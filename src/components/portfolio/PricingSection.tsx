'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, Sparkles, Zap, Shield, Crown } from 'lucide-react';
import ContactFormModal from './ContactFormModal';

const packages = [
  {
    name: 'Starter',
    price: 99,
    period: 'one-time',
    description: 'Perfect for getting your WordPress site up and running quickly.',
    features: [
      'Basic WordPress setup',
      'Theme installation',
      'Essential plugin setup',
      'Basic SEO configuration',
      '1 revision round',
      '3-day delivery',
    ],
    icon: Zap,
    gradient: 'from-slate-500/20 to-slate-600/20',
    borderGradient: 'from-slate-500/30 to-slate-600/30',
    featured: false,
  },
  {
    name: 'Professional',
    price: 249,
    period: 'one-time',
    description: 'Ideal for businesses wanting a polished, optimized web presence.',
    features: [
      'Custom theme customization',
      'Advanced plugin configuration',
      'Speed optimization',
      'Full SEO setup',
      '3 revision rounds',
      '30-day support',
      'Priority delivery',
    ],
    icon: Shield,
    gradient: 'from-teal-500/20 to-emerald-500/20',
    borderGradient: 'from-teal-500 to-emerald-500',
    featured: true,
  },
  {
    name: 'Premium',
    price: 499,
    period: 'one-time',
    description: 'For businesses that need a fully custom, high-performance solution.',
    features: [
      'Custom WordPress development from scratch',
      'Premium theme design',
      'Advanced performance tuning',
      'Comprehensive SEO strategy',
      'Unlimited revisions',
      '90-day priority support',
      'Dedicated project manager',
    ],
    icon: Crown,
    gradient: 'from-slate-500/20 to-slate-600/20',
    borderGradient: 'from-slate-500/30 to-slate-600/30',
    featured: false,
  },
];

function PricingCard({
  pkg,
  index,
  isInView,
  onGetStarted,
}: {
  pkg: (typeof packages)[0];
  index: number;
  isInView: boolean;
  onGetStarted: (planName: string) => void;
}) {
  const IconComp = pkg.icon;

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

        {/* Package name & icon */}
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                pkg.featured
                  ? 'bg-teal-500/15 text-teal-400'
                  : 'bg-slate-700/50 text-slate-400'
              }`}
            >
              <IconComp className="w-4.5 h-4.5" />
            </div>
            <h3
              className={`text-lg font-bold ${
                pkg.featured ? 'text-teal-400' : 'text-slate-300'
              }`}
            >
              {pkg.name}
            </h3>
          </div>

          {/* Price with attractive display font */}
          <div className="flex items-baseline gap-0 mb-1">
            <span className={`price-display ${pkg.featured ? 'gradient-text' : 'text-white'}`}>
              <span className="price-currency">$</span>
              {pkg.price}
              <span className="price-period">/{pkg.period}</span>
            </span>
          </div>
          <div className="h-px bg-white/5 my-4" />

          {/* Description */}
          <p className="text-slate-400 text-sm leading-relaxed mb-5">
            {pkg.description}
          </p>

          {/* Features list */}
          <ul className="space-y-3 mb-8 flex-1">
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
            <button
              onClick={() => onGetStarted(pkg.name)}
              className={`w-full py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                pkg.featured
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 btn-shine hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-transparent border border-teal-500/30 text-teal-400 hover:bg-teal-500/10 hover:border-teal-500/50 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function PricingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');

  const handleGetStarted = (planName: string) => {
    setSelectedPlan(planName);
    setContactModalOpen(true);
  };

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
              onGetStarted={handleGetStarted}
            />
          ))}
        </div>

        {/* Bottom trust note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center text-xs text-slate-500 mt-8 sm:mt-12"
        >
          All plans include free consultation &bull; No hidden fees &bull; 100% satisfaction guarantee
        </motion.p>

        {/* Glow Separator */}
        <div className="glow-separator mt-16 sm:mt-32" />
      </div>

      {/* Contact Form Modal */}
      <ContactFormModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        prefillSubject={`Inquiry about ${selectedPlan} Plan`}
      />
    </section>
  );
}
