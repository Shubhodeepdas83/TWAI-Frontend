"use client"
import ReactMarkdown from "react-markdown"
import { useAppContext } from "../../context/AppContext"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { X, Send, CloudUpload, Trash, Image, Bot, Search, BarChart2 } from "lucide-react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"

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
  } = useAppContext()

  const [image, setImage] = useState(null)
  const [graphImage, setGraphImage] = useState(null)
  const [isGraphVisible, setIsGraphVisible] = useState(false)

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

  return (
    <Card className="border shadow-sm h-[calc(100vh-120px)] flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-medium">AI Meeting Helper</CardTitle>
        </div>
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
      </CardHeader>

      {/* Flexible Content Area */}
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
              </div>
              <span>Press Enter to send, Shift+Enter for new line</span>
            </div>
          </div>
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
      </CardContent>

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
    </Card>
  )
}

