'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import {
  MapPin,
  Clock,
  Globe,
  MessageCircle,
  Star,
  Download,
  Award,
  Users,
  CheckCircle2,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ABOUT_IMAGE = '/about-portrait.png';

const quickInfo = [
  { icon: MapPin, label: 'Location', value: 'Bangladesh' },
  { icon: Clock, label: 'Experience', value: '8+ Years' },
  { icon: Globe, label: 'Availability', value: 'Full Time' },
  { icon: MessageCircle, label: 'Languages', value: 'English' },
];

const highlights = [
  'WordPress Management & Customization',
  'B2B Lead Generation & Research',
  'Speed Optimization & SEO',
  'WooCommerce & E-commerce',
  'Virtual Assistant Services',
  'Plugin Configuration',
];

const stats = [
  { value: '847+', label: 'Happy Clients', color: 'text-teal-400' },
  { value: '500+', label: 'Projects Done', color: 'text-emerald-400' },
  { value: '4.8', label: 'Avg Rating', color: 'text-yellow-400' },
  { value: '8+', label: 'Years Exp.', color: 'text-cyan-400' },
];

export default function AboutSection() {
  const { toast } = useToast();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="about" className="relative pt-10 sm:pt-16 pb-4 lg:pt-16 lg:pb-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-4 lg:mb-6"
        >
          <span className="text-teal-400 text-xs font-medium uppercase tracking-widest">
            Get to Know Me
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-2">
            About <span className="gradient-text">Me</span>
          </h2>
        </motion.div>

        {/* Main About Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative rounded-2xl lg:rounded-3xl overflow-hidden glass-card border border-white/[0.06]"
        >
          {/* Top gradient accent line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/40 to-transparent" />

          <div className="flex flex-col lg:flex-row">
            {/* ===== Left: Image Panel ===== */}
            <div className="relative lg:w-[380px] xl:w-[420px] shrink-0">
              {/* Image fills the full height on desktop */}
              <div className="relative h-64 sm:h-72 lg:h-full min-h-[280px] lg:min-h-[520px]">
                <Image
                  src={ABOUT_IMAGE}
                  alt="Upam - WordPress Virtual Assistant & B2B Lead Generation Specialist"
                  fill
                  sizes="(max-width: 1024px) 100vw, 420px"
                  className="object-cover object-center"
                  priority
                />
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 about-image-fade" />
                <div className="absolute inset-0 about-image-fade-secondary" />

                {/* Badges overlay on image - positioned at top for both mobile and desktop */}
                <div className="absolute top-0 left-0 right-0 p-4 lg:p-0 flex flex-wrap gap-2 lg:flex-col lg:gap-3 lg:top-6 lg:left-6 lg:right-auto lg:p-0">
                  {/* Level 2 Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    <div className="glass-card rounded-lg px-3 py-2 flex items-center gap-2 shadow-lg shadow-teal-500/10 border border-teal-500/20">
                      <Award className="w-4 h-4 text-teal-400" />
                      <span className="text-teal-400 font-semibold text-xs">Level 2 Seller</span>
                    </div>
                  </motion.div>

                  {/* Rating Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.5 }}
                  >
                    <div className="glass-card rounded-lg px-3 py-2 flex items-center gap-2 shadow-lg shadow-yellow-500/5 border border-yellow-500/10">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-white font-bold text-xs">4.8</span>
                      <span className="text-slate-400 text-[10px]">(847)</span>
                    </div>
                  </motion.div>

                  {/* Clients Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.6 }}
                  >
                    <div className="glass-card rounded-lg px-3 py-2 flex items-center gap-2 shadow-lg shadow-emerald-500/10 border border-emerald-500/10">
                      <Users className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold text-xs">847+ Clients</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* ===== Right: Content Panel ===== */}
            <div className="flex-1 p-5 sm:p-6 lg:p-8 xl:p-10 flex flex-col">
              {/* Name + Title */}
              <div className="mb-3 lg:mb-4">
                <span className="text-teal-400/70 text-xs font-medium uppercase tracking-wider">Hello! I&apos;m</span>
                <div className="flex items-center gap-3 mt-1">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                    Upam
                  </h3>
                  <div className="hidden sm:block h-px flex-1 bg-gradient-to-r from-teal-500/30 to-transparent max-w-[120px]" />
                </div>
                <p className="text-base sm:text-lg text-teal-400 font-semibold mt-1">
                  WordPress VA & B2B Lead Generation <span className="gradient-text">Specialist</span>
                </p>
              </div>

              {/* Bio - Compact */}
              <div className="space-y-2.5 text-slate-400 leading-relaxed text-sm sm:text-[15px] mb-5 lg:mb-6">
                <p>
                  I&apos;m a highly skilled WordPress Virtual Assistant and B2B Lead Generation specialist with over 8 years of professional experience. I&apos;ve helped hundreds of businesses establish and maintain their online presence through expert WordPress management and digital solutions.
                </p>
                <p>
                  My expertise spans WordPress site management, custom theme customization, plugin configuration, and performance optimization. I take pride in delivering clean, fast, and secure websites that drive real results for my clients.
                </p>
              </div>

              {/* Stats Row - Horizontal compact */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-5 lg:mb-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.08 }}
                    className="text-center rounded-xl p-2.5 sm:p-3 bg-white/[0.03] border border-white/[0.04]"
                  >
                    <div className={`text-lg sm:text-xl font-bold ${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-500 mt-0.5">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Skills - Compact 2-column */}
              <div className="mb-5 lg:mb-6">
                <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                  <Zap className="w-3 h-3 text-teal-400" />
                  What I Do Best
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {highlights.map((item, index) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: 8 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.3, delay: 0.4 + index * 0.04 }}
                      className="flex items-center gap-2 text-xs sm:text-sm text-slate-300"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      <span>{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quick Info - Inline horizontal */}
              <div className="flex flex-wrap gap-2 mb-5 lg:mb-6">
                {quickInfo.map((info, index) => (
                  <motion.div
                    key={info.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.06 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05] text-xs"
                  >
                    <info.icon className="w-3.5 h-3.5 text-teal-400" />
                    <span className="text-slate-500">{info.label}:</span>
                    <span className="text-white font-medium">{info.value}</span>
                  </motion.div>
                ))}
              </div>

              {/* Spacer to push buttons to bottom */}
              <div className="flex-1 min-h-[8px]" />

              {/* Action Buttons - Bottom aligned */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.7 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-4 border-t border-white/[0.05]"
              >
                <a
                  href="https://www.fiverr.com/upam1721"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 transition-all duration-300 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 hover:scale-[1.02] btn-shine"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Fiverr Profile
                </a>
                <button
                  onClick={() => toast({ title: 'Resume Available', description: 'Resume PDF will be available for download soon. Contact me to request a copy!' })}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-teal-400 border border-teal-500/30 hover:border-teal-400/60 hover:bg-teal-500/10 transition-all duration-300 hover:scale-[1.02]"
                >
                  <Download className="w-4 h-4" />
                  Download Resume
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Glow Separator - About → Experience */}
        <div className="glow-separator mt-6 lg:mt-8" />
      </div>
    </section>
  );
}
