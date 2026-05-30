'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MessageCircle, Layout, Wrench, CheckCircle } from 'lucide-react';

const steps = [
  {
    step: 1,
    icon: MessageCircle,
    title: 'Discuss',
    description: 'We discuss your requirements and project scope',
  },
  {
    step: 2,
    icon: Layout,
    title: 'Plan',
    description: 'I create a detailed plan and timeline',
  },
  {
    step: 3,
    icon: Wrench,
    title: 'Build',
    description: 'I build and implement your solution',
  },
  {
    step: 4,
    icon: CheckCircle,
    title: 'Deliver',
    description: 'Review, refine, and deliver the final result',
  },
];

export default function ProcessSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="process" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-teal-400 text-sm font-medium uppercase tracking-widest">
            My Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3">
            How I <span className="gradient-text">Work</span>
          </h2>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
            A simple and transparent process to ensure your project is delivered
            exactly how you envision it.
          </p>
        </motion.div>

        {/* Timeline - Horizontal on desktop, vertical on mobile */}
        <div className="relative">
          {/* Connecting line - Desktop horizontal */}
          <div className="hidden md:block absolute top-1/2 left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-px bg-gradient-to-r from-teal-500/30 via-teal-500/50 to-teal-500/30 -translate-y-1/2" />

          {/* Connecting line - Mobile vertical */}
          <div className="md:hidden absolute top-0 bottom-0 left-6 w-px bg-gradient-to-b from-teal-500/30 via-teal-500/50 to-teal-500/30" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-0">
            {steps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 * index }}
                className="relative flex flex-col md:flex-col items-start md:items-center text-left md:text-center pl-16 md:pl-0"
              >
                {/* Step Circle */}
                <div className="relative z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.15, type: 'spring', stiffness: 200 }}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/20"
                  >
                    <item.icon className="w-5 h-5 text-white" />
                  </motion.div>
                  {/* Step number */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.15 }}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-navy border-2 border-teal-500 flex items-center justify-center"
                  >
                    <span className="text-xs font-bold text-teal-400">{item.step}</span>
                  </motion.div>
                </div>

                {/* Text content */}
                <div className="mt-4 md:mt-6">
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.15 }}
                    className="text-lg font-bold text-white"
                  >
                    {item.title}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.15 }}
                    className="text-sm text-slate-400 mt-2 max-w-[200px] md:max-w-[220px] mx-0 md:mx-auto"
                  >
                    {item.description}
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
