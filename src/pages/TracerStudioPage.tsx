import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import TutorialVideo, {
  TRACERSTUDIO_TUTORIAL_ID,
} from "../components/TutorialVideo";
import {
  Award,
  Clapperboard,
  Crosshair,
  Download,
  Film,
  Globe,
  Layers,
  Monitor,
  Music,
  Rocket,
  Scissors,
  Sparkles,
  Tv,
  Video,
  Wand2,
  Zap,
} from "lucide-react";

const TRACERSTUDIO_APP_URL = "https://maxbogey.com/tracerstudio/";
const WINDOWS_DOWNLOAD_URL = "https://maxbogey.com/tracerstudio/TracerStudio.zip";

const features = [
  {
    icon: Crosshair,
    title: "Broadcast-Quality Shot Tracers",
    description:
      "Four tracer styles — solid, comet, hybrid and ball — with glow, taper, ground shadow and apex indicators. Shape true draw and fade curves with two drag handles.",
  },
  {
    icon: Wand2,
    title: "Motion Tracking",
    description:
      "Filmed handheld? No problem. Pin one reference point, hit Analyze, and your tracers and graphics stay locked to the world while the camera moves, pans and zooms.",
  },
  {
    icon: Tv,
    title: "TV Broadcast Graphics",
    description:
      "Player cards, scorecards, distance counters, hole info, wind, tickers and a spinning hole marker for putts — the same look you see on tour broadcasts, in a few clicks.",
  },
  {
    icon: Scissors,
    title: "Full Timeline Editor",
    description:
      "Cut, split, trim and reorder clips, change speed, and step frame by frame to nail the exact moment of impact. Built for whole rounds, not just single shots.",
  },
  {
    icon: Music,
    title: "Music & Sound",
    description:
      "Drop in music and sound effects with smooth fades, mix them with the original clip audio, and control volume per clip — no separate audio editor needed.",
  },
  {
    icon: Film,
    title: "One-Click Export",
    description:
      "Export the entire video — every tracer, graphic and track — in original resolution and frame rate with sound. MP4 (H.264/H.265) or GIF. Ready for YouTube.",
  },
  {
    icon: Layers,
    title: "Themes & Presets",
    description:
      "Color-theme every graphic in one place, save your own presets, and give your channel a consistent, professional identity across every video.",
  },
  {
    icon: Monitor,
    title: "Any Device, Anywhere",
    description:
      "Edit in the browser on your phone, tablet, laptop or desktop — or download the Windows app and work fully offline. Your footage never leaves your device. macOS app coming soon.",
  },
  {
    icon: Zap,
    title: "Free. Actually Free.",
    description:
      "No subscription, no watermark ransom, no trial countdown. Like everything MaxBogey makes, TracerStudio is 100% free.",
  },
];

const steps = [
  {
    n: "1",
    title: "Drop in your clips",
    text: "One file with the whole round or dozens of clips — they line up on the timeline automatically.",
  },
  {
    n: "2",
    title: "Trace your shots",
    text: "Click impact, click landing, shape the curve. Turn on motion tracking for handheld footage.",
  },
  {
    n: "3",
    title: "Add the TV look",
    text: "Scorecards, player cards, distance counters and music — dragged, scaled and timed in seconds.",
  },
  {
    n: "4",
    title: "Export once, upload",
    text: "The full video renders in original quality with sound. Straight to YouTube.",
  },
];

const faqs = [
  {
    q: "Is TracerStudio really free?",
    a: "Yes — 100% free, like everything from MaxBogey. Create a free account and start editing. No subscription, no credit card, no watermark fees.",
  },
  {
    q: "What makes TracerStudio different from other shot tracer apps?",
    a: "Other apps trace one clip at a time. TracerStudio is the world's first complete video editor built for golf: you cut, trace, add broadcast graphics and music, and export the entire finished YouTube video in one program.",
  },
  {
    q: "Does it work with handheld or moving camera footage?",
    a: "Yes. Built-in motion tracking pins your tracers and graphics to the world, so they stay put while the camera pans, shakes or zooms.",
  },
  {
    q: "Do I need After Effects or Premiere?",
    a: "No. TracerStudio replaces the whole stack — tracing, graphics, editing, music and export live in one app.",
  },
  {
    q: "Which devices does it run on?",
    a: "Everything. TracerStudio runs in any modern browser — phones and tablets included — so you can edit right from the course. On Windows you can also download the desktop app and work fully offline; a macOS app is coming soon.",
  },
];

const TracerStudioPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Seo
        title="TracerStudio — Free Golf Video Editor with Shot Tracers & TV Graphics | MaxBogey"
        description="The world's first video editor built for golf. Add shot tracers with motion tracking, TV broadcast graphics and music, then export your whole YouTube golf video in one go — 100% free. In your browser or on Windows."
        path="/golf-video-editor"
      />

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-black to-black z-0"></div>
        <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/carbon-fibre.png')] z-0"></div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-400 text-xs font-bold tracking-widest uppercase mb-6">
            <Award size={14} /> World's First — By MaxBogey
          </span>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-600">
            TRACER
            <span className="pr-2 drop-shadow-[0_0_15px_rgba(245,158,11,0.4)] text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">
              STUDIO
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto font-semibold">
            The first video editor ever built for golf.
          </p>
          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
            Create entire YouTube golf videos in one place — shot tracers,
            TV broadcast graphics, music and editing, finished in a few clicks.
            Completely free.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <a
              href={TRACERSTUDIO_APP_URL}
              className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-black font-bold rounded-full hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)]"
            >
              <Rocket size={20} /> LAUNCH IN BROWSER
            </a>
            <a
              href={WINDOWS_DOWNLOAD_URL}
              className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border border-gray-600 text-white font-bold rounded-full hover:border-white hover:bg-white/5 transition-all"
            >
              <Download size={20} /> DOWNLOAD FOR WINDOWS
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            100% free · No watermarks · Works on any device in the browser ·
            macOS app coming soon
          </p>
        </div>
      </section>

      {/* Why it's revolutionary */}
      <section className="py-20 bg-zinc-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-amber-500 font-bold tracking-widest uppercase text-sm mb-2 block">
            A New Category
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            NOTHING LIKE THIS HAS EXISTED BEFORE
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Every other tool traces one shot at a time and leaves the rest of
            the video to you. TracerStudio is a complete editing suite made
            for golf: import a whole round, trace every shot, drop in the
            graphics you see on tour broadcasts, add your music, and export
            one finished, YouTube-ready video. What used to take After
            Effects, Premiere and hours of keyframing now takes a few clicks.
          </p>
        </div>
      </section>

      {/* Feature grid */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-amber-500 font-bold tracking-widest uppercase text-sm mb-2 block">
              Everything In One Program
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              BUILT FOR GOLF CREATORS
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              From your first swing clip to a polished YouTube upload — no
              other software required.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="group relative bg-zinc-900/50 border border-white/5 rounded-xl p-6 hover:bg-zinc-800/80 hover:border-amber-500/50 transition-all duration-300"
              >
                <div className="text-amber-500 mb-4">
                  <f.icon size={28} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {f.description}
                </p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-zinc-900 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-amber-500 font-bold tracking-widest uppercase text-sm mb-2 block">
              From Round To Upload
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              HOW IT WORKS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.n} className="text-center px-2">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 font-black text-xl">
                  {s.n}
                </div>
                <h3 className="font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tutorial video */}
      <section className="py-24 bg-black relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-amber-500 font-bold tracking-widest uppercase text-sm mb-2 block">
              <Clapperboard className="inline mr-2 -mt-1" size={16} />
              Watch &amp; Learn
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              TRACERSTUDIO TUTORIAL
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              See how a full golf video comes together — clips, tracers,
              graphics, music and export — from start to finish.
            </p>
          </div>
          <TutorialVideo
            videoId={TRACERSTUDIO_TUTORIAL_ID}
            title="TracerStudio tutorial: build your entire golf video, step by step"
          />
        </div>
      </section>

      {/* Which tool is for me? */}
      <section className="py-24 bg-zinc-900 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              WHICH TOOL IS RIGHT FOR YOU?
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Both are free. Pick by what you're making today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/60 border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4 text-gray-300">
                <Video size={24} />
                <h3 className="text-xl font-bold text-white">Shot Tracer</h3>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                The fastest way to trace a single clip. Upload one shot, add a
                tracer and graphics, download. Perfect for a quick post to
                Instagram, TikTok or your group chat. (PC or laptop only.)
              </p>
              <Link
                to="/shot-tracer"
                className="inline-flex items-center text-white border-b border-gray-500 pb-1 hover:text-amber-500 hover:border-amber-500 transition-colors"
              >
                Trace a single clip →
              </Link>
            </div>

            <div className="bg-black/60 border border-amber-500/40 rounded-2xl p-8 shadow-[0_0_30px_rgba(245,158,11,0.08)] relative">
              <span className="absolute -top-3 left-6 px-3 py-0.5 bg-amber-500 text-black text-xs font-bold rounded-full uppercase tracking-wider">
                <Sparkles className="inline -mt-0.5 mr-1" size={11} />
                New
              </span>
              <div className="flex items-center gap-3 mb-4 text-amber-500">
                <Clapperboard size={24} />
                <h3 className="text-xl font-bold text-white">TracerStudio</h3>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                The full studio. Edit whole rounds on a timeline, trace every
                shot (even handheld, thanks to motion tracking), add broadcast
                graphics and music, and export one finished YouTube video.
                Works on any device — phones and tablets included.
              </p>
              <a
                href={TRACERSTUDIO_APP_URL}
                className="inline-flex items-center text-white border-b border-amber-500 pb-1 hover:text-amber-500 transition-colors"
              >
                Open TracerStudio →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-black relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              FREQUENTLY ASKED QUESTIONS
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group bg-zinc-900/50 border border-white/5 rounded-xl p-6 open:border-amber-500/40"
              >
                <summary className="cursor-pointer font-bold text-white list-none flex justify-between items-center">
                  {f.q}
                  <span className="text-amber-500 group-open:rotate-45 transition-transform text-xl leading-none">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-gray-400 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-zinc-900 relative text-center">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        <div className="max-w-3xl mx-auto px-4">
          <Globe className="mx-auto text-amber-500 mb-6" size={36} />
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            YOUR NEXT GOLF VIDEO STARTS HERE
          </h2>
          <p className="text-gray-400 text-lg mb-10">
            100% free. Nothing to lose except boring footage.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a
              href={TRACERSTUDIO_APP_URL}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 text-black font-bold rounded-full hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
            >
              <Rocket size={20} /> LAUNCH IN BROWSER
            </a>
            <a
              href={WINDOWS_DOWNLOAD_URL}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-gray-600 text-white font-bold rounded-full hover:border-white hover:bg-white/5 transition-all"
            >
              <Download size={20} /> DOWNLOAD FOR WINDOWS
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TracerStudioPage;
