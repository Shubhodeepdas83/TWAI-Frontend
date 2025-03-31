"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useState } from "react"
import WaitlistModal from "./WaitlistModal"

const CTASection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <section className="py-16 px-4 bg-[#0f1217] border-t border-gray-800">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Transform Your Meetings?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of professionals who are saving time, reducing stress, and making better decisions with
            Jarwiz AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-[#FF00D6] hover:bg-[#D600B1] text-white text-lg py-6 px-8"
              onClick={() => setIsModalOpen(true)}
            >
              Join the Waitlist
            </Button>

          </div>
          <p className="text-gray-400 mt-6">No credit card required. Early access for waitlist members.</p>
        </div>
      </div>

      {/* Waitlist Modal */}
      <WaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}

export default CTASection

