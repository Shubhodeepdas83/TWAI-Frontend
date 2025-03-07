"use client"

import LeftSection from "../../../components/SessionPageComponents/left-section"
import MiddleSection from "../../../components/SessionPageComponents/middle-section"
import RightSection from "../../../components/SessionPageComponents/right-section"
import { Button } from "../../../components/ui/button"
import { LogOut } from "lucide-react"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { isValidSession, appendConversation } from "./actions"
import { useAppContext } from "../../../context/AppContext"

export default function Home() {
  const { sessionId } = useParams()
  const { status } = useSession()

  const { wholeConversation, setCopiedText, micToken, captureToken } = useAppContext()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (status === "unauthenticated") {
        router.push("/")
      }

      const data = await isValidSession({ sessionId: sessionId })

      if (data.failure) {
        router.push("/")
      } else {
        micToken.current = data.micToken
        captureToken.current = data.captureToken
        setIsLoading(false)
      }
    }

    fetchData()
  }, [status, sessionId, router, captureToken, micToken])

  useEffect(() => {
    const handleMouseUp = () => {
      const selectedText = window.getSelection()?.toString().trim()
      if (!selectedText) return

      const selection = window.getSelection()
      if (!selection) return

      const anchorNode = selection.anchorNode
      const focusNode = selection.focusNode
      if (!anchorNode || !focusNode) return

      const conversationContainer = document.getElementById("conversation-container")

      // Ensure BOTH the start and end of selection are inside the conversation container
      if (conversationContainer?.contains(anchorNode) && conversationContainer.contains(focusNode)) {
        navigator.clipboard
          .writeText(selectedText)
          .then(() => {
            console.log("Copied:", selectedText)
            setCopiedText(selectedText)
          })
          .catch((err) => console.error("Copy failed:", err))
      }
    }

    document.addEventListener("mouseup", handleMouseUp)
    return () => document.removeEventListener("mouseup", handleMouseUp)
  }, [setCopiedText])

  const handleExit = async () => {
    await appendConversation({ sessionId: sessionId, newMessages: wholeConversation })
    window.location.href = "/dashboard"
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-gray-900 text-white shadow-md">
        <h1 className="text-xl font-bold">AI Meeting Assistant</h1>
        <Button
          onClick={async () => {
            await handleExit()
          }}
          variant="destructive"
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Exit Session
        </Button>
      </header>

      <main className="flex-1 w-full p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 max-h-[calc(100vh-80px)] overflow-hidden">
  <div className="lg:col-span-4 xl:col-span-4 overflow-hidden">
    <LeftSection />
  </div>
  <div className="lg:col-span-4 xl:col-span-4 overflow-hidden">
    <MiddleSection />
  </div>
  <div className="lg:col-span-4 xl:col-span-4 overflow-hidden">
    <RightSection />
  </div>
</main>

    </div>
  )
}

