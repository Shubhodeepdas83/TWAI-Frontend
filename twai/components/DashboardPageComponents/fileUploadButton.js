"use client";

import { useState } from "react";

export default function FileUploadButton() {
  const [file, setFile] = useState(null);
  const [addEmbedding, setAddEmbedding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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

    setIsLoading(true);
    setUploadProgress(0);

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
      });

      if (!signedUrlResponse.ok) {
        throw new Error("Failed to get signed URL");
      }

      const { signedUrl, fileUrl } = await signedUrlResponse.json();

      // 2. Upload the file directly to S3 using the signed URL
      const uploadResponse = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file to S3");
      }

      // Update progress visually
      setUploadProgress(50);

      // 3. Save the document metadata to our database
      const metadataResponse = await fetch("/api/file_upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileUrl,
          add_embedding: addEmbedding,
          fileName: file.name,
        }),
      });

      setUploadProgress(100);

      const data = await metadataResponse.json();

      if (metadataResponse.ok) {
        // Reload the page after successful upload
        window.location.reload();
      } else {
        alert(data.error || "Failed to save document metadata.");
      }
    } catch (error) {
      alert("An error occurred while uploading the file.");
      console.error("Upload error:", error);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
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

        {/* Upload progress bar */}
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
