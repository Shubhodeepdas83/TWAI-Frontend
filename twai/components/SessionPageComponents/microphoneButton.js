"use client"

import { useAppContext } from "../../context/AppContext"
import { Button } from "@/components/ui/button"
import { Mic, MicOff } from "lucide-react"
import { useEffect, useState } from "react"

let socket = null

export default function MicrophoneButton() {
  const {
    microphoneConnected,
    setMicrophoneConnected,
    micStream,
    setMicStream,
    wholeConversation,
    setWholeConversation,
  } = useAppContext()

  const [isConnecting, setIsConnecting] = useState(false)

  const openWebSocket = () => {
    return new Promise((resolve, reject) => {
      const url = "wss://api.deepgram.com/v1/listen?model=nova-3&language=en&smart_format=true&punctuate=true"

      socket = new WebSocket(url, ["token", process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY])

      socket.onopen = () => {
        console.log("Connected to Deepgram WebSocket")

        socket.send(
          JSON.stringify({
            type: "Configure",
            token: process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY,
            encoding: "opus",
            sample_rate: 44100,
            // interim_results: true,
          }),
        )

        resolve()
      }

      socket.onerror = (error) => {
        console.error("WebSocket error", error)
        reject(error)
      }

      const MAX_MESSAGE_LENGTH = 200

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.channel && data.channel.alternatives) {
          const transcript = data.channel.alternatives[0].transcript
          if (transcript.trim()) {
            const timestamp = new Date().toISOString() // Universal UTC timestamp

            setWholeConversation((prev) => {
              const lastMessage = prev[prev.length - 1]

              if (lastMessage?.user) {
                const updatedMessage = lastMessage.user + " " + transcript

                if (updatedMessage.length > MAX_MESSAGE_LENGTH) {
                  // If the message exceeds max length, start a new message
                  return [...prev, { user: transcript, time: timestamp, saved: false, hidden: false }]
                } else {
                  // Otherwise, update the last message
                  return [...prev.slice(0, -1), { user: updatedMessage, time: timestamp, saved: false, hidden: false }]
                }
              } else {
                return [...prev, { user: transcript, time: timestamp, saved: false, hidden: false }]
              }
            })
          }
        }
      }
    })
  }

  const handleConnectMicrophone = async () => {
    setIsConnecting(true)
    if (microphoneConnected) {
      if (micStream) {
        micStream.getTracks().forEach((track) => track.stop())
      }
      setMicrophoneConnected(false)
      setMicStream(null)
      console.log("Microphone disconnected.")
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        console.log(stream.getAudioTracks())
        setMicStream(stream)
        setMicrophoneConnected(true)

        await openWebSocket()

        const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" })

        mediaRecorder.ondataavailable = (event) => {
          if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(event.data)
          }
        }

        mediaRecorder.start(250)
      } catch (err) {
        console.error(err)
      }
    }
    setIsConnecting(false)
  }

  useEffect(() => {
    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close()
      }
      if (micStream) {
        micStream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [micStream])

  return (
    <Button
      className={`flex items-center gap-1 w-full py-1 h-auto text-xs ${microphoneConnected ? "bg-primary/90 hover:bg-primary/80" : ""}`}
      onClick={handleConnectMicrophone}
      disabled={isConnecting}
      variant={microphoneConnected ? "default" : "outline"}
    >
      {isConnecting ? (
        "Connecting..."
      ) : microphoneConnected ? (
        <>
          <MicOff className="h-3 w-3" />
          Disconnect Microphone
        </>
      ) : (
        <>
          <Mic className="h-3 w-3" />
          Connect to Microphone
        </>
      )}
    </Button>
  )
}

