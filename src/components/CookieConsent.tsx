import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cookie } from "lucide-react";

/**
 * GDPR / ePrivacy compliant cookie consent banner.
 *
 * Google Analytics is ONLY loaded after the visitor clicks "Accept". Choosing
 * "Reject" keeps analytics completely off (and disables GA if it was loaded
 * earlier in the session). The decision is stored in localStorage and can be
 * changed at any time via the "Cookie settings" link in the footer, which
 * dispatches the `open-cookie-settings` window event this component listens for.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  Your GA4 Measurement ID is already set below (G-RLDK09FJWV).
 *
 *  IMPORTANT: the old hard-coded gtag.js / Google Analytics <script> tags have
 *  been REMOVED from index.html (use the corrected index.html provided), so
 *  analytics now loads ONLY through this component — after consent.
 * ─────────────────────────────────────────────────────────────────────────────
 */
const GA_MEASUREMENT_ID = "G-RLDK09FJWV";

const CONSENT_KEY = "cookie_consent_v1";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    __gaLoaded?: boolean;
  }
}

const isConfigured = () =>
  GA_MEASUREMENT_ID.startsWith("G-") && !GA_MEASUREMENT_ID.includes("XXXX");

function loadGoogleAnalytics() {
  if (typeof window === "undefined" || window.__gaLoaded) return;
  if (!isConfigured()) return; // no real ID yet → nothing to load
  window.__gaLoaded = true;

  // Re-enable in case it was disabled earlier this session.
  (window as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`] = false;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  // anonymize_ip keeps visitor IPs from being stored in full (privacy best practice).
  window.gtag("config", GA_MEASUREMENT_ID, { anonymize_ip: true });
}

function disableGoogleAnalytics() {
  if (typeof window === "undefined") return;
  // Google reads this flag and stops sending any data for the property.
  (window as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false); // drives slide/fade animation

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(CONSENT_KEY);
    } catch {
      stored = null;
    }

    if (stored === "granted") {
      loadGoogleAnalytics();
    } else if (stored !== "denied") {
      setVisible(true);
    }

    const reopen = () => setVisible(true);
    window.addEventListener("open-cookie-settings", reopen);
    return () => window.removeEventListener("open-cookie-settings", reopen);
  }, []);

  useEffect(() => {
    if (visible) {
      const raf = requestAnimationFrame(() => setShow(true));
      return () => cancelAnimationFrame(raf);
    }
    setShow(false);
  }, [visible]);

  const persist = (value: "granted" | "denied") => {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      /* storage blocked — choice simply won't be remembered */
    }
  };

  const accept = () => {
    persist("granted");
    loadGoogleAnalytics();
    setVisible(false);
  };

  const reject = () => {
    persist("denied");
    disableGoogleAnalytics();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[10000] flex justify-center p-3 sm:p-4"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 250ms ease-out, transform 250ms ease-out",
      }}
    >
      <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-zinc-900/95 backdrop-blur-md p-5 shadow-2xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-500">
              <Cookie size={18} />
            </div>
            <p className="text-sm leading-relaxed text-gray-300">
              We use a single analytics cookie (Google Analytics) to count
              visitors and improve the site. It only loads if you accept.
              Essential features that save your tracer settings on your own
              device work without it. See our{" "}
              <Link
                to="/privacy"
                className="font-semibold text-amber-500 underline-offset-2 hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          <div className="flex shrink-0 gap-2 sm:ml-auto">
            <button
              onClick={reject}
              className="flex-1 whitespace-nowrap rounded-xl border border-white/10 bg-zinc-800 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-zinc-700 sm:flex-none"
            >
              Reject
            </button>
            <button
              onClick={accept}
              className="flex-1 whitespace-nowrap rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-black shadow-lg shadow-amber-500/20 transition-colors hover:bg-amber-400 sm:flex-none"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
