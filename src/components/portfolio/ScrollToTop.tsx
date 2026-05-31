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
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
          className="scroll-top-btn fixed bottom-40 right-6 z-50 w-10 h-10 rounded-full flex items-center justify-center relative"
          aria-label="Scroll to top"
        >
          {/* Layer 1: Outermost pulsing glow ring */}
          <motion.span
            animate={{
              scale: isHovered ? [1, 1.5, 1.2] : [1, 1.6, 1],
              opacity: isHovered ? [0.2, 0.05, 0.25] : [0.15, 0, 0.15],
            }}
            transition={{
              duration: isHovered ? 1.5 : 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="scroll-top-glow1 absolute -inset-3 rounded-full blur-lg"
            style={{
              background: 'radial-gradient(circle, rgba(6,182,212,0.25) 0%, rgba(16,185,129,0.1) 50%, transparent 70%)',
            }}
          />

          {/* Layer 2: Mid glow ring - opposite phase */}
          <motion.span
            animate={{
              scale: isHovered ? [1.3, 1.1, 1.4] : [1.2, 1, 1.2],
              opacity: isHovered ? [0.15, 0.3, 0.15] : [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: isHovered ? 1.2 : 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.4,
            }}
            className="scroll-top-glow2 absolute -inset-1.5 rounded-full blur-md"
            style={{
              background: 'radial-gradient(circle, rgba(20,184,166,0.2) 0%, rgba(6,182,212,0.08) 60%, transparent 80%)',
            }}
          />

          {/* Layer 3: Inner background with color animation */}
          <motion.span
            animate={{
              backgroundColor: isHovered
                ? ['rgba(6,182,212,0.3)', 'rgba(20,184,166,0.35)', 'rgba(16,185,129,0.3)', 'rgba(6,182,212,0.3)']
                : ['rgba(6,182,212,0.18)', 'rgba(20,184,166,0.22)', 'rgba(16,185,129,0.18)', 'rgba(6,182,212,0.18)'],
              boxShadow: isHovered
                ? [
                    '0 0 18px rgba(6,182,212,0.3), 0 0 36px rgba(16,185,129,0.1)',
                    '0 0 18px rgba(20,184,166,0.3), 0 0 36px rgba(6,182,212,0.1)',
                    '0 0 18px rgba(16,185,129,0.3), 0 0 36px rgba(20,184,166,0.1)',
                    '0 0 18px rgba(6,182,212,0.3), 0 0 36px rgba(16,185,129,0.1)',
                  ]
                : [
                    '0 0 10px rgba(6,182,212,0.12)',
                    '0 0 10px rgba(20,184,166,0.12)',
                    '0 0 10px rgba(16,185,129,0.12)',
                    '0 0 10px rgba(6,182,212,0.12)',
                  ],
              borderColor: isHovered
                ? ['rgba(6,182,212,0.4)', 'rgba(20,184,166,0.45)', 'rgba(16,185,129,0.4)', 'rgba(6,182,212,0.4)']
                : ['rgba(6,182,212,0.25)', 'rgba(20,184,166,0.3)', 'rgba(16,185,129,0.25)', 'rgba(6,182,212,0.25)'],
            }}
            transition={{
              duration: isHovered ? 2 : 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="scroll-top-inner absolute inset-0 rounded-full border backdrop-blur-md"
          />

          {/* Arrow icon */}
          <motion.span
            animate={{
              y: isHovered ? -1 : 0,
              color: isHovered
                ? ['rgb(94,234,212)', 'rgb(45,212,191)', 'rgb(52,211,153)', 'rgb(94,234,212)']
                : ['rgb(45,212,191)', 'rgb(34,211,238)', 'rgb(52,211,153)', 'rgb(45,212,191)'],
            }}
            transition={{
              y: { duration: 0.2 },
              color: { duration: isHovered ? 2 : 4, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="relative z-10 scroll-top-icon"
          >
            <ArrowUp className="w-4 h-4" />
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
