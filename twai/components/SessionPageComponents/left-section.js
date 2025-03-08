"use client"

import { useAppContext } from "../../context/AppContext"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquare, ScrollText, Send, Trash, Keyboard, Mic } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useParams } from "next/navigation"
import { appendConversation } from "../../app/session/[sessionId]/actions"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LeftSection() {
  const { wholeConversation, setWholeConversation, micPartialTranscript, capturePartialTranscript } = useAppContext()
  const { sessionId } = useParams()
  const [autoScroll, setAutoScroll] = useState(true)
  const [manualInput, setManualInput] = useState("")
  const [isUser, setIsUser] = useState(false)
  const scrollAreaRef = useRef(null)
  const conversationEndRef = useRef(null)
  const [activeTab, setActiveTab] = useState("input")

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
    }
  }

  // Auto-scroll effect
  useEffect(() => {
    if (autoScroll && conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [wholeConversation, autoScroll])

  useEffect(() => {
    // Auto-scroll transcript containers when content changes
    const captureContainer = document.getElementById("capture-transcript-container")
    const micContainer = document.getElementById("mic-transcript-container")

    // Use requestAnimationFrame to ensure the DOM has updated before scrolling
    requestAnimationFrame(() => {
      if (captureContainer) {
        captureContainer.scrollTop = captureContainer.scrollHeight
      }

      if (micContainer) {
        micContainer.scrollTop = micContainer.scrollHeight
      }
    })
  }, [capturePartialTranscript, micPartialTranscript])

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
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

          {/* Togglable Transcription/Input Section */}
          <div className="border-t pt-3 mt-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-2">
                <TabsTrigger value="transcripts" className="flex items-center gap-1">
                  <Mic className="h-3.5 w-3.5" />
                  <span>Transcripts</span>
                </TabsTrigger>
                <TabsTrigger value="input" className="flex items-center gap-1">
                  <Keyboard className="h-3.5 w-3.5" />
                  <span>Manual Input</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="transcripts" className="mt-0">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-100 p-2 rounded-lg h-16 overflow-hidden relative">
                    <h3 className="text-xs font-medium text-muted-foreground mb-1">Captured Audio</h3>
                    <div className="text-sm text-gray-800 overflow-auto h-8" id="capture-transcript-container">
                      {capturePartialTranscript || "No transcription available..."}
                    </div>
                  </div>
                  <div className="bg-gray-100 p-2 rounded-lg h-16 overflow-hidden relative">
                    <h3 className="text-xs font-medium text-muted-foreground mb-1">Mic Audio</h3>
                    <div className="text-sm text-gray-800 overflow-auto h-8" id="mic-transcript-container">
                      {micPartialTranscript || "No transcription available..."}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="input" className="mt-0">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="message-type" className="text-sm">
                      Message as: {isUser ? "You" : "Other"}
                    </Label>
                    <Switch id="message-type" checked={isUser} onCheckedChange={setIsUser} />
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
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

