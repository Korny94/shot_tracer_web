import { Link } from "react-router-dom";
import { ChevronUp } from "lucide-react";
import Seo from "../components/Seo";

const faqs = [
  {
    question: "What is MaxBogey?",
    answer:
      "MaxBogey is an all-in-one golf platform — a free golf app for Android (iOS coming soon), a free online Shot Tracer for single clips, and TracerStudio, the world's first video editor built for golf.",
  },
  {
    question: "What is TracerStudio?",
    answer: (
      <>
        TracerStudio is the world's first video editing software made
        specifically for golf. Edit whole rounds on a timeline, add shot
        tracers with motion tracking (so they work on handheld footage), drop
        in TV broadcast graphics like scorecards and player cards, mix in
        music, and export one finished YouTube-ready video. Use it in any
        browser — phones and tablets included — or download it for Windows
        (Mac coming soon). Completely free.{" "}
        <Link style={{ color: "#fe9a00" }} to="/golf-video-editor">
          Learn more here.
        </Link>
      </>
    ),
  },
  {
    question: "What's the difference between Shot Tracer and TracerStudio?",
    answer:
      "Shot Tracer is our quick online tool for tracing a single clip in seconds — perfect for social media (it requires a PC or laptop). TracerStudio is the full editing suite for building entire golf videos: multiple clips, motion tracking, broadcast graphics, music, and one export — and it works on any device, phones and tablets included. Both are free.",
  },
  {
    question: "Is TracerStudio really free?",
    answer:
      "Yes. Like everything from MaxBogey, TracerStudio is 100% free — no subscription, no credit card, no watermark fees. Just create a free account and start editing.",
  },
  {
    question: "How much does MaxBogey cost?",
    answer:
      "MaxBogey is completely free of charge, so nothing is stopping you from achieving greatness on the coursea!",
  },
  {
    question: "How can MaxBogey be completely free?",
    answer:
      "MaxBogey is developed and maintained by only two golf enthusiasts who is passionate about the sport. By keeping the team small and focusing on delivering value, we're able to offer the app at a price that's accessible to everyone.",
  },
  {
    question: "What features does MaxBogey offer?",
    answer:
      "MaxBogey includes a wide range of features such as shot tracers, score tracking, shot statistics, GPS mapping of courses, club yardages, practice logs, goal setting, social networking with other golfers, and much more. Visit our Home page for a detailed list.",
  },
  {
    question: "Do I need to create an account to use MaxBogey?",
    answer:
      "While you can use some a lot of features without an account, creating an account allows you to access all features, save your data, and connect with other golfers.",
  },
  {
    question: "How do I subscribe to MaxBogey?",
    answer:
      "You can subscribe by downloading the app from either Google Play Store or very soon the App Store.",
  },
  {
    question: "Is my personal data secure with MaxBogey?",
    answer:
      "Yes, we take your privacy and data security very seriously. We employ industry-standard encryption and security practices to protect your personal information. For more details, please review our Privacy Policy.",
  },
  {
    question: "Which devices is MaxBogey compatible with?",
    answer:
      "MaxBogey is available for Android devices and very soon iOS. You can download the app from Google Play Store and soon the App Store.",
  },
  {
    question: "How can I contact support if I have issues?",
    answer: (
      <>
        If you have any questions or need assistance, feel free to reach out to
        us at{" "}
        <Link style={{ color: "#fe9a00" }} to="/contact">
          contact@maxbogey.com
        </Link>
        . We're here to help!
      </>
    ),
  },
  {
    question: "Does MaxBogey include real-time GPS mapping?",
    answer:
      "Yes, MaxBogey offers real-time GPS mapping of golf courses, allowing you to see distances to hazards, greens, and more. This feature helps you make informed decisions on the course.",
  },
  {
    question: "Can I connect with friends on MaxBogey?",
    answer:
      "Definitely! MaxBogey includes social features that allow you to add friends, share your scores, and message them directly.",
  },
  {
    question: "Will there be updates and new features added?",
    answer:
      "Yes, we're continually working to improve MaxBogey. As a user, you'll receive updates with new features and enhancements regularly. Please contact us if you have any feature requests or suggestions!",
  },
];
const FAQPage = () => (
  <div className="min-h-screen bg-black text-white py-20 px-4">
    <Seo
      title="FAQ — MaxBogey, Shot Tracer & TracerStudio"
      description="Answers about the free MaxBogey golf app, the free online Shot Tracer, and TracerStudio — the world's first golf video editor. Pricing (free!), devices, features and support."
      path="/faq"
    />
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-10 text-center">FAQ</h1>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <details
            key={idx}
            className="group bg-zinc-900 rounded-lg overflow-hidden border border-white/5 open:border-amber-500/50 transition-all"
          >
            <summary className="flex cursor-pointer items-center justify-between p-6 font-medium text-lg hover:text-amber-500 transition-colors">
              {faq.question}
              <span className="transition-transform group-open:rotate-180">
                <ChevronUp size={20} />
              </span>
            </summary>
            <div className="p-6 pt-0 text-gray-400 leading-relaxed border-t border-white/5 mt-2">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  </div>
);

export default FAQPage;
