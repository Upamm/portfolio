'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

export default function FloatingHireFAB() {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show FAB when hero is NOT intersecting (scrolled past it)
        setIsVisible(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    let cancelled = false;
    const tryObserve = () => {
      const heroEl = document.getElementById('home');
      if (heroEl && !cancelled) {
        observer.observe(heroEl);
        heroRef.current = heroEl;
      } else if (!cancelled) {
        requestAnimationFrame(tryObserve);
      }
    };
    tryObserve();

    return () => {
      cancelled = true;
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.a
          href="https://www.fiverr.com/upam1721"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="hidden sm:flex fixed bottom-6 left-6 z-50 items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-sm font-medium shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-105 transition-all duration-300 group"
          aria-label="Hire me on Fiverr"
        >
          <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          <span>Hire Me</span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
