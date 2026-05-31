'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { ChevronDown, Briefcase, Users, FolderOpen, Award, Download, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FIVERR_IMAGE = 'https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_original/v1/attachments/profile/photo/c4f0de1b0c500594ed3b984332754e19-1551338465000/ade0268f-4643-49c9-804b-c301b683facb.jpg';

const roles = [
  'WordPress Virtual Assistant',
  'Web Designer',
  'B2B Lead Generation Expert',
  'WordPress Developer',
];

const stats = [
  { icon: Briefcase, value: 8, suffix: '+', label: 'Years Exp.' },
  { icon: Users, value: 847, suffix: '+', label: 'Clients' },
  { icon: FolderOpen, value: 500, suffix: '+', label: 'Projects' },
  { icon: Award, value: 'L2', label: 'Fiverr Level' },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const steps = 40;
    const duration = 1500;
    const stepTime = duration / steps;
    const increment = value / steps;
    let current = 0;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      current += increment;
      if (step >= steps) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref} className="text-xl sm:text-2xl font-bold gradient-text">
      {count}{suffix}
    </span>
  );
}

export default function HeroSection() {
  const { toast } = useToast();
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Typing animation
  useEffect(() => {
    const currentRole = roles[roleIndex];
    let timeout: NodeJS.Timeout;
    if (!isDeleting && displayedText === currentRole) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayedText === '') {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      }, 300);
    } else {
      timeout = setTimeout(
        () => {
          setDisplayedText(
            isDeleting
              ? currentRole.substring(0, displayedText.length - 1)
              : currentRole.substring(0, displayedText.length + 1)
          );
        },
        isDeleting ? 25 : 50
      );
    }
    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, roleIndex]);

  return (
    <section
      id="home"
      className="relative flex items-center justify-center overflow-hidden pt-14 sm:pt-16"
      style={{ minHeight: '100svh' }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/hero-bg.png')" }} />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/90 via-[#0a1628]/80 to-[#0a1628]" />
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-teal-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="absolute inset-0 bg-grid opacity-20" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full py-4 sm:py-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Availability badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-3 sm:mb-7"
          >
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs sm:text-sm text-slate-300 font-medium">Available for freelance work</span>
          </motion.div>

          {/* Profile Image + Main Heading */}
          <div className="flex items-center justify-center gap-4 sm:gap-5 mb-2 sm:mb-4">
            {/* Small avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-full overflow-hidden shrink-0 ring-2 ring-teal-500/30 ring-offset-2 ring-offset-[#0a1628]"
            >
              <Image
                src={FIVERR_IMAGE}
                alt="Upam"
                fill
                sizes="56px"
                className="object-cover object-top"
                priority
              />
            </motion.div>
            <div className="text-left">
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
                <span className="text-white">I&apos;m </span>
                <span className="gradient-text">Upam</span>
              </h1>
            </div>
          </div>

          {/* Typing subtitle */}
          <div className="h-8 sm:h-12 flex items-center justify-center mb-4 sm:mb-7">
            <p className="text-lg sm:text-xl md:text-2xl text-slate-300 font-light">
              {displayedText}
              <span className="inline-block w-0.5 h-5 sm:h-6 bg-teal-400 ml-1 animate-pulse" />
            </p>
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-5 sm:mb-9 leading-relaxed px-2"
          >
            Specialized in WordPress site management, theme customization,
            speed optimization, and B2B lead generation with 8+ years of experience.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 px-4"
          >
            <a
              href="#portfolio"
              onClick={(e) => {
                e.preventDefault();
                const nav = (window as unknown as Record<string, unknown>).__navigateTo as ((p: string) => void) | undefined;
                nav?.('portfolio');
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 transition-all duration-200 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 hover:scale-[1.03] active:scale-[0.98]"
            >
              View My Work
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                const nav = (window as unknown as Record<string, unknown>).__navigateTo as ((p: string) => void) | undefined;
                nav?.('contact');
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium text-teal-400 border border-teal-500/30 hover:border-teal-400/60 hover:bg-teal-500/10 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
            >
              Hire Me
            </a>
          </motion.div>

          {/* Download Resume */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-4"
          >
            <button
              onClick={() => toast({ title: 'Resume Available', description: 'Contact me to request a copy!' })}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-400 border border-slate-600/30 hover:border-teal-500/40 hover:text-teal-400 transition-all duration-200"
            >
              <Download className="w-3.5 h-3.5" />
              Download Resume
            </button>
          </motion.div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-6 sm:mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.1 + index * 0.1 }}
              className="glass-card rounded-xl p-2.5 sm:p-4 text-center"
            >
              <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400 mx-auto mb-1" />
              {typeof stat.value === 'number' ? (
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              ) : (
                <div className="text-lg sm:text-2xl font-bold gradient-text">{stat.value}</div>
              )}
              <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Down */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
      >
        <span className="text-[10px] text-slate-500 uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown className="w-4 h-4 text-teal-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}
