'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScrollToTop() {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [visible, setVisible] = useState(false);

  const handleScroll = useCallback(() => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight > 0) {
      const percent = (window.scrollY / scrollHeight) * 100;
      setScrollPercent(percent);
      setVisible(window.scrollY > 300);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // SVG circle params
  const size = 48;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollPercent / 100) * circumference;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 flex items-center justify-center group"
          aria-label="Scroll to top"
        >
          {/* Background circle */}
          <svg
            width={size}
            height={size}
            className="absolute inset-0 -rotate-90"
            viewBox={`0 0 ${size} ${size}`}
          >
            {/* Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="rgba(6, 182, 212, 0.1)"
              strokeWidth={strokeWidth}
            />
            {/* Progress */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="url(#scrollGradient)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-[stroke-dashoffset] duration-150 ease-out"
            />
            <defs>
              <linearGradient id="scrollGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>

          {/* Percentage text */}
          <span className="text-[10px] font-bold text-teal-300 relative z-10">
            {Math.round(scrollPercent)}%
          </span>

          {/* Hover ring glow */}
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_20px_rgba(6,182,212,0.3)]" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
