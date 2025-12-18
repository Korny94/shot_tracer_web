import { MessageCircle, User } from "lucide-react";

const aboutContent = [
  {
    title: "I am MaxBogey!",
    description:
      "As a 30-year-old golf enthusiast from Norway, I was frustrated by expensive, fragmented golf apps. I wanted one platform for everything.",
  },
  {
    title: "Building a Better App",
    description:
      "Leveraging my programming skills, I built MaxBogey—by golfers, for golfers.",
  },
  {
    title: "The Vision",
    description: "To make golf more enjoyable and accessible for everyone.",
  },
];

const AboutPage = () => (
  <div className="min-h-screen bg-black text-white py-20 px-4">
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div>
        <h1 className="text-5xl font-black mb-8 leading-tight">
          BUILT BY A <br />
          <span className="text-amber-500">GOLFER.</span>
        </h1>
        <div className="space-y-8">
          {aboutContent.map((item, idx) => (
            <div key={idx} className="border-l border-gray-700 pl-6">
              <h3 className="text-xl font-bold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="relative">
        <div className="absolute inset-0 bg-amber-500 blur-[100px] opacity-20"></div>
        <div className="relative bg-zinc-900 p-8 rounded-2xl border border-white/10 shadow-2xl">
          <MessageCircle size={48} className="text-amber-500 mb-6" />
          <h3 className="text-2xl font-bold mb-4">
            "Let's improve our game together."
          </h3>
          <p className="text-gray-400 mb-6">
            Join me on this journey to make golf more enjoyable and accessible
            for everyone.
          </p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-700 rounded-full overflow-hidden">
              {/* Founder Image Placeholder */}
              <User className="w-full h-full p-2 text-gray-400" />
            </div>
            <div>
              <p className="font-bold text-white">Founder</p>
              <p className="text-xs text-amber-500 uppercase tracking-wider">
                MaxBogey
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AboutPage;
