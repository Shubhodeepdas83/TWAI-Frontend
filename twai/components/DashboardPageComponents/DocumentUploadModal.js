"use client"

import { useState } from "react"
import { X } from "lucide-react"

export default function DocumentUploadModal({ isOpen, onClose, onSuccess }) {
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [addEmbedding, setAddEmbedding] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleCheckboxChange = (e) => {
    setAddEmbedding(e.target.checked)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      alert("No file selected.")
      return
    }

    setIsLoading(true)
    setUploadProgress(0)

    try {
      // 1. Get a signed URL from the server
      const signedUrlResponse = await fetch("/api/get_signed_url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      })

      if (!signedUrlResponse.ok) {
        throw new Error("Failed to get signed URL")
      }

      const { signedUrl, fileUrl } = await signedUrlResponse.json()

      // 2. Upload the file directly to S3 using the signed URL
      const uploadResponse = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setUploadProgress(percentCompleted)
        },
      })

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file to S3")
      }

      // 3. Save the document metadata to our database
      const metadataResponse = await fetch("/api/file_upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileUrl,
          add_embedding: addEmbedding,
          title,
          description,
          fileName: file.name,
        }),
      })

      const data = await metadataResponse.json()

      if (metadataResponse.ok) {
        onSuccess()
      } else {
        alert(data.error || "Failed to save document metadata.")
      }
    } catch (error) {
      alert("An error occurred while uploading the file.")
      console.error("Upload error:", error)
    } finally {
      setIsLoading(false)
      setUploadProgress(0)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">Upload Document</h2>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Document Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="Enter document title"
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
              placeholder="Enter document description"
              rows={2}
            />
          </div>

          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700">
              Select PDF File
            </label>
            <input
              type="file"
              id="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="addEmbedding"
              checked={addEmbedding}
              onChange={handleCheckboxChange}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="addEmbedding" className="text-sm text-gray-700">
              Add Embedding (for AI search capabilities)
            </label>
          </div>

          {isLoading && uploadProgress > 0 && (
            <div className="w-full">
              <div className="h-2 w-full bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-blue-600 rounded-full" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-center mt-1">{uploadProgress}% uploaded</p>
            </div>
          )}

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
              disabled={isLoading || !file}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isLoading ? "Uploading..." : "Upload Document"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

