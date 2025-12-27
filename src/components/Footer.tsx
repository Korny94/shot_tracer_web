import { Share2, Mail } from "lucide-react";
import {
  SiSnapchat,
  SiFacebook,
  SiYoutube,
  SiTiktok,
  SiX,
  SiInstagram,
} from "@icons-pack/react-simple-icons";

import { Link } from "react-router-dom";

// 3. Footer
const Footer = () => (
  <footer className="bg-black border-t border-white/10 pt-12 pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="col-span-1 md:col-span-1">
          <span className="text-2xl font-bold text-white">
            MAX
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">
              BOGEY
            </span>
          </span>
          <p className="mt-4 text-gray-500 text-sm">
            The ultimate golf companion. Premium features, completely for free.
          </p>
        </div>
        <div>
          <h3 className="text-white font-bold uppercase tracking-wider mb-4">
            Discover
          </h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>
              <Link
                to="/shot-tracer"
                className="hover:text-amber-500 transition-colors"
              >
                Shot Tracer
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-amber-500 transition-colors"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-amber-500 transition-colors">
                Features
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-bold uppercase tracking-wider mb-4">
            Support
          </h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>
              <Link
                to="/faq"
                className="hover:text-amber-500 transition-colors"
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-amber-500 transition-colors"
              >
                Contact Support
              </Link>
            </li>
            <li>
              <Link
                to="/terms"
                className="hover:text-amber-500 transition-colors"
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <Link
                to="/privacy"
                className="hover:text-amber-500 transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-bold uppercase tracking-wider mb-4">
            Connect
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-[250px]">
            <div className="w-8 h-8 rounded-full bg-gray-800 hover:bg-amber-500 transition-colors cursor-pointer flex items-center justify-center">
              <SiInstagram size={14} className="text-white" />
            </div>

            <div className="w-8 h-8 rounded-full bg-gray-800 hover:bg-amber-500 transition-colors cursor-pointer flex items-center justify-center">
              <SiYoutube size={14} className="text-white" />
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-800 hover:bg-amber-500 transition-colors cursor-pointer flex items-center justify-center">
              <SiFacebook size={14} className="text-white" />
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-800 hover:bg-amber-500 transition-colors cursor-pointer flex items-center justify-center">
              <SiTiktok size={14} className="text-white" />
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-800 hover:bg-amber-500 transition-colors cursor-pointer flex items-center justify-center">
              <SiX size={14} className="text-white" />
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-800 hover:bg-amber-500 transition-colors cursor-pointer flex items-center justify-center">
              <SiSnapchat size={14} className="text-white" />
            </div>
            <Link
              to="/contact"
              className="w-8 h-8 rounded-full bg-gray-800 hover:bg-amber-500 transition-colors cursor-pointer flex items-center justify-center"
            >
              <Mail size={14} className="text-white" />
            </Link>
            <div className="w-8 h-8 rounded-full bg-gray-800 hover:bg-amber-500 transition-colors cursor-pointer flex items-center justify-center">
              <Share2 size={14} className="text-white" />
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 pt-8 text-center text-gray-600 text-sm">
        &copy; {new Date().getFullYear()} Korny Applications. All rights
        reserved.
      </div>
    </div>
  </footer>
);
export default Footer;
