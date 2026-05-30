'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Clock, Globe, MessageCircle, Star } from 'lucide-react';
import Image from 'next/image';

const quickInfo = [
  { icon: MapPin, label: 'Location', value: 'Bangladesh' },
  { icon: Clock, label: 'Experience', value: '8+ Years' },
  { icon: Globe, label: 'Availability', value: 'Full Time' },
  { icon: MessageCircle, label: 'Languages', value: 'English' },
];

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-0 left-0 right-0 section-divider" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-teal-400 text-sm font-medium uppercase tracking-widest">
            Get to Know Me
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3">
            About <span className="gradient-text">Me</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center lg:justify-start"
          >
            <div className="relative">
              {/* Decorative border */}
              <div className="absolute -inset-3 rounded-2xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 blur-sm" />
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden animated-border">
                <Image
                  src="/images/avatar.png"
                  alt="Upam - WordPress Virtual Assistant"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Rating Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute -bottom-4 -right-4 glass-card rounded-xl px-4 py-3 flex items-center gap-2"
              >
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <div className="text-sm">
                  <span className="text-white font-semibold">4.8</span>
                  <span className="text-slate-400 ml-1">(847)</span>
                </div>
              </motion.div>
              {/* Level Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="absolute -top-4 -left-4 glass-card rounded-xl px-4 py-2"
              >
                <span className="text-teal-400 font-semibold text-sm">Level 2 Seller</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Text Side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              WordPress VA & B2B Lead Generation{' '}
              <span className="gradient-text">Specialist</span>
            </h3>

            <div className="space-y-4 text-slate-400 leading-relaxed">
              <p>
                I&apos;m Upam, a highly skilled WordPress Virtual Assistant and B2B
                Lead Generation specialist with over 8 years of professional
                experience. I&apos;ve helped hundreds of businesses establish and
                maintain their online presence through expert WordPress management
                and digital solutions.
              </p>
              <p>
                My expertise spans WordPress site management, custom theme
                customization, plugin configuration, and performance optimization.
                I take pride in delivering clean, fast, and secure websites that
                drive results for my clients.
              </p>
              <p>
                As a Level 2 Seller on Fiverr with 847+ five-star reviews, I&apos;ve
                built a reputation for reliability, attention to detail, and
                exceeding client expectations on every project.
              </p>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-8">
              {quickInfo.map((info, index) => (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
