"use client"

import { createContext, useContext, useState,useRef } from "react"

const AppContext = createContext()

export function AppProvider({ children }) {
  const [transcript, setTranscript] = useState("")
  const [chatMessages, setChatMessages] = useState([])
  const [userInput, setUserInput] = useState("")
  const [microphoneConnected, setMicrophoneConnected] = useState(false)
  const [micStream, setMicStream] = useState(null);
  const [micTranscript, setMicTranscript] = useState("");

  const [wholeConversation, setWholeConversation] = useState([]);

  const [stream,setStream] = useState(null);
  const videoRef = useRef(null);

  return (
    <AppContext.Provider
      value={{
        transcript,
        setTranscript,
        chatMessages,
        setChatMessages,
        userInput,
        setUserInput,
        microphoneConnected,
        setMicrophoneConnected,
        videoRef,
        stream,
        setStream,
        micStream,
        setMicStream,
        micTranscript,
        setMicTranscript,
        wholeConversation, setWholeConversation
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  return useContext(AppContext)
}

