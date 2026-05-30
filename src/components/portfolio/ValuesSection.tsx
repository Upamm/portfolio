'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Zap, Shield, Clock, MessageCircle, HeartHandshake, Target } from 'lucide-react';

const values = [
  {
    icon: Zap,
    title: 'Fast Delivery',
    description: 'Quick turnaround times with no compromise on quality. Most projects delivered within 3-7 business days.',
    color: 'from-teal-500 to-cyan-500',
  },
  {
    icon: Shield,
    title: 'Quality Assurance',
    description: 'Every project undergoes thorough testing and quality checks before delivery to ensure pixel-perfect results.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Clock,
    title: 'Always Available',
    description: 'Responsive communication with quick reply times. Available across multiple time zones for global clients.',
    color: 'from-cyan-500 to-teal-500',
  },
  {
    icon: MessageCircle,
    title: 'Clear Communication',
    description: 'Regular progress updates and transparent communication throughout every project lifecycle.',
    color: 'from-teal-500 to-emerald-500',
  },
  {
    icon: HeartHandshake,
    title: 'Client First Approach',
    description: 'Your satisfaction is my priority. I go above and beyond to exceed expectations on every deliverable.',
    color: 'from-emerald-500 to-cyan-500',
  },
  {
    icon: Target,
    title: 'Results Driven',
    description: 'Focused on delivering measurable results — from improved site speed to increased leads and conversions.',
    color: 'from-cyan-500 to-emerald-500',
  },
];

export default function ValuesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="values" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-15" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="absolute bottom-1/3 left-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl" />
      <div className="absolute top-1/4 right-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-teal-400 text-sm font-medium uppercase tracking-widest">
            Why Choose Me
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3">
            What I <span className="gradient-text">Bring</span>
          </h2>
          <span className="section-heading-line" />
          <p className="text-slate-400 mt-6 max-w-2xl mx-auto">
            Beyond technical skills, I bring commitment, reliability, and a results-focused mindset to every project.
          </p>
        </motion.div>

        {/* Values Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + index * 0.1 }}
              className="glass-card card-spotlight rounded-2xl p-6 sm:p-8 group hover-glow"
              onMouseMove={(e) => {
                const card = e.currentTarget;
                const rect = card.getBoundingClientRect();
                card.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
                card.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
              }}
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                <value.icon className="w-7 h-7 text-white" />
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-teal-300 transition-colors">
                {value.title}
              </h3>

              {/* Description */}
              <p className="text-slate-400 text-sm leading-relaxed">
                {value.description}
              </p>

              {/* Bottom accent line */}
              <div className="mt-5 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
