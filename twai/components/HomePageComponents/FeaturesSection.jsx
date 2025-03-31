import { MessageSquare, FileText, Lightbulb, Link, Settings } from "lucide-react"

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-[#1a1f29] p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px] border border-gray-800">
      <div className="flex items-start">
        <div className="mt-1 mr-4 text-[#FF00D6]">{icon}</div>
        <div>
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-300">{description}</p>
        </div>
      </div>
    </div>
  )
}

const FeaturesSection = () => {
  return (
    <section id="features" className="section-padding bg-[#0f1217]">
      <div className="container mx-auto">
        <h2 className="section-title text-white animate-fade-in">Key Features</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<MessageSquare size={24} />}
            title="Real-time conversation analysis"
            description="Understands the flow of the meeting and provides relevant inputs exactly when you need them, without disrupting the natural conversation."
          />

          <FeatureCard
            icon={<FileText size={24} />}
            title="1-Click assistance"
            description="Pre-defined quick-action AI-agents. Customized for un-interruptive & summarized assistance that is easy to grasp "
          />

          <FeatureCard
            icon={<FileText size={24} />}
            title="Instant document retrieval"
            description="Accesses uploaded documents to pull up exact information when needed, saving you from awkward pauses while searching for data."
          />

          <FeatureCard
            icon={<Lightbulb size={24} />}
            title="Contextual suggestions and insights"
            description="Offers actionable advice based on the discussion, helping you make better decisions and identify opportunities you might have missed."
          />

          <FeatureCard
            icon={<Link size={24} />}
            title="Seamless integration"
            description="Works with popular meeting platforms like Zoom, Google Meet, Microsoft Teams, and more with just a simple browser extension."
          />

          <FeatureCard
            icon={<Settings size={24} />}
            title="Customizable AI agents"
            description="Tailor the AI to specific roles or industries, ensuring you get exactly the type of assistance most relevant to your business needs."
          />
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection

