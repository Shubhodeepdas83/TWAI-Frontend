"use client"

import { useState, useEffect } from "react"
import { createSession, getUserDetails } from "../../app/dashboard/actions"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"

export default function CreateSessionModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [templates, setTemplates] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      fetchTemplates()
    }
  }, [isOpen])

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append("name", name)
    formData.append("description", description)
    if (selectedTemplate) {
      formData.append("templateId", selectedTemplate)
    }

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

