"use client"

import { useAppContext } from "../../context/AppContext"
import { Button } from "@/components/ui/button"
import { MonitorSmartphone, StopCircle } from "lucide-react"
import { useState } from "react"

export default function CaptureScreenButton() {
  const { setCapturePartialTranscript, setWholeConversation, setStream, videoRef, stream,captureToken } = useAppContext()
  const [isCapturing, setIsCapturing] = useState(false)

  let socket = null
  let mediaRecorder = null
  const ASSEMBLY_TOKEN = captureToken.current || ""

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
        
        // Create audio context to process the audio
        const audioContext = new AudioContext({
          sampleRate: 16000, // Match the required sample rate
        })
        
        // Create a MediaStreamSource from the audio track
        const source = audioContext.createMediaStreamSource(new MediaStream([audioTrack]))
        
        // Create a processor to convert to the required format
        const processor = audioContext.createScriptProcessor(4096, 1, 1)
        
        // Connect the source to the processor
        source.connect(processor)
        processor.connect(audioContext.destination)
        
        // Initialize the websocket connection
        await connectToAssemblyAI()
        
        // Process audio data
        processor.onaudioprocess = (e) => {
          if (socket && socket.readyState === WebSocket.OPEN) {
            // Get audio data
            const inputData = e.inputBuffer.getChannelData(0)
            
            // Convert to 16-bit PCM
            const pcmData = convertFloatTo16BitPCM(inputData)
            
            // Send the data
            socket.send(pcmData)
          }
        }
      } else {
        console.warn("No audio track found")
      }
    } catch (error) {
      console.error("Error accessing screen: ", error)
      setIsCapturing(false)
    }
  }

  // Convert Float32Array to Int16Array for PCM_S16LE format
  const convertFloatTo16BitPCM = (float32Array) => {
    const int16Array = new Int16Array(float32Array.length)
    for (let i = 0; i < float32Array.length; i++) {
      // Convert from [-1, 1] to [-32768, 32767]
      const s = Math.max(-1, Math.min(1, float32Array[i]))
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF
    }
    return int16Array.buffer
  }

  const connectToAssemblyAI = () => {
    return new Promise((resolve, reject) => {
      // AssemblyAI WebSocket URL
      const url = "wss://api.assemblyai.com/v2/realtime/ws"
      
      // AssemblyAI query params with updated configurations
      const queryParams = new URLSearchParams({
        sample_rate: "16000",
        encoding: "pcm_s16le", // PCM 16-bit little-endian
        token: ASSEMBLY_TOKEN,
        disable_partial_transcripts:true
      }).toString()
      
      console.log("Connecting to AssemblyAI with params:", queryParams)
      socket = new WebSocket(`${url}?${queryParams}`)

      socket.onopen = () => {
        console.log("Connected to AssemblyAI WebSocket")
        resolve()
      }

      socket.onerror = (error) => {
        console.error("WebSocket error", error)
        reject(error)
      }

      socket.onmessage = (event) => {
        const transcript = JSON.parse(event.data)
        if (!transcript.text) {
          return;
        }
  
        console.log('Capture Transcript received:', transcript);
        
        if (transcript.message_type === 'PartialTranscript') {
          setCapturePartialTranscript(transcript.text);
        } else {
          setCapturePartialTranscript("");
          
          setWholeConversation((prev) => {
            if (prev.length > 0 && prev[prev.length - 1]?.other) {
              return [...prev.slice(0, -1), { other: prev[prev.length - 1].other+" " + transcript.text }];
  
            } else {
              return [...prev, { other: transcript.text }];
            }
          });
        }
      }
    })
  }

  const stopScreenShare = () => {
    if (stream) {
      setCapturePartialTranscript("")
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
      setIsCapturing(false)

      if (videoRef.current) {
        videoRef.current.srcObject = null
      }

      if (socket && socket.readyState === WebSocket.OPEN) {
        // Send a termination message to the websocket
        socket.send(JSON.stringify({ terminate_session: true }))
        socket.close()
      }
    }
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