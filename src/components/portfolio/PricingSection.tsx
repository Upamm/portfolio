'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Check,
  Sparkles,
  Zap,
  Shield,
  Crown,
  MessageSquare,
  Clock,
  FileText,
  Rocket,
  Handshake,
  Headphones,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  ThumbsUp,
  RefreshCcw,
} from 'lucide-react';
import ContactFormModal from './ContactFormModal';

const packages = [
  {
    name: 'Starter',
    price: 99,
    period: 'one-time',
    description: 'Perfect for getting your WordPress site up and running quickly with essential features.',
    features: [
      'Basic WordPress installation & setup',
      'Responsive theme installation & configuration',
      'Essential plugin setup (SEO, Security, Backup)',
      'Basic on-page SEO configuration',
      'Contact form integration',
      'Mobile responsiveness check',
      '1 revision round',
      '3-day delivery',
    ],
    icon: Zap,
    gradient: 'from-slate-500/20 to-slate-600/20',
    borderGradient: 'from-slate-500/30 to-slate-600/30',
    featured: false,
    bestFor: 'Personal blogs, simple business sites, landing pages',
    deliveryTime: '3 business days',
    revisions: '1 Round',
  },
  {
    name: 'Professional',
    price: 249,
    period: 'one-time',
    description: 'Ideal for businesses wanting a polished, high-performance web presence that converts.',
    features: [
      'Custom theme design & full customization',
      'Advanced plugin configuration & optimization',
      'Speed optimization (90+ PageSpeed score)',
      'Full SEO setup (on-page + technical)',
      'E-commerce ready (WooCommerce setup)',
      'Analytics & conversion tracking integration',
      '3 revision rounds',
      '30-day post-launch support',
      'Priority delivery (5 business days)',
    ],
    icon: Shield,
    gradient: 'from-teal-500/20 to-emerald-500/20',
    borderGradient: 'from-teal-500 to-emerald-500',
    featured: true,
    bestFor: 'Growing businesses, online stores, service providers',
    deliveryTime: '5 business days',
    revisions: '3 Rounds',
  },
  {
    name: 'Premium',
    price: 499,
    period: 'one-time',
    description: 'For businesses that need a fully custom, enterprise-grade WordPress solution.',
    features: [
      'Custom WordPress development from scratch',
      'Premium theme design with unique branding',
      'Advanced performance tuning & caching',
      'Comprehensive SEO strategy & implementation',
      'Custom functionality & plugin development',
      'CRM & marketing automation integration',
      'Security hardening & monitoring setup',
      'Unlimited revisions',
      '90-day priority support',
      'Dedicated project manager',
    ],
    icon: Crown,
    gradient: 'from-slate-500/20 to-slate-600/20',
    borderGradient: 'from-slate-500/30 to-slate-600/30',
    featured: false,
    bestFor: 'Enterprises, large stores, custom web applications',
    deliveryTime: '10 business days',
    revisions: 'Unlimited',
  },
];

// Client Understanding steps
const clientProcess = [
  {
    step: 1,
    icon: MessageSquare,
    title: 'Discovery Call',
    description: 'We start with a free consultation to understand your business, goals, target audience, and design preferences. This helps me tailor the perfect solution.',
    color: 'from-teal-500 to-cyan-500',
  },
  {
    step: 2,
    icon: FileText,
    title: 'Proposal & Agreement',
    description: 'I provide a detailed project proposal with scope, timeline, deliverables, and pricing. Everything is transparent — no hidden costs, no surprises.',
    color: 'from-cyan-500 to-emerald-500',
  },
  {
    step: 3,
    icon: Rocket,
    title: 'Build & Iterate',
    description: 'Your project goes into development with regular progress updates. You\'ll see milestones and can provide feedback at each stage through revisions.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    step: 4,
    icon: ThumbsUp,
    title: 'Launch & Support',
    description: 'After your approval, I launch your site and provide post-launch support. Training, documentation, and ongoing assistance are included.',
    color: 'from-teal-500 to-emerald-500',
  },
];

