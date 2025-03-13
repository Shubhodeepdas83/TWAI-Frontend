"use client"

import LeftSection from "../../../components/SessionPageComponents/left-section"
import MiddleSection from "../../../components/SessionPageComponents/middle-section"
import RightSection from "../../../components/SessionPageComponents/right-section"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { isValidSession } from "./actions"
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

      // Ensure BOTH the start and end of selection are inside the conversation container
      const conversationContainer = document.getElementById("conversation-container")

      if (
        conversationContainer &&
        conversationContainer.contains(anchorNode) &&
        conversationContainer.contains(focusNode)
      ) {
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

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 w-full p-2 grid grid-cols-1 lg:grid-cols-12 gap-2 max-h-screen overflow-hidden">
        {/* Left Section - Screen Capture + Conversation */}
        <div className="lg:col-span-4 xl:col-span-4 overflow-hidden flex flex-col max-h-[calc(100vh-16px)]">
          <LeftSection />
        </div>

        {/* Middle Section - AI Meeting Helper */}
        <div className="lg:col-span-5 xl:col-span-5 overflow-hidden flex flex-col max-h-[calc(100vh-16px)]">
          <MiddleSection />
        </div>

        {/* Right Section - AI Tools + Citations */}
        <div className="lg:col-span-3 xl:col-span-3 overflow-hidden flex flex-col max-h-[calc(100vh-16px)]">
          <RightSection />
        </div>
      </main>
    </div>
  )
}

