
import { Bot, FileSearch, Brain, Clock } from "lucide-react";

const SolutionSection = () => {
  return (
    <section className="section-padding bg-[#181d26] text-white">
      <div className="container mx-auto">
        <h2 className="section-title text-white">How JarWiz AI Transforms Your Meetings</h2>
        
        <p className="text-xl text-center text-gray-300 max-w-3xl mx-auto mb-16">
          JarWiz AI acts as your real-time co-pilot, listening to the conversation, accessing your documents, and delivering instant insights and suggestions. It ensures you never miss a detail, saves you time, and boosts your confidence.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-[#242936] rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-lg border border-gray-800 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#1a1f29] flex items-center justify-center text-[#FF00D6] mb-4">
              <Bot className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Real-Time Assistant</h3>
            <p className="text-gray-300">
              JarWiz listens and provides contextual help exactly when you need it, without disrupting your flow.
            </p>
          </div>
          
          <div className="bg-[#242936] rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-lg border border-gray-800 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#1a1f29] flex items-center justify-center text-[#FF00D6] mb-4">
              <FileSearch className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Smart Document Search</h3>
            <p className="text-gray-300">
              Instantly access relevant information from your documents without leaving your meeting.
            </p>
          </div>
          
          <div className="bg-[#242936] rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-lg border border-gray-800 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#1a1f29] flex items-center justify-center text-[#FF00D6] mb-4">
              <Brain className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Contextual Intelligence</h3>
            <p className="text-gray-300">
              Get insights and suggestions based on the conversation context and your business needs.
            </p>
          </div>
          
          <div className="bg-[#242936] rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-lg border border-gray-800 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#1a1f29] flex items-center justify-center text-[#FF00D6] mb-4">
              <Clock className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Time Saver</h3>
            <p className="text-gray-300">
              Reduce meeting prep and follow-up time with automatic summaries and action item tracking.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
