import { ChevronUp } from "lucide-react";
const faqs = [
  {
    question: "What is MaxBogey?",
    answer:
      "MaxBogey is an all-in-one golf app designed to provide golfers with every feature they need in a single, affordable platform.",
  },
  {
    question: "How much does MaxBogey cost?",
    answer: "$4.99/month or $29.99/year (Save 49%).",
  },
  {
    question: "Is there a free trial?",
    answer: "Yes! 7-day free trial available.",
  },
  {
    question: "Device compatibility?",
    answer: "Available for both iOS and Android.",
  },
];
const FAQPage = () => (
  <div className="min-h-screen bg-black text-white py-20 px-4">
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
