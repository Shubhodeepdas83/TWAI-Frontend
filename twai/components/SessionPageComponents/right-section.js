"use client"

import { useAppContext } from "../../context/AppContext"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BookOpen, FileText, Clock, BarChart2, X, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useParams } from "next/navigation"
import { appendConversation } from "../../app/session/[sessionId]/actions"
import { unstable_noStore as noStore } from "next/cache"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

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
    useHighlightedText,
    copiedText,
    setCopiedText,
    graphImage,
    setGraphImage,
    setShowGraph,
    showGraph,
  } = useAppContext()

  const { sessionId } = useParams()
  const [isGraphVisible, setIsGraphVisible] = useState(false)

  const toggleGraphVisibility = () => {
    setIsGraphVisible(!isGraphVisible)
  }

  const handleAIAnswer = async (requestType) => {
    if (isProcessing) return
    setGraphImage(null)
    setIsProcessing(true)
    setUsedCitations([])
    setChatMessages([...chatMessages, { text: "Thinking...", sender: "ai" }])

    try {
      // Step 1: Extract the query using OpenAI on the frontend
      const tempconv = [...wholeConversation]
      setWholeConversation([])

      // Step 3: Send the extracted query to the backend for processing
      const response = await fetch("/api/get_AI_Help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation: tempconv,
          use_web: enableWebSearch,
          requestType,
          useHighlightedText,
          copiedText,
          sessionId,
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

        const lines = buffer.split("\n").filter((line) => line.trim() !== "")

        for (const line of lines) {
          try {
            const h = JSON.parse(line)
            buffer = lines.slice(1).join() || ""

            if (h.query) {
              setChatMessages((prev) => [
                ...prev.filter((msg) => msg.text !== "Thinking..."),
                { text: h.query, sender: "user" },
                { text: "Thinking...", sender: "ai" },
              ])
            }

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
            console.warn("Streaming JSON parse error:", error)
          }
        }
      }

      setCopiedText("")
      setChatMessages((prev) => [...prev.filter((msg) => msg.text !== "Thinking...")])

      const appending = await appendConversation({ sessionId, newMessages: tempconv })

      if (appending.success) {
        setCapturePartialTranscript("")
        setMicPartialTranscript("")
      } else {
        console.log("Error appending conversation")
        setWholeConversation(tempconv)
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
    <div className="h-full flex flex-col gap-4">
      {/* AI Tools Card */}
      <Card className="border shadow-sm">
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

            {/* Graph Icon - Positioned Below AI Tools */}
            {graphImage && showGraph && (
              <Button
                variant="outline"
                size="sm"
                className="w-full flex items-center justify-start"
                onClick={toggleGraphVisibility}
              >
                <BarChart2 className="h-4 w-4 mr-2" />
                {isGraphVisible ? "Hide Graph" : "Show Graph"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Citations Section */}
      <Card className="border shadow-sm flex-1 flex flex-col overflow-hidden">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg font-medium">Citations</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex-1 overflow-hidden">
  <ScrollArea className="h-full pr-3">
    {usedCitations.length > 0 ? (
      <div className="space-y-3">
        {usedCitations.map((citation) => {
          let modifiedDescription = citation.description;
          const pageMatch = modifiedDescription.match(/, Page (\d+(\.\d+)?)/i);

          if (pageMatch) {
            const pageNumber = pageMatch[1];
            modifiedDescription = modifiedDescription.replace(pageMatch[0], `#page=${parseInt(pageNumber) + 1}`);
          }

          return (
          <div
            key={citation.id}
            className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded">
                Citation #{citation.id}
              </div>
              {citation.description.startsWith("http") && (
                          <a
                            href={modifiedDescription}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
            </div>

            {/* Truncate Long Links */}
            <div className="text-sm w-full truncate">
              
              {citation.description.startsWith("http") && !citation.isimg && !citation.image_data ? (
                <a
                  href={modifiedDescription}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline w-full block truncate"
                  style={{ display: "block", maxWidth: "100%" }}
                  title={citation.description} // Show full link on hover
                >
                  {modifiedDescription.length > 50
                    ? modifiedDescription.slice(0, 50) + "..."
                    : modifiedDescription}
                </a>
              ) : (<></>)}
            </div>

            {/* Fixed Image Size */}
            {citation.isimg && citation.image_data && (
              <div className="mt-2 bg-white p-2 rounded border flex justify-center">
                <img
                  src={`data:image/png;base64,${citation.image_data}`}
                  alt={`Citation ${citation.id}`}
                  className="rounded-md object-contain"
                  style={{ maxWidth: "100%", maxHeight: "150px" }} // Adjust height to fit properly
                />
              </div>
            )}
          </div>
        )})}
      </div>
    ) : (
      <p className="text-muted-foreground text-center">No citations available</p>
    )}
  </ScrollArea>
</CardContent>

      </Card>

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

