"use client";

import { useAppContext } from "../../context/AppContext";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import MicrophoneButton from "@/components/SessionPageComponents/microphoneButton";
import CaptureScreenButton from "@/components/SessionPageComponents/captureScreenButton";

export default function LeftSection() {
  const { wholeConversation, videoRef, stream, setWholeConversation } = useAppContext();

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const handleClearConversation = () => {
    setWholeConversation([]); // Clears conversation
  };

  return (
    <div className="space-y-4">
      {/* Video Section */}
      <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
      </div>

      {/* Buttons Section */}
      <div className="flex gap-2">
        <MicrophoneButton />
        <CaptureScreenButton />
      </div>

      {/* Conversation Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Conversation</h2>

          {/* Small Clear Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearConversation}
            className="text-muted-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>

        <div className="h-[200px] p-3 bg-muted rounded-lg overflow-y-auto" role="textbox" aria-readonly="true">
          {wholeConversation.length > 0 ? (
            wholeConversation.map((message, index) => (
              <div key={index} className="flex flex-col gap-2">
                {message.user && (
                  <div className="text-left bg-primary text-primary-foreground p-2 rounded-lg">
                    <strong>User:</strong> {message.user}
                  </div>
                )}
                {message.other && (
                  <div className="text-left bg-muted p-2 rounded-lg">
                    <strong>Other:</strong> {message.other}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No conversation yet...</p>
          )}
        </div>
      </div>
    </div>
  );
}