// What clients get
const clientGuarantees = [
  {
    icon: Handshake,
    title: 'No Hidden Fees',
    description: 'The price you see is the price you pay. No surprise charges, no upselling during the project.',
  },
  {
    icon: RefreshCcw,
    title: 'Satisfaction Guarantee',
    description: 'If you\'re not happy with the work, I\'ll revise it until it meets your expectations within the agreed scope.',
  },
  {
    icon: Clock,
    title: 'On-Time Delivery',
    description: 'Projects are delivered on the committed timeline. If there are delays, you\'ll be notified in advance.',
  },
  {
    icon: Headphones,
    title: 'Ongoing Communication',
    description: 'Stay informed with regular progress updates. I\'m available via Fiverr messages, email, or your preferred channel.',
  },
  {
    icon: AlertCircle,
    title: 'Transparent Process',
    description: 'You\'ll always know what\'s happening with your project. Clear milestones, real-time updates, and open dialogue.',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'All websites are built with best-practice security, regular backups, and reliable hosting recommendations.',
  },
];

// Pricing FAQs
const pricingFaqs = [
  {
    question: 'Can I upgrade my plan later?',
    answer: 'Absolutely! You can start with any plan and upgrade as your needs grow. The price difference will be calculated proportionally based on the additional work required.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'I offer revisions within the agreed scope to ensure you\'re satisfied. If for any reason we can\'t meet your expectations after revisions, we can discuss a partial refund based on work completed.',
  },
  {
    question: 'What if I need features outside the plan scope?',
    answer: 'Custom requirements beyond the plan scope are billed separately. I\'ll provide a clear quote for additional work before starting, so you always know the cost upfront.',
  },
  {
    question: 'How do revisions work?',
    answer: 'Each plan includes a set number of revision rounds. A revision round means you can request changes to the design, layout, or functionality within the original project scope. Major scope changes may require additional fees.',
  },
  {
    question: 'What happens after the support period ends?',
    answer: 'After your support period (30 or 90 days), you can continue with optional maintenance plans or request support on an hourly/project basis. I\'m always available for future projects.',
  },
  {
    question: 'Do you work with clients outside Fiverr?',
    answer: 'Yes! While Fiverr is my primary platform, I also work directly with clients for larger projects. Contact me to discuss direct engagement options.',
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
      className={`relative rounded-2xl p-[1.5px] h-full ${
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
        className={`relative rounded-2xl p-5 sm:p-7 lg:p-8 h-full flex flex-col ${
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
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                pkg.featured
                  ? 'bg-teal-500/15 text-teal-400'
                  : 'bg-slate-700/50 text-slate-400'
              }`}
            >
              <IconComp className="w-5 h-5" />
            </div>
            <h3
              className={`text-lg sm:text-xl font-bold ${
                pkg.featured ? 'text-teal-400' : 'text-slate-200'
              }`}
            >
              {pkg.name}
            </h3>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-0 mb-1">
            <span className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${pkg.featured ? 'gradient-text' : 'text-white'}`}>
              <span className="text-2xl sm:text-3xl font-bold text-slate-400">$</span>
              {pkg.price}
            </span>
            <span className="text-sm sm:text-base text-slate-500 ml-1">/{pkg.period}</span>
          </div>

          {/* Best For & Delivery Info */}
          <div className="flex flex-wrap items-center gap-2 mt-3 mb-4">
            <span className="text-xs px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
              {pkg.deliveryTime}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {pkg.revisions}
            </span>
          </div>

          {/* Best for tag */}
          <p className="text-xs sm:text-sm text-slate-500 italic mb-2">
            Best for: {pkg.bestFor}
          </p>

          <div className="h-px bg-white/5 my-4" />

          {/* Description */}
          <p className="text-slate-300 text-sm leading-relaxed mb-5">
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
                <span className="text-sm text-slate-200 leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <div className="mt-auto">
            <button
              onClick={() => onGetStarted(pkg.name)}
              className={`inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer ${
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

function ProcessStep({
  step,
  icon: IconComp,
  title,
  description,
  color,
  index,
  isInView,
}: {
  step: number;
  icon: typeof MessageSquare;
  title: string;
  description: string;
  color: string;
  index: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.12 }}
      className="relative"
    >
      <div className="glass-card rounded-2xl p-5 sm:p-6 h-full hover-glow transition-all duration-300 group">
        {/* Step number + icon */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <IconComp className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Step</span>
            <span className="text-xl font-extrabold gradient-text">{step}</span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
      </div>

      {/* Connector arrow (hidden on last item and mobile) */}
      {step < 4 && (
        <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10">
          <ArrowRight className="w-4 h-4 text-teal-500/40" />
        </div>
      )}
    </motion.div>
  );
}

function GuaranteeCard({
  icon: IconComp,
  title,
  description,
  index,
  isInView,
}: {
  icon: typeof Handshake;
  title: string;
  description: string;
  index: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.05 + index * 0.08 }}
      className="glass-card rounded-xl p-5 hover-glow transition-all duration-300 group"
    >
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500/15 to-emerald-500/15 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
          <IconComp className="w-5 h-5 text-teal-400" />
        </div>
        <div>
          <h4 className="text-sm sm:text-base font-bold text-white mb-1">{title}</h4>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

function PricingFaqItem({
  question,
  answer,
  isOpen,
  onToggle,
  index,
  isInView,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: 0.05 + index * 0.06 }}
      className="h-full"
    >
      <button
        onClick={onToggle}
        className="w-full h-full glass-card rounded-xl p-4 sm:p-5 text-left hover-glow transition-all duration-300 cursor-pointer"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center shrink-0 mt-0.5">
            <HelpCircle className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm sm:text-base font-semibold text-white">{question}</h4>
            {isOpen && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="text-sm text-slate-400 leading-relaxed mt-2"
              >
                {answer}
              </motion.p>
            )}
          </div>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-teal-500/20 text-teal-400' : 'bg-slate-700/50 text-slate-500'}`}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>
    </motion.div>
  );
}

