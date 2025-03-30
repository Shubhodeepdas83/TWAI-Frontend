"use client"
import { useCallback } from "react";
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

// 4. Toast Notification for Text Selection
// First, import the toast component
import { useToast } from "@/hooks/use-toast";

export default function LeftSection() {
  const { wholeConversation, setWholeConversation, videoRef, stream,setUseHighlightedText,setCopiedText } = useAppContext()
  const { sessionId } = useParams()
  const router = useRouter()
  const [autoScroll, setAutoScroll] = useState(true)
  const [showConversation, setShowConversation] = useState(false) // Toggle state
  const [manualInput, setManualInput] = useState("")
  const [isUser, setIsUser] = useState(false)
  const [showInput, setShowInput] = useState(false)
  const scrollAreaRef = useRef(null)
  const conversationEndRef = useRef(null)

  // Add this inside the component function
  const { toast } = useToast()



  const handleAddConversation = () => {
    const timestamp = new Date().toISOString() // Universal UTC timestamp

    if (manualInput.trim()) {
      const newMessage = isUser
        ? { user: manualInput, time: timestamp, saved: false, hidden: false }
        : { other: manualInput, time: timestamp, saved: false, hidden: false }
      setWholeConversation((prev) => [...prev, newMessage])
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

  useEffect(() => {
    setWholeConversation((prev) =>
      prev.map(
        (message) =>
          message.saved
            ? { ...message, hidden: !showConversation } // Toggle `hidden` only for saved messages
            : message, // Keep unsaved messages unchanged
      ),
    )
  }, [showConversation])



  useEffect(() => {
    const handleMouseUp = () => {
      const selectedText = window.getSelection()?.toString().trim();
      if (!selectedText) return;
  
      const selection = window.getSelection();
      if (!selection) return;
  
      const anchorNode = selection.anchorNode;
      const focusNode = selection.focusNode;
  
      if (!anchorNode || !focusNode) return;
  
      const conversationContainer = document.getElementById("conversation-container");
  
      if (
        conversationContainer &&
        conversationContainer.contains(anchorNode) &&
        conversationContainer.contains(focusNode)
      ) {
        navigator.clipboard
          .writeText(selectedText)
          .then(() => {
            console.log("Copied:", selectedText);
            setCopiedText(selectedText);
            setUseHighlightedText(true); // Set highlighted text state to true
  
            // Show toast notification
            toast({
              title: "Text Selected",
              description: selectedText.length > 50 ? `"${selectedText.substring(0, 50)}..."` : `"${selectedText}"`,
              className: "bg-primary text-primary-foreground",
              duration: 1000,
            });
  
            // Deselect text after copying
            selection.removeAllRanges();
          })
          .catch((err) => console.error("Copy failed:", err));
      }
    };  
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);
  
  
  
  

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
            <CaptureScreenButton />
            <MicrophoneButton />
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
            className={cn("h-7 px-2", autoScroll && "bg-primary/10 text-primary")}
            title={autoScroll ? "Auto-scroll On" : "Auto-scroll Off"}
          >
            <ScrollText className="h-4 w-4 mr-1" />
            {autoScroll ? "Auto-scroll On" : "Auto-scroll Off"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowConversation((prev) => !prev)} // Toggle state
            className={cn("h-7 px-2", showConversation && "bg-primary/10 text-primary")}
            title={showConversation ? "Hide Conversation" : "Show Conversation"}
          >
            {showConversation ? "Hide Conversation" : "Show Conversation"}
          </Button>
        </div>

        <CardContent className="p-2 pt-8 flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 min-h-0 overflow-hidden">
            <ScrollArea className="h-full pr-2" ref={scrollAreaRef} id="conversation-container">
              {wholeConversation?.filter((msg) => msg.hidden == false).length > 0 ? (
                <div className="space-y-2 py-1">
                  {wholeConversation
                    .filter((msg) => msg.hidden == false)
                    .map((message, index) => (
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

