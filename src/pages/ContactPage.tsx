import { useState } from "react";
import { Send } from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.message) {
      setStatus("Please fill in all fields.");
      return;
    }
    if (!validateEmail(formData.email)) {
      setStatus("Please enter a valid email.");
      return;
    }

    // Simulate API call
    setStatus("Sending...");
    setTimeout(() => {
      setStatus("Message sent successfully! We will get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4 flex items-center justify-center">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">GET IN TOUCH</h1>
          <p className="text-gray-500">
            Bug reports, feature requests, or just to say hi.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900/50 p-8 rounded-2xl border border-white/10 backdrop-blur-sm"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">
                NAME
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-black border border-gray-700 rounded-lg p-4 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
                placeholder="Tiger Woods"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">
                EMAIL
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full bg-black border border-gray-700 rounded-lg p-4 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
                placeholder="tiger@pga.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">
                MESSAGE
              </label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full bg-black border border-gray-700 rounded-lg p-4 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
                placeholder="How do I fix my slice?"
              ></textarea>
            </div>

            {status && (
              <div
                className={`text-sm text-center ${
                  status.includes("success")
                    ? "text-green-500"
                    : "text-amber-500"
                }`}
              >
                {status}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-amber-500 text-black font-bold py-4 rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2"
            >
              SEND MESSAGE <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
