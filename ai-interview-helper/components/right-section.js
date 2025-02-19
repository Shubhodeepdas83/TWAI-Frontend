"use client"

import { useAppContext } from "../context/AppContext"
import { Button } from "@/components/ui/button"
import { Mic } from "lucide-react"
import { useState, useEffect } from 'react';

let socket = null;

export default function RightSection() {
  const { microphoneConnected, setMicrophoneConnected, micStream, setMicStream, micTranscript, setMicTranscript, wholeConversation, setWholeConversation } = useAppContext()
  const [error, setError] = useState("");


  const openWebSocket = () => {
    return new Promise((resolve, reject) => {
      const url = 'wss://api.deepgram.com/v1/listen';

      socket = new WebSocket(url, ["token", "4b08338bac09573504cfd67cec24e2e6038178b6"]);

      socket.onopen = () => {
        console.log("Connected to Deepgram WebSocket");

        socket.send(JSON.stringify({
          type: "Configure",
          features: {
            transcription: true,
            speaker_diarization: true
          }
        }));

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
    <div className="border rounded-lg p-4 flex flex-col h-[600px]">
      <h2 className="text-xl font-semibold mb-4">Microphone Transcription</h2>
      {!microphoneConnected ? (<><p className="text-muted-foreground text-sm mb-4">
        Click the button below to connect your microphone and include what you are saying in the AI response to provide
        more context.
      </p>
        <div className="bg-muted/50 p-4 rounded-lg mb-4">
          <p className="text-sm flex items-center gap-2">
            <span className="text-red-500">⚠</span>
            IMPORTANT: This is important if you want your responses to be included and analyzed in the AI summary.
          </p>
        </div></>) : (<></>)}

      <div className="flex gap-2">
        <Button className="flex items-center gap-2" onClick={handleConnectMicrophone}>
          <Mic className="h-4 w-4" />
          {microphoneConnected ? "Disconnect" : "Connect"} Microphone
        </Button>

      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <div className="mt-4 flex flex-col h-max border rounded-lg p-2 overflow-y-auto bg-gray-100">
        <h3 className="text-lg font-semibold mb-2">Transcript</h3>
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{micTranscript}</p>
      </div>


    </div>
  );
}
