import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
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
  Globe,
  TriangleRight,
  MapPinned,
  Brain,
  Ruler,
  Flag,
  Route,
  LineChart,
  Camera,
  Scissors,
  NotebookPen,
  Dumbbell,
  BarChart3,
  PieChart,
  Filter,
  CircleDot,
  Sigma,
  Users,
  Gauge,
  Backpack,
  Sliders,
  UserCircle,
  Share,
  ImagePlus,
  Bell,
  Zap,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import { SiArchicad } from "react-icons/si";

import ProcessingImg from "../assets/ProcessTracer2.jpg";

// const features = [
//   {
//     id: 1,
//     icon: Map,
//     title: "Courses",
//     description: "Explore over 42 000 golf courses worldwide.",
//   },
//   {
//     id: 2,
//     icon: Target,
//     title: "Shot Tracer",
//     description: "AI-powered shot tracing for your videos.",
//   }, // Highlighted
//   {
//     id: 3,
//     icon: BarChart2,
//     title: "Scorecard with Map",
//     description: "Visualize your game with interactive maps.",
//   },
//   {
//     id: 4,
//     icon: User,
//     title: "Caddy Feature",
//     description: "Get real-time advice and suggestions.",
//   },
//   {
//     id: 5,
//     icon: Target,
//     title: "Measure Shot",
//     description: "Accurately measure the distance of your shots.",
//   },
//   {
//     id: 6,
//     icon: Map,
//     title: "Distance to Green",
//     description: "Front, center and back green distances.",
//   },
//   {
//     id: 7,
//     icon: Video,
//     title: "Video Analysis",
//     description: "Record and analyze your swing.",
//   },
//   {
//     id: 8,
//     icon: Calendar,
//     title: "Practice Log",
//     description: "Log your practice sessions.",
//   },
//   {
//     id: 9,
//     icon: MessageCircle,
//     title: "Messaging",
//     description: "Chat with friends worldwide.",
//   },
//   {
//     id: 10,
//     icon: Share2,
//     title: "Social Round",
//     description: "View, like and comment on friends' rounds.",
//   },
//   // ... (In a real app, map the rest of your large array here)
// ];

