"use client"

import { useSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getUserDetails, removeDocument, getSummary, deleteMeetingTemplate, getAgentStore } from "./actions"
import { Calendar, FileText, Folder, LogOut, Plus, Trash, User, Edit, Store, ExternalLink } from "lucide-react"
import CreateSessionModal from "../../components/DashboardPageComponents/CreateSessionModal"
import DocumentUploadModal from "../../components/DashboardPageComponents/DocumentUploadModal"
import CreateTemplateModal from "../../components/DashboardPageComponents/CreateTemplateModal"
import EditDocumentModal from "../../components/DashboardPageComponents/EditDocumentModal"
import EditTemplateModal from "../../components/DashboardPageComponents/EditTemplateModal"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState("sessions")
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false)
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false)
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false)
  const [selectedSessionSummary, setSelectedSessionSummary] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [agents, setAgents] = useState([])
  const router = useRouter()

  // Add these state variables in the DashboardPage component
  const [isEditDocumentModalOpen, setIsEditDocumentModalOpen] = useState(false)
  const [isEditTemplateModalOpen, setIsEditTemplateModalOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  useEffect(() => {

    fetchAgentStore()
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    setIsLoading(true)
    const data = await getUserDetails()
    if (data.user) {
      setUser(data.user)
      setIsLoading(false)
    }

  }

  const fetchAgentStore = async () => {
    setIsLoading(true)
    const data = await getAgentStore()
    if (data.agents) {
      setAgents(data.agents)
    }
    else{
      alert("Failed to fetch agents")
    }

  }

  const handleDeleteDocument = async (documentId) => {
    setIsDeleting(true)
    setDeletingId(documentId)

    try {
      const result = await removeDocument(documentId)

      if (result.success) {
        await fetchUserData()
      } else if (result.error || result.failure) {
        console.error("Error deleting document:", result.error || result.failure)
        alert("Failed to delete document. Please try again.")
      }
    } catch (error) {
      console.error("Exception while deleting document:", error)
      alert("An error occurred while deleting the document.")
    } finally {
      setIsDeleting(false)
      setDeletingId(null)
    }
  }

  const handleDeleteTemplate = async (templateId) => {
    setIsDeleting(true)
    setDeletingId(templateId)

    try {
      const result = await deleteMeetingTemplate(templateId)

      if (result.success) {
        await fetchUserData()
      } else if (result.failure) {
        console.error("Error deleting template:", result.failure)
        alert("Failed to delete template. Please try again.")
      }
    } catch (error) {
      console.error("Exception while deleting template:", error)
      alert("An error occurred while deleting the template.")
    } finally {
      setIsDeleting(false)
      setDeletingId(null)
    }
  }

  const handleGenerateSummary = async (sessionId) => {
    const data = await getSummary(sessionId)
    if (data.summary) {
      setSelectedSessionSummary(data.summary)
      setIsSummaryModalOpen(true)
    } else {
      alert("Failed to generate summary")
    }
  }

  // Add these handlers in the DashboardPage component
  const handleEditDocument = (document) => {
    setSelectedDocument(document)
    setIsEditDocumentModalOpen(true)
  }

  const handleEditTemplate = (template) => {
    setSelectedTemplate(template)
    setIsEditTemplateModalOpen(true)
  }

  if (status === "loading" || isLoading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="flex h-full w-64 flex-col border-r bg-white px-4 py-6 shadow-sm">
        {/* User Info */}
        <div className="mb-6 flex flex-col items-center space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-center">
            <p className="font-medium">{session?.user?.name}</p>
            <p className="text-sm text-gray-500">{session?.user?.email}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="mb-6 space-y-1">
          <button
            onClick={() => setActiveTab("sessions")}
            className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === "sessions" ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Calendar className="mr-2 h-5 w-5" />
            Sessions
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === "documents" ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FileText className="mr-2 h-5 w-5" />
            Documents
          </button>
          <button
            onClick={() => setActiveTab("templates")}
            className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === "templates" ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Folder className="mr-2 h-5 w-5" />
            Meeting Templates
          </button>
          <button
            onClick={() => setActiveTab("agentStore")}
            className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === "agentStore" ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Store className="mr-2 h-5 w-5" />
            Agent Store
          </button>
        </nav>

        {/* Sign Out Button */}
        <button
          onClick={() => signOut()}
          className="mt-auto inline-flex w-full items-center justify-start rounded-md px-4 py-2 text-sm font-medium text-red-600 hover:bg-gray-50 transition-colors"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </button>
      </div>

      {/* Dashboard Main Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
          <h1 className="text-lg font-medium">
            {activeTab === "sessions" && "Interview Sessions"}
            {activeTab === "documents" && "Document Library"}
            {activeTab === "templates" && "Meeting Templates"}
            {activeTab === "agentStore" && "Agent Store"}
          </h1>
          {activeTab !== "agentStore" && (
            <button
              onClick={() => {
                if (activeTab === "sessions") setIsSessionModalOpen(true)
                if (activeTab === "documents") setIsDocumentModalOpen(true)
                if (activeTab === "templates") setIsTemplateModalOpen(true)
              }}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              <span className="flex items-center">
                <Plus className="mr-1 h-4 w-4" />
                {activeTab === "sessions" && "Create Session"}
                {activeTab === "documents" && "Upload Document"}
                {activeTab === "templates" && "Create Template"}
              </span>
            </button>
          )}
        </header>

        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          {/* Sessions Tab */}
          {activeTab === "sessions" && (
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-medium">Available Sessions</h2>
                <p className="text-sm text-gray-500">A list of your Interview Sessions.</p>
              </div>

              {user?.sessions?.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {user.sessions.map((session) => (
                    <div
                      key={session.id}
                      className="rounded-lg border bg-white p-5 shadow-sm transition-shadow hover:shadow-md h-[200px] flex flex-col"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-medium text-blue-600 truncate max-w-[200px]">
                          {session.name || `Session #${session.id}`}
                        </h3>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                          {new Date(session.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {session.description && (
                        <p className="mb-3 text-sm text-gray-600 line-clamp-2 flex-grow">{session.description}</p>
                      )}
                      <div className="mt-auto flex items-center justify-between">
                        <button
                          onClick={() => router.push(`/session/${session.id}`)}
                          className="rounded-md bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-200 transition-colors"
                        >
                          Open Session
                        </button>
                        <button
                          onClick={() => handleGenerateSummary(session.id)}
                          className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                          View Summary
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
                  <Calendar className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <h3 className="mb-1 text-lg font-medium">No sessions available</h3>
                  <p className="text-gray-500">Create a new session to get started.</p>
                  <button
                    onClick={() => setIsSessionModalOpen(true)}
                    className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="mr-1 inline-block h-4 w-4" />
                    Create Session
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === "documents" && (
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-medium">Document Library</h2>
                <p className="text-sm text-gray-500">Manage your uploaded documents.</p>
              </div>

              {user?.documents?.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {user.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="rounded-lg border bg-white p-5 shadow-sm transition-shadow hover:shadow-md h-[220px] flex flex-col"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-medium text-blue-600 truncate max-w-[200px]">
                          {doc.title || "Untitled Document"}
                        </h3>
                        <div className="flex items-center gap-2 ml-2">
                          {doc.isEmbedded ? (
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full whitespace-nowrap">
                              Embedded
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full whitespace-nowrap">
                              Not Embedded
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                      </div>
                      {doc.description && (
                        <p className="mb-3 text-sm text-gray-600 line-clamp-2 flex-grow">{doc.description}</p>
                      )}
                      <p className="mb-3 text-xs text-gray-500 truncate">{doc.fileUrl}</p>
                      <div className="mt-auto flex justify-between">
                        <div className="flex gap-2">
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-md bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-200 transition-colors"
                          >
                            View
                          </a>
                          <button
                            onClick={() => handleEditDocument(doc)}
                            className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                          >
                            <Edit className="mr-1 inline-block h-3 w-3" />
                            Edit
                          </button>
                        </div>
                        <button
                          onClick={() => handleDeleteDocument(doc.id)}
                          disabled={isDeleting && deletingId === doc.id}
                          className="rounded-md bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
                        >
                          {isDeleting && deletingId === doc.id ? (
                            "Deleting..."
                          ) : (
                            <>
                              <Trash className="mr-1 inline-block h-3 w-3" />
                              Delete
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
                  <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <h3 className="mb-1 text-lg font-medium">No documents available</h3>
                  <p className="text-gray-500">Upload a document to get started.</p>
                  <button
                    onClick={() => setIsDocumentModalOpen(true)}
                    className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="mr-1 inline-block h-4 w-4" />
                    Upload Document
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === "templates" && (
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-medium">Meeting Templates</h2>
                <p className="text-sm text-gray-500">Create and manage your meeting templates.</p>
              </div>

              {user?.meetingTemplates?.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {user.meetingTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="rounded-lg border bg-white p-5 shadow-sm transition-shadow hover:shadow-md h-[280px] flex flex-col"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-medium text-blue-600 truncate max-w-[200px]">{template.purpose}</h3>
                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 whitespace-nowrap ml-2">
                          {template.duration}
                        </span>
                      </div>
                      <div className="mb-3 flex-grow overflow-hidden">
                        <p className="text-sm font-medium text-gray-700">Goal:</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{template.goal}</p>

                        {template.additionalInfo && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-700">Additional Info:</p>
                            <p className="text-sm text-gray-600 line-clamp-2">{template.additionalInfo}</p>
                          </div>
                        )}

                        {template.documents && template.documents.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-700">Documents:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {template.documents.map((doc) => (
                                <span key={doc.id} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                                  {doc.title || "Untitled"}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="mt-auto">
                        <div className="text-xs text-gray-500 mb-2">
                          Created: {new Date(template.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex justify-between">
                          <button
                            onClick={() => handleEditTemplate(template)}
                            className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                          >
                            <Edit className="mr-1 inline-block h-3 w-3" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTemplate(template.id)}
                            disabled={isDeleting && deletingId === template.id}
                            className="rounded-md bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
                          >
                            {isDeleting && deletingId === template.id ? (
                              "Deleting..."
                            ) : (
                              <>
                                <Trash className="mr-1 inline-block h-3 w-3" />
                                Delete
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
                  <Folder className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <h3 className="mb-1 text-lg font-medium">No templates available</h3>
                  <p className="text-gray-500">Create a meeting template to get started.</p>
                  <button
                    onClick={() => setIsTemplateModalOpen(true)}
                    className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="mr-1 inline-block h-4 w-4" />
                    Create Template
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Agent Store Tab */}
          {activeTab === "agentStore" && (
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-medium">Agent Store</h2>
                <p className="text-sm text-gray-500">Browse available AI agents for your meetings.</p>
              </div>

              {agents && agents.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {agents.map((agent) => (
                    <div
                      key={agent.id}
                      className="rounded-lg border bg-white p-5 shadow-sm transition-shadow hover:shadow-md h-[250px] flex flex-col"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-medium text-blue-600 truncate max-w-[200px]">{agent.title}</h3>
                        {agent.imageUrl && (
                          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 ml-2 flex-shrink-0">
                            <img
                              src={agent.imageUrl || "/placeholder.svg"}
                              alt={agent.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                      <p className="mb-3 text-sm text-gray-600 line-clamp-3 flex-grow">{agent.description}</p>

                      <div className="mt-auto">
                        <div className="mb-3">
                          <p className="text-xs font-medium text-gray-700 mb-1">Tools Used:</p>
                          <div className="flex flex-wrap gap-1">
                            {agent.toolsUsed.map((tool, index) => (
                              <span key={index} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-end">
                          {/* <button
                            className="rounded-md bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-200 transition-colors flex items-center"
                            disabled
                          >
                            <ExternalLink className="mr-1 h-3 w-3" />
                            Coming Soon
                          </button> */}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
                  <Store className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <h3 className="mb-1 text-lg font-medium">No agents available</h3>
                  <p className="text-gray-500">Check back later for new AI agents.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <CreateSessionModal
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        onSuccess={() => {
          setIsSessionModalOpen(false)
          fetchUserData()
        }}
      />

      <DocumentUploadModal
        isOpen={isDocumentModalOpen}
        onClose={() => setIsDocumentModalOpen(false)}
        onSuccess={() => {
          setIsDocumentModalOpen(false)
          fetchUserData()
        }}
      />

      <CreateTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSuccess={() => {
          setIsTemplateModalOpen(false)
          fetchUserData()
        }}
      />

      {/* Summary Modal */}
      {isSummaryModalOpen && selectedSessionSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-lg font-medium">Session Summary</h2>
              <button
                onClick={() => setIsSummaryModalOpen(false)}
                className="rounded-full p-1 hover:bg-gray-200 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div>
              <h3 className="font-medium text-blue-600">Summary:</h3>
              <div className="space-y-2 mt-2 max-h-[60vh] overflow-y-auto pr-2">
                {selectedSessionSummary
                  .split("-")
                  .filter((line) => line.trim() !== "") // Remove empty lines
                  .map((line, index) => (
                    <div key={index} className="flex items-start">
                      <span className="mr-2 text-blue-600">•</span>
                      <p className="text-sm text-gray-700">{line.trim()}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add these modals at the end of the component */}
      <EditDocumentModal
        isOpen={isEditDocumentModalOpen}
        onClose={() => setIsEditDocumentModalOpen(false)}
        document={selectedDocument}
        onSuccess={() => {
          setIsEditDocumentModalOpen(false)
          fetchUserData()
        }}
      />

      <EditTemplateModal
        isOpen={isEditTemplateModalOpen}
        onClose={() => setIsEditTemplateModalOpen(false)}
        template={selectedTemplate}
        onSuccess={() => {
          setIsEditTemplateModalOpen(false)
          fetchUserData()
        }}
      />
    </div>
  )
}

