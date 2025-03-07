"use client"
import { useAppContext } from "../../context/AppContext"
import { Button } from "@/components/ui/button"
import { X, Image, FileText, ExternalLink, BookOpen, Clock } from "lucide-react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import MicrophoneButton from "@/components/SessionPageComponents/microphoneButton"
import CaptureScreenButton from "@/components/SessionPageComponents/captureScreenButton"
import { useParams } from "next/navigation"
import { appendConversation } from "../../app/session/[sessionId]/actions"
import { get_AI_Help } from "../../lib/sessionActions"

export default function MiddleSection() {
  const {
    chatMessages,
    setChatMessages,
    userInput,
    setUserInput,
    isProcessing,
    enableWebSearch,
    setEnableWebSearch,
    showGraph,
    setShowGraph,
    wholeConversation,
    setUsedCitations,
    setIsProcessing,
    videoRef,
    stream,
    setUseHighlightedText,
    useHighlightedText,
    usedCitations,
    setCapturePartialTranscript,
    setWholeConversation,
    setMicPartialTranscript,
    copiedText,
  } = useAppContext()

  const [image, setImage] = useState(null)
  const [graphImage, setGraphImage] = useState(null)
  const [isGraphVisible, setIsGraphVisible] = useState(false)

  const { sessionId } = useParams()

  const handleSendMessage = async () => {
    if (userInput.trim()) {
      setIsProcessing(true)
      setChatMessages([...chatMessages, { text: userInput, sender: "user" }])
      setUserInput("")

      const formData = new FormData()
      formData.append("user_input", userInput)
      formData.append("use_web", enableWebSearch)
      formData.append("use_graph", showGraph)

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

      if (!response.ok) {
        return setChatMessages((prev) => [...prev, { text: "Sorry, I couldn't process the response.", sender: "ai" }])
      }

      const data = await response.json()

      // Update chat messages with AI response
      setChatMessages((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { text: data.answer, sender: "ai" },
      ])

      // If graph image exists, update the state
      if (data.graph) {
        setGraphImage(data.graph)
      }
      if (data.used_citations) {
        setUsedCitations(
          Object.entries(data.used_citations).map(([key, value]) => ({
            id: key,
            ...value,
          })),
        )
      } else {
        setUsedCitations([])
      }
      setIsProcessing(false)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file && ["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      setImage(file)
    } else {
      alert("Please upload a valid image file (PNG, JPG, JPEG).")
    }
  }

  const handleClear = () => {
    setChatMessages([])
    setUserInput("")
    setGraphImage(null)
  }

  const triggerFileInput = () => {
    document.getElementById("imageUpload").click()
  }

  const handleRemoveImage = () => {
    setImage(null)
  }

  const toggleGraphVisibility = () => {
    setIsGraphVisible(!isGraphVisible)
  }

  const handleAIAnswer = async (requestType) => {
    if (isProcessing) return
    setIsProcessing(true)

    setChatMessages([...chatMessages, { text: "Thinking...", sender: "ai" }])

    try {
      // First save the conversation to the database
      const appending = await appendConversation({ sessionId, newMessages: wholeConversation })
      const tempconv = [...wholeConversation] // Create a copy to avoid reference issues

      if (appending.success) {
        setCapturePartialTranscript("")
        setWholeConversation([])
        setMicPartialTranscript("")
      }

      // Then get AI help
      const aiResponse = await get_AI_Help(tempconv, enableWebSearch, requestType, useHighlightedText, copiedText)

      if (aiResponse) {
        setChatMessages((prev) => [
          ...prev.filter((msg) => msg.text !== "Thinking..."),
          { text: aiResponse.question || `Request for ${requestType}`, sender: "user" },
          { text: aiResponse.answer || "No response received", sender: "ai" },
        ])

        if (aiResponse.used_citations) {
          setUsedCitations(
            Object.entries(aiResponse.used_citations).map(([key, value]) => ({
              id: key,
              ...value,
            })),
          )
        } else {
          setUsedCitations([])
        }
      } else {
        setChatMessages((prev) => [
          ...prev.filter((msg) => msg.text !== "Thinking..."),
          { text: "Sorry, I couldn't process the request.", sender: "ai" },
        ])
      }
    } catch (error) {
      console.error("AI Request failed:", error)
      setChatMessages((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { text: "An error occurred while processing your request.", sender: "ai" },
      ])
    } finally {
      setIsProcessing(false)
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

      {/* AI Tools and Citations in a grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
        {/* Citations Section - Expanded */}
        <Card className="border shadow-sm md:col-span-2 flex flex-col overflow-hidden">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-lg font-medium">Citations</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 flex-1 overflow-hidden">
            {usedCitations.length > 0 ? (
              <ScrollArea className="h-full pr-3">
                <div className="space-y-3">
                  {usedCitations.map((citation) => (
                    <div key={citation.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded">
                          Citation #{citation.id}
                        </div>

                        {citation.description.startsWith("http") && (
                          <a
                            href={citation.description}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>

                      <div className="text-sm">
                        {citation.description.startsWith("http") ? (
                          <a
                            href={citation.description}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline break-words"
                          >
                            {citation.description}
                          </a>
                        ) : (
                          <p className="break-words">{citation.description}</p>
                        )}
                      </div>

                      {citation.isimg && citation.image_data && (
                        <div className="mt-2 bg-white p-2 rounded border">
                          <img
                            src={`data:image/png;base64,${citation.image_data}`}
                            alt={`Citation ${citation.id}`}
                            className="w-full rounded object-contain"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="h-full flex items-center justify-center text-center p-4">
                <div>
                  <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No citations available</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Citations will appear here when AI uses external sources
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Tools Section - Compact */}
        <Card className="border shadow-sm md:col-span-1">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-lg font-medium">AI Tools</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="grid grid-cols-1 gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      disabled={isProcessing}
                      onClick={() => handleAIAnswer("help")}
                      variant="outline"
                      className="justify-start"
                      size="sm"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      AI Answer
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Get AI assistance with your meeting questions</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      disabled={isProcessing}
                      onClick={() => handleAIAnswer("factcheck")}
                      variant="outline"
                      className="justify-start"
                      size="sm"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Fact Checking
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Verify facts in the conversation</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      disabled={isProcessing}
                      onClick={() => handleAIAnswer("summary")}
                      variant="outline"
                      className="justify-start"
                      size="sm"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Summarize
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Get a summary of the conversation so far</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graph Icon - Displayed Below the Chat Input */}
      {graphImage && showGraph && (
        <Button
          variant="link"
          size="icon"
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-primary hover:text-primary/90"
          onClick={toggleGraphVisibility}
        >
          <Image className="h-5 w-5" />
        </Button>
      )}

      {/* Display the Graph in a Pop-up or Modal */}
      {isGraphVisible && graphImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-lg w-full relative">
            {/* Close button positioned near the image */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleGraphVisibility}
              className="absolute top-2 right-2 text-muted-foreground"
            >
              <X className="h-5 w-5" />
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
    </div>
  )
}

