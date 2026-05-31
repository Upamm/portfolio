'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  ShoppingCart,
  Heart,
  Building2,
  Cpu,
  GraduationCap,
  Rocket,
} from 'lucide-react';

const industries = [
  {
    icon: ShoppingCart,
    title: 'eCommerce & Retail',
    description:
      'Built and optimized WooCommerce stores, Shopify integrations, and online marketplaces for businesses worldwide.',
    projects: 120,
    gradient: 'from-teal-500 to-cyan-500',
  },
  {
    icon: Heart,
    title: 'Healthcare & Medical',
    description:
      'Developed HIPAA-compliant websites, patient portals, and appointment booking systems for medical practices.',
    projects: 85,
    gradient: 'from-emerald-400 to-cyan-500',
  },
  {
    icon: Building2,
    title: 'Real Estate',
    description:
      'Created property listing websites, IDX/MLS integrations, and virtual tour platforms for real estate agencies.',
    projects: 95,
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Cpu,
    title: 'SaaS & Technology',
    description:
      'Built landing pages, documentation sites, and marketing websites for software and technology startups.',
    projects: 110,
    gradient: 'from-cyan-400 to-teal-500',
  },
  {
    icon: GraduationCap,
    title: 'Education & Training',
    description:
      'Developed learning management systems, course platforms, and educational content websites.',
    projects: 70,
    gradient: 'from-teal-400 to-emerald-500',
  },
  {
    icon: Rocket,
    title: 'Startups & Small Business',
    description:
      'Helped 200+ startups establish their online presence with professional websites and growth strategies.',
    projects: 200,
    gradient: 'from-cyan-500 to-emerald-500',
  },
];

export default function IndustriesServedSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="industries" className="relative py-16 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-15" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      <div className="absolute top-1/3 left-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="text-teal-400 text-sm font-medium uppercase tracking-widest">
            Industries
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3">
            Industries I <span className="gradient-text">Serve</span>
          </h2>
          <span className="section-heading-line" />
          <p className="text-slate-400 mt-6 max-w-2xl mx-auto">
            From startups to established enterprises, I&apos;ve delivered results across a wide range of industries with tailored WordPress and lead generation solutions.
          </p>
        </motion.div>

        {/* Industries Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {industries.map((industry, index) => (
            <motion.div
              key={industry.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              className="glass-card card-spotlight rounded-2xl p-6 sm:p-8 group hover-glow relative overflow-hidden"
              onMouseMove={(e) => {
                const card = e.currentTarget;
                const rect = card.getBoundingClientRect();
                card.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
                card.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
              }}
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${industry.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                <industry.icon className="w-7 h-7 text-white" />
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-teal-300 transition-colors">
                {industry.title}
              </h3>

              {/* Description */}
              <p className="text-slate-400 text-sm leading-relaxed">
                {industry.description}
              </p>

              {/* Project Count Badge */}
              <div className="mt-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-500/20">
                <span className="text-xs font-semibold text-teal-400">
                  {industry.projects}+ Projects
                </span>
              </div>

              {/* Bottom accent line */}
              <div className="mt-5 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
