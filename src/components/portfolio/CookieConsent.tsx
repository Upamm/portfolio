'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
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
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 250 }}
          className="fixed bottom-0 left-0 right-0 z-50 sm:px-4 sm:pb-4"
        >
          <div className="cookie-card max-w-4xl mx-auto sm:rounded-2xl px-3 py-2.5 sm:px-5 sm:py-4 flex items-center gap-2.5 sm:gap-4 shadow-2xl border border-teal-500/10">
            {/* Icon — tiny on mobile */}
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 flex items-center justify-center shrink-0">
              <Cookie className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-teal-400" />
            </div>

            {/* Text — single compact line */}
            <div className="flex-1 min-w-0">
              <p className="text-slate-300 text-[11px] leading-snug sm:text-sm sm:leading-relaxed">
                We use cookies to improve your experience.{' '}
                <span className="hidden sm:inline">By continuing, you agree to our cookie policy.</span>
              </p>
            </div>

            {/* Actions — compact inline buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              <button
                onClick={handleDecline}
                className="px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-medium text-slate-400 border border-slate-600/30 hover:border-slate-500 hover:text-white transition-all duration-200"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="btn-shine px-3 py-1 sm:px-4.5 sm:py-1.5 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-medium text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 transition-all duration-200 shadow-lg shadow-teal-500/20"
              >
                Accept
              </button>
              <button
                onClick={handleDecline}
                className="p-1 rounded-md text-slate-500 hover:text-white hover:bg-white/5 transition-all sm:hidden"
                aria-label="Close"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
