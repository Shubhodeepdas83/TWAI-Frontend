"use client"

import { Button } from "@/components/ui/button"
import { Bot, X, Send, CloudUpload, Trash, Search, BarChart2, Highlighter, ScrollText, Database } from "lucide-react"
import { useAppContext } from "../../context/AppContext"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useParams } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import ReactMarkdown from "react-markdown"
import { unstable_noStore as noStore } from "next/cache"

export default function MiddleSection() {
  noStore()
  const {
    isProcessing,
    setChatMessages,
    chatMessages,
    enableWebSearch,
    setEnableWebSearch,
    showGraph,
    setShowGraph,
    useHighlightedText,
    setUseHighlightedText,
    userInput,
    setUserInput,
    setGraphImage,
    wholeConversation,
    setUsedCitations,
    setCapturePartialTranscript,
    setMicPartialTranscript,
    setWholeConversation,
    videoRef,
    stream,
    setCopiedText,
    graphImage,
    usedCitations,
    setIsProcessing, useRag, setUseRag
  } = useAppContext()

  const { sessionId } = useParams()
  const [autoScroll, setAutoScroll] = useState(true)
  const chatEndRef = useRef(null)
  const [image, setImage] = useState(null)
  const [isGraphVisible, setIsGraphVisible] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")

  const toggleGraphVisibility = () => {
    setIsGraphVisible(!isGraphVisible)
  }

  const handleAIAnswer = async (type) => {
    // Placeholder function for AI tools
    console.log(`AI Tool ${type} clicked`)
  }

  const handleSendMessage = async () => {
    if (isProcessing) return

    if (userInput.trim()) {
      setChatMessages((prev) => [...prev, { text: userInput, sender: "user" }])
      setChatMessages((prev) => [...prev, { text: "Thinking...", sender: "ai" }])
      setUserInput("")
      setUsedCitations([])
      setGraphImage(null)
      setIsProcessing(true)

      const formData = new FormData()
      formData.append("user_input", userInput)
      formData.append("use_web", enableWebSearch)
      formData.append("use_graph", showGraph)
      formData.append("sessionId", sessionId)
      formData.append("useRag", useRag)
      if (image) {
        formData.append("uploaded_file", image)
      }

      if (wholeConversation) {
        formData.append("raw_Conversation", JSON.stringify(wholeConversation))
      }

      try {
        // Send the request to the server-side route
        const response = await fetch("/api/chat_Jamie_AI", {
          method: "POST",
          body: formData,
        })

        if (!response) throw new Error("AI response is undefined")

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ""
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })

          // Ensure we process full JSON objects by splitting on newline (\n)
          const lines = buffer.split("\n").filter((line) => line.trim() !== "")

          for (const line of lines) {
            try {
              const h = JSON.parse(line)
              buffer = lines.slice(1).join() || ""
              if (h.result) {
                setChatMessages((prev) => [
                  ...prev.filter((msg) => msg.text !== "Thinking..."),
                  { text: h.result, sender: "ai" },
                ])
              }
              if (h.used_citations) {
                setUsedCitations(
                  Object.entries(h.used_citations).map(([key, value]) => ({
                    id: key,
                    ...value,
                  })),
                )
              }
              if (h.graph) {
                setGraphImage(h.graph)
                setShowGraph(true)
              }
            } catch (error) {
              console.error("JSON Parsing Error:", error)
            }
          }
        }

        setChatMessages((prev) => [...prev.filter((msg) => msg.text !== "Thinking...")])
        setIsProcessing(false)
      } catch (error) {
        console.error("Error sending message:", error)
        setChatMessages((prev) => [
          ...prev.filter((msg) => msg.text !== "Thinking..."),
          { text: "An error occurred while processing your request.", sender: "ai" },
        ])
        setIsProcessing(false)
      }
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
    <div className="h-full flex flex-col gap-2">
      <Card className="border shadow-sm flex-1 flex flex-col overflow-hidden">
        <CardHeader className="p-3 pb-1 flex flex-row items-center justify-between shrink-0">
          <div className="flex items-center gap-1">
            <Bot className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-medium">TalkWise AI</CardTitle>
            {isProcessing && (
              <div className="flex space-x-1 ml-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-150"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-300"></div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAutoScroll(!autoScroll)}
              className={`text-muted-foreground h-7 w-7 p-0 ${autoScroll ? "bg-primary/10 text-primary" : ""}`}
              title={autoScroll ? "Auto-scroll On" : "Auto-scroll Off"}
            >
              <ScrollText className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-red-500 h-7 w-7 p-0"
              disabled={chatMessages.length === 0}
              title="Clear Chat"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-3 pt-0 flex-1 flex flex-col overflow-hidden">
          {/* Scrollable Messages Area */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full pr-2">
              {chatMessages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center p-4">
                  <div className="max-w-sm">
                    <Bot className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-base font-medium mb-1">Welcome to AI Meeting Helper</h3>
                    <p className="text-muted-foreground text-xs">
                      Ask questions or upload an image to get assistance with your meeting preparation.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 py-1">
                  {chatMessages.map((message, index) => (
                    <div key={index} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`p-2 rounded-lg max-w-[85%] text-sm ${message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                      >
                        {message.text === "Thinking..." ? (
                          <div className="flex items-center gap-1">
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
        </CardContent>
        {image && (
          <div className="mb-2 p-1 bg-muted rounded-lg flex items-center w-full">
            <img
              src={URL.createObjectURL(image) || "/placeholder.svg"}
              alt="Uploaded Preview"
              className="h-10 w-10 object-cover rounded-md"
            />
            <span className="text-xs ml-2 flex-1 truncate">{image.name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveImage}
              className="text-destructive hover:text-destructive/90 h-7 w-7 p-0"
            >

              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
        <CardFooter className="p-3 pt-1 border-t">


          <div className="flex flex-col gap-1 w-full">
            <div className="flex gap-1 w-full">
              <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type a message..."
                className="resize-none min-h-[60px] flex-1 text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
              <div className="flex flex-col gap-1">
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

            <div className="flex items-center justify-between text-xs text-muted-foreground mt-1 flex-wrap">
              <div className="flex flex-nowrap overflow-x-auto space-x-2 pb-1 max-w-full">
                <label className="flex items-center gap-1 cursor-pointer whitespace-nowrap">
                  <Checkbox
                    checked={enableWebSearch}
                    onCheckedChange={() => setEnableWebSearch(!enableWebSearch)}
                    id="web-search"
                    className={`h-3 w-3 ${enableWebSearch ? "bg-primary text-primary-foreground" : ""}`}
                  />
                  <div className="flex items-center gap-1">
                    <Search className={`h-3 w-3 ${enableWebSearch ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={`text-xs ${enableWebSearch ? "text-primary font-medium" : ""}`}>Web Search</span>
                  </div>
                </label>

                <label className="flex items-center gap-1 cursor-pointer whitespace-nowrap">
                  <Checkbox
                    checked={showGraph}
                    onCheckedChange={() => setShowGraph(!showGraph)}
                    id="show-graph"
                    className={`h-3 w-3 ${showGraph ? "bg-primary text-primary-foreground" : ""}`}
                  />
                  <div className="flex items-center gap-1">
                    <BarChart2 className={`h-3 w-3 ${showGraph ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={`text-xs ${showGraph ? "text-primary font-medium" : ""}`}>Graph</span>
                  </div>
                </label>
                <label className="flex items-center gap-1 cursor-pointer whitespace-nowrap">
                  <Checkbox
                    checked={useHighlightedText}
                    onCheckedChange={() => setUseHighlightedText(!useHighlightedText)}
                    id="use-highlighted-text-toggle"
                    className={`h-3 w-3 ${useHighlightedText ? "bg-primary text-primary-foreground" : ""}`}
                  />
                  <div className="flex items-center gap-1">
                    <Highlighter
                      className={`h-3 w-3 ${useHighlightedText ? "text-primary" : "text-muted-foreground"}`}
                    />
                    <span className={`text-xs ${useHighlightedText ? "text-primary font-medium" : ""}`}>
                      Highlighted
                    </span>
                  </div>
                </label>
                <label className="flex items-center gap-1 cursor-pointer whitespace-nowrap">
                  <Checkbox
                    checked={useRag}
                    onCheckedChange={() => setUseRag(!useRag)}
                    id="use-rag-toggle"
                    className={`h-3 w-3 ${useRag ? "bg-primary text-primary-foreground" : ""}`}
                  />
                  <div className="flex items-center gap-1">
                    <Database className={`h-3 w-3 ${useRag ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={`text-xs ${useRag ? "text-primary font-medium" : ""}`}>Use RAG</span>
                  </div>
                </label>
              </div>
              <span className="text-xs">Shift+Enter for new line</span>
            </div>
          </div>
        </CardFooter>
      </Card>

    </div>
  )
}

