"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { BookOpen, Clock, Search, BarChart2, ExternalLink, FileText } from "lucide-react"
import { useAppContext } from "../../context/AppContext"
import { get_AI_Help } from "../../lib/sessionActions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function RightSection() {
  const {
    isProcessing,
    setIsProcessing,
    setTranscript,
    setMicTranscript,
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
  } = useAppContext()

  const handleAIAnswer = async (requestType) => {
    if (isProcessing) return
    setIsProcessing(true)

    setChatMessages([...chatMessages, { text: "Thinking...", sender: "ai" }])

    try {
      const aiResponse = await get_AI_Help(wholeConversation, enableWebSearch, requestType)

      setChatMessages((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { text: aiResponse.question, sender: "user" },
        { text: aiResponse.answer, sender: "ai" },
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
    } catch (error) {
      console.error("AI Request failed:", error)
    } finally {
      setIsProcessing(false)
      setTranscript("")
      setWholeConversation([])
      setMicTranscript("")
    }
  }

  const handleCheckboxChange = (setter) => {
    setter((prev) => !prev)
  }

  return (
    <div className="space-y-4 h-[calc(100vh-120px)] flex flex-col overflow-hidden">
      <Card className="border shadow-sm">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg font-medium">AI Tools</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="grid grid-cols-1 gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    disabled={isProcessing}
                    onClick={() => handleAIAnswer("help")}
                    variant="outline"
                    className="justify-start"
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

          <Separator className="my-4" />

          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={enableWebSearch}
                onCheckedChange={() => handleCheckboxChange(setEnableWebSearch)}
                id="web-search"
              />
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <span>Enable Web search</span>
              </div>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={showGraph}
                onCheckedChange={() => handleCheckboxChange(setShowGraph)}
                id="show-graph"
              />
              <div className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
                <span>Show Graph</span>
              </div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Citations Section */}
      <Card className="border shadow-sm flex-1 flex flex-col">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg font-medium">Citations</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex-1">
          {usedCitations.length > 0 ? (
            <ScrollArea className="h-[calc(100vh-350px)] pr-3">
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
    </div>
  )
}

