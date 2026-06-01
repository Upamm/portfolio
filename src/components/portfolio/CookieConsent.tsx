'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Shield } from 'lucide-react';
import { getCookie, setCookie, COOKIES } from '@/lib/cookies';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Only show if user hasn't already made a choice (stored in cookie)
    const consent = getCookie(COOKIES.COOKIE_CONSENT);
    if (!consent) {
      const handleScroll = () => {
        // Show banner once user has scrolled past hero (80% of viewport)
        if (window.scrollY > window.innerHeight * 0.8) {
          setShowBanner(true);
          window.removeEventListener('scroll', handleScroll);
        }
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleAccept = () => {
    setCookie(COOKIES.COOKIE_CONSENT, 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    setCookie(COOKIES.COOKIE_CONSENT, 'declined');
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
        >
          <div className="cookie-card max-w-4xl mx-auto rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center sm:items-center gap-4 shadow-2xl border border-teal-500/10">
            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 flex items-center justify-center shrink-0">
              <Cookie className="w-6 h-6 text-teal-400" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-white font-semibold text-sm">Cookie Preferences</h4>
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                This website uses cookies to enhance your browsing experience, remember your preferences,
                and analyze site traffic. Your choices are saved for 1 year.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-center">
              <button
                onClick={handleDecline}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 border border-slate-600/30 hover:border-slate-500 hover:text-white transition-all duration-200"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="btn-shine px-5 py-2 rounded-lg text-xs font-medium text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 transition-all duration-200 shadow-lg shadow-teal-500/20"
              >
                Accept All
              </button>
              <button
                onClick={handleDecline}
                className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all sm:hidden"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
