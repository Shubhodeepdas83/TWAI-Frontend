"use client"

import { useAppContext } from "../../context/AppContext"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { X, Send } from "lucide-react"
import { get_AI_Help } from "../../lib/AI_Helper"

export default function MiddleSection() {
  const { chatMessages, setChatMessages, userInput, setUserInput, setTranscript, wholeConversation, setWholeConversation,setMicTranscript } = useAppContext()







  const handleSendMessage = async () => {
    if (userInput.trim()) {
      setChatMessages([...chatMessages, { text: userInput, sender: "user" }])
      setUserInput("")
      const aiResponse = await get_AI_Help([{other: userInput}]);
  
    setChatMessages((prev) => [
      ...prev.filter((msg) => msg.text !== "Thinking..."),
      { text: aiResponse.answer, sender: "ai" },
    ]);
    }
  }

  const handleAIAnswer = async () => {

    setChatMessages([
      ...chatMessages,
      { text: "Thinking...", sender: "ai" },
    ]);
  
    const aiResponse = await get_AI_Help(wholeConversation);
  
    setChatMessages((prev) => [
      ...prev.filter((msg) => msg.text !== "Thinking..."),{ text: aiResponse.question, sender: "user" },
      { text: aiResponse.answer, sender: "ai" },
    ]);

    setTranscript("")
    setWholeConversation([])
    setMicTranscript("")
  }

  const handleClear = () => {
    setChatMessages([])
    setUserInput("")

  }

  return (
    <div className="border rounded-lg p-4 flex flex-col h-[600px]">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl font-semibold">AI Interview Helper</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {chatMessages.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${message.sender === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
              } max-w-[80%]`}
          >
            {message.text}
          </div>
        ))}
      </div>

      <Button variant="ghost" size="sm" onClick={handleClear} className="text-muted-foreground self-end mb-2">
        <X className="h-4 w-4 mr-1" />
        Clear Answers
      </Button>

      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type a manual message..."
            className="resize-none"
          />
          <Button onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button className="flex-1" variant="default" onClick={handleAIAnswer}>
            Help from AI
          </Button>

        </div>
      </div>
    </div>
  )
}
