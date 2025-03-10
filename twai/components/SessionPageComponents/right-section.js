"use client"

import { Button } from "@/components/ui/button"
import { Bot, X, Send, CloudUpload, Trash, Search, BarChart2, Highlighter, ScrollText } from "lucide-react"
import { useAppContext } from "../../context/AppContext"
import { get_AI_Help } from "../../lib/sessionActions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { appendConversation } from "../../app/session/[sessionId]/actions"
import { useParams } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import ReactMarkdown from "react-markdown"
import { unstable_noStore as noStore } from 'next/cache';
export default function RightSection() {
  noStore();
  const {
    isProcessing,
    setIsProcessing,
    setCapturePartialTranscript,
    setMicPartialTranscript,
    setWholeConversation,
    setChatMessages,
    chatMessages,
    wholeConversation,
    enableWebSearch,
    setEnableWebSearch,
    showGraph,
    setShowGraph,
    usedCitations,
    setUsedCitations,
    useHighlightedText,
    setUseHighlightedText,
    copiedText,
    userInput,
    setUserInput,
  } = useAppContext()

  const { sessionId } = useParams()
  const [autoScroll, setAutoScroll] = useState(true)
  const chatEndRef = useRef(null)
  const [image, setImage] = useState(null)



  const handleSendMessage = async () => {
    if (userInput.trim()) {
      setIsProcessing(true)
      setChatMessages((prev) => [...prev, { text: userInput, sender: "user" }])
      setChatMessages((prev) => [...prev, { text: "Thinking...", sender: "ai"} ]);
      setUserInput("")

      const formData = new FormData()
      formData.append("user_input", userInput)
      formData.append("use_web", enableWebSearch)
      formData.append("use_graph", showGraph)
      formData.append("sessionId", sessionId)
      if (image) {
        formData.append("uploaded_file", image)
      }

      if (wholeConversation) {
        formData.append("raw_Conversation", JSON.stringify(wholeConversation))
      }

      // Send the request to the server-side route
      const response = await fetch("/api/chat_Jamie_AI", {
        method: "POST",
        body: formData,
      })

      if (!response) throw new Error("AI response is undefined");
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // Ensure we process full JSON objects by splitting on newline (\n)
        const lines = buffer.split("\n").filter(line => line.trim() !== "");
        // buffer = lines.pop() || ""; // Save the last (possibly incomplete) line for next read



        console.log("Lines:", lines);
        console.log("Remaining Buffer:", buffer);
        console.log("Buffer split:",buffer.split("\n").filter(line => line.trim() !== ""))
        for (const line of lines) {
          try {
              const h = JSON.parse(line);
              buffer = lines.slice(1).join() || "";
              // if (h.query) {
              //   setChatMessages((prev) => [
              //     ...prev.filter((msg) => msg.text !== "Thinking..."),
              //     { text: h.query, sender: "user" },
              //   ]);
              // }
              if (h.result) {
                setChatMessages((prev) => [
                  ...prev.filter((msg) => msg.text !== "Thinking..."),
                  { text: h.result, sender: "ai" },
                ]);
              }
              if (h.used_citations) {
                setUsedCitations(
                  Object.entries(h.used_citations).map(([key, value]) => ({
                    id: key,
                    ...value,
                  }))
                );
              }
              if(h.graph){
                setGraphImage(h.graph)
                setShowGraph(true)
              }
          } catch (error) {
              console.error('JSON Parsing Error:', error);
          }
      }


      
    }

      // Update chat messages with AI response
      // setChatMessages((prev) => [
      //   ...prev.filter((msg) => msg.text !== "Thinking..."),
      //   { text: data.answer, sender: "ai" },
      // ])

      // if (data.used_citations) {
      //   setUsedCitations(
      //     Object.entries(data.used_citations).map(([key, value]) => ({
      //       id: key,
      //       ...value,
      //     })),
      //   )
      // } else {
      //   setUsedCitations([])
      // }
      setIsProcessing(false)
    }
  }

  const handleClear = () => {
    setChatMessages([])
    setUserInput("")
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file && ["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      setImage(file)
    } else {
      alert("Please upload a valid image file (PNG, JPG, JPEG).")
    }
  }

  const triggerFileInput = () => {
    document.getElementById("imageUpload").click()
  }

  const handleRemoveImage = () => {
    setImage(null)
  }

  // Auto-scroll effect for chat
  useEffect(() => {
    if (autoScroll && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [chatMessages, autoScroll])

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col overflow-hidden">
      {/* AI Chat Card - Full height */}
      <Card className="border shadow-sm flex-1 flex flex-col overflow-hidden">
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-medium">AI Meeting Helper</CardTitle>
            {isProcessing && (
    <div className="flex space-x-2">
      <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce"></div>
      <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce delay-150"></div>
      <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce delay-300"></div>
    </div>
  )}
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
              onClick={handleClear}
              className="text-muted-foreground h-8"
              disabled={chatMessages.length === 0}
            >
              <X className="h-4 w-4 mr-1" />
              Clear Chat
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0 flex-1 flex flex-col overflow-hidden">
          {/* Scrollable Messages Area */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full pr-3">
              {chatMessages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center p-8">
                  <div className="max-w-sm">
                    <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Welcome to AI Meeting Helper</h3>
                    <p className="text-muted-foreground text-sm">
                      Ask questions or upload an image to get assistance with your meeting preparation.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 py-2">
                  {chatMessages.map((message, index) => (
                    <div key={index} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`p-3 rounded-lg max-w-[85%] ${
                          message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        {message.text === "Thinking..." ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-pulse">Thinking</div>
                            <span className="animate-bounce">.</span>
                            <span className="animate-bounce delay-100">.</span>
                            <span className="animate-bounce delay-200">.</span>
                          </div>
                        ) : (
                          <div className="text-sm">
                            <ReactMarkdown>{message.text}</ReactMarkdown>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Fixed Input Area */}
          <div className="mt-4 shrink-0">
            {image && (
              <div className="mb-3 p-2 bg-muted rounded-lg flex items-center">
                <img
                  src={URL.createObjectURL(image) || "/placeholder.svg"}
                  alt="Uploaded Preview"
                  className="h-12 w-12 object-cover rounded-md"
                />
                <span className="text-sm ml-2 flex-1 truncate">{image.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveImage}
                  className="text-destructive hover:text-destructive/90 h-8 w-8 p-0"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Type a message..."
                  className="resize-none min-h-[80px]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <div className="flex flex-col gap-2">
                  <Button disabled={isProcessing || !userInput.trim()} onClick={handleSendMessage} className="flex-1">
                    <Send className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="flex-1" onClick={triggerFileInput}>
                    <CloudUpload className="h-4 w-4" />
                  </Button>
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                <div className="flex space-x-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={enableWebSearch}
                      onCheckedChange={() => setEnableWebSearch(!enableWebSearch)}
                      id="web-search"
                      className={enableWebSearch ? "bg-primary text-primary-foreground" : ""}
                    />
                    <div className="flex items-center gap-1">
                      <Search className={`h-4 w-4 ${enableWebSearch ? "text-primary" : "text-muted-foreground"}`} />
                      <span className={enableWebSearch ? "text-primary font-medium" : ""}>Web Search</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={showGraph}
                      onCheckedChange={() => setShowGraph(!showGraph)}
                      id="show-graph"
                      className={showGraph ? "bg-primary text-primary-foreground" : ""}
                    />
                    <div className="flex items-center gap-1">
                      <BarChart2 className={`h-4 w-4 ${showGraph ? "text-primary" : "text-muted-foreground"}`} />
                      <span className={showGraph ? "text-primary font-medium" : ""}>Graph Visualization</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={useHighlightedText}
                      onCheckedChange={() => setUseHighlightedText(!useHighlightedText)}
                      id="use-highlighted-text-toggle"
                      className={useHighlightedText ? "bg-primary text-primary-foreground" : ""}
                    />
                    <div className="flex items-center gap-1">
                      <Highlighter
                        className={`h-4 w-4 ${useHighlightedText ? "text-primary" : "text-muted-foreground"}`}
                      />
                      <span className={useHighlightedText ? "text-primary font-medium" : ""}>Highlighted Text</span>
                    </div>
                  </label>
                </div>
                <span>Press Enter to send, Shift+Enter for new line</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

