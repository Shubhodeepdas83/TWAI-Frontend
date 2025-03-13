"use client"

import { useAppContext } from "../../context/AppContext"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollText, Send, Trash, Keyboard } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
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

  // Auto-scroll effect
  useEffect(() => {
    if (autoScroll && conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [wholeConversation, autoScroll])

  return (
    <div className="h-full flex flex-col gap-2">
      {/* Screen Capture Card - Reduced padding, removed title */}
      <Card className="border shadow-sm">
        <CardContent className="p-2">
          {/* Video Section */}
          <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden mb-2">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          </div>

          {/* Buttons Section - Reduced spacing */}
          <div className="flex flex-col sm:flex-row gap-1">
            <MicrophoneButton />
            <CaptureScreenButton />
          </div>
        </CardContent>
      </Card>

      {/* Conversation Card - Reduced padding, removed title */}
      <Card className="border shadow-sm flex-1 flex flex-col overflow-hidden relative">
        {/* Overlay buttons for auto-scroll and clear */}
        <div className="absolute top-2 right-2 z-10 flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAutoScroll(!autoScroll)}
            className={cn("h-7 w-7 p-0", autoScroll && "bg-primary/10 text-primary")}
            title={autoScroll ? "Auto-scroll On" : "Auto-scroll Off"}
          >
            <ScrollText className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearConversation}
            className="text-red-500 h-7 w-7 p-0"
            disabled={wholeConversation.length === 0}
            title="Clear Conversation"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>

        <CardContent className="p-2 pt-8 flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 min-h-0 overflow-hidden">
            <ScrollArea className="h-full pr-2" ref={scrollAreaRef} id="conversation-container">
              {wholeConversation.length > 0 ? (
                <div className="space-y-2 py-1">
                  {wholeConversation.map((message, index) => (
                    <div key={index} className={`flex ${message.user ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-2 text-sm ${
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
                <div className="text-center text-muted-foreground py-4">
                  <p className="text-sm">No conversation recorded yet...</p>
                  <p className="text-xs mt-1">Use the microphone or screen capture to start recording</p>
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Add Message Button */}
          {!showInput && (
            <Button variant="outline" className="mt-2" onClick={() => setShowInput(true)}>
              <Keyboard className="h-4 w-4 mr-2" />
              Add Message
            </Button>
          )}

          {/* Manual Input Section - Collapsible */}
          {showInput && (
            <div className="border-t pt-2 mt-2 animate-in slide-in-from-bottom duration-200">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="message-type" className="text-sm">
                    Message as: {isUser ? "You" : "Other"}
                  </Label>
                  <div className="flex items-center gap-2">
                    <Switch id="message-type" checked={isUser} onCheckedChange={setIsUser} />
                    <Button variant="ghost" size="sm" onClick={() => setShowInput(false)} className="h-7 w-7 p-0">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Textarea
                    placeholder="Type message to add..."
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    className="min-h-[50px] flex-1 text-sm"
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

