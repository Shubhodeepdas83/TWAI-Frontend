"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Check, ChevronLeft, ChevronRight } from "lucide-react"
import WaitlistModal from "./WaitlistModal"

// pricingTiers array remains the same
const pricingTiers = [
    { id: "free", name: "Free", price: 0, description: "Perfect for checking out first time", meetings: "300 minutes of meetings", storage: "1 GB storage", features: ["Real-time AI meeting assistance", "Document search & retrieval", "Meeting summaries / Transcripts", "Priority support", "5 Agents",], cta: "Join Waitlist", },
    { id: "basic", name: "Basic", price: 29, description: "Perfect for freelancers and individual consultants", meetings: "1500 minutes of meetings", storage: "5 GB storage", features: ["Everything in Free, plus:", "Agenda item tracking", "Preparation Hub QnA Access", "Priority support", "15 AI-agents",], popular: true, cta: "Join Waitlist", },
    { id: "pro", name: "Pro", price: 199, description: "Ideal for small teams and growing businesses", meetings: "10000 minutes of meetings", storage: "20 GB storage", features: ["Everything in Basic, plus:", "Custom AI agent development", "Integration with CRM systems", "Dedicated account manager", "Unlimited AI-agent templates",], cta: "Join Waitlist", },
]

// PricingCard component remains the same
const PricingCard = ({ tier, billingCycle, onJoinWaitlist }) => {
    const displayPrice = billingCycle === "annual" && tier.price > 0 ? Math.round(tier.price * 0.8 * 12) : tier.price;
    const priceSuffix = billingCycle === "annual" && tier.price > 0 ? "/year" : "/month";

    return (
        <div className={`relative rounded-xl overflow-hidden h-full flex flex-col ${ tier.popular ? "shadow-xl border-2 border-[#FF00D6]" : "shadow-md border border-gray-800" }`}>
             {tier.popular && (<div className="absolute top-0 right-0 bg-[#FF00D6] text-white px-3 py-1 text-xs font-semibold rounded-bl-lg z-10">Most Popular</div>)}
             <div className="bg-[#1a1f29] p-6 flex-grow flex flex-col">
                 <h3 className="text-xl font-bold text-white mb-1">{tier.name}</h3>
                 <p className="text-sm text-gray-300 mb-3 h-10">{tier.description}</p>
                 <div className="mb-4">
                     {tier.price === 0 ? (<span className="text-3xl font-bold text-white">Free</span>) : (<><span className="text-3xl font-bold text-white">${displayPrice}</span><span className="text-sm text-gray-400">{priceSuffix}</span></>)}
                 </div>
                 <div className="space-y-2 mb-6 text-sm text-gray-300">
                     <div className="flex items-center"><Check className="h-4 w-4 text-[#FF00D6] mr-2 flex-shrink-0" />{tier.meetings}</div>
                     <div className="flex items-center"><Check className="h-4 w-4 text-[#FF00D6] mr-2 flex-shrink-0" />{tier.storage}</div>
                 </div>
                 <Button className={`w-full mt-auto py-3 text-base ${ tier.popular ? "bg-[#FF00D6] hover:bg-[#D600B1] text-white" : "bg-[#242936] hover:bg-[#2f3646] text-white" }`} onClick={() => onJoinWaitlist(tier.id)}>{tier.cta}</Button>
                 <div className="space-y-2 mt-6 pt-6 border-t border-gray-700">
                     {tier.features.map((feature, index) => (<div key={index} className="flex items-start"><div className="text-[#FF00D6] mr-2 mt-0.5 flex-shrink-0"><Check className="h-4 w-4" /></div><span className="text-sm text-gray-300">{feature}</span></div>))}
                 </div>
             </div>
        </div>
    )
}

