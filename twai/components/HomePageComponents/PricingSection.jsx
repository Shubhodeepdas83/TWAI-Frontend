"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Check, ChevronLeft, ChevronRight } from "lucide-react"
import WaitlistModal from "./WaitlistModal"

const pricingTiers = [
  {
    id: "free",
    name: "Free",
    price: 0,
    description: "Perfect for checking out first time",
    meetings: "300 minutes of meetings",
    storage: "1 GB storage",
    features: [
      "Real-time AI meeting assistance",
      "Document search & retrieval",
      "Meeting summaries / Transcripts",
      "Priority support",
      "5 Agents",
    ],
    cta: "Join Waitlist",
    ctaColor: "bg-[#242936] hover:bg-[#2f3646]",
  },
  {
    id: "basic",
    name: "Basic",
    price: 29,
    description: "Perfect for freelancers and individual consultants",
    meetings: "1500 minutes of meetings",
    storage: "5 GB storage",
    features: [
      "Everything in Free, plus:",
      "Agenda item tracking",
      "Preparation Hub QnA Access",
      "Priority support",
      "15 AI-agents",
    ],
    popular: true,
    cta: "Join Waitlist",
    ctaColor: "bg-[#FF00D6] hover:bg-[#D600B1]",
  },
  {
    id: "pro",
    name: "Pro",
    price: 199,
    description: "Ideal for small teams and growing businesses",
    meetings: "10000 minutes of meetings",
    storage: "20 GB storage",
    features: [
      "Everything in Basic, plus:",
      "Custom AI agent development",
      "Integration with CRM systems",
      "Dedicated account manager",
      "Unlimited AI-agent templates",
    ],
    cta: "Join Waitlist",
    ctaColor: "bg-[#242936] hover:bg-[#2f3646]",
  },
]

