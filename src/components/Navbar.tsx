import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
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

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-xl bg-black/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-6 group">
            {/* <img
              style={{ filter: "invert(100%)", height: 32 }}
              src={Logo}
            ></img> */}
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
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-gray-300 hover:text-amber-400 px-3 py-2 rounded-md text-sm font-medium tracking-wide uppercase transition-all hover:glow-text"
                >
                  {link.name}
                </Link>
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
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-amber-400 block px-3 py-4 rounded-md text-base font-bold uppercase text-center border-b border-white/5"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
