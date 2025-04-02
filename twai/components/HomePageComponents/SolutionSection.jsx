import { useState, useRef, useEffect } from "react";
import { MessageSquare, FileText, Lightbulb, Link, Settings } from "lucide-react"; // Removed unused imports

// FeatureCard component remains the same
const FeatureCard = ({ icon, title, description, isActive = false, isMobile = false }) => {
  return (
    <div
      className={`bg-[#1a1f29] p-5 rounded-xl shadow-md transition-all duration-300 border border-gray-800 h-full // Added h-full for consistent height
        ${isMobile ?
          `transform ${isActive ? 'scale-100 opacity-100 z-10' : 'scale-95 opacity-70 z-0'}` : // Slightly adjusted non-active scale
          'hover:shadow-lg hover:translate-y-[-5px]'}`
      }
    >
      <div className="flex items-start">
        <div className="mt-1 mr-3 md:mr-4 text-[#FF00D6]">{icon}</div>
        <div>
          <h3 className="text-lg font-bold text-white mb-2">{title}</h3> {/* Removed md:text-xl for mobile consistency */}
          <p className="text-sm text-gray-300">{description}</p> {/* Removed md:text-base */}
        </div>
      </div>
    </div>
  );
};

// MobileCarousel component with fixes
const MobileCarousel = ({ features }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselWidth, setCarouselWidth] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const carouselRef = useRef(null);
  const cardWrapperRef = useRef(null); // Use a ref for the wrapper to measure its full width

  // --- Debounce Function ---
  // Simple debounce to prevent excessive recalculations on resize
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // --- Update Dimensions Function ---
  const updateDimensions = () => {
    if (carouselRef.current) {
      setCarouselWidth(carouselRef.current.offsetWidth);
    }
    // Ensure the card wrapper ref exists before measuring
    if (cardWrapperRef.current) {
      // Measure the wrapper div, which now controls the spacing
      setCardWidth(cardWrapperRef.current.offsetWidth);
    }
  };

  useEffect(() => {
    // Initial calculation
    updateDimensions();

    // Debounced resize handler
    const debouncedHandleResize = debounce(updateDimensions, 100);

    window.addEventListener('resize', debouncedHandleResize);
    return () => window.removeEventListener('resize', debouncedHandleResize);
  }, []); // Empty dependency array ensures this runs once on mount and cleans up on unmount

  // Recalculate dimensions if the number of features changes (unlikely but good practice)
  useEffect(() => {
    updateDimensions();
  }, [features.length])

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % features.length);
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + features.length) % features.length);
  };

  // Calculate offset to center the active card wrapper
  const calculateOffset = () => {
    if (!carouselWidth || !cardWidth ) return '0px';
    
    const centerOffset = (carouselWidth - cardWidth) / 2;
    const maxOffset = 0; // Ensure first card is fully visible
    const calculatedOffset = `-${(activeIndex * cardWidth) - centerOffset}px`;

    return activeIndex === 0 ? `${maxOffset}px` : calculatedOffset;
};


  // Auto-advance interval
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [features.length]); // Re-run if features change, activeIndex change handled by nextSlide

  return (
    <div className="relative w-full overflow-hidden py-6" ref={carouselRef}>
      {/* Left button */}
      <button
        onClick={prevSlide}
        className="absolute left-1 md:left-2 top-1/2 transform -translate-y-1/2 z-20 bg-[#1a1f29]/60 h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-full text-white hover:bg-[#1a1f29]/80 transition-colors"
        aria-label="Previous card"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Right button */}
      <button
        onClick={nextSlide}
        className="absolute right-1 md:right-2 top-1/2 transform -translate-y-1/2 z-20 bg-[#1a1f29]/60 h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-full text-white hover:bg-[#1a1f29]/80 transition-colors"
        aria-label="Next card"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Carousel Track */}
      <div
        className="flex transition-transform duration-300 ease-in-out touch-pan-y"
        style={{
          transform: `translateX(${calculateOffset()})`,
          // Add a fallback for initial render before JS calculates width
          // This helps prevent a jarring jump but might not be perfectly centered initially
          // marginLeft: cardWidth === 0 ? 'calc(50% - 140px)' : '0' // Example fallback: center a 280px card roughly
        }}
      >
        {features.map((feature, index) => (
          <div
            key={index}
            // *** CHANGE HERE: Use a ref on the wrapper and make width flexible ***
            ref={index === 0 ? cardWrapperRef : null} // Ref the wrapper of the first card
            className="w-[80vw] max-w-[300px] px-2 flex-shrink-0 cursor-pointer" // Use viewport width, capped, add padding for spacing, prevent shrinking
            onClick={() => setActiveIndex(index)}
            role="group"
            aria-roledescription="slide"
            aria-label={`Card ${index + 1} of ${features.length}`}
          >
            <FeatureCard
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              isActive={index === activeIndex}
              isMobile={true}
            />
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="flex justify-center mt-6 space-x-2">
        {features.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300
              ${index === activeIndex ? 'bg-[#FF00D6] w-6' : 'bg-gray-500 hover:bg-gray-400'}`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === activeIndex}
          />
        ))}
      </div>
    </div>
  );
};


// SolutionSection component remains mostly the same, but ensure imports are correct
const SolutionSection = () => {
  const features = [
    {
      icon: <MessageSquare size={22} />,
      title: "Real-time AI collaborator",
      description: "Understands the meeting flow & provides relevant inputs exactly when you need, without disrupting the natural conversation."
    },
    {
      icon: <FileText size={22} />,
      title: "1-Click assistance",
      description: "Pre-defined quick-action AI-agents. Customized for un-interruptive & summarized assistance that is easy to grasp."
    },
    {
      icon: <FileText size={22} />, // Note: Duplicate icon used, consider FileSearch?
      title: "Instant web & doc search",
      description: "Searches uploaded documents & web to pull up exact information when needed, saving you from awkward pauses while searching for data."
    },
    {
      icon: <Lightbulb size={22} />,
      title: "Contextual suggestions",
      description: "Offers live advice based on the discussion, helping you make better decisions and identify opportunities you might have missed."
    },
    {
      icon: <Link size={22} />,
      title: "Seamless integration",
      description: "Works with all popular meeting platforms like Zoom, Google Meet, Microsoft Teams and other browser based meeting apps."
    },
    {
      icon: <Settings size={22} />,
      title: "Customizable AI agents",
      description: "Tailor the AI to specific roles or industries, ensuring you get exactly the type of assistance most relevant to your business needs."
    }
  ];

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Using 768px (Tailwind's `md` breakpoint) might be more standard than 640 (`sm`)
      // Adjust if your definition of "mobile" differs
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section className="section-padding bg-[#181d26] text-white py-16 md:py-24"> {/* Added padding example */}
      <div className="container mx-auto px-4">
        <h2 className="section-title text-white text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">
          How JarWiz AI Transforms Your Meetings
        </h2>

        <p className="text-base md:text-xl text-center text-gray-300 w-full md:w-4/5 mx-auto mb-10 md:mb-16 hidden md:block">

          A real-time RAG-based AI super-agent that helps you think, speak, and communicate effectively & accurately.

          <br className="hidden md:block" />

          Simply update JarWiz AI with meeting details, relevant documents, and integrations (e.g., Salesforce, CRM).

          <br className="hidden md:block" />
          <br className="hidden md:block" />


          It joins your meeting on any platform, follows the conversation, delivers instant answers, arguments, & action plans.

        </p>

        {/* Conditional Rendering */}
        {isMobile ? (
          <MobileCarousel features={features} />
        ) : (
          /* Desktop Grid */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"> {/* Adjusted gap */}
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                isMobile={false} // Explicitly pass false for desktop
              // isActive prop is not needed for the static grid
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SolutionSection;