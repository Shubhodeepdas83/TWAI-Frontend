"use client"

import { useAppContext } from "../../context/AppContext"
import { Button } from "@/components/ui/button"
import { Mic } from "lucide-react"
import { useState, useEffect } from 'react';

let socket = null;

export default function microphoneButton() {
  const { microphoneConnected, setMicrophoneConnected, micStream, setMicStream, micTranscript, setMicTranscript, wholeConversation, setWholeConversation } = useAppContext()
  const [error, setError] = useState("");


  const openWebSocket = () => {
    return new Promise((resolve, reject) => {
      const url = 'wss://api.deepgram.com/v1/listen';

      socket = new WebSocket(url, ["token", process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY]);

      socket.onopen = () => {
        console.log("Connected to Deepgram WebSocket");

        socket.send((JSON.stringify({
          "type": "Configure",
          "token": process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY,
          "encoding": "opus",
          "sample_rate": 16000,
          "interim_results": true,
          "diarize": true,
        })));

        resolve();
      };



      socket.onerror = (error) => {
        console.error("WebSocket error", error);
        reject(error);
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.channel && data.channel.alternatives) {
          const transcript = data.channel.alternatives[0].transcript;
          if (transcript.trim()) {
            console.log(wholeConversation)
            setMicTranscript((prevMessages) => prevMessages + " " + transcript);

            setWholeConversation((prev) => {
              if (prev[prev.length - 1]?.user) {
                return [...prev.slice(0, -1), { user: prev[prev.length - 1].user + " " + transcript }];
              } else {
                return [...prev, { user: transcript }];
              }
            });
          }
        }
      };

    });
  };

  const handleConnectMicrophone = async () => {
    if (microphoneConnected) {
      if (micStream) {
        micStream.getTracks().forEach(track => track.stop());
      }
      setMicrophoneConnected(false);
      setMicStream(null);
      console.log("Microphone disconnected.");
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log(stream.getAudioTracks())
        setMicStream(stream);
        setMicrophoneConnected(true);

        await openWebSocket();

        const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

        mediaRecorder.ondataavailable = (event) => {
          if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(event.data);
          }
        };

        mediaRecorder.start(250);

      } catch (err) {
        setError("Failed to access the microphone: " + err.message);
        console.error(err);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
      if (micStream) {
        micStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [micStream]);

  return (

        <Button className="flex items-center gap-2" onClick={handleConnectMicrophone}>
          <Mic className="h-4 w-4" />
          {microphoneConnected ? "Disconnect" : "Connect"} Microphone
        </Button>

  );
}
