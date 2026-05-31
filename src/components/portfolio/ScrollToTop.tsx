'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

export default function ScrollToTop() {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [visible, setVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const rafRef = useRef<number>(0);
  const lastVisibleRef = useRef(false);

  const handleScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const percent = Math.min((window.scrollY / scrollHeight) * 100, 100);
        setScrollPercent(percent);
        const shouldShow = window.scrollY > 200;
        if (shouldShow !== lastVisibleRef.current) {
          lastVisibleRef.current = shouldShow;
          setVisible(shouldShow);
        }
      }
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // SVG circle params
  const size = 52;
  const strokeWidth = 3.5;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollPercent / 100) * circumference;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={scrollToTop}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          initial={{ opacity: 0, y: 30, scale: 0.6 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.6 }}
          transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          className="fixed bottom-6 right-6 z-50 group"
          aria-label="Scroll to top"
        >
          {/* Outer glow ring - always visible, pulses subtly */}
          <motion.div
            animate={{
              boxShadow: isHovered
                ? '0 0 30px rgba(6,182,212,0.35), 0 0 60px rgba(16,185,129,0.15)'
                : '0 0 15px rgba(6,182,212,0.15), 0 0 30px rgba(16,185,129,0.08)',
            }}
            transition={{ duration: 0.3 }}
            className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-teal-500/20 to-emerald-500/20 blur-sm"
          />

          {/* Spinning outer ring track */}
          <svg
            width={size + 8}
            height={size + 8}
            className="absolute -inset-1"
            viewBox={`0 0 ${size + 8} ${size + 8}`}
          >
            {/* Background track */}
            <circle
              cx={(size + 8) / 2}
              cy={(size + 8) / 2}
              r={(size + 8 - strokeWidth * 2) / 2}
              fill="none"
              stroke="rgba(6, 182, 212, 0.06)"
              strokeWidth={1}
            />
          </svg>

          {/* Main button container */}
          <div
            className="relative w-[52px] h-[52px] rounded-full overflow-hidden"
            style={{
              background: 'rgba(6, 20, 40, 0.85)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1.5px solid rgba(6, 182, 212, 0.15)',
            }}
          >
            {/* Progress SVG ring */}
            <svg
              width={size}
              height={size}
              className="absolute inset-0"
              viewBox={`0 0 ${size} ${size}`}
            >
              <defs>
                <linearGradient id="scrollGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>

              {/* Track circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="rgba(6, 182, 212, 0.08)"
                strokeWidth={strokeWidth}
              />

              {/* Progress arc */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="url(#scrollGrad)"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="-rotate-90 origin-center"
                style={{
                  transition: 'stroke-dashoffset 0.2s ease-out',
                  filter: 'drop-shadow(0 0 4px rgba(6,182,212,0.5))',
                }}
              />

              {/* Small dot at the end of progress */}
              {scrollPercent > 2 && (
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${(scrollPercent / 100) * circumference} ${circumference}`}
                  strokeLinecap="round"
                  className="-rotate-90 origin-center"
                  style={{
                    transition: 'stroke-dasharray 0.2s ease-out',
                  }}
                >
                  <circle
                    r={3.5}
                    fill="#06b6d4"
                    style={{
                      filter: 'drop-shadow(0 0 6px rgba(6,182,212,0.8))',
                    }}
                  />
                </circle>
              )}
            </svg>

            {/* Inner content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                animate={{
                  y: isHovered ? -2 : 0,
                  scale: isHovered ? 1.15 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                <ChevronUp
                  className="w-5 h-5 text-teal-400"
                  strokeWidth={2.5}
                />
              </motion.div>
              <span
                className="text-[9px] font-bold leading-none mt-0.5"
                style={{
                  background: 'linear-gradient(135deg, #06b6d4, #10b981)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {Math.round(scrollPercent)}
              </span>
            </div>

            {/* Inner glass reflection */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle at 30% 20%, rgba(6,182,212,0.06) 0%, transparent 60%)',
              }}
            />
          </div>

          {/* Hover scale-up ring */}
          <motion.div
            animate={{
              scale: isHovered ? 1 : 0.95,
              opacity: isHovered ? 0.4 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="absolute -inset-2 rounded-full border border-teal-400/20"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
