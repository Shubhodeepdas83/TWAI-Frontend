"use client"

import { useState, useEffect, useRef } from "react"
import { createSession, getUserDetails, getEmbeddedDocuments } from "../../app/dashboard/actions"
import { useRouter } from "next/navigation"
import { X, Check, ChevronDown } from "lucide-react"

export default function CreateSessionModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [templates, setTemplates] = useState([])
  const [embeddedDocuments, setEmbeddedDocuments] = useState([])
  const [selectedDocuments, setSelectedDocuments] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      fetchTemplates()
      fetchEmbeddedDocuments()
    }
  }, [isOpen])

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [dropdownRef])

  const fetchTemplates = async () => {
    setIsLoading(true)
    try {
      const data = await getUserDetails()
      if (data.user && data.user.meetingTemplates) {
        setTemplates(data.user.meetingTemplates)
      }
    } catch (error) {
      console.error("Error fetching templates:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchEmbeddedDocuments = async () => {
    try {
      const data = await getEmbeddedDocuments()
      if (data.documents) {
        setEmbeddedDocuments(data.documents)
      }
    } catch (error) {
      console.error("Error fetching embedded documents:", error)
    }
  }

  const toggleDocumentSelection = (docId) => {
    setSelectedDocuments(prev => {
      if (prev.includes(docId)) {
        return prev.filter(id => id !== docId)
      } else {
        return [...prev, docId]
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append("name", name)
    formData.append("description", description)
    if (selectedTemplate) {
      formData.append("templateId", selectedTemplate)
    }
    
    selectedDocuments.forEach(docId => {
      formData.append("documentIds", docId)
    })

    try {
      const result = await createSession(formData)
      if (result.sessionId) {
        onSuccess()
        router.push(`/session/${result.sessionId}`)
      } else {
        console.error("Failed to create session:", result.failure)
        alert("Failed to create session. Please try again.")
      }
    } catch (error) {
      console.error("Error creating session:", error)
      alert("An error occurred while creating the session.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">Create New Session</h2>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Session Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="Enter session name"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="Enter session description"
              rows={3}
            />
          </div>

          {/* Custom Multi-select Dropdown with Checkboxes */}
          <div className="relative" ref={dropdownRef}>
            <label htmlFor="documents" className="block text-sm font-medium text-gray-700 mb-1">
              Embedded Documents (Optional)
            </label>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center justify-between w-full rounded-md border border-gray-300 px-3 py-2 bg-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <span className="text-sm truncate">
                {selectedDocuments.length === 0 
                  ? "-- Select documents --" 
                  : `${selectedDocuments.length} document${selectedDocuments.length > 1 ? 's' : ''} selected`}
              </span>
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
            
            {dropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-56 overflow-y-auto">
                {embeddedDocuments.length > 0 ? (
                  embeddedDocuments.map((doc) => (
                    <div 
                      key={doc.id}
                      onClick={() => toggleDocumentSelection(doc.id)}
                      className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <div className={`w-4 h-4 border rounded flex items-center justify-center mr-2 ${
                          selectedDocuments.includes(doc.id) 
                            ? 'bg-blue-500 border-blue-500' 
                            : 'border-gray-300'
                        }`}>
                          {selectedDocuments.includes(doc.id) && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-sm">{doc.title || 'Untitled Document'}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500">No embedded documents available</div>
                )}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="template" className="block text-sm font-medium text-gray-700">
              Meeting Template (Optional)
            </label>
            {isLoading ? (
              <div className="text-center py-2 text-sm">Loading templates...</div>
            ) : (
              <select
                id="template"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value="">-- Select a template --</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.purpose}
                  </option>
                ))}
              </select>
            )}
          </div>

          

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isSubmitting ? "Creating..." : "Create Session"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

