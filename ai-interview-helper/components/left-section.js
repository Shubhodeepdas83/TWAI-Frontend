"use  client"

import { useAppContext } from "../context/AppContext"
import { useState,useEffect } from 'react';

export default function LeftSection() {
const { transcript, videoRef, stream } = useAppContext();

useEffect(() => {
  if (stream && videoRef.current) {
    videoRef.current.srcObject = stream;
  }
}, [stream]);






  return (
    <div className="space-y-4">
      <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
        <video ref={videoRef}
          autoPlay
          playsInline className="w-full h-full object-cover" />
      </div>
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Transcript</h2>
        <div className="h-[200px] p-3 bg-muted rounded-lg overflow-y-auto" role="textbox" aria-readonly="true">
          {transcript || "Please connect the screen..."}
        </div>
      </div>
    </div>
  )
}


