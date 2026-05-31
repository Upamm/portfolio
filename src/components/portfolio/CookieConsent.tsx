'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Shield } from 'lucide-react';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Only show on first visit, after user scrolls past hero section
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const handleScroll = () => {
        // Show banner once user has scrolled past hero (100vh)
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
    localStorage.setItem('cookie-consent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
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
          <div className="max-w-4xl mx-auto glass-card rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center sm:items-center gap-4 shadow-2xl shadow-black/20 border border-teal-500/10">
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
                This website uses cookies to enhance your browsing experience and analyze site traffic. 
                By continuing to use this site, you agree to our use of cookies.
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
