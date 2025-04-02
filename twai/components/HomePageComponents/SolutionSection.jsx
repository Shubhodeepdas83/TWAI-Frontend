import { Bot, FileSearch, Brain, Clock } from "lucide-react"
import { MessageSquare, FileText, Lightbulb, Link, Settings } from "lucide-react"

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-[#1a1f29] p-5 md:p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px] border border-gray-800">
      <div className="flex items-start">
        <div className="mt-1 mr-3 md:mr-4 text-[#FF00D6]">{icon}</div>
        <div>
          <h3 className="text-lg md:text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-sm md:text-base text-gray-300">{description}</p>
        </div>
      </div>
    </div>
  )
}

const SolutionSection = () => {
  return (
    <section className="section-padding bg-[#181d26] text-white">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-white text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">
          How JarWiz AI Transforms Your Meetings
        </h2>

        <p className="text-base md:text-xl text-center text-gray-300 w-full md:w-4/5 mx-auto mb-10 md:mb-16">
          A real-time RAG-based AI super-agent that helps you think, speak, and communicate effectively & accurately.
          <br className="hidden md:block" />
          Simply update JarWiz AI with meeting details, relevant documents, and integrations (e.g., Salesforce, CRM).
          <br className="hidden md:block" />
          <br className="hidden md:block" />
          It joins your meeting on any platform, follows the conversation, delivers instant answers, arguments, & action
          plans.
        </p>

        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
          <div className="bg-[#242936] rounded-xl p-5 md:p-6 shadow-md transition-all duration-300 hover:shadow-lg border border-gray-800 flex flex-col items-center text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#1a1f29] flex items-center justify-center text-[#FF00D6] mb-3 md:mb-4">
              <Bot className="h-6 w-6 md:h-8 md:w-8" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">Real-Time AI Assistance</h3>
            <p className="text-sm md:text-base text-gray-300">
              JarWiz listens and provides contextual help when you need it, without disrupting your flow.
            </p>
          </div>

          <div className="bg-[#242936] rounded-xl p-5 md:p-6 shadow-md transition-all duration-300 hover:shadow-lg border border-gray-800 flex flex-col items-center text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#1a1f29] flex items-center justify-center text-[#FF00D6] mb-3 md:mb-4">
              <FileSearch className="h-6 w-6 md:h-8 md:w-8" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">Smart RAG & Web Search</h3>
            <p className="text-sm md:text-base text-gray-300">
              Instantly fetches & displays relevant information from your documents, web or other integrations.
            </p>
          </div>

          <div className="bg-[#242936] rounded-xl p-5 md:p-6 shadow-md transition-all duration-300 hover:shadow-lg border border-gray-800 flex flex-col items-center text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#1a1f29] flex items-center justify-center text-[#FF00D6] mb-3 md:mb-4">
              <Brain className="h-6 w-6 md:h-8 md:w-8" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">Contextual Intelligence</h3>
            <p className="text-sm md:text-base text-gray-300">
              Get insights & suggestions based on ongoing conversation & brainstorm with AI live.
            </p>
          </div>

          <div className="bg-[#242936] rounded-xl p-5 md:p-6 shadow-md transition-all duration-300 hover:shadow-lg border border-gray-800 flex flex-col items-center text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#1a1f29] flex items-center justify-center text-[#FF00D6] mb-3 md:mb-4">
              <Clock className="h-6 w-6 md:h-8 md:w-8" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">Time Saver</h3>
            <p className="text-sm md:text-base text-gray-300">
              AI-Agents reduce prep time, meeting time & follow-up time. Helps get more done in less time.
            </p>
          </div>
        </div> */}
         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
          <FeatureCard
            icon={<MessageSquare size={22} />}
            title="Real-time AI collaborator"
            description="Understands the meeting flow & provides relevant inputs exactly when you need, without disrupting the natural conversation."
          />

          <FeatureCard
            icon={<FileText size={22} />}
            title="1-Click assistance"
            description="Pre-defined quick-action AI-agents. Customized for un-interruptive & summarized assistance that is easy to grasp "
          />

          <FeatureCard
            icon={<FileText size={22} />}
            title="Instant web & doc search"
            description="Searches uploaded documents & web to pull up exact information when needed, saving you from awkward pauses while searching for data."
          />

          <FeatureCard
            icon={<Lightbulb size={22} />}
            title="Contextual suggestions"
            description="Offers live advice based on the discussion, helping you make better decisions and identify opportunities you might have missed."
          />

          <FeatureCard
            icon={<Link size={22} />}
            title="Seamless integration"
            description="Works with all popular meeting platforms like Zoom, Google Meet, Microsoft Teams and other browser based meeting apps."
          />

          <FeatureCard
            icon={<Settings size={22} />}
            title="Customizable AI agents"
            description="Tailor the AI to specific roles or industries, ensuring you get exactly the type of assistance most relevant to your business needs."
          />
        </div>
      </div>
    </section>
  )
}

export default SolutionSection

