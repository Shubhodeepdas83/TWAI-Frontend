import { Clock, CheckCircle, TrendingUp } from "lucide-react"

const BenefitsSection = () => {
  return (
    <section id="benefits" className="section-padding bg-[#121620]">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-white text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">
          Why Choose Jarwiz AI?
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-8 mb-10 md:mb-16">
          <div className="bg-[#1a1f29] p-5 md:p-8 rounded-xl shadow-md border border-gray-800 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#242936] flex items-center justify-center text-[#FF00D6] mb-4 md:mb-6">
              <Clock className="h-6 w-6 md:h-7 md:w-7" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">Save Time</h3>
            <p className="text-sm md:text-base text-gray-300 mb-3 md:mb-4">
              Reduce prep and follow-up time by up to 50% with automatic information retrieval and meeting summaries.
            </p>
            <ul className="space-y-2 md:space-y-3">
              <li className="flex items-start">
                <div className="text-[#FF00D6] mr-2 mt-1 flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 md:w-5 md:h-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <p className="text-sm md:text-base text-gray-300">Less time spent preparing materials</p>
              </li>
              <li className="flex items-start">
                <div className="text-[#FF00D6] mr-2 mt-1 flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 md:w-5 md:h-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <p className="text-sm md:text-base text-gray-300">Automatic meeting notes and summaries</p>
              </li>
              <li className="flex items-start">
                <div className="text-[#FF00D6] mr-2 mt-1 flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 md:w-5 md:h-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <p className="text-sm md:text-base text-gray-300">Faster decision-making in meetings</p>
              </li>
            </ul>
          </div>

          <div className="bg-[#1a1f29] p-5 md:p-8 rounded-xl shadow-md border border-gray-800 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#242936] flex items-center justify-center text-[#FF00D6] mb-4 md:mb-6">
              <CheckCircle className="h-6 w-6 md:h-7 md:w-7" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">Boost Confidence</h3>
            <p className="text-sm md:text-base text-gray-300 mb-3 md:mb-4">
              Instant access to data means you&apos;re always prepared, even for unexpected questions or discussion
              topics.
            </p>
            <ul className="space-y-2 md:space-y-3">
              <li className="flex items-start">
                <div className="text-[#FF00D6] mr-2 mt-1 flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 md:w-5 md:h-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <p className="text-sm md:text-base text-gray-300">Eliminate anxiety about forgetting details</p>
              </li>
              <li className="flex items-start">
                <div className="text-[#FF00D6] mr-2 mt-1 flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 md:w-5 md:h-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <p className="text-sm md:text-base text-gray-300">Provide accurate information on demand</p>
              </li>
              <li className="flex items-start">
                <div className="text-[#FF00D6] mr-2 mt-1 flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 md:w-5 md:h-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <p className="text-sm md:text-base text-gray-300">Speak with authority on any topic</p>
              </li>
            </ul>
          </div>

          <div className="bg-[#1a1f29] p-5 md:p-8 rounded-xl shadow-md border border-gray-800 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#242936] flex items-center justify-center text-[#FF00D6] mb-4 md:mb-6">
              <TrendingUp className="h-6 w-6 md:h-7 md:w-7" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">Improve Outcomes</h3>
            <p className="text-sm md:text-base text-gray-300 mb-3 md:mb-4">
              Make better decisions and close deals faster with AI-powered insights and suggestions during meetings.
            </p>
            <ul className="space-y-2 md:space-y-3">
              <li className="flex items-start">
                <div className="text-[#FF00D6] mr-2 mt-1 flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 md:w-5 md:h-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <p className="text-sm md:text-base text-gray-300">Higher conversion rates in sales calls</p>
              </li>
              <li className="flex items-start">
                <div className="text-[#FF00D6] mr-2 mt-1 flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 md:w-5 md:h-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <p className="text-sm md:text-base text-gray-300">More productive team discussions</p>
              </li>
              <li className="flex items-start">
                <div className="text-[#FF00D6] mr-2 mt-1 flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 md:w-5 md:h-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <p className="text-sm md:text-base text-gray-300">Shorter decision cycles across projects</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-[#1a1f29] p-5 md:p-8 rounded-xl shadow-md border border-gray-800">
          <h3 className="text-xl md:text-2xl font-bold text-center text-white mb-6 md:mb-8">Impact on Your Business</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 text-center">
            <div className="p-4 md:p-6 bg-[#242936] rounded-lg border border-gray-700">
              <div className="text-2xl md:text-3xl font-bold text-[#FF00D6] mb-1 md:mb-2">50%</div>
              <p className="text-sm md:text-base text-gray-300">Reduction in meeting preparation time</p>
            </div>

            <div className="p-4 md:p-6 bg-[#242936] rounded-lg border border-gray-700">
              <div className="text-2xl md:text-3xl font-bold text-[#FF00D6] mb-1 md:mb-2">35%</div>
              <p className="text-sm md:text-base text-gray-300">Increase in meeting productivity</p>
            </div>

            <div className="p-4 md:p-6 bg-[#242936] rounded-lg border border-gray-700">
              <div className="text-2xl md:text-3xl font-bold text-[#FF00D6] mb-1 md:mb-2">25%</div>
              <p className="text-sm md:text-base text-gray-300">Faster decision-making process</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BenefitsSection

