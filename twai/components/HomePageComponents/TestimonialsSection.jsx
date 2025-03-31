
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

  return (
    <section id="testimonials" className="section-padding bg-[#0f1217] pt-20 pb-24">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-white">What Our Beta Users Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {testimonials.map((testimonial) => (
            <Card 
              key={testimonial.id} 
              className="bg-[#171b22] border border-gray-800 p-6 h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="mb-4">
                <h3 className="text-xl md:text-2xl font-bold text-white italic">&quot;{testimonial.quote}&quot;</h3>
              </div>
              
              <p className="text-gray-300 mb-6 flex-grow">
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
      </div>
    </section>
  );
};

export default TestimonialsSection;
