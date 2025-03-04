"use client"

import { useAppContext } from "../../context/AppContext"
import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquare, ScrollText, Send } from "lucide-react"
import MicrophoneButton from "@/components/SessionPageComponents/microphoneButton"
import CaptureScreenButton from "@/components/SessionPageComponents/captureScreenButton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useParams } from "next/navigation"
import { appendConversation } from "../../app/session/[sessionId]/actions"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
export default function LeftSection() {
  const { wholeConversation, videoRef, stream, setWholeConversation } = useAppContext()
  const { sessionId } = useParams()
  const [autoScroll, setAutoScroll] = useState(true)
  const [manualInput, setManualInput] = useState("")
  const [isUser, setIsUser] = useState(false)
  const scrollAreaRef = useRef(null)

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream
    }
  }, [stream, videoRef])

  const handleClearConversation = () => {
    const appending = appendConversation({ sessionId, newMessages: wholeConversation })
    if (appending.success) {
      setWholeConversation([])
    } else {
      console.log(appending?.failure)
    }
  }

  useEffect(() => {
    if (autoScroll && scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [autoScroll,wholeConversation])

  const handleAddConversation = () => {
    if (manualInput.trim()) {
      const newMessage = isUser ? { user: manualInput } : { other: manualInput }
      setWholeConversation([...wholeConversation, newMessage])
      setManualInput("")
    }
  }

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-4">
      {/* Video Card - Fixed Height */}
      <Card className="border shadow-sm">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg font-medium">Screen Capture</CardTitle>
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

      {/* Conversation Card - Flexible Height with Fixed Container */}
      <Card className="border shadow-sm flex-1 flex flex-col overflow-hidden">
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <CardTitle className="text-lg font-medium">Conversation</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAutoScroll(!autoScroll)}
            className={`text-muted-foreground h-8 ${autoScroll ? "bg-primary/10 text-primary" : ""}`}
          >
            <ScrollText className="h-4 w-4 mr-1" />
            {autoScroll ? "Auto-scroll On" : "Auto-scroll Off"}
          </Button>
        </CardHeader>

        <CardContent className="p-4 pt-0 flex-1 flex flex-col overflow-hidden">
          {/* Conversation Scrollable Area - This will grow and shrink as needed */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <ScrollArea id="conversation-container" className="h-full pr-3" ref={scrollAreaRef}>
              {wholeConversation.length > 0 ? (
                wholeConversation.map((message, index) => (
                  <div key={index} className="mb-3">
                    {message.user && (
                      <div className="text-left bg-primary/10 text-primary p-3 rounded-lg mb-2">
                        <div className="font-semibold text-xs mb-1 text-muted-foreground">You</div>
                        {message.user}
                      </div>
                    )}
                    {message.other && (
                      <div className="text-left bg-muted p-3 rounded-lg">
                        <div className="font-semibold text-xs mb-1 text-muted-foreground">Other</div>
                        {message.other}
                      </div>
                    )}
                    {index < wholeConversation.length - 1 && <Separator className="my-3" />}
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <p>No conversation recorded yet...</p>
                  <p className="text-sm mt-2">Use the microphone or screen capture to start recording</p>
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Input Section - This will stay fixed at the bottom */}
          <div className="mt-4 border-t pt-4 flex-shrink-0">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="manual-input" className="text-sm font-medium">
                  Add to Conversation
                </Label>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="message-type" className="text-sm">
                    {isUser ? "User" : "Other"}
                  </Label>
                  <Switch id="message-type" checked={isUser} onCheckedChange={setIsUser} />
                </div>
              </div>
              <div className="flex space-x-2">
                <Textarea
                  id="manual-input"
                  placeholder="Type message to add..."
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  className="min-h-[60px] flex-1"
                />
                <Button onClick={handleAddConversation} disabled={!manualInput.trim()} size="icon" className="self-end">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

