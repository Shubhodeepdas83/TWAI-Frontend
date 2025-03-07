"use client"

import { useAppContext } from "../../context/AppContext"
import { Button } from "@/components/ui/button"
import { Mic, MicOff } from "lucide-react"
import { useEffect, useState, useCallback, useRef } from "react"
import { RealtimeTranscriber } from "assemblyai"

export default function MicrophoneButton() {
  const {
    microphoneConnected,
    setMicrophoneConnected,
    micStream,
    setMicStream,
    setMicPartialTranscript,
    wholeConversation,
    setWholeConversation,
    micToken
  } = useAppContext()

  const transcriberRef = useRef(null);
  const micConnected = useRef(false);
  const [audioContext, setAudioContext] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  // Initialize the audio buffer queue with an empty Int16Array
  const audioBufferQueueRef = useRef(new Int16Array(0));

  const createTranscriber = useCallback(async () => {
    const token = micToken.current;
    console.log(micToken.current)
    if (!token) {
      console.error('No token found');
      return null;
    }
    const tempAudioContext = new AudioContext();
    const nativeSampleRate = tempAudioContext.sampleRate;
    tempAudioContext.close();

    console.log('Creating transcriber with token:', token.substring(0, 5) + '...');

    // Create the transcriber with the native sample rate of the audio context
    // We'll let the browser handle the sample rate conversion
    const transcriber = new RealtimeTranscriber({
      sampleRate: nativeSampleRate || 44100, // Use standard sample rate, will be resampled if needed
      token: token,
      encoding: 'pcm_s16le', // Explicitly set encoding to match our Int16Array format

    });

    transcriber.on('transcript', (transcript) => {
      if (!transcript.text) {
        return;
      }

      console.log('Transcript received:', transcript);

      if (transcript.message_type === 'PartialTranscript') {
        setMicPartialTranscript(transcript.text);
      } else {
        setMicPartialTranscript("");

        setWholeConversation((prev) => {

            return [...prev, { user: transcript.text }];


          }
        );
      }
    });

    transcriber.on('error', (error) => {
      console.error('Transcriber error:', error);
    });

    transcriber.on('open', () => {
      console.log('Transcriber connection opened');
    });

    transcriber.on('close', () => {
      console.log('Transcriber connection closed');
    });

    return transcriber;
  }, [setMicPartialTranscript, setWholeConversation]);

  const handleConnectMicrophone = async () => {
    if (micConnected.current) {
      setIsConnecting(false);
      setMicrophoneConnected(false);
      micConnected.current = false

      if (micStream) {
        micStream.getTracks().forEach((track) => track.stop());
        setMicStream(null);
      }

      if (audioContext) {
        audioContext.close();
        setAudioContext(null);
      }

      if (transcriberRef.current) {
        try {
          await transcriberRef.current.close(false);
        } catch (error) {
          console.error('Error closing transcriber:', error);
        }
        transcriberRef.current = null;
      }

      setMicPartialTranscript("");

      console.log("Microphone disconnected.");
    } else {
      setIsConnecting(true);

      try {
        // Request audio with specific constraints to ensure quality
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true, // Try disabling these to get raw audio
            noiseSuppression: false,
            autoGainControl: true,
            channelCount: 1  // Mono audio
          }
        });

        console.log("Microphone stream obtained:", stream.getAudioTracks());

        setMicStream(stream);
        setMicrophoneConnected(true);
        micConnected.current = true;

        // Try a simpler approach to audio processing
        const newAudioContext = new AudioContext();

        // Create a script processor node instead of worklet for better compatibility
        const scriptNode = newAudioContext.createScriptProcessor(4096, 1, 1);
        const source = newAudioContext.createMediaStreamSource(stream);
        source.connect(scriptNode);
        scriptNode.connect(newAudioContext.destination);

        setAudioContext(newAudioContext);

        // Then create and connect the transcriber
        const newTranscriber = await createTranscriber();
        if (!newTranscriber) {
          throw new Error("Failed to create transcriber");
        }

        console.log("Connecting transcriber...");
        await newTranscriber.connect();
        console.log("Transcriber connected successfully");

        transcriberRef.current = newTranscriber;

        // Process audio with script processor
        scriptNode.onaudioprocess = (audioProcessingEvent) => {
          if (!transcriberRef.current || !micConnected.current) return;

          const inputBuffer = audioProcessingEvent.inputBuffer;
          const inputData = inputBuffer.getChannelData(0);

          // Check if we have actual audio
          let hasAudio = false;
          let maxValue = 0;
          for (let i = 0; i < inputData.length; i++) {
            const absValue = Math.abs(inputData[i]);
            if (absValue > maxValue) {
              maxValue = absValue;
            }
            if (absValue > 0.005) { // Lower threshold to detect more subtle audio
              hasAudio = true;
            }
          }

          // Initialize silence counter if it doesn't exist
          if (typeof scriptNode.silenceCounter === 'undefined') {
            scriptNode.silenceCounter = 0;
          }

          if (!hasAudio) {
            scriptNode.silenceCounter++;
            // Only consider it silence after consistent silence (about 500ms)
            if (scriptNode.silenceCounter > 5 && Math.random() < 0.05) {
            }

            // Still send audio occasionally during silence to maintain connection
            if (scriptNode.silenceCounter < 20 || scriptNode.silenceCounter % 30 === 0) {
              // Continue processing to avoid completely cutting off audio
              hasAudio = true;
            } else {
              return; // Skip processing this buffer
            }
          } else {
            // Reset silence counter when we detect audio
            scriptNode.silenceCounter = 0;
          }

          // Convert to Int16 format for AssemblyAI
          const audioInt16 = new Int16Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) {
            // Apply gain and convert to int16
            const gain = 5.0; // Boost the signal
            audioInt16[i] = Math.max(-1, Math.min(1, inputData[i] * gain)) * 0x7FFF;
          }

          // Send to transcriber
          try {
            if (Math.random() < 0.1) { // Log occasionally
              // console.log("Sending audio buffer with length:", audioInt16.length, 
              //           "Max value:", maxValue,
              //           "First few samples:", Array.from(audioInt16.slice(0, 5)));
            }
            transcriberRef.current.sendAudio(audioInt16);
          } catch (error) {
            console.error("Error sending audio:", error);
          }
        };




        console.log("Microphone connected and transcription started.");

        // Ensure session keeps alive by sending audio data at regular intervals
        // setInterval(() => {
        //   if (transcriberRef.current ) {
        //     console.log("Sending keep-alive ping");
        //     try {
        //       transcriberRef.current.sendAudio(new Uint8Array(0)); // Send empty data to keep connection alive
        //     } catch (error) {
        //       console.error("Error sending keep-alive:", error);
        //     }
        //   }
        // }, 5000);  // Send ping every 5 seconds

      } catch (err) {
        console.error("Error connecting microphone:", err);

        if (micStream) {
          micStream.getTracks().forEach((track) => track.stop());
          setMicStream(null);
        }

        if (transcriberRef.current) {
          try {
            await transcriberRef.current.close(false);
          } catch (e) {
            console.error("Error closing transcriber on cleanup:", e);
          }
          transcriberRef.current = null;
        }

        if (audioContext) {
          audioContext.close();
          setAudioContext(null);
        }
      } finally {
        setIsConnecting(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (transcriberRef.current) {
        try {
          // transcriberRef.current.close(false);
        } catch (error) {
          console.error("Error closing transcriber on unmount:", error);
        }
      }

      if (audioContext) {
        audioContext.close();
      }

      if (micStream) {
        micStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [audioContext, micStream]);

  return (
    <Button
      className={`flex items-center gap-2 w-full ${microphoneConnected ? "bg-primary/90 hover:bg-primary/80" : ""}`}
      onClick={handleConnectMicrophone}
      disabled={isConnecting}
      variant={microphoneConnected ? "default" : "outline"}
    >
      {isConnecting ? (
        "Connecting..."
      ) : microphoneConnected ? (
        <>
          <MicOff className="h-4 w-4" />
          Disconnect Mic
        </>
      ) : (
        <>
          <Mic className="h-4 w-4" />
          Connect Mic
        </>
      )}
    </Button>
  );
}