const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState("monthly")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTier, setSelectedTier] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const carouselRef = useRef(null)

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleJoinWaitlist = (tier) => {
    setSelectedTier(tier)
    setIsModalOpen(true)
  }

  const scrollToCard = (index) => {
    if (carouselRef.current) {
      setActiveIndex(index)
      const maxIndex = pricingTiers.length - 1
      const safeIndex = Math.min(Math.max(0, index), maxIndex)

      const cardWidth = carouselRef.current.scrollWidth / pricingTiers.length
      carouselRef.current.scrollTo({
        left: cardWidth * safeIndex,
        behavior: "smooth",
      })
    }
  }

  const nextCard = () => {
    scrollToCard(Math.min(activeIndex + 1, pricingTiers.length - 1))
  }

  const prevCard = () => {
    scrollToCard(Math.max(activeIndex - 1, 0))
  }

  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollPosition = carouselRef.current.scrollLeft
      const cardWidth = carouselRef.current.scrollWidth / pricingTiers.length
      const newIndex = Math.round(scrollPosition / cardWidth)
      setActiveIndex(newIndex)
    }
  }

  return (
    <section id="pricing" className="section-padding bg-[#0f1217] text-white">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-white text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">
          Choose Your Plan
        </h2>

        <div className="flex justify-center mb-8 md:mb-12">
          <div className="bg-[#1a1f29] rounded-lg p-1 shadow-sm border border-gray-800 inline-flex">
            <button
              className={`px-3 py-2 md:px-4 md:py-2 text-sm md:text-base rounded-md transition-colors ${
                billingCycle === "monthly"
                  ? "bg-[#FF00D6] text-white"
                  : "bg-transparent text-gray-300 hover:bg-[#242936]"
              }`}
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly
            </button>
            <button
              className={`px-3 py-2 md:px-4 md:py-2 text-sm md:text-base rounded-md transition-colors ${
                billingCycle === "annual"
                  ? "bg-[#FF00D6] text-white"
                  : "bg-transparent text-gray-300 hover:bg-[#242936]"
              }`}
              onClick={() => setBillingCycle("annual")}
            >
              Annual <span className="text-[#FF69B4] text-xs ml-1">Save 20%</span>
            </button>
          </div>
        </div>

        {isMobile ? (
          <div className="relative">
            <div
              ref={carouselRef}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth gap-4 pb-6"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              onScroll={handleScroll}
            >
              {pricingTiers.map((tier) => (
                <div key={tier.id} className="snap-center flex-shrink-0 w-full">
                  <div
                    className={`relative rounded-xl overflow-hidden ${
                      tier.popular ? "shadow-xl border-2 border-[#FF00D6]" : "shadow-md border border-gray-800"
                    }`}
                  >
                    {tier.popular && (
                      <div className="absolute top-0 right-0 bg-[#FF00D6] text-white px-3 py-1 text-xs md:text-sm font-semibold">
                        Most Popular
                      </div>
                    )}

                    <div className="bg-[#1a1f29] p-5 md:p-8">
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">{tier.name}</h3>
                      <p className="text-sm md:text-base text-gray-300 mb-3 md:mb-4">{tier.description}</p>

                      <div className="mb-4 md:mb-6">
                        <span className="text-2xl md:text-4xl font-bold text-white">${tier.price}</span>
                        <span className="text-sm md:text-base text-gray-400">/month</span>
                      </div>

                      <div className="space-y-2 md:space-y-3 mb-6 md:mb-8 text-xs md:text-sm text-gray-300">
                        <div className="flex items-center">
                          <div className="text-[#FF00D6] mr-2 flex-shrink-0">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                              className="w-4 h-4 md:w-5 md:h-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                              />
                            </svg>
                          </div>
                          {tier.meetings}
                        </div>
                        <div className="flex items-center">
                          <div className="text-[#FF00D6] mr-2 flex-shrink-0">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                              className="w-4 h-4 md:w-5 md:h-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                              />
                            </svg>
                          </div>
                          {tier.storage}
                        </div>
                      </div>

                      <Button
                        className={`w-full mb-6 md:mb-8 py-5 md:py-6 text-sm md:text-base ${
                          tier.popular
                            ? "bg-[#FF00D6] hover:bg-[#D600B1] text-white"
                            : "bg-[#242936] hover:bg-[#2f3646] text-white"
                        }`}
                        onClick={() =>
                          tier.cta === "Contact Sales"
                            ? (window.location.href = "#contact")
                            : handleJoinWaitlist(tier.id)
                        }
                      >
                        {tier.cta}
                      </Button>

                      <div className="space-y-2 md:space-y-3">
                        {tier.features.map((feature, index) => (
                          <div key={index} className="flex items-start">
                            <div className="text-[#FF00D6] mr-2 mt-1 flex-shrink-0">
                              <Check className="h-4 w-4 md:h-5 md:w-5" />
                            </div>
                            <span className="text-xs md:text-sm text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center items-center mt-6 gap-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-[#242936] border-gray-700 text-white hover:bg-[#2f3646] hover:text-white"
                onClick={prevCard}
                disabled={activeIndex === 0}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div className="flex gap-1">
                {pricingTiers.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full ${activeIndex === index ? "bg-[#FF00D6]" : "bg-gray-600"}`}
                    onClick={() => scrollToCard(index)}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-[#242936] border-gray-700 text-white hover:bg-[#2f3646] hover:text-white"
                onClick={nextCard}
                disabled={activeIndex >= pricingTiers.length - 1}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier) => (
              <div
                key={tier.id}
                className={`relative rounded-xl overflow-hidden ${
                  tier.popular ? "shadow-xl border-2 border-[#FF00D6]" : "shadow-md border border-gray-800"
                }`}
              >
                {tier.popular && (
                  <div className="absolute top-0 right-0 bg-[#FF00D6] text-white px-3 py-1 text-xs md:text-sm font-semibold">
                    Most Popular
                  </div>
                )}

                <div className="bg-[#1a1f29] p-5 md:p-8">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">{tier.name}</h3>
                  <p className="text-sm md:text-base text-gray-300 mb-3 md:mb-4">{tier.description}</p>

                  <div className="mb-4 md:mb-6">
                    <span className="text-2xl md:text-4xl font-bold text-white">${tier.price}</span>
                    <span className="text-sm md:text-base text-gray-400">/month</span>
                  </div>

                  <div className="space-y-2 md:space-y-3 mb-6 md:mb-8 text-xs md:text-sm text-gray-300">
                    <div className="flex items-center">
                      <div className="text-[#FF00D6] mr-2 flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-4 h-4 md:w-5 md:h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      </div>
                      {tier.meetings}
                    </div>
                    <div className="flex items-center">
                      <div className="text-[#FF00D6] mr-2 flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-4 h-4 md:w-5 md:h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      </div>
                      {tier.storage}
                    </div>
                  </div>

                  <Button
                    className={`w-full mb-6 md:mb-8 py-5 md:py-6 text-sm md:text-base ${
                      tier.popular
                        ? "bg-[#FF00D6] hover:bg-[#D600B1] text-white"
                        : "bg-[#242936] hover:bg-[#2f3646] text-white"
                    }`}
                    onClick={() =>
                      tier.cta === "Contact Sales" ? (window.location.href = "#contact") : handleJoinWaitlist(tier.id)
                    }
                  >
                    {tier.cta}
                  </Button>

                  <div className="space-y-2 md:space-y-3">
                    {tier.features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <div className="text-[#FF00D6] mr-2 mt-1 flex-shrink-0">
                          <Check className="h-4 w-4 md:h-5 md:w-5" />
                        </div>
                        <span className="text-xs md:text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Waitlist Modal */}
      <WaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}

export default PricingSection

