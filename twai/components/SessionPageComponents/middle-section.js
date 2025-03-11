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
import { unstable_noStore as noStore } from 'next/cache';
export default function MiddleSection() {
  noStore();
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

  const toggleGraphVisibility = () => {
    setIsGraphVisible(!isGraphVisible)
  }

  const handleAIAnswer = async (requestType) => {
    if (isProcessing) return;
    setIsProcessing(true);

    setChatMessages([...chatMessages, { text: "Thinking...", sender: "ai" }]);

    try {
      // Save the conversation to the database
      const tempconv = [...wholeConversation]
      setWholeConversation([]);
      

      // Call the new API route
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
      });

      if (!response.ok) throw new Error(`Server responded with ${response.status}`);

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Streaming not supported");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Split buffer into lines to handle streamed JSON objects
        const lines = buffer.split("\n").filter((line) => line.trim() !== "");


        console.log("Lines:", lines);
        console.log("Remaining Buffer:", buffer);
        console.log("Buffer split:", buffer.split("\n").filter(line => line.trim() !== ""))

        for (const line of lines) {
          try {
            const h = JSON.parse(line);
            buffer = lines.slice(1).join() || "";

            if (h.query) {
              setChatMessages((prev) => [
                ...prev.filter((msg) => msg.text !== "Thinking..."),
                { text: h.query, sender: "user" }, { text: "Thinking...", sender: "ai" },
              ]);

            }

            if (h.result) {
              setChatMessages((prev) => [
                ...prev.filter((msg) => msg.text !== "Thinking..."), { text: h.result, sender: "ai" },
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
          } catch (error) {
            console.warn("Streaming JSON parse error:", error);
          }
        }
      }


      const appending = await appendConversation({ sessionId, newMessages: tempconv });


      if (appending.success) {
        setCapturePartialTranscript("");
        
        setMicPartialTranscript("");
      }
      else{
        console.log("Error appending conversation")
        setWholeConversation(tempconv);
      }
    } catch (error) {
      console.error("AI Request failed:", error);
      setChatMessages((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { text: "An error occurred while processing your request.", sender: "ai" },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };



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
          <CardContent className="p-4 pt-0 flex-1 overflow-y-auto max-h-[calc(100vh-300px)]">
            {usedCitations.length > 0 ? (
              <div className="space-y-3">
                {usedCitations.map((citation) => {
                  // Extract the page number from the description if present
                  let modifiedDescription = citation.description;
                  const pageMatch = modifiedDescription.match(/, Page (\d+(\.\d+)?)/i);

                  if (pageMatch) {
                    const pageNumber = pageMatch[1];
                    modifiedDescription = modifiedDescription.replace(pageMatch[0], `#page=${parseInt(pageNumber)+1}`);
                  }

                  return (
                    <div key={citation.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
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

                      <div className="text-sm">
                        {citation.description.startsWith("http") ? (
                          <a
                            href={modifiedDescription}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline break-words"
                          >
                            {modifiedDescription}
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
                            className="w-full max-h-80 object-contain rounded"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}

              </div>
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

