'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const rafRef = useRef<number>(0);
  const lastVisibleRef = useRef(false);

  const handleScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const shouldShow = window.scrollY > 300;
      if (shouldShow !== lastVisibleRef.current) {
        lastVisibleRef.current = shouldShow;
        setVisible(shouldShow);
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

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={scrollToTop}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
          className="scroll-top-btn fixed bottom-24 right-6 z-50 w-10 h-10 rounded-full flex items-center justify-center relative"
          aria-label="Scroll to top"
        >
          {/* Layer 1: Outermost pulsing glow ring */}
          <motion.span
            animate={{
              scale: isHovered ? [1, 1.5, 1.2] : [1, 1.6, 1],
              opacity: isHovered ? [0.15, 0.05, 0.2] : [0.12, 0, 0.12],
            }}
            transition={{
              duration: isHovered ? 1.5 : 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="scroll-top-glow1 absolute -inset-2.5 rounded-full bg-gradient-to-r from-teal-500/20 to-emerald-500/20 blur-md"
          />

          {/* Layer 2: Mid glow ring - slower, opposite phase */}
          <motion.span
            animate={{
              scale: isHovered ? [1.3, 1.1, 1.4] : [1.2, 1, 1.2],
              opacity: isHovered ? [0.1, 0.25, 0.1] : [0.08, 0.15, 0.08],
            }}
            transition={{
              duration: isHovered ? 1.2 : 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.3,
            }}
            className="scroll-top-glow2 absolute -inset-1.5 rounded-full bg-gradient-to-br from-emerald-400/15 to-cyan-500/15 blur-sm"
          />

          {/* Layer 3: Inner solid background with border */}
          <motion.span
            animate={{
              boxShadow: isHovered
                ? '0 0 20px rgba(6,182,212,0.3), 0 0 40px rgba(16,185,129,0.1), inset 0 0 12px rgba(6,182,212,0.1)'
                : '0 0 8px rgba(6,182,212,0.1), inset 0 0 6px rgba(6,182,212,0.05)',
            }}
            transition={{ duration: 0.3 }}
            className="scroll-top-inner absolute inset-0 rounded-full bg-teal-500/15 border border-teal-500/25 backdrop-blur-md"
          />

          {/* Arrow icon on top */}
          <motion.span
            animate={{
              y: isHovered ? -1 : 0,
              scale: isHovered ? 1.15 : 1,
            }}
            transition={{ duration: 0.2 }}
            className="relative z-10 text-teal-400 scroll-top-icon"
          >
            <ArrowUp className="w-4 h-4" />
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
