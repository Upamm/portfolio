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
          className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 sm:p-6"
        >
          <div className="cookie-card max-w-4xl mx-auto rounded-2xl px-4 py-3 sm:px-6 sm:py-5 flex flex-row items-center gap-3 sm:gap-4 shadow-2xl border border-teal-500/10">
            {/* Icon */}
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 flex items-center justify-center shrink-0">
              <Cookie className="w-4 h-4 sm:w-6 sm:h-6 text-teal-400" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-white font-semibold text-xs sm:text-sm">Cookie Preferences</h4>
                <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
              </div>
              <p className="text-slate-400 text-[11px] sm:text-sm leading-relaxed mt-0.5 sm:mt-1">
                We use cookies to improve your experience. By continuing, you agree to our cookie policy.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                onClick={handleDecline}
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[11px] sm:text-xs font-medium text-slate-400 border border-slate-600/30 hover:border-slate-500 hover:text-white transition-all duration-200"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="btn-shine px-4 py-1.5 sm:px-5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-medium text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 transition-all duration-200 shadow-lg shadow-teal-500/20"
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
