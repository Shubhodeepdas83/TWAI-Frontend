import { ClipboardX, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

const ProblemSection = () => {
  const [activeSlide, setActiveSlide] = useState(0)
  const totalSlides = 3
  
  const nextSlide = () => {
    setActiveSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1))
  }
  
  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1))
  }
  
  const problemItems = [
    {
      title: "Time Wasted - before meetings",
      description: "Hours spent preparing materials that may never be referenced during the meeting."
    },
    {
      title: "Information Overload - during meetings",
      description: "Struggling to recall key data points when they are most needed in discussions."
    },
    {
      title: "Lost Opportunities - after meetings",
      description: "Missing crucial insights that could have led to better business decisions."
    }
  ]

  return (
    <section className="section-padding bg-[#0f1217] text-white py-10 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-white text-3xl md:text-4xl font-bold text-center mb-6 md:mb-8">
          The Hidden Cost of Ineffective Meetings
        </h2>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Desktop version - visible only on md screens and up */}
          <div className="hidden md:block bg-[#1a1f29] p-6 md:p-8 rounded-xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 opacity-10">
              <ClipboardX size={180} className="text-jarwiz-400" />
            </div>
            <div className="grid gap-4 md:gap-6 relative z-10">
              <div className="bg-[#242936] p-4 md:p-5 rounded-lg shadow-sm border border-gray-800">
                <h3 className="text-lg md:text-xl font-semibold text-[#FF00D6] mb-2">Time Wasted - before meetings</h3>
                <p className="text-sm md:text-base text-gray-300">
                  Hours spent preparing materials that may never be referenced during the meeting.
                </p>
              </div>
              <div className="bg-[#242936] p-4 md:p-5 rounded-lg shadow-sm border border-gray-800">
                <h3 className="text-lg md:text-xl font-semibold text-[#FF00D6] mb-2">
                  Information Overload - during meetings
                </h3>
                <p className="text-sm md:text-base text-gray-300">
                  Struggling to recall key data points when they are most needed in discussions.
                </p>
              </div>
              <div className="bg-[#242936] p-4 md:p-5 rounded-lg shadow-sm border border-gray-800">
                <h3 className="text-lg md:text-xl font-semibold text-[#FF00D6] mb-2">
                  Lost Opportunities - after meetings
                </h3>
                <p className="text-sm md:text-base text-gray-300">
                  Missing crucial insights that could have led to better business decisions.
                </p>
              </div>
            </div>
          </div>
          
          {/* Mobile carousel - visible only on screens below md */}
          <div className="md:hidden bg-[#1a1f29] p-6 rounded-xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 opacity-10">
              <ClipboardX size={180} className="text-jarwiz-400" />
            </div>
            <div className="relative z-10">
              <div className="overflow-hidden">
                <div 
                  className="transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${activeSlide * 100}%)`, display: 'flex' }}
                >
                  {problemItems.map((item, index) => (
                    <div key={index} className="w-full flex-shrink-0 px-1">
                      <div className="bg-[#242936] p-4 rounded-lg shadow-sm border border-gray-800">
                        <h3 className="text-lg font-semibold text-[#FF00D6] mb-2">{item.title}</h3>
                        <p className="text-sm text-gray-300">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <button 
                  onClick={prevSlide} 
                  className="p-2 rounded-full bg-[#242936] text-white"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <div className="flex space-x-2">
                  {Array.from({ length: totalSlides }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveSlide(index)}
                      className={`w-2 h-2 rounded-full ${activeSlide === index ? 'bg-[#FF00D6]' : 'bg-gray-600'}`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
                
                <button 
                  onClick={nextSlide} 
                  className="p-2 rounded-full bg-[#242936] text-white"
                  aria-label="Next slide"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="order-first md:order-last hidden md:block">
            <p className="text-base md:text-lg text-gray-300 mb-6">
              Professionals waste hours each week preparing for and following up on meetings, only to struggle with
              information overload and forgotten details during the discussion.
            </p>
            <p className="text-base md:text-lg text-gray-300 mb-6">
              This leads to lost opportunities, delayed decisions, and unnecessary stress.
            </p>
            <div className="bg-[#1a1f29] border border-gray-800 p-5 md:p-6 rounded-lg">
              <h3 className="text-lg md:text-xl font-bold text-white mb-4">The Average Professional:</h3>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#242936] flex items-center justify-center text-[#FF00D6] mr-3 md:mr-4 flex-shrink-0 text-sm md:text-base">
                    12+
                  </div>
                  <p className="text-sm md:text-base text-gray-300">Hours per week in meetings</p>
                </li>
                <li className="flex items-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#242936] flex items-center justify-center text-[#FF00D6] mr-3 md:mr-4 flex-shrink-0 text-sm md:text-base">
                    4+
                  </div>
                  <p className="text-sm md:text-base text-gray-300">Hours preparing for those meetings</p>
                </li>
                <li className="flex items-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#242936] flex items-center justify-center text-[#FF00D6] mr-3 md:mr-4 flex-shrink-0 text-sm md:text-base">
                    65%
                  </div>
                  <p className="text-sm md:text-base text-gray-300">Feel meetings are unproductive</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProblemSection

