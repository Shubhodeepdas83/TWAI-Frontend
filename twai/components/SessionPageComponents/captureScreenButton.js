"use client"

import { useAppContext } from "../../context/AppContext"
import { Button } from "@/components/ui/button"
import { MonitorSmartphone, StopCircle } from "lucide-react"
import { useState } from "react"

export default function CaptureScreenButton() {
  const { setTranscript, setWholeConversation, setStream, videoRef, stream } = useAppContext()
  const [isCapturing, setIsCapturing] = useState(false)

  let socket = null

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
      setIsCapturing(true)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }

      // Set up event listener for when the user stops sharing
      mediaStream.getVideoTracks()[0].onended = () => {
        stopScreenShare()
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
      setIsCapturing(false)
    }
  }

  const stopScreenShare = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
      setIsCapturing(false)

      if (videoRef.current) {
        videoRef.current.srcObject = null
      }

      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close()
      }
    }
  }

  const openWebSocket = () => {
    return new Promise((resolve, reject) => {
      const url = "wss://api.deepgram.com/v1/listen"

      socket = new WebSocket(url, ["token", process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY])

      socket.onopen = () => {
        console.log("Connected to Deepgram WebSocket")

        socket.send(
          JSON.stringify({
            type: "Configure",
            token: process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY,
            encoding: "opus",
            sample_rate: 16000,
            interim_results: true,
            diarize: true,
          }),
        )

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
            setTranscript((prevMessages) => prevMessages + " " + transcript)

            setWholeConversation((prev) => {
              if (prev[prev.length - 1]?.other) {
                return [...prev.slice(0, -1), { other: prev[prev.length - 1].other + " " + transcript }]
              } else {
                return [...prev, { other: transcript }]
              }
            })
          }
        }
      }
    })
  }

  return (
    <Button
      onClick={isCapturing ? stopScreenShare : startScreenShare}
      variant={isCapturing ? "default" : "outline"}
      className={`w-full ${isCapturing ? "bg-primary/90 hover:bg-primary/80" : ""}`}
    >
      {isCapturing ? (
        <>
          <StopCircle className="h-4 w-4 mr-2" />
          Stop Capture
        </>
      ) : (
        <>
          <MonitorSmartphone className="h-4 w-4 mr-2" />
          Capture Screen
        </>
      )}
    </Button>
  )
}

