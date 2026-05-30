'use client';

import { useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import { ChevronDown, Briefcase, Users, FolderOpen, Award, Download } from 'lucide-react';

const roles = [
  'WordPress Virtual Assistant',
  'Web Designer',
  'B2B Lead Generation Expert',
  'WordPress Developer',
];

const stats = [
  { icon: Briefcase, value: 8, suffix: '+', label: 'Years Experience' },
  { icon: Users, value: 847, suffix: '+', label: 'Happy Clients' },
  { icon: FolderOpen, value: 500, suffix: '+', label: 'Projects Completed' },
  { icon: Award, value: 'L2', label: 'Fiverr Seller' },
];

// Deterministic particles data (no Math.random to avoid hydration mismatch)
const particles = [
  { id: 0, left: '5%', size: 3, duration: 12, delay: 0, opacity: 0.4 },
  { id: 1, left: '12%', size: 4, duration: 15, delay: 2, opacity: 0.3 },
  { id: 2, left: '20%', size: 2, duration: 10, delay: 4, opacity: 0.5 },
  { id: 3, left: '28%', size: 5, duration: 18, delay: 1, opacity: 0.25 },
  { id: 4, left: '35%', size: 3, duration: 11, delay: 6, opacity: 0.45 },
  { id: 5, left: '42%', size: 4, duration: 14, delay: 3, opacity: 0.35 },
  { id: 6, left: '50%', size: 2, duration: 9, delay: 5, opacity: 0.5 },
  { id: 7, left: '58%', size: 5, duration: 16, delay: 0, opacity: 0.3 },
  { id: 8, left: '65%', size: 3, duration: 13, delay: 7, opacity: 0.4 },
  { id: 9, left: '72%', size: 4, duration: 11, delay: 2, opacity: 0.35 },
  { id: 10, left: '78%', size: 2, duration: 17, delay: 4, opacity: 0.5 },
  { id: 11, left: '85%', size: 5, duration: 12, delay: 1, opacity: 0.25 },
  { id: 12, left: '90%', size: 3, duration: 15, delay: 6, opacity: 0.4 },
  { id: 13, left: '95%', size: 4, duration: 10, delay: 3, opacity: 0.45 },
  { id: 14, left: '8%', size: 2, duration: 14, delay: 5, opacity: 0.3 },
  { id: 15, left: '18%', size: 3, duration: 16, delay: 0, opacity: 0.5 },
  { id: 16, left: '38%', size: 4, duration: 9, delay: 7, opacity: 0.35 },
  { id: 17, left: '55%', size: 3, duration: 13, delay: 2, opacity: 0.4 },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
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
    <span ref={ref} className="text-2xl sm:text-3xl font-bold gradient-text">
      {typeof value === 'number' ? `${count}${suffix}` : value}
    </span>
  );
}

function MagneticButton({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className: string;
  onClick: () => void;
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10; // max 5px movement
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
    setPosition({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  return (
    <button
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: 'transform 0.15s ease-out',
      }}
      className={className}
    >
      {children}
    </button>
  );
}

export default function HeroSection() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const mousePosition = useRef({ x: 0, y: 0 });
  const orbPosition = useRef({ x: 0, y: 0 });
  const orbRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const bgRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef({ y: 0 });

  // Typing animation (client-only via useEffect)
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
        isDeleting ? 30 : 60
      );
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, roleIndex]);

  // Parallax + Gradient orb following cursor with lerp
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleScroll = () => {
      scrollRef.current.y = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    const lerpFactor = 0.08;

    const animate = () => {
      // Orb
      orbPosition.current.x += (mousePosition.current.x - orbPosition.current.x) * lerpFactor;
      orbPosition.current.y += (mousePosition.current.y - orbPosition.current.y) * lerpFactor;

      if (orbRef.current) {
        orbRef.current.style.transform = `translate(${orbPosition.current.x - 150}px, ${orbPosition.current.y - 150}px)`;
      }

      // Parallax background
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${scrollRef.current.y * 0.3}px)`;
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const scrollToPortfolio = () => {
    document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
        style={{ backgroundImage: "url('/images/hero-bg.png')" }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/90 via-[#0a1628]/80 to-[#0a1628]" />

      {/* Animated mesh gradient orbs */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-teal-500/5 rounded-full blur-3xl mesh-gradient-orb" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl mesh-gradient-orb-delay" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/3 rounded-full blur-3xl mesh-gradient-orb-slow" />
      <div className="absolute inset-0 bg-grid opacity-30" />

      {/* Gradient Orb following cursor with breathing glow */}
      <div
        ref={orbRef}
        className="fixed pointer-events-none z-0"
        style={{ width: '300px', height: '300px' }}
      >
        <div className="w-full h-full rounded-full bg-radial-teal orb-breathe" />
      </div>

      {/* Floating Particles */}
      <div className="hero-particles">
        {particles.map((p) => (
          <div
            key={p.id}
            className="hero-particle"
            style={{
              left: p.left,
              bottom: '-10px',
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              opacity: p.opacity,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Greeting badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 availability-badge-v2"
          >
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50" />
            <span className="text-sm text-slate-300 font-medium">Available for freelance work</span>
          </motion.div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 tracking-tight">
            <span className="text-white">I&apos;m </span>
            <span className="gradient-reveal">Upam</span>
          </h1>

          {/* Typing subtitle */}
          <div className="h-12 sm:h-14 flex items-center justify-center mb-8">
            <p className="text-xl sm:text-2xl md:text-3xl text-slate-300 font-light">
              {displayedText}
              <span className="inline-block w-0.5 h-7 bg-teal-400 ml-1 animate-pulse" />
            </p>
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Specialized in WordPress site management, theme customization,
            plugin setup, speed optimization, and B2B lead generation with
            8+ years of professional experience.
          </motion.p>

          {/* CTA Buttons with Magnetic Effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <MagneticButton
              onClick={scrollToPortfolio}
              className="btn-shine group relative px-8 py-3.5 rounded-lg font-medium text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 transition-all duration-300 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 hover:scale-105"
            >
              View My Work
              <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform">
                &rarr;
              </span>
            </MagneticButton>
            <MagneticButton
              onClick={scrollToContact}
              className="px-8 py-3.5 rounded-lg font-medium text-teal-400 border border-teal-500/30 hover:border-teal-400/60 hover:bg-teal-500/10 transition-all duration-300 hover:scale-105"
            >
              Hire Me
            </MagneticButton>
          </motion.div>

          {/* Download Resume Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-6"
          >
            <a
              href="#"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-slate-400 border border-slate-600/30 hover:border-teal-500/40 hover:text-teal-400 transition-all duration-300"
            >
              <Download className="w-4 h-4" />
              Download Resume
            </a>
          </motion.div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
              className="glass-card rounded-xl p-4 sm:p-6 text-center"
            >
              <stat.icon className="w-6 h-6 text-teal-400 mx-auto mb-2" />
              {typeof stat.value === 'number' ? (
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              ) : (
                <div className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
              )}
              <div className="text-xs sm:text-sm text-slate-400 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-slate-500 uppercase tracking-widest">Scroll Down</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown className="w-5 h-5 text-teal-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}