const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState("monthly")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTierId, setSelectedTierId] = useState(null)

  // --- Mobile Carousel State & Refs ---
  const [isMobile, setIsMobile] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [carouselWidth, setCarouselWidth] = useState(0)
  const [cardWidth, setCardWidth] = useState(0)
  const carouselRef = useRef(null)
  const cardWrapperRef = useRef(null)
  const trackRef = useRef(null); // Ref for the track div for adding/removing classes

  // --- Swipe Handling State ---
  const [touchStartX, setTouchStartX] = useState(null);
  const [isSwiping, setIsSwiping] = useState(false);

  // --- Debounce Function ---
  function debounce(func, wait) { /* ... debounce logic ... */
    let timeout;
    return function executedFunction(...args) {
      const later = () => { clearTimeout(timeout); func(...args); };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // --- Update Dimensions Function ---
  const updateDimensions = () => { /* ... updateDimensions logic ... */
    requestAnimationFrame(() => {
        if (carouselRef.current) setCarouselWidth(carouselRef.current.offsetWidth);
        if (cardWrapperRef.current) setCardWidth(cardWrapperRef.current.offsetWidth);
    });
  };

  // Check mobile status and setup resize listener
  useEffect(() => { /* ... checkMobile useEffect ... */
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      if (isMobile !== mobile) { // Only update state and activeIndex if mode changes
          setIsMobile(mobile);
          setActiveIndex(0); // Reset to first card when switching modes
      }
    };
    checkMobile();
    const debouncedCheckMobile = debounce(checkMobile, 100);
    window.addEventListener("resize", debouncedCheckMobile);
    return () => window.removeEventListener("resize", debouncedCheckMobile);
  }, [isMobile]); // Dependency ensures checkMobile runs if isMobile changes elsewhere

  // Update dimensions on mount and when isMobile changes
  useEffect(() => { /* ... updateDimensions useEffect ... */
    if (isMobile) {
      updateDimensions();
      const debouncedUpdateDimensions = debounce(updateDimensions, 100);
      window.addEventListener('resize', debouncedUpdateDimensions);
      return () => window.removeEventListener('resize', debouncedUpdateDimensions);
    }
  }, [isMobile]);


  // Open modal handler
  const handleJoinWaitlist = (tierId) => { /* ... handleJoinWaitlist logic ... */
    setSelectedTierId(tierId);
    setIsModalOpen(true);
  }

  // --- Carousel Navigation ---
  const nextSlide = () => { /* ... nextSlide logic ... */
    setActiveIndex((prevIndex) => Math.min(prevIndex + 1, pricingTiers.length - 1));
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
};


  // --- Calculate Offset for Centering ---
  const calculateOffset = () => {
    if (!carouselWidth || !cardWidth || !isMobile) return '0px';
    
    const centerOffset = (carouselWidth - cardWidth) / 2;
    const maxOffset = 0; // Ensure first card is fully visible
    const calculatedOffset = `-${(activeIndex * cardWidth) - centerOffset}px`;

    return activeIndex === 0 ? `${maxOffset}px` : calculatedOffset;
};


  // --- Swipe Handlers ---
  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length === 1) {
      setTouchStartX(e.touches[0].clientX);
      setIsSwiping(true);
      // Disable transition during swipe for instant feedback
      trackRef.current?.classList.remove('duration-300');
    }
  };

  const handleTouchMove = (e) => {
    if (isSwiping && touchStartX !== null && e.touches && e.touches.length === 1) {
      const currentX = e.touches[0].clientX;
      const deltaX = currentX - touchStartX;

      // Basic check to prioritize horizontal swipe over vertical scroll
      // You might refine this threshold or add Y-delta comparison if needed
      if (Math.abs(deltaX) > 10) {
        // Prevent vertical page scroll while swiping horizontally
        e.preventDefault();

        // Optional: Live dragging effect (more complex)
        // const currentOffsetPixels = parseFloat(calculateOffset().replace('px', ''));
        // trackRef.current.style.transform = `translateX(${currentOffsetPixels + deltaX}px)`;
      }
    }
  };

  const handleTouchEnd = (e) => {
    // Re-enable transition after swipe ends
    trackRef.current?.classList.add('duration-300');

    if (isSwiping && touchStartX !== null && e.changedTouches && e.changedTouches.length === 1) {
      const touchEndX = e.changedTouches[0].clientX;
      const deltaX = touchEndX - touchStartX;
      const swipeThreshold = 50; // Minimum distance in pixels for a swipe action

      if (Math.abs(deltaX) > swipeThreshold) {
        if (Math.abs(deltaX) > swipeThreshold) {
          if (deltaX < 0) {
              // Swiped Left (Next)
              nextSlide();
          } else {
              // Swiped Right (Previous)
              if (activeIndex > 0) { // Ensure it doesn't go beyond first card
                  prevSlide();
              }
          }
      }
      
      } else {
        // Optional: If implementing live dragging, snap back to the original position
        // if the swipe wasn't long enough. Currently, it snaps automatically
        // because we only update activeIndex on valid swipes.
        // trackRef.current.style.transform = `translateX(${calculateOffset()})`;
      }
    }
    setTouchStartX(null);
    setIsSwiping(false);
  };


  return (
    <section id="pricing" className="section-padding bg-[#0f1217] text-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-white text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">
          Choose Your Plan
        </h2>

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center mb-8 md:mb-12">
           {/* ... Billing toggle buttons ... */}
           <div className="bg-[#1a1f29] rounded-lg p-1 shadow-sm border border-gray-800 inline-flex">
             <button className={`px-3 py-2 md:px-4 md:py-2 text-sm md:text-base rounded-md transition-colors ${ billingCycle === "monthly" ? "bg-[#FF00D6] text-white" : "bg-transparent text-gray-300 hover:bg-[#242936]" }`} onClick={() => setBillingCycle("monthly")}>Monthly</button>
             <button className={`px-3 py-2 md:px-4 md:py-2 text-sm md:text-base rounded-md transition-colors ${ billingCycle === "annual" ? "bg-[#FF00D6] text-white" : "bg-transparent text-gray-300 hover:bg-[#242936]" }`} onClick={() => setBillingCycle("annual")}>Annual <span className="text-[#FF69B4] text-xs ml-1">Save 20%</span></button>
           </div>
        </div>

        {/* Conditional Rendering: Mobile Carousel or Desktop Grid */}
        {isMobile ? (
            <div className="relative w-full overflow-hidden pb-6" ref={carouselRef}>
                 {/* Left/Right Buttons */}
                <button onClick={prevSlide} disabled={activeIndex === 0} className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-[#1a1f29]/60 h-10 w-10 flex items-center justify-center rounded-full text-white hover:bg-[#1a1f29]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Previous tier"><ChevronLeft className="h-5 w-5" /></button>
                <button onClick={nextSlide} disabled={activeIndex >= pricingTiers.length - 1} className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-[#1a1f29]/60 h-10 w-10 flex items-center justify-center rounded-full text-white hover:bg-[#1a1f29]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Next tier"><ChevronRight className="h-5 w-5" /></button>

                {/* Carousel Track with Touch Handlers */}
                <div
                    ref={trackRef} // Add ref to the track
                    className="flex transition-transform ease-in-out duration-300" // Base classes, duration added/removed dynamically
                    style={{ transform: `translateX(${calculateOffset()})` }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {pricingTiers.map((tier, index) => (
                        <div
                            key={tier.id}
                            ref={index === 0 ? cardWrapperRef : null}
                            // Removed cursor-pointer as swipe is primary interaction now
                            className={`w-[85vw] max-w-[340px] px-2 flex-shrink-0 transform ${
                                index === activeIndex ? 'scale-100 opacity-100 z-10' : 'scale-95 opacity-70 z-0'
                            }`}
                             // Removed onClick on wrapper, use indicators/buttons/swipe
                            role="group"
                            aria-roledescription="slide"
                            aria-label={`Pricing tier ${index + 1} of ${pricingTiers.length}: ${tier.name}`}
                         >
                            <PricingCard
                                tier={tier}
                                billingCycle={billingCycle}
                                onJoinWaitlist={handleJoinWaitlist}
                            />
                        </div>
                    ))}
                </div>

                {/* Indicators */}
                <div className="flex justify-center mt-6 space-x-2">
                   {/* ... Indicator buttons ... */}
                   {pricingTiers.map((_, index) => (<button key={index} className={`w-2 h-2 rounded-full transition-all duration-300 ${ index === activeIndex ? 'bg-[#FF00D6] w-5' : 'bg-gray-600 hover:bg-gray-500' }`} onClick={() => setActiveIndex(index)} aria-label={`Go to tier ${index + 1}`} aria-current={index === activeIndex}/>))}
                </div>
            </div>
        ) : (
            // --- Desktop Grid View (Unchanged) ---
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {pricingTiers.map((tier) => (
                     <PricingCard
                        key={tier.id}
                        tier={tier}
                        billingCycle={billingCycle}
                        onJoinWaitlist={handleJoinWaitlist}
                    />
                ))}
            </div>
        )}
      </div>

      {/* Waitlist Modal (Unchanged) */}
      <WaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} tierId={selectedTierId} />
    </section>
  )
}

export default PricingSection