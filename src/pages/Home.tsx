import { Link } from "react-router-dom";
import {
  ChevronUp,
  Target,
  BarChart2,
  User,
  Video,
  Calendar,
  MessageCircle,
  Share2,
  Map,
} from "lucide-react";

const features = [
  {
    id: 1,
    icon: Map,
    title: "Courses",
    description: "Explore over 42 000 golf courses worldwide.",
  },
  {
    id: 2,
    icon: Target,
    title: "Shot Tracer",
    description: "AI-powered shot tracing for your videos.",
  }, // Highlighted
  {
    id: 3,
    icon: BarChart2,
    title: "Scorecard with Map",
    description: "Visualize your game with interactive maps.",
  },
  {
    id: 4,
    icon: User,
    title: "Caddy Feature",
    description: "Get real-time advice and suggestions.",
  },
  {
    id: 5,
    icon: Target,
    title: "Measure Shot",
    description: "Accurately measure the distance of your shots.",
  },
  {
    id: 6,
    icon: Map,
    title: "Distance to Green",
    description: "Front, center and back green distances.",
  },
  {
    id: 7,
    icon: Video,
    title: "Video Analysis",
    description: "Record and analyze your swing.",
  },
  {
    id: 8,
    icon: Calendar,
    title: "Practice Log",
    description: "Log your practice sessions.",
  },
  {
    id: 9,
    icon: MessageCircle,
    title: "Messaging",
    description: "Chat with friends worldwide.",
  },
  {
    id: 10,
    icon: Share2,
    title: "Social Round",
    description: "View, like and comment on friends' rounds.",
  },
  // ... (In a real app, map the rest of your large array here)
];

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Gradient/Image Placeholder */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-black to-black z-0"></div>
        <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/carbon-fibre.png')] z-0"></div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-600">
            MASTER YOUR <br />
            <span className=" drop-shadow-[0_0_15px_rgba(245,158,11,0.4)] text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">
              GAME
            </span>
          </h1>
          {/* <h1
            style={{ letterSpacing: 2 }}
            className="text-5xl md:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-600"
          >
            MAX
            <span className="pl-1 drop-shadow-[0_0_15px_rgba(245,158,11,0.4)] text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">
              BOGEY
            </span>
          </h1> */}
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            The all-in-one golf ecosystem. 42,000+ courses, advanced analytics,
            and the revolutionary new Shot Tracer.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              to="/shot-tracer"
              className="px-8 py-4 bg-amber-500 text-black font-bold rounded-full hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)]"
            >
              TRY SHOT TRACER
            </Link>
            <button className="px-8 py-4 bg-transparent border border-gray-600 text-white font-bold rounded-full hover:border-white hover:bg-white/5 transition-all">
              DOWNLOAD APP
            </button>
          </div>
        </div>
      </section>

      {/* Shot Tracer Feature Highlight - "The Showstopper" */}
      <section className="py-24 relative bg-zinc-900 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black via-transparent to-black pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              {/* Aesthetic mock of phone or video player */}
              <div className="rounded-3xl border-4 border-amber-500/30 overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.15)] bg-black aspect-[9/16] relative flex items-center justify-center">
                <div className="absolute inset-0 bg-gray-800 animate-pulse opacity-20"></div>
                <Target size={64} className="text-amber-500" />
                <p className="mt-4 text-amber-500 font-mono text-sm uppercase tracking-widest">
                  Processing Ball Flight...
                </p>
              </div>
            </div>
            <div className="w-full md:w-1/2 text-left">
              <span className="text-amber-500 font-bold tracking-widest uppercase text-sm mb-2 block">
                New Feature
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                PRO-LEVEL SHOT TRACING. <br />
                INSTANTLY.
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Add TV-quality shot tracers to your golf videos right here on
                the web, or inside the app. Customize colors, tails, and see
                your ball flight like never before.
              </p>
              <Link
                to="/shot-tracer"
                className="inline-flex items-center text-white border-b border-amber-500 pb-1 hover:text-amber-500 transition-colors"
              >
                Launch Web Tool{" "}
                <ChevronUp className="rotate-90 ml-2" size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid - "The Gallery" */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              THE FULL ARSENAL
            </h2>
            <p className="text-gray-500">
              Everything you need. Nothing you don't.
            </p>
          </div>

          {/* Dense Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group relative bg-zinc-900/50 border border-white/5 rounded-xl p-6 hover:bg-zinc-800/80 hover:border-amber-500/50 transition-all duration-300"
              >
                <div className="absolute top-4 right-4 text-gray-700 group-hover:text-amber-500 transition-colors">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 mt-4">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm">
              ...and 20+ more features inside the app.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
