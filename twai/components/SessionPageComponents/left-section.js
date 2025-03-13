"use client"

import { useAppContext } from "../../context/AppContext"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquare, ScrollText, Send, Trash, Keyboard, LogOut } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useParams, useRouter } from "next/navigation"
import { appendConversation } from "../../app/session/[sessionId]/actions"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import MicrophoneButton from "@/components/SessionPageComponents/microphoneButton"
import CaptureScreenButton from "@/components/SessionPageComponents/captureScreenButton"

export default function LeftSection() {
  const { wholeConversation, setWholeConversation, videoRef, stream } = useAppContext()
  const { sessionId } = useParams()
  const router = useRouter()
  const [autoScroll, setAutoScroll] = useState(true)
  const [manualInput, setManualInput] = useState("")
  const [isUser, setIsUser] = useState(false)
  const [showInput, setShowInput] = useState(false)
  const scrollAreaRef = useRef(null)
  const conversationEndRef = useRef(null)

  const handleClearConversation = async () => {
    const tempConversation = [...wholeConversation]
    setWholeConversation([]) // Immediately clear UI
    await appendConversation({ sessionId, newMessages: tempConversation })
  }

  const handleAddConversation = () => {
    if (manualInput.trim()) {
      const newMessage = isUser ? { user: manualInput } : { other: manualInput }
      setWholeConversation([...wholeConversation, newMessage])
      setManualInput("")
      setShowInput(false) // Hide input after sending
    }
  }

  const handleExit = async () => {
    await appendConversation({ sessionId: sessionId, newMessages: wholeConversation })
    router.push("/dashboard")
  }

  // Auto-scroll effect
  useEffect(() => {
    if (autoScroll && conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [wholeConversation, autoScroll])

  return (
    <div className="h-[calc(100vh-32px)] flex flex-col gap-4">
      {/* Screen Capture Card */}
      <Card className="border shadow-sm">
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">Screen Capture</CardTitle>
          <Button onClick={handleExit} variant="destructive" size="sm" className="flex items-center gap-1">
            <LogOut className="h-4 w-4" />
            Exit Session
          </Button>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {/* Video Section */}
          <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden mb-3">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          </div>

          {/* Buttons Section */}
          <div className="flex flex-col sm:flex-row gap-2">
            <MicrophoneButton />
            <CaptureScreenButton />
          </div>
        </CardContent>
      </Card>

      {/* Conversation Card */}
      <Card className="border shadow-sm flex-1 flex flex-col overflow-hidden">
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <CardTitle className="text-lg font-medium">Conversation</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAutoScroll(!autoScroll)}
              className={cn("text-muted-foreground h-8", autoScroll && "bg-primary/10 text-primary")}
            >
              <ScrollText className="h-4 w-4 mr-1" />
              {autoScroll ? "Auto-scroll On" : "Auto-scroll Off"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearConversation}
              className="text-red-500 h-8"
              disabled={wholeConversation.length === 0}
            >
              <Trash className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0 flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 min-h-0 overflow-hidden">
            <ScrollArea className="h-full pr-3" ref={scrollAreaRef} id="conversation-container">
              {wholeConversation.length > 0 ? (
                <div className="space-y-3 py-2">
                  {wholeConversation.map((message, index) => (
                    <div key={index} className={`flex ${message.user ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.user
                            ? "bg-primary text-primary-foreground rounded-tr-none"
                            : "bg-muted rounded-tl-none"
                        }`}
                      >
                        {message.user ? message.user : message.other}
                      </div>
                    </div>
                  ))}
                  <div ref={conversationEndRef} />
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <p>No conversation recorded yet...</p>
                  <p className="text-sm mt-2">Use the microphone or screen capture to start recording</p>
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Add Message Button */}
          {!showInput && (
            <Button variant="outline" className="mt-3" onClick={() => setShowInput(true)}>
              <Keyboard className="h-4 w-4 mr-2" />
              Add Message
            </Button>
          )}

          {/* Manual Input Section - Collapsible */}
          {showInput && (
            <div className="border-t pt-3 mt-3 animate-in slide-in-from-bottom duration-200">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="message-type" className="text-sm">
                    Message as: {isUser ? "You" : "Other"}
                  </Label>
                  <div className="flex items-center gap-2">
                    <Switch id="message-type" checked={isUser} onCheckedChange={setIsUser} />
                    <Button variant="ghost" size="sm" onClick={() => setShowInput(false)} className="h-8 w-8 p-0">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Type message to add..."
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    className="min-h-[60px] flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleAddConversation()
                      }
                    }}
                    autoFocus
                  />
                  <Button
                    onClick={handleAddConversation}
                    disabled={!manualInput.trim()}
                    size="icon"
                    className="self-end"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

