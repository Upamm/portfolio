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
  {
    name: 'Lisa P.',
    company: 'Nexus Digital',
    role: 'Operations Manager',
    rating: 4,
    text: 'Fantastic virtual assistant work. Upam handled our email management, CRM updates, and data entry tasks with precision. Very reliable and always available when we needed help.',
    initials: 'LP',
    color: 'from-teal-500 to-emerald-500',
  },
  {
    name: 'David W.',
    company: 'Urban Eats Co.',
    role: 'Owner',
    rating: 5,
    text: 'Upam built our restaurant delivery website from scratch and it looks amazing. The WooCommerce integration was seamless and our online orders increased by 40% within the first month.',
    initials: 'DW',
    color: 'from-emerald-500 to-cyan-500',
  },
];

export default function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  }, []);

  // Auto-play
  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next]);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
  };

  return (
    <section id="testimonials" className="relative py-24 sm:py-32 overflow-hidden">
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
          className="text-center mb-16"
        >
          <span className="text-teal-400 text-sm font-medium uppercase tracking-widest">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3">
            Client <span className="gradient-text">Reviews</span>
          </h2>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
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
          <div className="relative glass-card rounded-2xl p-8 sm:p-12 min-h-[320px] flex items-center">
            {/* Quote icon */}
            <Quote className="absolute top-6 right-6 w-12 h-12 text-teal-500/10" />

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonials[current].rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-slate-600'
                      }`}
                    />
                  ))}
                </div>

                {/* Text */}
                <p className="text-lg sm:text-xl text-slate-300 leading-relaxed mb-8 italic">
                  &ldquo;{testimonials[current].text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonials[current].color} flex items-center justify-center`}
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

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > current ? 1 : -1);
                    setCurrent(index);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === current
                      ? 'bg-teal-400 w-8'
                      : 'bg-slate-600 hover:bg-slate-500'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-slate-400 hover:text-white transition-colors"
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
