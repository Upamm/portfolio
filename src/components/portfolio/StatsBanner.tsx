'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Briefcase, Users, FolderOpen, Star, Award, ThumbsUp } from 'lucide-react';

const stats = [
  { icon: Briefcase, value: 8, suffix: '+', label: 'Years Experience', color: 'text-teal-400' },
  { icon: Users, value: 847, suffix: '+', label: 'Happy Clients', color: 'text-emerald-400' },
  { icon: FolderOpen, value: 500, suffix: '+', label: 'Projects Completed', color: 'text-cyan-400' },
  { icon: Star, value: 4.8, suffix: '', label: 'Average Rating', color: 'text-yellow-400' },
  { icon: Award, value: 100, suffix: '%', label: 'Success Rate', color: 'text-teal-400' },
  { icon: ThumbsUp, value: 15, suffix: '+', label: 'Repeat Clients', color: 'text-emerald-400' },
];

function AnimatedStatCounter({ stat, isInView }: { stat: (typeof stats)[0]; isInView: boolean }) {
  const [count, setCount] = useState(0);
  const numericValue = typeof stat.value === 'number' ? stat.value : 0;

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;
    const increment = numericValue / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current += increment;
      if (step >= steps) {
        setCount(numericValue);
        clearInterval(timer);
      } else {
        setCount(Number((current).toFixed(1)));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, numericValue]);

  const displayValue = typeof stat.value === 'number' && stat.value % 1 !== 0
    ? `${count}${stat.suffix}`
    : `${Math.floor(count)}${stat.suffix}`;

  return (
    <div className="text-center group">
      <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-teal-500/10 flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
        <stat.icon className={`w-5 h-5 sm:w-7 sm:h-7 ${stat.color}`} />
      </div>
      <div className="text-2xl sm:text-4xl font-bold text-white mb-1">
        {displayValue}
      </div>
      <div className="text-xs sm:text-sm text-slate-400">{stat.label}</div>
    </div>
  );
}

export default function StatsBanner() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section className="relative py-16 sm:py-20 overflow-hidden">
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 via-transparent to-emerald-500/5" />
        <div className="absolute inset-0 bg-grid opacity-10" />
      </div>

      {/* Animated glowing orbs */}
      <div className="absolute left-[10%] top-1/2 -translate-y-1/2 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl animate-pulse" />
      <div className="absolute right-[10%] top-1/2 -translate-y-1/2 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Top and bottom separators */}
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="absolute bottom-0 left-0 right-0 section-divider" />

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <AnimatedStatCounter stat={stat} isInView={isInView} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
