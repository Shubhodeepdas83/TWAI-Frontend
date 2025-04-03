"use client"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
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
          <a href="#" className="text-2xl md:text-3xl font-extrabold" style={{ color: "#007BFF" }}>
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
          <Button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="bg-[#FF00D6] hover:bg-[#D600B1] text-white"
          >
            Sign Up
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation - Improved with better animation and styling */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[60px] bg-[#0a0d14] z-40 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col space-y-6 p-8">
            <a
              href="#features"
              className="text-lg font-medium text-gray-300 hover:text-white transition-colors py-3 border-b border-gray-800"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#benefits"
              className="text-lg font-medium text-gray-300 hover:text-white transition-colors py-3 border-b border-gray-800"
              onClick={() => setIsMenuOpen(false)}
            >
              Benefits
            </a>
            <a
              href="#testimonials"
              className="text-lg font-medium text-gray-300 hover:text-white transition-colors py-3 border-b border-gray-800"
              onClick={() => setIsMenuOpen(false)}
            >
              Testimonials
            </a>
            <a
              href="#pricing"
              className="text-lg font-medium text-gray-300 hover:text-white transition-colors py-3 border-b border-gray-800"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="text-lg font-medium text-gray-300 hover:text-white transition-colors py-3 border-b border-gray-800"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQ
            </a>
            <div className="pt-4">
              <Button
                className="bg-[#FF00D6] hover:bg-[#D600B1] text-white w-full py-6 text-lg"
                onClick={() => {
                  setIsMenuOpen(false)
                  signIn("google", { callbackUrl: "/dashboard" })
                }}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Waitlist Modal */}
      <WaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  )
}

export default Header

