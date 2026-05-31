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
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FIVERR_IMAGE = 'https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_original/v1/attachments/profile/photo/c4f0de1b0c500594ed3b984332754e19-1551338465000/ade0268f-4643-49c9-804b-c301b683facb.jpg';

const quickInfo = [
  { icon: MapPin, label: 'Location', value: 'Bangladesh' },
  { icon: Clock, label: 'Experience', value: '8+ Years' },
  { icon: Globe, label: 'Availability', value: 'Full Time' },
  { icon: MessageCircle, label: 'Languages', value: 'English' },
];

const highlights = [
  'WordPress Site Management & Customization',
  'B2B Lead Generation & Data Research',
  'Speed Optimization & SEO',
  'WooCommerce & E-commerce Setup',
  'Virtual Assistant Services',
  'Plugin Configuration & Maintenance',
];

export default function AboutSection() {
  const { toast } = useToast();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="relative py-16 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="text-teal-400 text-sm font-medium uppercase tracking-widest">
            Get to Know Me
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3">
            About <span className="gradient-text">Me</span>
          </h2>
          <span className="section-heading-line" />
          <p className="text-slate-400 mt-6 max-w-2xl mx-auto">
            A passionate WordPress Virtual Assistant and B2B Lead Generation specialist dedicated to helping businesses thrive online.
          </p>
        </motion.div>

        {/* Two-column: Image + Text */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* ===== Image Side ===== */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center lg:justify-start"
          >
            <div className="relative">
              {/* Animated glow behind image */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 blur-xl animate-pulse-glow" />

              {/* Main profile image */}
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-[340px] lg:h-[340px] rounded-2xl overflow-hidden animated-border z-10">
                <Image
                  src={FIVERR_IMAGE}
                  alt="Upam - WordPress Virtual Assistant & B2B Lead Generation Specialist"
                  fill
                  sizes="(max-width: 640px) 288px, (max-width: 1024px) 320px, 340px"
                  className="object-cover object-top"
                  priority
                />
                {/* Subtle overlay gradient at bottom for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/40 to-transparent" />
              </div>

              {/* Level 2 Seller Badge - Top Left */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute -top-3 -left-3 z-20"
              >
                <div className="glass-card rounded-xl px-3 py-2 flex items-center gap-2 shadow-lg shadow-teal-500/10">
                  <Award className="w-4 h-4 text-teal-400" />
                  <span className="text-teal-400 font-semibold text-xs sm:text-sm">Level 2 Seller</span>
                </div>
              </motion.div>

              {/* Rating Badge - Bottom Right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="absolute -bottom-3 -right-3 z-20"
              >
                <div className="glass-card rounded-xl px-4 py-2.5 flex items-center gap-2 shadow-lg shadow-teal-500/10">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <div className="text-sm">
                    <span className="text-white font-bold">4.8</span>
                    <span className="text-slate-400 text-xs ml-1">(847)</span>
                  </div>
                </div>
              </motion.div>

              {/* Clients Badge - Bottom Left */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="absolute -bottom-3 -left-3 z-20"
              >
                <div className="glass-card rounded-xl px-3 py-2 flex items-center gap-2 shadow-lg shadow-emerald-500/10">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold text-xs sm:text-sm">847+ Clients</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* ===== Text Side ===== */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Greeting + Title */}
            <div className="mb-2">
              <span className="text-teal-400 text-sm font-medium">Hello! I&apos;m</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Upam
            </h3>
            <p className="text-lg sm:text-xl text-teal-400 font-semibold mb-6">
              WordPress VA & B2B Lead Generation{' '}
              <span className="gradient-text">Specialist</span>
            </p>

            {/* Bio */}
            <div className="space-y-4 text-slate-400 leading-relaxed text-sm sm:text-base">
              <p>
                I&apos;m a highly skilled WordPress Virtual Assistant and B2B Lead Generation specialist with over 8 years of professional experience. I&apos;ve helped hundreds of businesses establish and maintain their online presence through expert WordPress management and digital solutions.
              </p>
              <p>
                My expertise spans WordPress site management, custom theme customization, plugin configuration, and performance optimization. I take pride in delivering clean, fast, and secure websites that drive real results for my clients.
              </p>
              <p>
                As a <span className="text-white font-medium">Level 2 Seller</span> on Fiverr with <span className="text-white font-medium">847+ five-star reviews</span>, I&apos;ve built a reputation for reliability, attention to detail, and exceeding client expectations on every project I take on.
              </p>
            </div>

            {/* Skills/What I Do highlights */}
            <div className="mt-8">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">What I Do Best</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {highlights.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: 10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.05 }}
                    className="flex items-center gap-2.5 text-sm text-slate-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-8">
              {quickInfo.map((info, index) => (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  className="glass-card rounded-xl p-3 sm:p-4 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center shrink-0">
                    <info.icon className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{info.label}</p>
                    <p className="text-sm font-medium text-white">{info.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 1 }}
              className="mt-8 flex flex-col sm:flex-row items-center sm:items-start gap-3 w-full sm:w-auto"
            >
              <a
                href="https://www.fiverr.com/upam1721"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 transition-all duration-300 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 hover:scale-[1.03] btn-shine"
              >
                <ExternalLink className="w-4 h-4" />
                View Fiverr Profile
              </a>
              <button
                onClick={() => toast({ title: 'Resume Available', description: 'Resume PDF will be available for download soon. Contact me to request a copy!' })}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-teal-400 border border-teal-500/30 hover:border-teal-400/60 hover:bg-teal-500/10 transition-all duration-300 hover:scale-[1.03]"
              >
                <Download className="w-4 h-4" />
                Download Resume
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Glow Separator - About → Experience */}
        <div className="glow-separator mt-16 sm:mt-32" />
      </div>
    </section>
  );
}
