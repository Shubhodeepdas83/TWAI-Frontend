"use client"

import LeftSection from "../../../components/SessionPageComponents/left-section"
import MiddleSection from "../../../components/SessionPageComponents/middle-section"
import RightSection from "../../../components/SessionPageComponents/right-section"
import WelcomeModal from "@/components/SessionPageComponents/welcomeModal"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { isValidSession } from "./actions"
import { useAppContext } from "../../../context/AppContext"
// Import the Toaster component for toast notifications
import { Toaster } from "@/components/ui/toaster"
import { FullscreenLoader } from "@/components/loading-page"

export default function Home() {
  const { sessionId } = useParams()
  const { status } = useSession()

  const { wholeConversation, setCopiedText, setWholeConversation, setChatMessages } = useAppContext()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [loadingPhase, setLoadingPhase] = useState("initializing")

  useEffect(() => {
    const fetchData = async () => {
      if (status === "unauthenticated") {
        router.push("/")
        return
      }

      if (status === "loading") {
        return
      }

      setLoadingPhase("authenticating")

      try {
        const data = await isValidSession({ sessionId: sessionId })

        if (data.failure) {
          router.push("/")
          return
        }

        setLoadingPhase("loading-session")

        if (data.chat) {
          setChatMessages(data.chat.map((c) => ({ ...c, hidden: true, saved: true })))
        }

        if (data.conversation) {
          setWholeConversation(data.conversation.map((c) => ({ ...c, hidden: true, saved: true })))
        }

        // Simulate a minimum loading time for better UX
        setTimeout(() => {
          setIsLoading(false)
        }, 800)
      } catch (error) {
        console.error("Error fetching session data:", error)
        router.push("/")
      }
    }

    fetchData()
  }, [status, sessionId, router])

  if (status === "loading" || isLoading) {
    return <FullscreenLoader />
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

      {/* Welcome Modal */}
      <WelcomeModal />

      {/* Toast notifications */}
      <Toaster />
    </div>
  )
}

