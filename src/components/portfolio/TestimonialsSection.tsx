'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'John M.',
    company: 'TechStart Inc.',
    role: 'CEO',
    rating: 5,
    text: 'Upam did an outstanding job redesigning our WordPress website. The speed optimization alone improved our load time by 60%. Highly professional and communicative throughout the project.',
    initials: 'JM',
    color: 'from-teal-500 to-cyan-500',
  },
  {
    name: 'Sarah K.',
    company: 'GreenLeaf Agency',
    role: 'Marketing Director',
    rating: 5,
    text: 'We hired Upam for lead generation and the results were incredible. Over 2000 verified B2B contacts delivered ahead of schedule. Data quality was top-notch and exactly what we needed.',
    initials: 'SK',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    name: 'Michael R.',
    company: 'Bright Horizons LLC',
    role: 'Founder',
    rating: 5,
    text: 'Upam has been managing our WordPress site for over a year now. His attention to detail and proactive approach to maintenance is exactly what we were looking for. A true professional.',
    initials: 'MR',
    color: 'from-cyan-500 to-teal-500',
  },
];

const SLIDE_DURATION = 5000;

export default function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const total = testimonials.length;

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

  const next = useCallback(() => {
    goTo((current + 1) % total);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + total) % total);
  }, [current, goTo]);

  // Auto-play
  useEffect(() => {
    const interval = setInterval(next, SLIDE_DURATION);
    return () => clearInterval(interval);
  }, [next]);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
  };

  return (
    <section id="testimonials" className="relative py-10 sm:py-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-15" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/3 rounded-full blur-3xl" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-10"
        >
          <span className="text-teal-400 text-sm font-medium uppercase tracking-widest">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3">
            Client <span className="gradient-text">Reviews</span>
          </h2>
          <span className="section-heading-line" />
          <p className="text-slate-400 mt-6 max-w-2xl mx-auto">
            What my clients say about working with me.
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          {/* Slide Card */}
          <div className="relative glass-card testimonial-glow rounded-2xl p-6 sm:p-12 min-h-[280px] sm:min-h-[340px] flex items-center overflow-hidden">
            {/* Quote icon */}
            <Quote className="absolute top-4 sm:top-8 right-6 sm:right-10 w-16 h-16 sm:w-20 sm:h-20 text-teal-500/5 rotate-180" />
            <Quote className="absolute bottom-4 sm:bottom-6 left-6 sm:left-10 w-12 h-12 sm:w-16 sm:h-16 text-emerald-500/5" />

            {/* Bottom reflection/glow gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-teal-500/5 to-transparent pointer-events-none" />

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="w-full"
              >
                {/* Stars */}
                <div className="flex gap-0.5 sm:gap-1 mb-4 sm:mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${
                        i < testimonials[current].rating
                          ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.3)]'
                          : 'text-slate-600'
                      }`}
                    />
                  ))}
                </div>

                {/* Text */}
                <p className="text-base sm:text-xl text-slate-300 leading-relaxed mb-6 sm:mb-8 italic">
                  &ldquo;{testimonials[current].text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonials[current].color} flex items-center justify-center shrink-0`}
                  >
                    <span className="text-white font-bold text-sm">
                      {testimonials[current].initials}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">
                      {testimonials[current].name}
                    </p>
                    <p className="text-sm text-slate-400">
                      {testimonials[current].role} at{' '}
                      {testimonials[current].company}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Arrows + Dots Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            {/* Previous Arrow */}
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-slate-400 hover:text-teal-400 hover:shadow-[0_0_12px_rgba(6,182,212,0.2)] transition-all duration-300 shrink-0"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((t, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === current
                      ? 'w-8 h-2.5 bg-gradient-to-r ' + t.color + ' shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                      : 'w-2.5 h-2.5 bg-slate-600 hover:bg-slate-500'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            {/* Next Arrow */}
            <button
              onClick={next}
              className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-slate-400 hover:text-teal-400 hover:shadow-[0_0_12px_rgba(6,182,212,0.2)] transition-all duration-300 shrink-0"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
