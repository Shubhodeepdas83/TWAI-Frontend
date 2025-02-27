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
  const [isProcessing, setIsProcessing] = useState(false);
  const [wholeConversation, setWholeConversation] = useState([{"other": "Whats the difference between DAO and Traditional Organizations?"},{"user":"They are the same"}]);
  const [enableWebSearch, setEnableWebSearch] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [stream,setStream] = useState(null);
  const videoRef = useRef(null);
  const [usedCitations, setUsedCitations] = useState([]);

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
        wholeConversation, setWholeConversation,
        isProcessing, setIsProcessing,
        enableWebSearch,
        setEnableWebSearch,
        showGraph,
        setShowGraph,usedCitations, setUsedCitations
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  return useContext(AppContext)
}

