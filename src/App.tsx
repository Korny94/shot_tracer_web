import { Routes, Route, useLocation } from "react-router-dom";
import ScrollToTop from "./components/components";
import Home from "./pages/Home";
import ShotTracer from "./pages/ShotTracer";
import AboutPage from "./pages/AboutPage";
import TermsPage from "./pages/TermsPage";
import ContactPage from "./pages/ContactPage";
import FAQPage from "./pages/FAQPage";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import "./index.css";

const App = () => {
  const location = useLocation();
  const isShotTracer = location.pathname === "/shot-tracer";

  return (
    <div
      className={`flex flex-col min-h-screen bg-black ${
        isShotTracer ? "overflow-hidden h-screen" : ""
      }`}
    >
      {!isShotTracer && <Navbar />}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shot-tracer" element={<ShotTracer />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<TermsPage />} />
        </Routes>
      </main>

      {!isShotTracer && <Footer />}
      {!isShotTracer && <ScrollToTop />}
    </div>
  );
};

export default App;
