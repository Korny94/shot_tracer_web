import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import Seo from "../components/Seo";
import TutorialVideo, {
  SHOT_TRACER_TUTORIAL_ID,
  TRACERSTUDIO_TUTORIAL_ID,
} from "../components/TutorialVideo";
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
  Clapperboard,
  Sparkles,
  Wand2,
  Tv,
  Music,
  Download,
  Smartphone,
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
      <Seo
        title="Shot Tracer Free Online + Golf Video Editor | MaxBogey"
        description="Add shot tracers to your golf videos for free — trace a single clip online in seconds, or build entire YouTube golf videos with TracerStudio, the world's first golf video editor. Plus the free MaxBogey golf app for Android."
        path="/"
      />
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-20">
        {/* Background Gradient/Image Placeholder */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-black to-black z-0"></div>
        <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/carbon-fibre.png')] z-0"></div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <Link
            to="/golf-video-editor"
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-400 text-xs md:text-sm font-bold tracking-wide uppercase hover:bg-amber-500/20 transition-colors"
          >
            <Sparkles size={14} /> New: TracerStudio — the world's first golf
            video editor →
          </Link>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-600">
            MAX
            <span className="pr-2 drop-shadow-[0_0_15px_rgba(245,158,11,0.4)] text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">
              BOGEY
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
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Shot tracers, a full golf video editor, and an all-in-one golf app.
            Everything a golfer needs — completely free.
          </p>

          {/* Tool picker — landing-page style */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
            {/* Shot Tracer */}
            <div className="flex flex-col bg-black/60 backdrop-blur border border-white/10 rounded-2xl p-7 hover:border-gray-400/60 transition-colors">
              <div className="flex items-center gap-3 mb-3 text-gray-300">
                <Video size={22} />
                <h2 className="text-lg font-bold text-white">Shot Tracer</h2>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-6 flex-grow">
                Trace a single golf clip in seconds. Upload, trace, download —
                perfect for Instagram and TikTok.
              </p>
              <button
                onClick={() => {
                  if (isMobile) {
                    setShowModal(true);
                  } else {
                    navigate("/shot-tracer");
                  }
                }}
                className="w-full py-3 px-4 rounded-full font-bold text-sm bg-zinc-800 text-white hover:bg-white hover:text-black transition-colors text-center"
              >
                TRY SHOT TRACER
              </button>
            </div>

            {/* TracerStudio — the flagship */}
            <div className="relative flex flex-col bg-black/60 backdrop-blur border border-amber-500/50 rounded-2xl p-7 shadow-[0_0_30px_rgba(245,158,11,0.12)]">
              <span className="absolute -top-3 left-6 px-3 py-0.5 bg-amber-500 text-black text-xs font-bold rounded-full uppercase tracking-wider">
                <Sparkles className="inline -mt-0.5 mr-1" size={11} />
                New
              </span>
              <div className="flex items-center gap-3 mb-3 text-amber-500">
                <Clapperboard size={22} />
                <h2 className="text-lg font-bold text-white">Tracer Studio</h2>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-6 flex-grow">
                Build entire YouTube golf videos — tracers, TV graphics, music,
                one export. Works on any device, right in the browser.
              </p>
              <a
                href="https://maxbogey.com/tracerstudio/"
                className="w-full py-3 px-4 rounded-full font-bold text-sm bg-amber-500 text-black hover:bg-white transition-colors shadow-lg shadow-amber-500/20 text-center"
              >
                TRY TRACERSTUDIO
              </a>
              <Link
                to="/golf-video-editor"
                className="mt-3 text-center text-xs text-gray-500 hover:text-amber-500 transition-colors"
              >
                Learn more →
              </Link>
            </div>

            {/* MaxBogey App */}
            <div className="flex flex-col bg-black/60 backdrop-blur border border-white/10 rounded-2xl p-7 hover:border-gray-400/60 transition-colors">
              <div className="flex items-center gap-3 mb-3 text-gray-300">
                <Smartphone size={22} />
                <h2 className="text-lg font-bold text-white">MaxBogey App</h2>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-6 flex-grow">
                The all-in-one golf app: 42,000+ courses with GPS, smart
                scorecard, stats and more. Android now, iOS soon.
              </p>
              <a
                href="https://play.google.com/store/apps/details?id=com.rbkorny.maxbogeyapp"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-full font-bold text-sm bg-zinc-800 text-white hover:bg-white hover:text-black transition-colors text-center"
              >
                DOWNLOAD APP
              </a>
            </div>
          </div>

          <p className="mt-6 text-sm text-gray-600">
            100% free · No watermarks · No subscriptions
          </p>
        </div>
      </section>

      {/* TracerStudio - "The Flagship" */}
      <section className="py-24 relative bg-black overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-amber-500 font-bold tracking-widest uppercase text-sm mb-3">
              <Sparkles size={14} /> World Premiere
            </span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-600">
              TRACER
              <span className="pr-2 drop-shadow-[0_0_15px_rgba(245,158,11,0.4)] text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">
                STUDIO
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              The first video editor ever built for golf. Cut whole rounds on a
              timeline, trace every shot — even handheld footage, thanks to
              motion tracking — add TV broadcast graphics and music, and export
              one finished YouTube video. Free, like everything we make.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[
              {
                icon: Clapperboard,
                title: "Full Timeline Editor",
                text: "Cut, split, trim and reorder whole rounds — not just one clip.",
              },
              {
                icon: Wand2,
                title: "Motion Tracking",
                text: "Tracers stay locked on target even when the camera is handheld.",
              },
              {
                icon: Tv,
                title: "TV Broadcast Graphics",
                text: "Player cards, scorecards, distance counters, wind and more.",
              },
              {
                icon: Music,
                title: "Music & One Export",
                text: "Mix in music, then export the whole video in original quality.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-zinc-900/60 border border-white/5 rounded-xl p-6 hover:border-amber-500/50 transition-colors"
              >
                <f.icon className="text-amber-500 mb-3" size={24} />
                <h3 className="font-bold text-white mb-1">{f.title}</h3>
                <p className="text-sm text-gray-400">{f.text}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <a
              href="https://maxbogey.com/tracerstudio/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-black font-bold rounded-full hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
            >
              <Clapperboard size={20} /> OPEN TRACERSTUDIO
            </a>
            <a
              href="https://maxbogey.com/tracerstudio/TracerStudio.zip"
              className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border border-gray-600 text-white font-bold rounded-full hover:border-white hover:bg-white/5 transition-all"
            >
              <Download size={20} /> DOWNLOAD FOR WINDOWS
            </a>
            <Link
              to="/golf-video-editor"
              className="text-gray-400 hover:text-amber-500 transition-colors font-medium"
            >
              Learn more →
            </Link>
          </div>
          <p className="mt-4 text-center text-sm text-gray-600">
            Runs in your browser or on Windows · macOS coming soon · 100% free
          </p>
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

      {/* Tutorial Videos - "How It Works" */}
      <section className="py-24 bg-black relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-amber-500 font-bold tracking-widest uppercase text-sm mb-2 block">
              Watch & Learn
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              HOW IT WORKS
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Two free tools, two quick tutorials. Pick the one that matches
              what you're making.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Shot Tracer tutorial */}
            <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 rounded-full bg-zinc-800 border border-white/10 text-gray-300 text-xs font-bold uppercase tracking-wider">
                  Shot Tracer
                </span>
                <h3 className="text-lg font-bold text-white">
                  Trace a single clip
                </h3>
              </div>
              <p className="text-gray-500 text-sm mb-5">
                The quick online tool: upload one shot, add a tracer and
                graphics, download. Perfect for social clips.
              </p>
              <TutorialVideo
                videoId={SHOT_TRACER_TUTORIAL_ID}
                title="Shot Tracer tutorial: add a shot tracer to a golf clip in seconds"
              />
            </div>

            {/* TracerStudio tutorial */}
            <div className="relative bg-zinc-900/50 border border-amber-500/40 rounded-2xl p-6 md:p-8 shadow-[0_0_30px_rgba(245,158,11,0.08)]">
              <span className="absolute -top-3 left-6 px-3 py-0.5 bg-amber-500 text-black text-xs font-bold rounded-full uppercase tracking-wider">
                <Sparkles className="inline -mt-0.5 mr-1" size={11} />
                New
              </span>
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  TracerStudio
                </span>
                <h3 className="text-lg font-bold text-white">
                  Build an entire golf video
                </h3>
              </div>
              <p className="text-gray-500 text-sm mb-5">
                The full editor: timeline, tracers with motion tracking, TV
                graphics, music and one-click export.{" "}
                <Link
                  to="/golf-video-editor"
                  className="text-amber-500 hover:text-amber-400"
                >
                  Learn more →
                </Link>
              </p>
              <TutorialVideo
                videoId={TRACERSTUDIO_TUTORIAL_ID}
                title="TracerStudio tutorial: build your entire golf video, step by step"
              />
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

      <Modal
        open={showModal && isMobile}
        onClose={() => setShowModal(false)}
        label="PC only feature"
      >
        <div className="relative bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full shadow-2xl overflow-hidden">
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
              Shot Tracer is currently available only on PC or laptop. You can
              download the mobile version from the Play Store.
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
        </div>
      </Modal>
    </div>
  );
};

export default Home;
