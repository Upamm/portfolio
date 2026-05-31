'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const packages = [
  {
    name: 'Starter',
    price: 99,
    description: 'Perfect for getting your WordPress site up and running quickly.',
    features: [
      'Basic WordPress setup',
      'Theme installation',
      'Essential plugin setup',
      'Basic SEO configuration',
      '1 revision round',
    ],
    gradient: 'from-slate-500/20 to-slate-600/20',
    borderGradient: 'from-slate-500/30 to-slate-600/30',
    featured: false,
  },
  {
    name: 'Professional',
    price: 249,
    description: 'Ideal for businesses wanting a polished, optimized web presence.',
    features: [
      'Custom theme customization',
      'Advanced plugin configuration',
      'Speed optimization',
      'Full SEO setup',
      '3 revision rounds',
      '30-day support',
    ],
    gradient: 'from-teal-500/20 to-emerald-500/20',
    borderGradient: 'from-teal-500 to-emerald-500',
    featured: true,
  },
  {
    name: 'Premium',
    price: 499,
    description: 'For businesses that need a fully custom, high-performance solution.',
    features: [
      'Custom WordPress development from scratch',
      'Premium theme design',
      'Advanced performance tuning',
      'Comprehensive SEO strategy',
      'Unlimited revisions',
      '90-day priority support',
    ],
    gradient: 'from-slate-500/20 to-slate-600/20',
    borderGradient: 'from-slate-500/30 to-slate-600/30',
    featured: false,
  },
];

function PricingCard({
  pkg,
  index,
  isInView,
}: {
  pkg: (typeof packages)[0];
  index: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.15 + index * 0.15 }}
      className={`relative rounded-2xl p-[1.5px] ${
        pkg.featured
          ? 'bg-gradient-to-br from-teal-500 to-emerald-500'
          : 'bg-gradient-to-br from-slate-700/40 to-slate-700/40'
      }`}
    >
      {/* "Most Popular" badge */}
      {pkg.featured && (
        <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 z-20">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-xs font-bold shadow-lg shadow-teal-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            Most Popular
          </div>
        </div>
      )}

      <div
        className={`relative rounded-2xl p-6 sm:p-8 h-full flex flex-col ${
          pkg.featured
            ? 'bg-[#0a1628]'
            : 'bg-[#0a1628]/80 glass-card'
        }`}
      >
        {/* Background glow for featured */}
        {pkg.featured && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        )}

        {/* Package name */}
        <div className="relative z-10">
          <h3
            className={`text-lg font-bold mb-2 ${
              pkg.featured ? 'text-teal-400' : 'text-slate-300'
            }`}
          >
            {pkg.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-1 mb-4">
            <span
              className={`text-4xl sm:text-5xl font-bold ${
                pkg.featured ? 'gradient-text' : 'text-white'
              }`}
            >
              ${pkg.price}
            </span>
          </div>

          {/* Description */}
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            {pkg.description}
          </p>

          {/* Features list */}
          <ul className="space-y-3 mb-8">
            {pkg.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    pkg.featured
                      ? 'bg-teal-500/15 text-teal-400'
                      : 'bg-slate-700/50 text-slate-400'
                  }`}
                >
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-sm text-slate-300">{feature}</span>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <div className="mt-auto">
            <Button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className={`w-full py-3 rounded-xl font-medium transition-all duration-300 ${
                pkg.featured
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 btn-shine'
                  : 'bg-transparent border border-teal-500/30 text-teal-400 hover:bg-teal-500/10 hover:border-teal-500/50'
              }`}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function PricingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="pricing" className="relative py-16 sm:py-32 overflow-x-hidden">
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
            Pricing Plans
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3">
            Simple, Transparent <span className="gradient-text">Pricing</span>
          </h2>
          <span className="section-heading-line" />
          <p className="text-slate-400 mt-6 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include quality work,
            clear communication, and timely delivery.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 items-start">
          {packages.map((pkg, index) => (
            <PricingCard
              key={pkg.name}
              pkg={pkg}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>

        {/* Glow Separator - Skills/Pricing → Testimonials */}
        <div className="glow-separator mt-16 sm:mt-32" />
      </div>
    </section>
  );
}
