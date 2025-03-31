
import { ClipboardX } from "lucide-react";

const ProblemSection = () => {
  return (
    <section className="section-padding bg-[#0f1217] text-white">
      <div className="container mx-auto">
        <h2 className="section-title text-white">The Hidden Cost of Ineffective Meetings</h2>
        
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="bg-[#1a1f29] p-8 rounded-xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 opacity-10">
              <ClipboardX size={200} className="text-jarwiz-400" />
            </div>
            <div className="grid gap-6 relative z-10">
              <div className="bg-[#242936] p-5 rounded-lg shadow-sm border border-gray-800">
                <h3 className="text-xl font-semibold text-[#FF00D6] mb-2">Time Wasted before meetings</h3>
                <p className="text-gray-300">Hours spent preparing materials that may never be referenced during the meeting.</p>
              </div>
              <div className="bg-[#242936] p-5 rounded-lg shadow-sm border border-gray-800">
                <h3 className="text-xl font-semibold text-[#FF00D6] mb-2">Information Overload during meetings</h3>
                <p className="text-gray-300">Struggling to recall key data points when they are most needed in discussions.</p>
              </div>
              <div className="bg-[#242936] p-5 rounded-lg shadow-sm border border-gray-800">
                <h3 className="text-xl font-semibold text-[#FF00D6] mb-2">Lost Opportunities after meetings</h3>
                <p className="text-gray-300">Missing crucial insights that could have led to better business decisions.</p>
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-lg text-gray-300 mb-6">
              Professionals waste hours each week preparing for and following up on meetings, only to struggle with information overload and forgotten details during the discussion.
            </p>
            <p className="text-lg text-gray-300 mb-6">
              This leads to lost opportunities, delayed decisions, and unnecessary stress.
            </p>
            <div className="bg-[#1a1f29] border border-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-3">The Average Professional:</h3>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-[#242936] flex items-center justify-center text-[#FF00D6] mr-4">
                    12+
                  </div>
                  <p className="text-gray-300">Hours per week in meetings</p>
                </li>
                <li className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-[#242936] flex items-center justify-center text-[#FF00D6] mr-4">
                    4+
                  </div>
                  <p className="text-gray-300">Hours preparing for those meetings</p>
                </li>
                <li className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-[#242936] flex items-center justify-center text-[#FF00D6] mr-4">
                    65%
                  </div>
                  <p className="text-gray-300">Feel meetings are unproductive</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