const features = [
  {
    id: 1,
    icon: Globe,
    title: "Golf Courses",
    description: "Access over 42,000 golf courses worldwide.",
  },
  {
    id: 2,
    icon: SiArchicad,
    title: "Shot Tracer",
    description: "Add TV-quality graphics & shot tracers to your golf videos.",
  },
  {
    id: 3,
    icon: MapPinned,
    title: "Smart Scorecard",
    description: "Interactive scorecard with hole maps and key distances.",
  },
  {
    id: 4,
    icon: Brain,
    title: "Virtual Caddie",
    description: "Receive real-time club recommendations on the course.",
  },
  {
    id: 5,
    icon: Ruler,
    title: "Shot Distance",
    description: "Measure shot distances with high accuracy.",
  },
  {
    id: 6,
    icon: Flag,
    title: "Green Distances",
    description: "View front, center, and back distances to the green.",
  },
  {
    id: 7,
    icon: Route,
    title: "Course Mapping",
    description: "See accurate distances to hazards and landing zones.",
  },
  {
    id: 8,
    icon: LineChart,
    title: "Shot Tracking",
    description: "Record shot data to build round statistics.",
  },
  {
    id: 9,
    icon: Camera,
    title: "Video Recording",
    description: "Record your swing for detailed analysis.",
  },
  {
    id: 10,
    icon: Scissors,
    title: "Video Analysis",
    description: "Analyze swings with slow motion and drawing tools.",
  },
  {
    id: 28,
    icon: TriangleRight,
    title: "Green Reading",
    description: "Improve your putting with precise green and slope readings.",
  },

  {
    id: 11,
    icon: NotebookPen,
    title: "Practice Log",
    description: "Log and review your practice sessions.",
  },
  {
    id: 12,
    icon: Dumbbell,
    title: "Practice Mode",
    description: "Improve skills with focused practice and tracking.",
  },
  {
    id: 13,
    icon: BarChart3,
    title: "Game Statistics",
    description: "Analyze performance across all parts of your game.",
  },
  {
    id: 14,
    icon: PieChart,
    title: "Performance Insights",
    description: "Understand trends and identify improvement areas.",
  },
  {
    id: 15,
    icon: Filter,
    title: "Stat Filters",
    description: "Filter statistics by club, distances and more.",
  },
  {
    id: 16,
    icon: CircleDot,
    title: "Putting Stats",
    description: "Track putting accuracy and missed distances.",
  },
  {
    id: 17,
    icon: Sigma,
    title: "Advanced Putting",
    description: "Deep putting analytics for serious improvement.",
  },
  {
    id: 18,
    icon: Users,
    title: "Find Friends",
    description: "Search and connect with golfers worldwide.",
  },
  {
    id: 19,
    icon: Gauge,
    title: "Club Yardages",
    description: "View average distances for each club.",
  },
  {
    id: 20,
    icon: Backpack,
    title: "My Bag",
    description: "Manage and organize your golf clubs.",
  },
  {
    id: 21,
    icon: Sliders,
    title: "Preferences",
    description: "Customize app behavior and display settings.",
  },
  {
    id: 22,
    icon: UserCircle,
    title: "Profile",
    description: "Manage your personal information and stats.",
  },
  {
    id: 23,
    icon: Share,
    title: "Social Rounds",
    description: "View and interact with friends’ completed rounds.",
  },
  {
    id: 24,
    icon: ImagePlus,
    title: "Social Posts",
    description: "Like and comment on posts from your network.",
  },
  {
    id: 25,
    icon: Bell,
    title: "Notifications",
    description: "See all alerts and updates in one place.",
  },
  {
    id: 26,
    icon: Zap,
    title: "Live Alerts",
    description: "Receive instant updates and reminders.",
  },
  {
    id: 27,
    icon: MessageSquare,
    title: "Messaging",
    description: "Chat privately with friends inside the app.",
  },
];

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const isMobile =
    typeof window !== "undefined" &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const navigate = useNavigate();

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
            SHOT TRACER <br />
            <span className=" drop-shadow-[0_0_15px_rgba(245,158,11,0.4)] text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">
              FREE
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
          {/* <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            The all-in-one golf ecosystem. 42,000+ courses, advanced analytics,
            and the revolutionary new Shot Tracer.
          </p> */}
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Add Shot Tracers to Your Golf Videos in Seconds
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            {/* <Link
              to="/shot-tracer"
              className="px-8 py-4 bg-amber-500 text-black font-bold rounded-full hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)]"
            >
              TRY SHOT TRACER
            </Link> */}
            <button
              onClick={() => {
                if (isMobile) {
                  setShowModal(true);
                } else {
                  navigate("/shot-tracer");
                }
              }}
              className="px-8 py-4 bg-amber-500 text-black font-bold rounded-full hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)]"
            >
              TRY NOW
            </button>

            <button
              onClick={() =>
                window.open(
                  "https://play.google.com/store/apps/details?id=com.rbkorny.maxbogeyapp",
                  "_blank",
                )
              }
              className="px-8 py-4 bg-transparent border border-gray-600 text-white font-bold rounded-full hover:border-white hover:bg-white/5 transition-all"
            >
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
              <div className="rounded-3xl border-4 border-amber-500/30 overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.15)] bg-black aspect-[9/16] relative flex items-center justify-center max-h-[85vh] mx-auto ">
                <div className="absolute inset-0 bg-gray-900 animate-pulse opacity-20 z-99"></div>
                <Target size={50} className="text-amber-500 z-99" />
                <p className="ml-4 text-amber-500 font-mono text-sm uppercase tracking-widest z-99 font-bold">
                  Processing Shot Tracer..
                </p>
                <img
                  src={ProcessingImg}
                  alt="App preview"
                  className="absolute inset-0 w-full h-full object-cover opacity-50"
                />
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
                Add TV-quality graphics & shot tracers to your golf videos right
                here on the web, or inside the app. Customize colors, tails, and
                see your ball flight like never before.
              </p>

              <button
                onClick={() => {
                  if (isMobile) {
                    setShowModal(true);
                  } else {
                    navigate("/shot-tracer");
                  }
                }}
                className="inline-flex items-center text-white border-b border-amber-500 pb-1 hover:text-amber-500 transition-colors"
              >
                Launch Web Tool{" "}
                <ChevronUp className="rotate-90 ml-2" size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid - "The Gallery" */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              MAXBOGEY GOLF APP
            </h2>
            <p className="text-gray-500">
              Everything you need. Nothing you don't. On Android and coming soon
              to iOS.
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

          {/* <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm">
              ...and 20+ more features inside the app.
            </p>
          </div> */}
        </div>
      </section>

      <AnimatePresence>
        {showModal && isMobile && (
          <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            {/* Click outside to close */}
            <div
              className="absolute inset-0"
              onClick={() => setShowModal(false)}
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl overflow-hidden"
            >
              {/* Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)]" />

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mb-4 text-amber-500 border border-amber-500/20">
                  <AlertTriangle size={24} />
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                  PC Only Feature
                </h3>

                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  Shot Tracer is currently available only on PC or laptop. You
                  can download the mobile version from the Play Store.
                </p>

                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
                  >
                    Close
                  </button>

                  <a
                    href="https://play.google.com/store/apps/details?id=com.rbkorny.maxbogeyapp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-amber-500 text-black hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20 text-center"
                  >
                    Play Store
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
