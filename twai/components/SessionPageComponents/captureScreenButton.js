"use client"

import { useAppContext } from "../../context/AppContext"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { X, Send } from "lucide-react"
import { getGeminiResponse } from "@/lib/geminihelper"

export default function MiddleSection() {
  const { setTranscript, setWholeConversation } = useAppContext()
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

      socket = new WebSocket(url, ["token", process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY])

      socket.onopen = () => {
        console.log("Connected to Deepgram WebSocket")

        socket.send(JSON.stringify({
          "type": "Configure",
          "token": process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY,
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


  return (


          <Button onClick={startScreenShare} variant="outline">Capture Screen</Button>

  )
}
