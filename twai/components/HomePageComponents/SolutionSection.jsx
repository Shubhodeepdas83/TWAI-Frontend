
import { Bot, FileSearch, Brain, Clock } from "lucide-react";

const SolutionSection = () => {
  return (
    <section className="section-padding bg-[#181d26] text-white">
      <div className="container mx-auto">
        <h2 className="section-title text-white">How JarWiz AI Transforms Your Meetings</h2>
        
        <p className="text-xl text-center text-gray-300 w-4/5 mx-auto mb-16">
          A real-time RAG-based AI super-agent that helps you think, speak, and communicate effectively & accurately./n         
          Simply update JarWiz AI with meeting details, relevant documents, and integrations (e.g., Salesforce, CRM).
          <br /><br />
          It joins your meeting on any platform, follows the conversation, delivers instant answers, arguments, & action plans.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-[#242936] rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-lg border border-gray-800 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#1a1f29] flex items-center justify-center text-[#FF00D6] mb-4">
              <Bot className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Real-Time AI Assistance</h3>
            <p className="text-gray-300">
              JarWiz listens and provides contextual help when you need it, without disrupting your flow.
            </p>
          </div>
          
          <div className="bg-[#242936] rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-lg border border-gray-800 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#1a1f29] flex items-center justify-center text-[#FF00D6] mb-4">
              <FileSearch className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Smart RAG & Web Search</h3>
            <p className="text-gray-300">
              Instantly fetches & displays relevant information from your documents, web or other integrations. 
            </p>
          </div>
          
          <div className="bg-[#242936] rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-lg border border-gray-800 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#1a1f29] flex items-center justify-center text-[#FF00D6] mb-4">
              <Brain className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Contextual Intelligence</h3>
            <p className="text-gray-300">
              Get insights & suggestions based on ongoing conversation & brainstorm with AI live.
            </p>
          </div>
          
          <div className="bg-[#242936] rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-lg border border-gray-800 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#1a1f29] flex items-center justify-center text-[#FF00D6] mb-4">
              <Clock className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Time Saver</h3>
            <p className="text-gray-300">
              AI-Agents reduce prep time, meeting time & follow-up time. Helps get more done in less time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
