"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserDetails, createSession, removeDocument } from "./actions";
import FileUploadButton from "../../components/DashboardPageComponents/fileUploadButton";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [isDocumentsModalOpen, setIsDocumentsModalOpen] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        }
    }, [status, router]);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        setIsLoading(true);
        const data = await getUserDetails();
        if (data.user) {
            setUser(data.user);
            setDocuments(data.user.documents);
        }
        setIsLoading(false);
    };

    const handleCreateSession = async () => {
        const data = await createSession();
        if (data.failure) {
            console.error(data.failure);
            return;
        }
        if (data.sessionId) {
            console.log("Session created successfully!");
            router.push(`/session/${data.sessionId}`);
        }
    };

    const handleDeleteDocument = async (documentId) => {
        setIsDeleting(true);
        setDeletingId(documentId);
        
        try {
            const result = await removeDocument(documentId);
            
            if (result.success) {
                // Update documents list after successful deletion
                await fetchUserData();
            } else if (result.error || result.failure) {
                console.error("Error deleting document:", result.error || result.failure);
                alert("Failed to delete document. Please try again.");
            }
        } catch (error) {
            console.error("Exception while deleting document:", error);
            alert("An error occurred while deleting the document.");
        } finally {
            setIsDeleting(false);
            setDeletingId(null);
        }
    };

    if (status === "loading" || isLoading) {
        return <div className="h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="flex h-full w-64 flex-col border-r bg-white px-4 py-6">
                {/* User Info */}
                <div className="mb-6 flex flex-col items-center space-y-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                        <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>
                    </div>
                    <div className="text-center">
                        <p className="font-medium">{session?.user?.name}</p>
                        <p className="text-sm text-gray-500">{session?.user?.email}</p>
                    </div>
                </div>

                <FileUploadButton onUploadComplete={fetchUserData} />

                {/* Button to Open Documents Modal */}
                <button
                    onClick={() => setIsDocumentsModalOpen(true)}
                    className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    View Uploaded Documents
                </button>

                {/* Sign Out Button */}
                <button
                    onClick={() => signOut()}
                    className="inline-flex w-full items-center justify-start rounded-md px-4 py-2 text-sm font-medium text-red-600 hover:bg-gray-50"
                >
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                    </svg>
                    Sign Out
                </button>
            </div>

            {/* Dashboard Main Area */}
            <div className="flex flex-1 flex-col">
                <header className="flex h-16 items-center justify-between border-b px-6">
                    <h1 className="text-lg font-medium">Interview Sessions</h1>
                    <button
                        onClick={() => handleCreateSession()}
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        Create Session
                    </button>
                </header>

                <main className="flex-1 p-6">
                    <div className="mb-4">
                        <h2 className="text-lg font-medium">Available Sessions</h2>
                        <p className="text-sm text-gray-500">A list of your Interview Sessions.</p>
                    </div>

                    {user?.sessions?.length > 0 ? (
                        <div className="rounded-lg border shadow-sm">
                            <div className="divide-y divide-gray-200">
                                {user.sessions.map((session) => (
                                    <div
                                        key={session.id}
                                        className="p-4 flex justify-between items-center hover:bg-gray-100 transition-colors duration-200 ease-in-out rounded-md"
                                    >
                                        <div className="flex-1">
                                            <h3 className="font-medium text-lg text-blue-600">Session #{session.id}</h3>
                                            <p className="text-sm text-gray-500">
                                                {session.summary ? (
                                                    <span className="text-green-600">Summary available</span>
                                                ) : (
                                                    <span className="text-gray-400">No summary available</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-lg border shadow-sm">
                            <div className="p-4 text-center text-gray-500">
                                No sessions available. Create a new session to get started.
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Documents Modal */}
            {isDocumentsModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg overflow-y-auto max-h-[80vh]">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-medium">Uploaded Documents</h2>
                            <button onClick={() => setIsDocumentsModalOpen(false)} className="rounded-full p-1 hover:bg-gray-200">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className="mb-4 space-y-4">
                            {documents.length > 0 ? (
                                documents.map((doc) => (
                                    <div key={doc.id} className="mb-4 border rounded p-2">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="text-sm font-medium text-blue-600">
                                                Document uploaded at {new Date(doc.uploadedAt).toLocaleString()}
                                            </h3>
                                            <button
                                                onClick={() => handleDeleteDocument(doc.id)}
                                                disabled={isDeleting && deletingId === doc.id}
                                                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                                            >
                                                {isDeleting && deletingId === doc.id ? (
                                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                ) : (
                                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                        />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        <iframe
                                            src={doc.fileUrl}
                                            width="100%"
                                            height="200px"
                                            className="border rounded"
                                        ></iframe>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-500">No documents uploaded yet.</div>
                            )}
                        </div>

                        <button
                            onClick={() => setIsDocumentsModalOpen(false)}
                            className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}