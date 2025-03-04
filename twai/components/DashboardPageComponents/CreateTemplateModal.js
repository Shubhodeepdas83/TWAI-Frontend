"use client"

import { useState } from "react"
import { createMeetingTemplate } from "../../app/dashboard/actions"
import { X } from "lucide-react"

export default function CreateTemplateModal({ isOpen, onClose, onSuccess }) {
  const [purpose, setPurpose] = useState("")
  const [goal, setGoal] = useState("")
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [duration, setDuration] = useState("30 mins")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append("purpose", purpose)
    formData.append("goal", goal)
    formData.append("additionalInfo", additionalInfo)
    formData.append("duration", duration)

    try {
      const result = await createMeetingTemplate(formData)
      if (result.success) {
        onSuccess()
        setPurpose("")
        setGoal("")
        setAdditionalInfo("")
        setDuration("30 mins")
      } else {
        console.error("Failed to create template:", result.failure)
        alert("Failed to create template. Please try again.")
      }
    } catch (error) {
      console.error("Error creating template:", error)
      alert("An error occurred while creating the template.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">Create Meeting Template</h2>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
              Add meeting purpose
            </label>
            <input
              type="text"
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="Enter meeting purpose"
              required
            />
          </div>

          <div>
            <label htmlFor="goal" className="block text-sm font-medium text-gray-700">
              Your goal of the meeting/ what do you want to achieve?
            </label>
            <input
              type="text"
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="Enter meeting goal"
              required
            />
          </div>

          <div>
            <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700">
              Add any other relevant communications, correspondence, etc?
            </label>
            <textarea
              id="additionalInfo"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="Enter additional information"
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
              Duration of meeting
            </label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="15 mins">15 mins</option>
              <option value="30 mins">30 mins</option>
              <option value="45 mins">45 mins</option>
              <option value="1 hour">1 hour</option>
              <option value="1.5 hours">1.5 hours</option>
              <option value="2 hours">2 hours</option>
            </select>
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
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

