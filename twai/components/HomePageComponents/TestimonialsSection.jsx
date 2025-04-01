"use client"

import { useState, useRef, useEffect } from "react"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    id: 1,
    quote: "Real-time savior",
    content: "Just upload all the notes, ideas & docs. And it surfaces them in meeting, at exactly the right moment.",
    name: "Nibin Issac",
    rating: 5,
  },
  {
    id: 2,
    quote: "No more dark eyes for me",
    content:
      "Before I had to prepare hours for presentations, memorizing & creating notes, which then I always forgot. Well not anymore",
    name: "Olivia Thompson",
    rating: 5,
  },
  {
    id: 3,
    quote: "Takes away all your stress",
    content:
      "I enjoy presentations much more now. All questions, doubts, arguments are handles by JarWiz instantly. And I just focus on connecting with clients now.",
    name: "Harish Goyal",
    rating: 5,
  },
  {
    id: 4,
    quote: "Citations gives confidence",
    content:
      "It cites everything and shows exactly where it got the detail from. Exact slide, exact paragraph, exact tab. Never doubts about hallucination.",
    name: "Kanan Gupta",
    rating: 5,
  },
  {
    id: 5,
    quote: "No more disagreements",
    content: "More consensus. No more hand-waving. More data-backed arguments. Everybody on same page.",
    name: "Sonia Thomas",
    rating: 5,
  },
  {
    id: 6,
    quote: "Meetings are fun",
    content: "Once you get try it, there is no going back. Meetings are not same anymore. They are walk in park.",
    name: "Prakash Oswal",
    rating: 5,
  },
  {
    id: 7,
    quote: "So many Agents!",
    content: "It has so 20+ Agents, all working in background and they surface instantly, only when you need.",
    name: "Sam Sharma",
    rating: 5,
  },
  {
    id: 8,
    quote: "Amazingly Non-Intrusive",
    content:
      "Initially I had doubts if AI will obstruct my flow. But kudos to 1-click feature. It is so intuitive and seamless.",
    name: "Noah Johnson",
    rating: 5,
  },
  {
    id: 9,
    quote: "Crack those critical meetings..",
    content:
      "You dont want to take chances with those high-stakes critical meetings. Every inch matters in them & JarWIZ gives you a yard ",
    name: "Morten Larsson",
    rating: 5,
  },
]

const TestimonialsSection = () => {
  const carouselRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [cardsPerView, setCardsPerView] = useState(3)

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)

      if (width < 640) {
        setCardsPerView(1)
      } else if (width < 1024) {
        setCardsPerView(2)
      } else {
        setCardsPerView(3)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Function to render stars based on rating
  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-3 w-3 md:h-4 md:w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          />
        ))}
        <span className="ml-1 text-xs md:text-sm text-gray-300">{rating}/5</span>
      </div>
    )
  }

  const scrollToCard = (index) => {
    if (carouselRef.current) {
      setActiveIndex(index)
      const maxIndex = testimonials.length - cardsPerView
      const safeIndex = Math.min(Math.max(0, index), maxIndex)

      const cardWidth = carouselRef.current.scrollWidth / testimonials.length
      carouselRef.current.scrollTo({
        left: cardWidth * safeIndex,
        behavior: "smooth",
      })
    }
  }

  const nextCard = () => {
    const maxIndex = testimonials.length - cardsPerView
    scrollToCard(Math.min(activeIndex + 1, maxIndex))
  }

  const prevCard = () => {
    scrollToCard(Math.max(activeIndex - 1, 0))
  }

  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollPosition = carouselRef.current.scrollLeft
      const cardWidth = carouselRef.current.scrollWidth / testimonials.length
      const newIndex = Math.round(scrollPosition / cardWidth)
      setActiveIndex(newIndex)
    }
  }

  return (
    <section id="testimonials" className="section-padding bg-[#0f1217] pt-14 md:pt-20 pb-20 md:pb-24">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-white text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">
          What Our Beta Users Say
        </h2>

        {/* Mobile Carousel View */}
        <div className="relative">
          <div
            ref={carouselRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth gap-4 pb-6"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onScroll={handleScroll}
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="snap-center flex-shrink-0 w-full sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)]"
              >
                <Card className="bg-[#171b22] border border-gray-800 p-4 md:p-6 h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="mb-3 md:mb-4">
                    <h3 className="text-lg md:text-xl xl:text-2xl font-bold text-white italic">
                      &quot;{testimonial.quote}&quot;
                    </h3>
                  </div>

                  <p className="text-sm md:text-base text-gray-300 mb-4 md:mb-6 flex-grow">{testimonial.content}</p>

                  <div className="mt-auto">
                    <h4 className="font-medium text-white mb-1">{testimonial.name}</h4>
                    {testimonial.title && testimonial.company && (
                      <p className="text-xs md:text-sm text-gray-400">
                        {testimonial.title}, {testimonial.company}
                      </p>
                    )}
                    <div className="mt-2">{renderStars(testimonial.rating)}</div>
                  </div>
                </Card>
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
              {Array.from({ length: Math.ceil(testimonials.length / cardsPerView) }).map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    Math.floor(activeIndex / cardsPerView) === index ? "bg-[#FF00D6]" : "bg-gray-600"
                  }`}
                  onClick={() => scrollToCard(index * cardsPerView)}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-[#242936] border-gray-700 text-white hover:bg-[#2f3646] hover:text-white"
              onClick={nextCard}
              disabled={activeIndex >= testimonials.length - cardsPerView}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection

