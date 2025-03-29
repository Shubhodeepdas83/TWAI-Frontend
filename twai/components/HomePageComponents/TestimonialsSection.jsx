"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    quote:
      "Jarwiz AI has revolutionized how I conduct client meetings. I never have to worry about forgetting details again. It's like having a brilliant assistant who never misses a beat.",
    name: "Sarah Johnson",
    title: "Freelance Consultant",
    company: "Johnson Consulting LLC",
    avatar: "SJ",
  },
  {
    id: 2,
    quote:
      "With Jarwiz AI, our team meetings are more focused and productive. It's like having an extra team member dedicated to efficiency. The real-time data access has saved us countless hours.",
    name: "David Chen",
    title: "Startup Founder",
    company: "NexGen Technologies",
    avatar: "DC",
  },
  {
    id: 3,
    quote:
      "I was skeptical about AI meeting assistants, but Jarwiz proved me wrong. It's intuitive, non-intrusive, and genuinely makes my meetings better. Worth every penny!",
    name: "Michelle Rodriguez",
    title: "Project Manager",
    company: "Innovative Solutions Inc.",
    avatar: "MR",
  },
]

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }

  return (
    <section id="testimonials" className="section-padding bg-[#0f1217]">
      <div className="container mx-auto">
        <h2 className="section-title text-white">What Our Users Say</h2>

        <div className="relative max-w-4xl mx-auto">
          <div className="bg-[#1a1f29] rounded-xl p-8 md:p-12 border border-gray-800 shadow-md">
            <div className="flex justify-center mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="text-yellow-400 h-6 w-6 fill-yellow-400" />
              ))}
            </div>

            <blockquote className="text-xl md:text-2xl text-center text-gray-300 italic mb-8">
              &quot;{testimonials[activeIndex].quote}&quot;
            </blockquote>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#FF00D6]/20 flex items-center justify-center text-white font-semibold text-xl mb-4">
                {testimonials[activeIndex].avatar}
              </div>
              <div className="text-center">
                <h4 className="text-lg font-bold text-white">{testimonials[activeIndex].name}</h4>
                <p className="text-gray-400">
                  {testimonials[activeIndex].title}, {testimonials[activeIndex].company}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={goToPrevious}
              className="w-12 h-12 rounded-full bg-[#242936] border border-gray-700 flex items-center justify-center text-gray-300 hover:bg-[#2f3646] hover:text-white transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <div className="flex space-x-2 items-center">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full ${index === activeIndex ? "bg-[#FF00D6]" : "bg-gray-600"}`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              className="w-12 h-12 rounded-full bg-[#242936] border border-gray-700 flex items-center justify-center text-gray-300 hover:bg-[#2f3646] hover:text-white transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection

