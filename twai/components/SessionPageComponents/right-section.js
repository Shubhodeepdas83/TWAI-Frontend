"use client"

import { useAppContext } from "../../context/AppContext"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  FileText,
  Clock,
  BarChart2,
  X,
  ExternalLink,
  LogOut,
  Smile,
  MessageCircle,
  Handshake,
  Star,
  Search,
  Book,
  List,
  Send,
  Database,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useParams, useRouter } from "next/navigation"
import { appendConversation } from "../../app/session/[sessionId]/actions"
import { unstable_noStore as noStore } from "next/cache"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { v4 as uuidv4 } from "uuid"
import { Textarea } from "@/components/ui/textarea"
import FloatingImageWindow from "./FloatingImageWindow"

export default function RightSection() {
  noStore()
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
    usedCitations,
    setUsedCitations,
    copiedText,
    setCopiedText,
    graphImage,
    setGraphImage,
    setShowGraph,
    showGraph,
    useRag,
    setSaveChatCounter,
    setUseHighlightedText,
    useHighlightedText,
    setEnableWebSearch,
    videoRef,
    stream,
    setUseRag,
    saveChatCounter,
  } = useAppContext()

  const { sessionId } = useParams()
  const router = useRouter()
  const [isGraphVisible, setIsGraphVisible] = useState(false)
  const [enlargedImage, setEnlargedImage] = useState(null)
  const [loadingExit, setLoadingExit] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [userInput, setUserInput] = useState("")

  const toggleGraphVisibility = () => {
    setIsGraphVisible(!isGraphVisible)
  }

  const handleExit = async () => {
    setLoadingExit(true)
    appendConversation({
      sessionId: sessionId,
      newMessages: wholeConversation
        .filter((msg) => msg.saved == false)
        .map((message) =>
          ["user", "other", "time"].reduce((acc, key) => {
            if (message.hasOwnProperty(key)) acc[key] = message[key]
            return acc
          }, {}),
        ),
    })
    router.push("/dashboard")
  }

  const handleAIAnswer = async (requestType) => {
    if (isProcessing) return
    setGraphImage(null)
    setIsProcessing(true)
    setUsedCitations([])
    setChatMessages([...chatMessages, { text: "Thinking...", sender: "ai" }])
    const COPIEDTEXT = copiedText.trim()
    const USEHIGHLIGHTEDTEXT = useHighlightedText
    setCopiedText("")
    setUseHighlightedText(false)

    try {
      const tempconv = [...wholeConversation]
      setWholeConversation((prev) => prev.map((msg) => ({ ...msg, saved: true })))
      const id = uuidv4()

      const response = await fetch("/api/get_AI_Help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation: tempconv,
          use_web: enableWebSearch,
          requestType,
          useHighlightedText: USEHIGHLIGHTEDTEXT,
          copiedText: COPIEDTEXT,
          sessionId,
          useRag,
        }),
      })

      if (!response.ok) throw new Error(`Server responded with ${response.status}`)

      const reader = response.body?.getReader()
      if (!reader) throw new Error("Streaming not supported")

      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")

        // 🟣 Keep incomplete JSON line for next iteration
        buffer = lines.pop() || ""

        for (const line of lines) {
          if (!line.trim()) continue
          try {
            const h = JSON.parse(line)

            if (h.query) {
              setChatMessages((prev) => {
                const filteredMessages = prev.filter((msg) => msg.text !== "Thinking...")
                const existingMessageIndex = filteredMessages.findIndex((msg) => msg.id === id && msg.sender === "user")

                if (existingMessageIndex !== -1) {
                  const updatedMessages = [...filteredMessages]
                  updatedMessages[existingMessageIndex] = {
                    ...updatedMessages[existingMessageIndex],
                    text: h.query,
                    saved: false,
                  }
                  return [...updatedMessages, { text: "Thinking...", sender: "ai" }]
                } else {
                  return [
                    ...filteredMessages,
                    {
                      text: h.query,
                      sender: "user",
                      id: id,
                      time: new Date().toISOString(),
                      action: requestType,
                      latestConvoTime: tempconv.length > 0 ? tempconv[tempconv.length - 1].time : null,
                      saved: false,
                      hidden: false,
                      isWeb: enableWebSearch,
                      isRag: useRag,
                      useHighlightedText: USEHIGHLIGHTEDTEXT,
                      copiedText: COPIEDTEXT,
                    },
                    { text: "Thinking...", sender: "ai" },
                  ]
                }
              })
            }

            if (h.result) {
              setChatMessages((prev) => {
                const aiMessageIndex = prev.findIndex((msg) => msg.id === id && msg.sender === "ai")
                if (aiMessageIndex !== -1) {
                  return prev
                    .filter((msg) => msg.text !== "Thinking...")
                    .map((msg) =>
                      msg.id === id && msg.sender === "ai" ? { ...msg, text: h.result, saved: false } : msg,
                    )
                } else {
                  return [
                    ...prev.filter((msg) => msg.text !== "Thinking..."),
                    {
                      text: h.result,
                      sender: "ai",
                      id: id,
                      time: new Date().toISOString(),
                      saved: false,
                      hidden: false,
                    },
                  ]
                }
              })
            }

            if (h.used_citations) {
              console.log("Used Citations:", h.used_citations)
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
            console.warn("Streaming JSON parse error:", error)
          }
        }
      }

      // ✅ Handle any remaining data in buffer after stream ends
      if (buffer.trim() !== "") {
        try {
          const h = JSON.parse(buffer)
          if (h.result) {
            setChatMessages((prev) => [
              ...prev.filter((msg) => msg.text !== "Thinking..."),
              {
                text: h.result,
                sender: "ai",
                id: id,
                time: new Date().toISOString(),
                saved: false,
                hidden: false,
              },
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
        } catch (err) {
          console.warn("Final JSON parse error:", err)
        }
      }

      setChatMessages((prev) => [...prev.filter((msg) => msg.text !== "Thinking...")])

      setSaveChatCounter((prev) => prev + 1)

      const appending = await appendConversation({
        sessionId,
        newMessages: tempconv
          .filter((msg) => msg.saved === false)
          .map((message) =>
            ["user", "other", "time"].reduce((acc, key) => {
              if (message.hasOwnProperty(key)) acc[key] = message[key]
              return acc
            }, {}),
          ),
      })

      if (appending.success) {
        setCapturePartialTranscript("")
        setMicPartialTranscript("")
      } else {
        console.log("Error appending conversation")
        setWholeConversation((prev) => [tempconv, ...prev])
      }
    } catch (error) {
      console.error("AI Request failed:", error)
      setChatMessages((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { text: "An error occurred while processing your request.", sender: "ai", hidden: false },
      ])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleImageClick = (imageData) => {
    setEnlargedImage(imageData)
  }

  const handleSendMessage = async () => {
    if (isProcessing || !userInput.trim()) return

    const id = uuidv4()
    setIsProcessing(true)
    setCopiedText("")
    setUseHighlightedText(false)

    setChatMessages((prev) => [
      ...prev,
      {
        text: userInput,
        sender: "user",
        id: id,
        time: new Date().toISOString(),
        action: "chat_Jamie_AI",
        latestConvoTime: wholeConversation.length > 0 ? wholeConversation[wholeConversation.length - 1].time : null,
        saved: false,
        hidden: false,
        isWeb: enableWebSearch,
        isRag: useRag,
        useHighlightedText: false,
        copiedText: "",
      },
      { text: "Thinking...", sender: "ai" },
    ])

    setUserInput("")
    setUsedCitations([])
    setGraphImage(null)

    const formData = new FormData()
    formData.append("user_input", userInput)
    formData.append("use_web", enableWebSearch)
    formData.append("use_graph", showGraph)
    formData.append("sessionId", sessionId)
    formData.append("useRag", useRag)

    try {
      const response = await fetch("/api/chat_Jamie_AI", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error(`Server responded with ${response.status}`)

      const reader = response.body?.getReader()
      if (!reader) throw new Error("Streaming not supported")

      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        const lines = buffer.split("\n")
        buffer = lines.pop() || ""

        for (const line of lines) {
          if (!line.trim()) continue
          try {
            const h = JSON.parse(line)

            if (h.result) {
              setChatMessages((prev) => {
                const filteredMessages = prev.filter((msg) => msg.text !== "Thinking...")
                const existingMessageIndex = filteredMessages.findIndex((msg) => msg.id === id && msg.sender === "ai")

                if (existingMessageIndex !== -1) {
                  return filteredMessages.map((msg) =>
                    msg.id === id && msg.sender === "ai" ? { ...msg, text: h.result, saved: false } : msg,
                  )
                } else {
                  return [
                    ...filteredMessages,
                    {
                      text: h.result,
                      sender: "ai",
                      id: id,
                      time: new Date().toISOString(),
                      saved: false,
                      hidden: false,
                    },
                  ]
                }
              })
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
            console.warn("JSON parse error for line:", line, error)
          }
        }
      }

      setChatMessages((prev) => [...prev.filter((msg) => msg.text !== "Thinking...")])
      setSaveChatCounter((prev) => prev + 1)
    } catch (error) {
      console.error("Error sending message:", error)
      setChatMessages((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { text: "An error occurred while processing your request.", sender: "ai", hidden: false },
      ])
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="h-full flex flex-col gap-2">
      {/* AI Tools Card */}
      <Card className="border shadow-sm">
        <CardHeader className="p-2 pb-1 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-medium">Quick Action AI-Agents</CardTitle>
          <Button
            onClick={handleExit}
            variant="destructive"
            size="sm"
            className="flex items-center gap-1 h-7 py-0 text-xs"
            disabled={loadingExit}
          >
            {loadingExit ? (
              <>
                <div className="h-3 w-3 border-2 border-t-transparent border-white rounded-full animate-spin mr-1"></div>
                Exiting...
              </>
            ) : (
              <>
                <LogOut className="h-3 w-3" />
                Exit
              </>
            )}
          </Button>
        </CardHeader>

        <CardContent className="p-2 pt-0 flex flex-col gap-3">
          {/* Checkboxes Section converted to button style */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEnableWebSearch(!enableWebSearch)}
              className={`text-muted-foreground h-7 px-2 flex items-center ${enableWebSearch ? "bg-primary/10 text-primary" : ""}`}
              title={enableWebSearch ? "Web Search On" : "Web Search Off"}
            >
              <Search className="h-3 w-3 mr-1" />
              Web Search
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowGraph(!showGraph)}
              className={`text-muted-foreground h-7 px-2 flex items-center ${showGraph ? "bg-primary/10 text-primary" : ""}`}
              title={showGraph ? "Graph On" : "Graph Off"}
            >
              <BarChart2 className="h-3 w-3 mr-1" />
              Graph
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setUseRag(!useRag)}
              className={`text-muted-foreground h-7 px-2 flex items-center ${useRag ? "bg-primary/10 text-primary" : ""}`}
              title={useRag ? "RAG On" : "RAG Off"}
            >
              <Database className="h-3 w-3 mr-1" />
              RAG
            </Button>
          </div>

          {useHighlightedText && copiedText && (
            <div className="flex items-center gap-2 bg-muted p-2 rounded-md text-xs relative">
              <p className="whitespace-nowrap overflow-hidden text-ellipsis flex-1 pr-6 w-full">
                <span className="font-bold">Selected Text:</span> {copiedText}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCopiedText("")
                  setUseHighlightedText(false)
                }}
                className="h-5 w-5 p-0 absolute right-1 top-1"
                title="Clear highlighted text"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          {/* Vertically Scrollable Buttons Section (2 per row) - reduced height */}
          <div className="overflow-y-auto max-h-[95px] pr-1" style={{ scrollSnapType: "y mandatory" }}>
            <div className="grid grid-cols-2 gap-1">
              {/* AI Answer */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      disabled={isProcessing}
                      onClick={() => handleAIAnswer("help")}
                      variant="outline"
                      className="justify-start h-7 py-0 text-xs whitespace-nowrap"
                      size="sm"
                      style={{ scrollSnapAlign: "start" }}
                    >
                      <BookOpen className="mr-1 h-3 w-3" />
                      AI Answer
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="pointer-events-none">
                    <p className="text-xs">Get AI assistance with your meeting questions</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Fact Checking */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      disabled={isProcessing}
                      onClick={() => handleAIAnswer("factcheck")}
                      variant="outline"
                      className="justify-start h-7 py-0 text-xs whitespace-nowrap"
                      size="sm"
                      style={{ scrollSnapAlign: "start" }}
                    >
                      <FileText className="mr-1 h-3 w-3" />
                      Fact Checking
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="pointer-events-none">
                    <p className="text-xs">Verify facts in the conversation</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Summarize */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      disabled={isProcessing}
                      onClick={() => handleAIAnswer("summary")}
                      variant="outline"
                      className="justify-start h-7 py-0 text-xs whitespace-nowrap"
                      size="sm"
                      style={{ scrollSnapAlign: "start" }}
                    >
                      <Clock className="mr-1 h-3 w-3" />
                      Summarize
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="pointer-events-none">
                    <p className="text-xs">Get a summary of the conversation so far</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Create Action Plan */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      disabled={isProcessing}
                      onClick={() => handleAIAnswer("createactionplan")}
                      variant="outline"
                      className="justify-start h-7 py-0 text-xs whitespace-nowrap"
                      size="sm"
                      style={{ scrollSnapAlign: "start" }}
                    >
                      <List className="mr-1 h-3 w-3" />
                      Create Action Plan
                    </Button>
                  </TooltipTrigger>
                </Tooltip>
              </TooltipProvider>

              {/* Explain Like 5-Year-Old */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      disabled={isProcessing}
                      onClick={() => handleAIAnswer("fiveyearold")}
                      variant="outline"
                      className="justify-start h-7 py-0 text-xs whitespace-nowrap"
                      size="sm"
                      style={{ scrollSnapAlign: "start" }}
                    >
                      <Smile className="mr-1 h-3 w-3" />
                      Explain Like 5yr Old
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Simplify the explanation</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Make Convincing */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      disabled={true}
                      variant="outline"
                      className="justify-start h-7 py-0 text-xs whitespace-nowrap"
                      size="sm"
                      style={{ scrollSnapAlign: "start" }}
                    >
                      <Star className="mr-1 h-3 w-3" />
                      Make Convincing
                    </Button>
                  </TooltipTrigger>
                </Tooltip>
              </TooltipProvider>

              {/* Search CRM */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      disabled={true}
                      variant="outline"
                      className="justify-start h-7 py-0 text-xs whitespace-nowrap"
                      size="sm"
                      style={{ scrollSnapAlign: "start" }}
                    >
                      <Search className="mr-1 h-3 w-3" />
                      Search CRM
                    </Button>
                  </TooltipTrigger>
                </Tooltip>
              </TooltipProvider>

              {/* Help Explain Better */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      disabled={true}
                      variant="outline"
                      className="justify-start h-7 py-0 text-xs whitespace-nowrap"
                      size="sm"
                      style={{ scrollSnapAlign: "start" }}
                    >
                      <MessageCircle className="mr-1 h-3 w-3" />
                      Help Explain Better
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Get a clearer explanation</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Negotiation Tip */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      disabled={true}
                      variant="outline"
                      className="justify-start h-7 py-0 text-xs whitespace-nowrap"
                      size="sm"
                      style={{ scrollSnapAlign: "start" }}
                    >
                      <Handshake className="mr-1 h-3 w-3" />
                      Negotiation Tip
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Get a useful negotiation tip</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Explain Layman Terms */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      disabled={true}
                      variant="outline"
                      className="justify-start h-7 py-0 text-xs whitespace-nowrap"
                      size="sm"
                      style={{ scrollSnapAlign: "start" }}
                    >
                      <Book className="mr-1 h-3 w-3" />
                      Explain Layman Terms
                    </Button>
                  </TooltipTrigger>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Text Input and Send Button */}
          <div className="flex flex-col gap-1 w-full mt-1">
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
              </div>
            </div>
          </div>
        </CardContent>

        {/* Graph Icon - Positioned Below AI Tools */}
        {graphImage && showGraph && (
          <Button
            variant="outline"
            size="sm"
            className="w-full flex items-center justify-center h-7 py-0 text-xs mt-2 gap-1"
            onClick={toggleGraphVisibility}
          >
            <BarChart2 className="h-3 w-3" />
            <span>{isGraphVisible ? "Hide Graph" : "Show Graph"}</span>
          </Button>
        )}
      </Card>

      {/* Citations Section */}
      <Card className="border shadow-sm flex-1 flex flex-col overflow-hidden">
        <CardHeader className="p-2 pb-1">
          <CardTitle className="text-base font-medium">Artifacts</CardTitle>
        </CardHeader>
        <CardContent className="p-2 pt-0 flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-2">
            {usedCitations.length > 0 ? (
              <div className="space-y-2">
                {usedCitations.map((citation) => {
                  let modifiedDescription = citation.description
                  const pageMatch = modifiedDescription.match(/, Page (\d+(\.\d+)?)/i)

                  if (pageMatch) {
                    const pageNumber = pageMatch[1]
                    modifiedDescription = modifiedDescription.replace(
                      pageMatch[0],
                      `#page=${Number.parseInt(pageNumber) + 1}`,
                    )
                  }

                  return (
                    <div key={citation.id} className="border rounded-lg p-2 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <div className="bg-primary/10 text-primary text-xs font-medium px-1.5 py-0.5 rounded">
                          #{citation.id}
                        </div>
                        {citation.description.startsWith("http") && (
                          <a
                            href={modifiedDescription}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>

                      {/* Truncate Long Links */}
                      <div className="text-xs w-full truncate">
                        {citation.description.startsWith("http") && !citation.isimg && !citation.image_data ? (
                          <a
                            href={modifiedDescription}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline w-full block truncate"
                            style={{ display: "block", maxWidth: "100%" }}
                            title={citation.description}
                          >
                            {modifiedDescription.length > 50
                              ? modifiedDescription.slice(0, 50) + "..."
                              : modifiedDescription}
                          </a>
                        ) : (
                          <></>
                        )}
                      </div>

                      {/* Fixed Image Size with click to enlarge */}
                      {citation.isimg && citation.image_data && (
                        <div
                          className="mt-1 bg-white p-1 rounded border flex justify-center cursor-pointer"
                          onClick={() => handleImageClick(citation.image_data)}
                        >
                          <img
                            src={`data:image/png;base64,${citation.image_data}`}
                            alt={`Citation ${citation.id}`}
                            className="rounded-md object-contain"
                            style={{ maxWidth: "100%", maxHeight: "120px" }}
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground text-center text-xs">No Artifacts available</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Display the Graph in a Pop-up or Modal */}
      {isGraphVisible && graphImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-3 rounded-lg max-w-lg w-full relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleGraphVisibility}
              className="absolute top-1 right-1 text-muted-foreground h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="flex justify-center">
              <img
                src={`data:image/png;base64,${graphImage}`}
                alt="Generated Graph"
                className="rounded-md max-w-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Enlarged Image Slide-in Panel */}
      {enlargedImage && (
        <FloatingImageWindow
          imageData={enlargedImage}
          onClose={() => {
            setEnlargedImage(null)
            setZoomLevel(1) // Reset zoom when closing
          }}
        />
      )}
    </div>
  )
}

