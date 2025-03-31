"use client"

import { useState, useEffect } from "react"
import { useSession,signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import WaitlistModal from "./WaitlistModal"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-[#0a0d14] shadow-md py-2" : "bg-transparent py-4"}`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
        <a href="#" className="text-3xl font-extrabold" style={{ color: "#007BFF" }}>
    Jarwiz<span style={{ color: "#FF00D6" }}>AI</span>
  </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 items-center">
          <a href="#features" className="text-gray-300 hover:text-white transition-colors">
            Features
          </a>
          <a href="#benefits" className="text-gray-300 hover:text-white transition-colors">
            Benefits
          </a>
          <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">
            Testimonials
          </a>
          <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
            Pricing
          </a>
          <a href="#faq" className="text-gray-300 hover:text-white transition-colors">
            FAQ
          </a>
          <Button onClick={() => signIn("google",{callbackUrl:"/dashboard"})} className="bg-[#FF00D6] hover:bg-[#D600B1] text-white">
            Sign Up
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#0a0d14] shadow-lg absolute top-full left-0 right-0">
          <div className="flex flex-col space-y-4 p-6">
            <a
              href="#features"
              className="text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#benefits"
              className="text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Benefits
            </a>
            <a
              href="#testimonials"
              className="text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Testimonials
            </a>
            <a
              href="#pricing"
              className="text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQ
            </a>
            <Button
              className="bg-[#FF00D6] hover:bg-[#D600B1] text-white w-full"
              onClick={() => {
                setIsMenuOpen(false)
                setIsModalOpen(true)
              }}
            >
              Join Waitlist
            </Button>
          </div>
        </div>
      )}

      {/* Waitlist Modal */}
      <WaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  )
}

export default Header