export default function PricingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleGetStarted = (planName: string) => {
    setSelectedPlan(planName);
    setContactModalOpen(true);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section id="pricing" className="relative py-10 sm:py-16 overflow-x-hidden">
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
          className="text-center mb-6 sm:mb-10"
        >
          <span className="text-teal-400 text-sm font-medium uppercase tracking-widest">
            Pricing Plans
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 text-white">
            Simple, Transparent <span className="gradient-text">Pricing</span>
          </h2>
          <span className="section-heading-line" />
          <p className="text-slate-300 mt-6 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed">
            Choose the plan that fits your needs. All plans include quality work,
            clear communication, and timely delivery. No hidden fees, no surprises.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 items-stretch">
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-400 mt-6 sm:mt-8"
        >
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-teal-400" />
            Free consultation
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-teal-400" />
            No hidden fees
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-teal-400" />
            100% satisfaction guarantee
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-teal-400" />
            Secure payment via Fiverr
          </span>
        </motion.div>

        {/* ===== CLIENT UNDERSTANDING SECTION ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mt-10 sm:mt-14 mb-6 sm:mb-10"
        >
          <span className="text-teal-400 text-sm font-medium uppercase tracking-widest">
            How It Works
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-3 text-white">
            Client <span className="gradient-text">Understanding</span>
          </h2>
          <span className="section-heading-line" />
          <p className="text-slate-300 mt-5 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed">
            I believe in complete transparency. Here&apos;s exactly what you can expect when we work together — from first contact to post-launch support.
          </p>
        </motion.div>

        {/* Process Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {clientProcess.map((item, index) => (
            <ProcessStep
              key={item.step}
              step={item.step}
              icon={item.icon}
              title={item.title}
              description={item.description}
              color={item.color}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>

        {/* What You Get — Guarantees */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 sm:mb-10"
        >
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">What You Get With Every Plan</h3>
              <p className="text-sm text-slate-400">My commitment to your project success</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {clientGuarantees.map((item, index) => (
              <GuaranteeCard
                key={item.title}
                icon={item.icon}
                title={item.title}
                description={item.description}
                index={index}
                isInView={isInView}
              />
            ))}
          </div>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8 sm:mb-12"
        >
          <div className="pricing-table-glow rounded-2xl overflow-hidden max-w-3xl mx-auto">
            <div className="p-5 sm:p-6 border-b border-white/5">
              <h3 className="text-lg sm:text-xl font-bold text-white">Quick Plan Comparison</h3>
              <p className="text-sm text-slate-400 mt-1">See what&apos;s included in each plan at a glance</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px]">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left p-4 sm:p-5 text-sm font-semibold text-slate-400">Feature</th>
                    <th className="text-center p-4 sm:p-5 text-sm font-semibold text-slate-300 w-28">Starter</th>
                    <th className="text-center p-4 sm:p-5 text-sm font-semibold text-teal-400 w-28 bg-teal-500/5">Professional</th>
                    <th className="text-center p-4 sm:p-5 text-sm font-semibold text-slate-300 w-28">Premium</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { feature: 'Custom Design', starter: false, pro: true, premium: true },
                    { feature: 'Speed Optimization', starter: false, pro: true, premium: true },
                    { feature: 'Full SEO Setup', starter: false, pro: true, premium: true },
                    { feature: 'E-commerce Ready', starter: false, pro: true, premium: true },
                    { feature: 'Custom Functionality', starter: false, pro: false, premium: true },
                    { feature: 'Analytics Integration', starter: false, pro: true, premium: true },
                    { feature: 'Security Hardening', starter: false, pro: false, premium: true },
                    { feature: 'Revisions', starter: '1 Round', pro: '3 Rounds', premium: 'Unlimited' },
                    { feature: 'Support Period', starter: 'None', pro: '30 Days', premium: '90 Days' },
                    { feature: 'Dedicated PM', starter: false, pro: false, premium: true },
                  ].map((row, i) => (
                    <tr key={row.feature} className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                      <td className="p-4 sm:p-5 text-slate-300">{row.feature}</td>
                      <td className={`p-4 sm:p-5 text-center ${row.starter === false ? 'text-slate-600' : row.starter === true ? 'text-teal-400' : 'text-slate-300'}`}>
                        {row.starter === false ? '—' : row.starter === true ? <Check className="w-4 h-4 mx-auto text-teal-400" /> : row.starter}
                      </td>
                      <td className={`p-4 sm:p-5 text-center bg-teal-500/5 ${row.pro === false ? 'text-slate-600' : row.pro === true ? 'text-teal-400' : 'text-slate-300'}`}>
                        {row.pro === false ? '—' : row.pro === true ? <Check className="w-4 h-4 mx-auto text-teal-400" /> : row.pro}
                      </td>
                      <td className={`p-4 sm:p-5 text-center ${row.premium === false ? 'text-slate-600' : row.premium === true ? 'text-teal-400' : 'text-slate-300'}`}>
                        {row.premium === false ? '—' : row.premium === true ? <Check className="w-4 h-4 mx-auto text-teal-400" /> : row.premium}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Pricing FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-6 sm:mb-10"
        >
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">Common Questions About Pricing</h3>
              <p className="text-sm text-slate-400">Everything you need to know before getting started</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            {pricingFaqs.map((faq, index) => (
              <PricingFaqItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFaq === index}
                onToggle={() => toggleFaq(index)}
                index={index}
                isInView={isInView}
              />
            ))}
          </div>
        </motion.div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="glass-card rounded-2xl p-6 sm:p-10 text-center relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3">
              Not Sure Which Plan Is <span className="gradient-text">Right for You?</span>
            </h3>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed">
              Let&apos;s discuss your project and I&apos;ll recommend the best approach. Get a free consultation with no obligation — I&apos;ll provide honest advice and a clear quote.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={() => handleGetStarted('Custom')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 btn-shine hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                Get Free Consultation
              </button>
              <a
                href="https://www.fiverr.com/upam1721"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 rounded-xl font-semibold text-sm border border-teal-500/30 text-teal-400 hover:bg-teal-500/10 hover:border-teal-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                View on Fiverr
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>

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
