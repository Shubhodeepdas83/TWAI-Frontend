"use client"

import { Button } from "@/components/ui/button"
import { VideoIcon, Users } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import WaitlistModal from "./WaitlistModal"

const HeroSection = () => {
  const [textIndex, setTextIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const suffixes = ["mpanion", "llaborator", "presenter", "pilot"]
  const suffixRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prevIndex) => (prevIndex + 1) % suffixes.length)
    }, 2500) // Slightly slower transition for better readability

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="pt-32 pb-20 md:py-40 px-4 bg-[#0f1217] text-white relative overflow-hidden">
      {/* Background pattern for visual interest */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYtMi42ODYgNi02cy0yLjY4Ni02LTYtNmMtMyAwLTYgMi42ODYtNiA2czMgNiA2IDZ6bTAgMThjMy4zMTQgMCA2LTIuNjg2IDYtNnMtMi42ODYtNi02LTZjLTMgMC02IDIuNjg2LTYgNnMzIDYgNiA2em0xOCAwYzMuMzE0IDAgNi0yLjY4NiA2LTZzLTIuNjg2LTYtNi02Yy0zIDAtNiAyLjY4Ni02IDZzMyA2IDYgNnptMC0xOGMzLjMxNCAwIDYtMi42ODYgNi02cy0yLjY4Ni02LTYtNmMtMyAwLTYgMi42ODYtNiA2czMgNiA2IDZ6bS0xOCAxOGMtMyAwLTYgMi42ODYtNiA2czMgNiA2IDZjMy4zMTQgMCA2LTIuNjg2IDYtNnMtMi42ODYtNi02LTZ6bS0xOC0xOGMtMyAwLTYgMi42ODYtNiA2czMgNiA2IDZjMy4zMTQgMCA2LTIuNjg2IDYtNnMtMi42ODYtNi02LTZ6bTAgMThjLTMgMC02IDIuNjg2LTYgNnMzIDYgNiA2YzMuMzE0IDAgNi0yLjY4NiA2LTZzLTIuNjg2LTYtNi02em0tMTgtMThjLTMgMC02IDIuNjg2LTYgNnMzIDYgNiA2YzMuMzE0IDAgNi0yLjY4NiA2LTZzLTIuNjg2LTYtNi02eiIgZmlsbD0iI2ZmZmZmZiIvPjwvZz48L3N2Zz4=')]"></div>
      </div>

      {/* Product Hunt notification banner with improved visual */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-[#1a1f29] py-3 px-6 rounded-full flex items-center gap-3 border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
          <div className="bg-jarwiz-500 rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
            <span className="text-sm">🚀</span>
          </div>
          <span className="text-sm font-medium text-gray-200">We're launching on Product Hunt soon!</span>
          <div className="bg-white/10 h-6 w-6 rounded-full flex items-center justify-center ml-2 border border-white/20">
            <span className="text-xs font-bold">PH</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        {/* Improved heading with better animated text */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-5xl mb-8 text-center font-semibold bg-gradient-to-r from-jarwiz-400 to-jarwiz-500 bg-clip-text text-transparent flex items-center justify-center flex-wrap">
            <span>Your Meeting AI Co</span>
            <span className="relative inline-flex items-center overflow-hidden ml-1"
              style={{
                height: '1.4em',
                minWidth: '250px',
                display: 'inline-block',
                verticalAlign: 'bottom'
              }}>
              {suffixes.map((suffix, index) => (
                <span
                  key={suffix}
                  className={`absolute transition-all duration-500 ease-in-out font-bold ${index === textIndex
                      ? "opacity-100 transform-none"
                      : "opacity-0 translate-y-8"
                    }`}
                  style={{
                    left: '0%',
                    top: '15%',
                    textShadow: index === textIndex ? '0 0 0px rgba(255,0,214,0.5), 0 0 0px rgba(255,255,255,0.3)' : 'none',
                    WebkitBackgroundClip: 'text',
                    letterSpacing: '0.5px'
                  }}
                >
                  {suffix}
                </span>
              ))}
            </span>
          </h1>
        </div>

        {/* Enhanced subheadline with better typography and spacing */}
        <div className="space-y-5 text-center max-w-3xl mx-auto mb-14 font-semibold">
          <p className="text-xl md:text-2xl text-gray-200">Step into every meeting with a virtual team of experts</p>
          <p className="text-lg md:text-xl text-gray-300">
            Pre-meeting prep, Real-time support, Post-meeting analysis. All handled by team of AI-agents
          </p>
          <p className="text-lg md:text-xl text-gray-300">
            Jarwiz AI ensures every conversation, henceforth, will be more productive, efficient and delivers optimum
            outcome.
          </p>
        </div>

        {/* Enhanced integration logos */}
        <div className="flex justify-center gap-8 mb-14">
          <div className="flex items-center gap-3 text-gray-200 transition-all duration-200 hover:text-white">
            <span className="bg-white/10 p-2.5 rounded-lg flex items-center justify-center border border-white/5 shadow-lg">
              {/* Fixed Google Meet logo - 24px with no background */}
              <svg xmlns="http://www.w3.org/2000/svg" aria-label="Google Meet" role="img" viewBox="0 0 512 512" width="24px" height="24px">
                <path d="M166 106v90h-90" fill="#ea4335"></path>
                <path d="M166 106v90h120v62l90-73v-49q0-30-30-30" fill="#ffba00"></path>
                <path d="M164 406v-90h122v-60l90 71v49q0 30-30 30" fill="#00ac47"></path>
                <path d="M286 256l90-73v146" fill="#00832d"></path>
                <path d="M376 183l42-34c9-7 18-7 18 7v200c0 14-9 14-18 7l-42-34" fill="#00ac47"></path>
                <path d="M76 314v62q0 30 30 30h60v-92" fill="#0066da"></path>
                <path d="M76 196h90v120h-90" fill="#2684fc"></path>
              </svg>
            </span>
            <span className="font-medium">Google Meet</span>
          </div>
          <div className="flex items-center gap-3 text-gray-200 transition-all duration-200 hover:text-white">
            <span className="bg-white/10 p-2.5 rounded-lg flex items-center justify-center border border-white/5 shadow-lg">
              <VideoIcon size={22} className="text-[#0E86D4]" />
            </span>
            <span className="font-medium">Zoom</span>
          </div>
          <div className="flex items-center gap-3 text-gray-200 transition-all duration-200 hover:text-white">
            <span className="bg-white/10 p-2.5 rounded-lg flex items-center justify-center border border-white/5 shadow-lg">
              <Users size={22} className="text-[#6264A7]" />
            </span>
            <span className="font-medium">Teams</span>
          </div>
        </div>

        {/* Enhanced CTA Button */}
        <div className="flex justify-center">
          <Button
            className="bg-[#FF00D6] hover:bg-[#D600B1] text-white text-lg py-6 px-10 rounded-xl shadow-lg shadow-[#FF00D6]/20 hover:shadow-xl hover:shadow-[#FF00D6]/30 transition-all duration-300 transform hover:-translate-y-1"
            onClick={() => setIsModalOpen(true)}
          >
            Join the Waitlist
          </Button>
        </div>
      </div>

      {/* Waitlist Modal */}
      <WaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}

export default HeroSection

