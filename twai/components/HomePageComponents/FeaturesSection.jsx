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

const FeaturesSection = () => {
  return (
    <section id="features" className="section-padding bg-[#0f1217]">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-white text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 animate-fade-in">
          Key Features
        </h2>

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

export default FeaturesSection

