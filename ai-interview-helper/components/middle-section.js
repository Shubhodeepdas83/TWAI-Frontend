"use client"

import { useAppContext } from "../context/AppContext"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { X, Send } from "lucide-react"
import { getGeminiResponse } from "@/lib/geminihelper"

export default function MiddleSection() {
  const { chatMessages, setChatMessages, userInput, setUserInput, setTranscript, wholeConversation, setWholeConversation,setMicTranscript } = useAppContext()
  const { setStream, videoRef } = useAppContext()

  let socket = null;

  const startScreenShare = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "always" },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          suppressLocalAudioPlayback: true,
        },
        preferCurrentTab: false,
      })

      setStream(mediaStream)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }

      const audioTrack = mediaStream.getAudioTracks()[0]
      if (audioTrack) {
        console.log("Audio found")
        const audioStream = new MediaStream([audioTrack])

        const mediaRecorder = new MediaRecorder(audioStream, { mimeType: "audio/webm" })

        await openWebSocket()

        mediaRecorder.ondataavailable = (event) => {
          if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(event.data)
          }
        }

        mediaRecorder.start(250)

      } else {
        console.warn("No audio track found")
      }
    } catch (error) {
      console.error("Error accessing screen: ", error)
    }
  }

  const openWebSocket = () => {
    return new Promise((resolve, reject) => {
      const url = 'wss://api.deepgram.com/v1/listen'

      socket = new WebSocket(url, ["token", "4b08338bac09573504cfd67cec24e2e6038178b6"])

      socket.onopen = () => {
        console.log("Connected to Deepgram WebSocket")

        socket.send(JSON.stringify({
          "type": "Configure",
          "token": "4b08338bac09573504cfd67cec24e2e6038178b6",
          "encoding": "opus",
          "sample_rate": 16000,
          "interim_results": true,
          "diarize": true,
        }))

        resolve()
      }

      socket.onerror = (error) => {
        console.error("WebSocket error", error)
        reject(error)
      }

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.channel && data.channel.alternatives) {
          const transcript = data.channel.alternatives[0].transcript
          if (transcript.trim()) {
            setTranscript((prevMessages) => prevMessages + " " + transcript);

            setWholeConversation((prev) => {
              if (prev[prev.length - 1]?.other) {
                return [...prev.slice(0, -1), { other: prev[prev.length - 1].other + " " + transcript }];
              } else {
                return [...prev, { other: transcript }];
              }
            });
          }
        }
      }
    })
  }


  const handleSendMessage = async () => {
    if (userInput.trim()) {
      setChatMessages([...chatMessages, { text: userInput, sender: "user" }])
      setUserInput("")
      const aiResponse = await getGeminiResponse([{other: userInput}]);
  
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
  
    const aiResponse = await getGeminiResponse(wholeConversation);
  
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
            AI Answer
          </Button>
          <Button onClick={startScreenShare} variant="outline">Capture Screen</Button>
        </div>
      </div>
    </div>
  )
}
