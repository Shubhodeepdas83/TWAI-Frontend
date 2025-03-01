"use client";

import { useState } from "react";

export default function FileUploadButton() {
  const [file, setFile] = useState(null);
  const [addEmbedding, setAddEmbedding] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Track loading state

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCheckboxChange = (e) => {
    setAddEmbedding(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("No file selected.");
      return;
    }

    // Create form data to send the file and checkbox value
    const formData = new FormData();
    formData.append("file", file);
    formData.append("add_embedding", addEmbedding);

    setIsLoading(true); // Start loading

    try {
      // Send the file and checkbox value to the server via the API route
      const response = await fetch("/api/file_upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        // Reload the page after successful upload
        window.location.reload();
      } else {
        alert(data.error || "File upload failed.");
      }
    } catch (error) {
      alert("An error occurred while uploading the file.");
      console.error("Upload error:", error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md border border-gray-200 max-w-xs w-full">
      <h2 className="text-xl font-semibold mb-4">Upload a PDF</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File Input */}
        <div className="flex items-center">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
        </div>

        {/* Checkbox for embedding */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={addEmbedding}
            onChange={handleCheckboxChange}
            className="h-5 w-5 text-blue-600"
          />
          <label className="text-sm text-gray-700">Add Embedding</label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-md text-white font-semibold ${
              isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex justify-center items-center space-x-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="4"
                    d="M4 12a8 8 0 118 8 8 8 0 01-8-8z"
                  ></path>
                </svg>
                <span>Uploading...</span>
              </span>
            ) : (
              "Upload"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
