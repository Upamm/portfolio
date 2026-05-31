'use client';

import { useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { Briefcase, RefreshCw, Handshake, Check } from 'lucide-react';

const engagementModels = [
  {
    title: 'One-Time Project',
    icon: Briefcase,
    gradient: 'from-teal-500 to-cyan-500',
    description:
      'Perfect for specific tasks with clear scope and deliverables.',
    benefits: [
      'Fixed price with no surprises',
      'Detailed scope & timeline',
      '3 free revisions included',
      'Source file handover',
      '30-day post-delivery support',
    ],
    bestFor: 'Website builds, speed optimization, data entry tasks',
    recommended: false,
  },
  {
    title: 'Monthly Retainer',
    icon: RefreshCw,
    gradient: 'from-emerald-500 to-teal-500',
    description:
      'Ongoing support with guaranteed availability and priority response.',
    benefits: [
      'Dedicated hours per month',
      'Priority response within 2hrs',
      'Monthly performance reports',
      'Flexible scope adjustment',
      'Cancel anytime — no lock-in',
    ],
    bestFor: 'WordPress maintenance, VA support, lead generation campaigns',
    recommended: false,
  },
  {
    title: 'Long-Term Partnership',
    icon: Handshake,
    gradient: 'from-cyan-500 to-emerald-500',
    description:
      'Strategic collaboration for businesses needing consistent, reliable support.',
    benefits: [
      'Discounted hourly rates',
      'Dedicated account management',
      'Weekly strategy calls',
      'Custom SLA & KPI tracking',
      'First access to new services',
    ],
    bestFor: 'Growing businesses, agencies, enterprise clients',
    recommended: true,
  },
];

function EngagementCard({
  model,
  index,
  isInView,
}: {
  model: (typeof engagementModels)[0];
  index: number;
  isInView: boolean;
}) {
  const IconComp = model.icon;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    },
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.15 + index * 0.1 }}
      className="relative"
    >
      {/* Animated gradient border for recommended card */}
      {model.recommended && (
        <div className="absolute -inset-[1.5px] rounded-2xl bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-500 opacity-75 blur-[1px] animate-pulse-glow pointer-events-none" />
      )}

      <div
        className={`relative rounded-2xl p-6 sm:p-8 h-full card-spotlight hover-glow overflow-hidden ${
          model.recommended
            ? 'glass-card shadow-lg shadow-teal-500/10'
            : 'glass-card'
        }`}
        onMouseMove={handleMouseMove}
      >
        {/* Background glow for recommended */}
        {model.recommended && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-56 h-56 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        )}

        {/* RECOMMENDED badge */}
        {model.recommended && (
          <div className="absolute top-4 right-4 z-20">
            <span className="inline-flex items-center text-xs font-bold bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-3 py-1 rounded-full shadow-lg shadow-teal-500/25">
              RECOMMENDED
            </span>
          </div>
        )}

        {/* Card content */}
        <div className="relative z-10">
          {/* Icon container */}
          <div
            className={`w-14 h-14 rounded-xl bg-gradient-to-br ${model.gradient} flex items-center justify-center mb-5`}
          >
            <IconComp className="w-7 h-7 text-white" />
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-white">{model.title}</h3>

          {/* Description */}
          <p className="text-slate-400 text-sm leading-relaxed mt-3">
            {model.description}
          </p>

          {/* Benefits list */}
          <ul className="space-y-2 mt-5">
            {model.benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300">{benefit}</span>
              </li>
            ))}
          </ul>

          {/* Best for */}
          <div className="mt-5 pt-4 border-t border-white/5">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
              Best for
            </p>
            <p className="text-sm text-slate-400">{model.bestFor}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function WorkWithMeSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="work-with-me"
      className="relative py-16 sm:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-15" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="text-teal-400 text-sm font-medium uppercase tracking-widest">
            Engagement
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3">
            Let&apos;s Work <span className="gradient-text">Together</span>
          </h2>
          <span className="section-heading-line" />
          <p className="text-slate-400 mt-6 max-w-2xl mx-auto">
            Choose the collaboration model that fits your needs
          </p>
        </motion.div>

        {/* Engagement Models Grid */}
        <div className="grid md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 items-stretch">
          {engagementModels.map((model, index) => (
            <EngagementCard
              key={model.title}
              model={model}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
