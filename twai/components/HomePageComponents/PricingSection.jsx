"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import WaitlistModal from "./WaitlistModal"

const pricingTiers = [
  {
    id: "basic",
    name: "Basic",
    price: 29,
    description: "Perfect for freelancers and individual consultants",
    meetings: "10 meetings",
    storage: "100MB storage",
    features: [
      "Real-time meeting assistance",
      "Document search & retrieval",
      "Basic meeting summaries",
      "Email support",
      "1 AI agent template",
    ],
    cta: "Join Waitlist",
  },
  {
    id: "pro",
    name: "Pro",
    price: 79,
    description: "Ideal for small teams and growing businesses",
    meetings: "30 meetings",
    storage: "1GB storage",
    features: [
      "Everything in Basic, plus:",
      "Advanced meeting insights",
      "Full meeting transcriptions",
      "Action item tracking",
      "Priority support",
      "3 AI agent templates",
    ],
    popular: true,
    cta: "Join Waitlist",
  },
  {
    id: "premium",
    name: "Premium",
    price: 149,
    description: "For enterprises and organizations with advanced needs",
    meetings: "Unlimited meetings",
    storage: "5GB storage",
    features: [
      "Everything in Pro, plus:",
      "Custom AI agent development",
      "Integration with CRM systems",
      "Analytics dashboard",
      "Dedicated account manager",
      "Unlimited AI agent templates",
    ],
    cta: "Contact Sales",
  },
]

const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState("monthly")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTier, setSelectedTier] = useState(null)

  const handleJoinWaitlist = (tier) => {
    setSelectedTier(tier)
    setIsModalOpen(true)
  }

  return (
    <section id="pricing" className="section-padding bg-[#0f1217] text-white">
      <div className="container mx-auto">
        <h2 className="section-title text-white">Choose Your Plan</h2>

        <div className="flex justify-center mb-12">
          <div className="bg-[#1a1f29] rounded-lg p-1 shadow-sm border border-gray-800 inline-flex">
            <button
              className={`px-4 py-2 rounded-md transition-colors ${
                billingCycle === "monthly"
                  ? "bg-[#FF00D6] text-white"
                  : "bg-transparent text-gray-300 hover:bg-[#242936]"
              }`}
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 rounded-md transition-colors ${
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

        <div className="grid md:grid-cols-3 gap-8">
          {pricingTiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative rounded-xl overflow-hidden ${
                tier.popular ? "shadow-xl border-2 border-[#FF00D6]" : "shadow-md border border-gray-800"
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0 bg-[#FF00D6] text-white px-4 py-1 text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className="bg-[#1a1f29] p-8">
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-gray-300 mb-4">{tier.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">${tier.price}</span>
                  <span className="text-gray-400">/month</span>
                </div>

                <div className="space-y-3 mb-8 text-sm text-gray-300">
                  <div className="flex items-center">
                    <div className="text-[#FF00D6] mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
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
                    <div className="text-[#FF00D6] mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
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
                  className={`w-full mb-8 ${
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

                <div className="space-y-3">
                  {tier.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <div className="text-[#FF00D6] mr-2 mt-1">
                        <Check className="h-5 w-5" />
                      </div>
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Need a custom plan?</h3>
          <p className="text-gray-300 mb-8">
            Contact our sales team for custom pricing and plans tailored to your organization&apos;s needs.
          </p>
          <p className="text-sm text-gray-300 mt-2">Don&apos;t see a plan that works for you? Contact us for custom pricing.</p>
          <Button variant="outline" className="border-[#FF00D6] text-[#FF00D6] hover:bg-[#FF00D6]/10">
            Contact Sales
          </Button>
        </div>
      </div>

      {/* Waitlist Modal */}
      <WaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}

export default PricingSection

