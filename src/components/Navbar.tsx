import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, AlertTriangle } from "lucide-react";
// import Logo from "../assets/logo.png";

// 2. Navigation
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shot Tracer", path: "/shot-tracer" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];
  const [showModal, setShowModal] = useState(false);
  const isMobile =
    typeof window !== "undefined" &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-xl bg-black/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-6 group">
            <span className="text-2xl font-bold tracking-tighter text-white">
              MAX
              <span
                className="pr-1 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600 
"
              >
                BOGEY
              </span>
            </span>
          </Link>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => {
                    if (link.name === "Shot Tracer" && isMobile) {
                      setShowModal(true);
                    } else {
                      navigate(link.path);
                    }
                  }}
                  className="text-gray-300 hover:text-amber-400 px-3 py-2 rounded-md text-sm font-medium tracking-wide uppercase transition-all hover:glow-text"
                >
                  {link.name}
                </button>
              ))}

              <button
                onClick={() =>
                  window.open(
                    "https://play.google.com/store/apps/details?id=com.rbkorny.maxbogeyapp",
                    "_blank"
                  )
                }
                className="bg-amber-500 text-black px-5 py-2 rounded-full font-bold hover:bg-white transition-colors duration-300 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
              >
                Download App
              </button>
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white p-2"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => {
                  setIsOpen(false);

                  if (link.name === "Shot Tracer" && isMobile) {
                    setShowModal(true);
                  } else {
                    navigate(link.path);
                  }
                }}
                className="text-gray-300 hover:text-amber-400 block w-full px-3 py-4 rounded-md text-base font-bold uppercase text-center border-b border-white/5"
              >
                {link.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {createPortal(
        <AnimatePresence>
          {showModal && !isMobile && (
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
        </AnimatePresence>,
        document.body
      )}
    </nav>
  );
};

export default Navbar;
