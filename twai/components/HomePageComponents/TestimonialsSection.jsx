"use client"

import { useState, useEffect, useRef } from "react";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";

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
    content: "Before I had to prepare hours for presentations, memorizing & creating notes, which then I always forgot. Well not anymore",
    name: "Olivia Thompson",
    rating: 5,
  },
  {
    id: 3,
    quote: "Takes away all your stress",
    content: "I enjoy presentations much more now. All questions, doubts, arguments are handles by JarWiz instantly. And I just focus on connecting with clients now.",
    name: "Harish Goyal",
    rating: 5,
  },
  {
    id: 4,
    quote: "Citations gives confidence",
    content: "It cites everything and shows exactly where it got the detail from. Exact slide, exact paragraph, exact tab. Never doubts about hallucination.",
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
    content: "Initially I had doubts if AI will obstruct my flow. But kudos to 1-click feature. It is so intuitive and seamless.",
    name: "Noah Johnson",
    rating: 5,
  },
  {
    id: 9,
    quote: "Crack those critical meetings..",
    content: "You dont want to take chances with those high-stakes critical meetings. Every inch matters in them & JarWIZ gives you a yard ",
    name: "Morten Larsson",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef(null);
  
  // Function to render stars based on rating
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-300">{rating}/5</span>
      </div>
    );
  };

  // Create 3 copies of testimonials for smooth infinite scrolling
  const allTestimonials = [...testimonials, ...testimonials, ...testimonials];
  
  // Group testimonials in rows of 3
  const createRows = (items) => {
    const rows = [];
    for (let i = 0; i < items.length; i += 3) {
      rows.push(items.slice(i, Math.min(i + 3, items.length)));
    }
    return rows;
  };
  
  const testimonialRows = createRows(allTestimonials);
  
  useEffect(() => {
    if (isHovered || !containerRef.current) return;
    
    const container = containerRef.current;
    const totalHeight = container.scrollHeight / 3; // Divide by 3 since we have 3 copies
    
    let animationFrameId;
    const animateScroll = () => {
      setScrollPosition(prev => {
        const newPosition = prev + 0.5; // Adjust speed here (smaller = slower, larger = faster)
        
        // When we've scrolled through one set of testimonials, reset to beginning of second set
        if (newPosition >= totalHeight) {
          // Reset to the start of the second set to create seamless loop
          return 0;
        }
        
        return newPosition;
      });
      
      animationFrameId = requestAnimationFrame(animateScroll);
    };
    
    animationFrameId = requestAnimationFrame(animateScroll);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHovered]);
  
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = scrollPosition;
    }
  }, [scrollPosition]);

  return (
    <section id="testimonials" className="section-padding bg-[#0f1217] pt-14 pb-16">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-white text-center text-3xl font-bold mb-6">
          What Our Beta Users Say
        </h2>
        
        <div 
          className="relative h-96 overflow-hidden"
        >
          {/* Gradient overlay at top */}
          <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-[#0f1217] to-transparent h-16 z-10 pointer-events-none"></div>
          
          {/* Gradient overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0f1217] to-transparent h-16 z-10 pointer-events-none"></div>
          
          {/* Scrolling container */}
          <div 
            ref={containerRef}
            className="h-full overflow-hidden"
            style={{ 
              maskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)" 
            }}
          >
            <div className="pb-4">
              {testimonialRows.map((row, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {row.map((testimonial, index) => (
                    <Card 
                      key={`${rowIndex}-${index}`} 
                      className="bg-[#171b22] border border-gray-800 p-6 h-64 flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <div className="mb-3">
                        <h3 className="text-xl font-bold text-white italic">&quot;{testimonial.quote}&quot;</h3>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-4 flex-grow line-clamp-3">
                        {testimonial.content}
                      </p>
                      
                      <div className="mt-auto">
                        <h4 className="font-medium text-white mb-1">{testimonial.name}</h4>
                        {testimonial.title && testimonial.company && (
                          <p className="text-sm text-gray-400">{testimonial.title}, {testimonial.company}</p>
                        )}
                        <div className="mt-2">
                          {renderStars(testimonial.rating)}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;