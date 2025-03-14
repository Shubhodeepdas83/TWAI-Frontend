"use client"

import { createContext, useContext, useState,useRef, use } from "react"

const AppContext = createContext()

export function AppProvider({ children }) {
  const [capturePartialTranscript, setCapturePartialTranscript] = useState("")
  const [chatMessages, setChatMessages] = useState([])
  const [userInput, setUserInput] = useState("")
  const [microphoneConnected, setMicrophoneConnected] = useState(false)
  const [micStream, setMicStream] = useState(null);
  const [micPartialTranscript, setMicPartialTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [wholeConversation, setWholeConversation] = useState([]);
  const [enableWebSearch, setEnableWebSearch] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [stream,setStream] = useState(null);
  const videoRef = useRef(null);
  const [usedCitations, setUsedCitations] = useState([]);
  const [copiedText, setCopiedText] = useState("");
  const [useHighlightedText,setUseHighlightedText] = useState(false);
  const micToken = useRef(null);
  const captureToken = useRef(null);

  return (
    <AppContext.Provider
      value={{
        capturePartialTranscript,
        setCapturePartialTranscript,
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
        micPartialTranscript,
        setMicPartialTranscript,
        wholeConversation, setWholeConversation,
        isProcessing, setIsProcessing,
        enableWebSearch,
        setEnableWebSearch,
        showGraph,
        setShowGraph,usedCitations, setUsedCitations,setCopiedText,copiedText,micToken,captureToken,setUseHighlightedText,useHighlightedText
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  return useContext(AppContext)
}

