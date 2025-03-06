"use client"

import { useAppContext } from "../../context/AppContext"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquare, ScrollText, Send, Trash } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useParams } from "next/navigation"
import { appendConversation } from "../../app/session/[sessionId]/actions"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function LeftSection() {
  const { wholeConversation, setWholeConversation, micPartialTranscript, capturePartialTranscript } = useAppContext()
  const { sessionId } = useParams()
  const [autoScroll, setAutoScroll] = useState(true)
  const [manualInput, setManualInput] = useState("")
  const [isUser, setIsUser] = useState(false)
  const scrollAreaRef = useRef(null)

  const handleClearConversation = async () => {
    // Save current conversation to backend before clearing
    await appendConversation({ sessionId, newMessages: wholeConversation })
    // Clear the conversation in the UI
    setWholeConversation([])
  }

  const handleAddConversation = () => {
    if (manualInput.trim()) {
      const newMessage = isUser ? { user: manualInput } : { other: manualInput }
      setWholeConversation([...wholeConversation, newMessage])
      setManualInput("")
    }
  }

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      {/* Conversation Card - Full Height */}
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
              className={`text-muted-foreground h-8 ${autoScroll ? "bg-primary/10 text-primary" : ""}`}
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
          {/* Conversation Scrollable Area - This will grow and shrink as needed */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <ScrollArea id="conversation-container" className="h-full pr-3" ref={scrollAreaRef}>
              {wholeConversation.length > 0 ? (
                wholeConversation.map((message, index) => {
                  const lastUserMessageIndex = wholeConversation
                    .map((m, i) => (m.user ? i : -1))
                    .filter((i) => i !== -1)
                    .pop()

                  const lastOtherMessageIndex = wholeConversation
                    .map((m, i) => (m.other ? i : -1))
                    .filter((i) => i !== -1)
                    .pop()

                  const isLastUserMessage = message.user && index === lastUserMessageIndex
                  const isLastOtherMessage = message.other && index === lastOtherMessageIndex

                  return (
                    <div key={index} className="mb-3">
                      {/* User Messages */}
                      {message.user && (
                        <div className="text-left bg-primary/10 text-primary p-3 rounded-lg mb-2">
                          <div className="font-semibold text-xs mb-1 text-muted-foreground">You</div>
                          {message.user}
                          {isLastUserMessage && micPartialTranscript !== "" && (
                            <span className="text-muted-foreground animate-blink"> {micPartialTranscript}...</span>
                          )}
                        </div>
                      )}

                      {/* Other Messages */}
                      {message.other && (
                        <div className="text-left bg-muted p-3 rounded-lg">
                          <div className="font-semibold text-xs mb-1 text-muted-foreground">Other</div>
                          {message.other}
                          {isLastOtherMessage && capturePartialTranscript !== "" && (
                            <span className="text-muted-foreground animate-blink"> {capturePartialTranscript}...</span>
                          )}
                        </div>
                      )}

                      {/* Separator */}
                      {index < wholeConversation.length - 1 && <Separator className="my-3" />}
                    </div>
                  )
                })
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleAddConversation()
                    }
                  }}
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

