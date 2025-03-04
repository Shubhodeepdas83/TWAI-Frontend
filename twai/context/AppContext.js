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
  const [wholeConversation, setWholeConversation] = useState([{'other':"whatt are the Disadvantages of a centralized organization"},{'user':"i am not sure let me think"}]);
  const [enableWebSearch, setEnableWebSearch] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [stream,setStream] = useState(null);
  const videoRef = useRef(null);
  const [usedCitations, setUsedCitations] = useState([]);
  const [copiedText, setCopiedText] = useState("");

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
        setShowGraph,usedCitations, setUsedCitations,setCopiedText,copiedText
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  return useContext(AppContext)
}

