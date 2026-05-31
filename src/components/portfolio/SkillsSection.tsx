'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface SkillData {
  readonly name: string;
  readonly percentage: number;
  readonly color: string;
  readonly glowColor: string;
}

const skills: readonly SkillData[] = [
  { name: 'WordPress', percentage: 95, color: '#06b6d4', glowColor: 'rgba(6,182,212,0.35)' },
  { name: 'Theme Customization', percentage: 90, color: '#22d3ee', glowColor: 'rgba(34,211,238,0.35)' },
  { name: 'Plugin Development', percentage: 85, color: '#10b981', glowColor: 'rgba(16,185,129,0.35)' },
  { name: 'SEO Optimization', percentage: 88, color: '#14b8a6', glowColor: 'rgba(20,184,166,0.35)' },
  { name: 'Speed Optimization', percentage: 92, color: '#2dd4bf', glowColor: 'rgba(45,212,191,0.35)' },
  { name: 'B2B Lead Generation', percentage: 90, color: '#34d399', glowColor: 'rgba(52,211,153,0.35)' },
  { name: 'Data Research', percentage: 95, color: '#06b6d4', glowColor: 'rgba(6,182,212,0.35)' },
  { name: 'Virtual Assistance', percentage: 93, color: '#22d3ee', glowColor: 'rgba(34,211,238,0.35)' },
] as const;

interface ToolData {
  readonly name: string;
  readonly color: string;
  readonly logo: React.ReactNode;
}

const ToolLogoWordPress = (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5.4 8.7l3.6 5.1 1.7-2.3h1.2l-2.5 3.4 3.3 4.6h-2.9l-3.4-4.9-1.6 2.1H3.3l2.1-2.8-3.2-4.3z" fill="currentColor" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18.5c-4.7 0-8.5-3.8-8.5-8.5S7.3 3.5 12 3.5s8.5 3.8 8.5 8.5-3.8 8.5-8.5 8.5z" fill="currentColor" />
    <path d="M18.6 15.3l3.2-4.3h-2.2l-1.6 2.1-1.4-2.1h-2.3l2.5 3.4-2.5 3.4h2.2l1.7-2.3 1.4 2.3z" fill="currentColor" />
  </svg>
);

const ToolLogoWooCommerce = (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16c-.186 0-.375.003-.563.012a.26.26 0 00-.218.178c-.07.252-.148.5-.234.742a.26.26 0 00.17.334c.198.06.362.12.51.186a1.99 1.99 0 01.85.938c.094.198.17.398.23.6a.26.26 0 01-.17.323 9.48 9.48 0 01-3.82.163 8.94 8.94 0 01-2.647-.743.26.26 0 01-.094-.412 5.966 5.966 0 01.646-1.182c.204-.3.43-.584.676-.85a.26.26 0 00-.044-.387A5.965 5.965 0 017.36 5.878a.26.26 0 01.334-.063 8.95 8.95 0 013.834 3.043.26.26 0 00.387.044c.266-.246.55-.472.85-.676a5.965 5.965 0 011.182-.646.26.26 0 01.412.094c.594 1.15.95 2.474.97 3.883a.26.26 0 00.17.334 8.94 8.94 0 01.743 2.647c.06 1.3-.118 2.562-.516 3.758a.26.26 0 01-.334.17" fill="currentColor" />
  </svg>
);

const ToolLogoElementor = (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <path d="M13.578 3.05c-.086-.242-.31-.4-.564-.4H7.154c-.255 0-.478.158-.564.4l-4.342 12.07c-.13.36.136.72.507.72h2.61c.255 0 .478-.158.564-.4L7.3 12.95h4.08l.975 2.49c.086.242.31.4.564.4h2.61c.37 0 .638-.36.506-.72L13.578 3.05zm-2.082 6.4H8.704L9.6 5.87l1.896 3.58z" fill="currentColor" />
    <path d="M20.2 18.1c.19-.19.19-.5 0-.7l-2.2-2.2c-.1-.1-.23-.15-.35-.15H15c-.28 0-.5.22-.5.5v2.65c0 .28.22.5.5.5h2.65c.13 0 .25-.05.35-.15z" fill="currentColor" opacity="0.6" />
  </svg>
);

const ToolLogoYoast = (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <circle cx="12" cy="6.5" r="3" fill="currentColor" />
    <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.7" />
    <circle cx="12" cy="17.5" r="3" fill="currentColor" opacity="0.4" />
    <rect x="10" y="3" width="4" height="18" rx="1" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
  </svg>
);

const ToolLogoAstra = (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61z" fill="currentColor" />
  </svg>
);

const ToolLogoDivi = (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <rect x="3" y="6" width="4" height="12" rx="1" fill="currentColor" />
    <rect x="10" y="3" width="4" height="18" rx="1" fill="currentColor" opacity="0.8" />
    <rect x="17" y="8" width="4" height="8" rx="1" fill="currentColor" opacity="0.6" />
  </svg>
);

const ToolLogoCF7 = (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <polyline points="3,8 8,8 11,14 14,8 21,8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="3" y1="17" x2="21" y2="17" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const ToolLogoWPRocket = (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <path d="M12 2C9 2 6.5 4 6 7l1.5 1C8 6.5 9.8 4.5 12 4.5S16 6.5 16.5 8L18 7c-.5-3-3-5-6-5z" fill="currentColor" opacity="0.7" />
    <path d="M10 8l-1 8h2l-1 5 4-6h-2.5L14 8z" fill="currentColor" />
    <path d="M7 7.5l-2.5 4.5c-.3.5-.1 1.2.4 1.5l3 1.5c.5.3 1.2.1 1.5-.4L12 11l-3-1.5z" fill="currentColor" opacity="0.6" />
    <path d="M17 7.5l2.5 4.5c.3.5.1 1.2-.4 1.5l-3 1.5c-.5.3-1.2.1-1.5-.4L12 11l3-1.5z" fill="currentColor" opacity="0.6" />
  </svg>
);

const ToolLogoRankMath = (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <rect x="2" y="14" width="4" height="6" rx="0.5" fill="currentColor" />
    <rect x="8" y="10" width="4" height="10" rx="0.5" fill="currentColor" opacity="0.8" />
    <rect x="14" y="5" width="4" height="15" rx="0.5" fill="currentColor" opacity="0.6" />
    <rect x="20" y="2" width="2" height="18" rx="0.5" fill="currentColor" opacity="0.4" />
    <path d="M4 3L8 7 6 7z" fill="currentColor" opacity="0.5" />
  </svg>
);

const ToolLogoMailchimp = (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <path d="M12 2a6 6 0 00-6 6c0 .6.1 1.2.3 1.7A4 4 0 0012 16a4 4 0 002.8-1.2A5 5 0 0020 10a5 5 0 00-5-5 4.98 4.98 0 00-.7.05A6 6 0 0012 2z" fill="currentColor" opacity="0.85" />
    <circle cx="9" cy="8" r="1" fill="currentColor" opacity="0.5" />
    <circle cx="9" cy="8" r="0.4" fill="currentColor" />
    <path d="M16 3a2 2 0 01-1 3.64" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
  </svg>
);

const ToolLogoHubSpot = (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <circle cx="12" cy="12" r="3" fill="currentColor" />
    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 2a8 8 0 110 16 8 8 0 010-16z" fill="currentColor" opacity="0.3" />
    <circle cx="12" cy="5" r="1.5" fill="currentColor" opacity="0.6" />
    <circle cx="17" cy="8.5" r="1.5" fill="currentColor" opacity="0.5" />
    <circle cx="19" cy="12" r="1.5" fill="currentColor" opacity="0.4" />
  </svg>
);

const ToolLogoLinkedIn = (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="currentColor" />
  </svg>
);

const ToolLogoGoogleAnalytics = (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <path d="M20.5 6.5h-7V9h4.6A5.5 5.5 0 1112 14.5a5.47 5.47 0 01-3.2-1.04l-1.8 1.8A7.48 7.48 0 1019.5 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M20.5 2v5h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="3" y="15" width="3" height="6" rx="0.5" fill="currentColor" opacity="0.4" />
    <rect x="7" y="12" width="3" height="9" rx="0.5" fill="currentColor" opacity="0.6" />
    <rect x="11" y="9" width="3" height="12" rx="0.5" fill="currentColor" opacity="0.8" />
    <rect x="15" y="6" width="3" height="15" rx="0.5" fill="currentColor" />
  </svg>
);

const ToolLogoUpwork = (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <path d="M18.56 3.84l-3.44 8.12c-.25.6-.98.88-1.57.63l-1.5-.64 2.44-5.76a5.54 5.54 0 00-3.58-7.38 5.54 5.54 0 00-6.96 3.44l2.56 1.09a2.96 2.96 0 013.72-1.84 2.96 2.96 0 01-.63 3.72l-2.75 6.48 1.5.64c.6.25 1.33-.03 1.57-.63l1.64-3.87.33.14a7.7 7.7 0 004.34.1" fill="currentColor" />
    <path d="M2 15l4.5 6 4.5-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
  </svg>
);

const ToolLogoFiverr = (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <path d="M23 5.5V20c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V5.5c0-1.1.9-2 2-2h18c1.1 0 2 .9 2 2z" fill="currentColor" opacity="0.15" />
    <rect x="1" y="3" width="22" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    <path d="M7.5 8.5L5 18h2.2l.4-1.5h2.8L11 18h2.2L10.9 8.5zm1.6 6l.9-3.2.9 3.2z" fill="currentColor" />
    <circle cx="17" cy="13" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path d="M16 13l1-1 1 1" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ToolLogoZapier = (
  <svg viewBox="0 0 24 24" className="w-full h-full">
    <path d="M12 2L4 14h7l-3 8 12-12h-7z" fill="currentColor" />
  </svg>
);

const tools: readonly ToolData[] = [
  { name: 'WordPress',       color: '#21759B', logo: ToolLogoWordPress },
  { name: 'WooCommerce',     color: '#96588A', logo: ToolLogoWooCommerce },
  { name: 'Elementor',      color: '#92003B', logo: ToolLogoElementor },
  { name: 'Yoast SEO',      color: '#1A428A', logo: ToolLogoYoast },
  { name: 'Astra',          color: '#0369A1', logo: ToolLogoAstra },
  { name: 'Divi',           color: '#EB4D4D', logo: ToolLogoDivi },
  { name: 'Contact Form 7', color: '#2E6AB0', logo: ToolLogoCF7 },
  { name: 'WP Rocket',      color: '#F56640', logo: ToolLogoWPRocket },
  { name: 'Rank Math',      color: '#E8553D', logo: ToolLogoRankMath },
  { name: 'Mailchimp',      color: '#FFE01B', logo: ToolLogoMailchimp },
  { name: 'HubSpot',        color: '#FF7A59', logo: ToolLogoHubSpot },
  { name: 'LinkedIn Sales Nav', color: '#0A66C2', logo: ToolLogoLinkedIn },
  { name: 'Google Analytics', color: '#E37400', logo: ToolLogoGoogleAnalytics },
  { name: 'Upwork',         color: '#14A800', logo: ToolLogoUpwork },
  { name: 'Fiverr',         color: '#1DBF73', logo: ToolLogoFiverr },
  { name: 'Zapier',         color: '#FF4A00', logo: ToolLogoZapier },
] as const;

const whyChooseMeItems: readonly string[] = [
  '8+ years of hands-on WordPress experience',
  '4.8/5 rating across 847+ completed projects',
  'Quick turnaround with no compromise on quality',
  'Clear communication and regular progress updates',
  'Post-project support and maintenance available',
] as const;

// Indices of tools that should span 2 columns in the bento grid
const bentoLargeIndices = new Set<number>([0, 5, 9, 14]);

// ---------------------------------------------------------------------------
// Animated Counter Hook
// ---------------------------------------------------------------------------

function useAnimatedCounter(target: number, isInView: boolean, duration = 1.5): number {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(count, target, {
      duration,
      ease: 'easeOut',
    });
    const unsub = rounded.on('change', (v) => setDisplayValue(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [isInView, target, count, rounded, duration]);

  return displayValue;
}

// ---------------------------------------------------------------------------
// Circular Progress Ring
// ---------------------------------------------------------------------------

function CircularProgressRing({
  skill,
  index,
  isInView,
}: {
  readonly skill: SkillData;
  readonly index: number;
  readonly isInView: boolean;
}) {
  const size = 110;
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (skill.percentage / 100) * circumference;
  const displayPercentage = useAnimatedCounter(skill.percentage, isInView, 1.6);

  return (
    <div className="relative flex items-center justify-center">
      {/* Glow filter */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id={`glow-ring-${index}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient
            id={`ring-gradient-${index}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>

      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(148,163,184,0.08)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#ring-gradient-${index})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={isInView ? { strokeDashoffset: offset } : { strokeDashoffset: circumference }}
          transition={{
            duration: 1.6,
            delay: index * 0.1,
            ease: 'easeOut',
          }}
          filter={`url(#glow-ring-${index})`}
          style={{ opacity: isInView ? 1 : 0, transition: 'opacity 0.3s' }}
        />
      </svg>
      {/* Percentage label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4, delay: index * 0.1 + 0.6 }}
          className="text-2xl font-bold text-white tabular-nums"
        >
          {displayPercentage}%
        </motion.span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Skill Card
// ---------------------------------------------------------------------------

function SkillCard({
  skill,
  index,
  isInView,
}: {
  readonly skill: SkillData;
  readonly index: number;
  readonly isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group relative"
    >
      <div className="glass-card rounded-2xl p-5 sm:p-6 flex flex-col items-center gap-4 transition-all duration-500 hover:scale-[1.04] hover:border-teal-500/30 cursor-default relative overflow-hidden">
        {/* Hover glow backdrop */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 30%, ${skill.glowColor}, transparent 70%)`,
          }}
        />
        {/* Spotlight corner effect */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/10 transition-all duration-500" />

        <CircularProgressRing skill={skill} index={index} isInView={isInView} />

        <div className="relative text-center">
          <h4 className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors duration-300 leading-tight">
            {skill.name}
          </h4>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-transparent via-teal-400 to-transparent group-hover:w-3/4 transition-all duration-500" />
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Radar Chart – Premium Edition
// ---------------------------------------------------------------------------

function RadarChart({ isInView }: { readonly isInView: boolean }) {
  const radarSkills = [
    { name: 'WordPress', value: 95 },
    { name: 'Theme Dev', value: 90 },
    { name: 'SEO', value: 88 },
    { name: 'Speed Opt.', value: 92 },
    { name: 'Lead Gen', value: 90 },
    { name: 'Data Research', value: 95 },
  ];

  const chartSize = 220;
  const padding = 45;
  const size = chartSize + padding * 2;
  const center = size / 2;
  const maxRadius = 95;
  const levels = 5;
  const numAxes = radarSkills.length;

  const getPoint = (i: number, value: number) => {
    const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
    const r = (value / 100) * maxRadius;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  };

  const gridPoints = (level: number) =>
    Array.from({ length: numAxes }, (_, i) => {
      const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
      const r = (level / levels) * maxRadius;
      return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
    }).join(' ');

  const dataPoints = radarSkills.map((s, i) => getPoint(i, s.value));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ') + ' Z';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
      className="flex justify-center"
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="max-w-[320px] w-full"
      >
        {/* Defs */}
        <defs>
          <radialGradient id="radar-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(6,182,212,0.35)" />
            <stop offset="100%" stopColor="rgba(16,185,129,0.08)" />
          </radialGradient>
          <filter id="radar-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="dot-pulse-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Grid levels */}
        {[1, 2, 3, 4, 5].map((level) => (
          <polygon
            key={level}
            points={gridPoints(level)}
            fill="none"
            stroke="rgba(6,182,212,0.07)"
            strokeWidth="1"
          />
        ))}

        {/* Axis lines */}
        {radarSkills.map((_, i) => {
          const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={center + maxRadius * Math.cos(angle)}
              y2={center + maxRadius * Math.sin(angle)}
              stroke="rgba(6,182,212,0.07)"
              strokeWidth="1"
            />
          );
        })}

        {/* Data fill */}
        <motion.path
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.6 }}
          d={dataPath}
          fill="url(#radar-gradient)"
          stroke="rgba(6,182,212,0.6)"
          strokeWidth="2"
          filter="url(#radar-glow)"
        />

        {/* Data stroke (brighter overlay) */}
        <motion.path
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.8 }}
          d={dataPath}
          fill="none"
          stroke="url(#radar-gradient)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Data points with pulse */}
        {dataPoints.map((p, i) => (
          <g key={i}>
            {/* Pulse ring */}
            <motion.circle
              cx={p.x}
              cy={p.y}
              r={6}
              fill="none"
              stroke="rgba(6,182,212,0.3)"
              strokeWidth="1"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={
                isInView
                  ? { opacity: [0.4, 0, 0.4], scale: [1, 1.8, 1] }
                  : {}
              }
              transition={{
                duration: 2.5,
                delay: 1 + i * 0.15,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            {/* Dot */}
            <motion.circle
              cx={p.x}
              cy={p.y}
              r={4}
              fill="#06b6d4"
              stroke="rgba(6,182,212,0.4)"
              strokeWidth="4"
              filter="url(#dot-pulse-glow)"
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 1 + i * 0.1 }}
            />
            {/* Inner bright dot */}
            <motion.circle
              cx={p.x}
              cy={p.y}
              r={2}
              fill="#ffffff"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.3, delay: 1.2 + i * 0.1 }}
            />
          </g>
        ))}

        {/* Labels */}
        {radarSkills.map((skill, i) => {
          const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
          const labelR = maxRadius + 22;
          return (
            <motion.text
              key={i}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 1.3 + i * 0.08 }}
              x={center + labelR * Math.cos(angle)}
              y={center + labelR * Math.sin(angle)}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(148,163,184,0.85)"
              fontSize="11"
              fontWeight="500"
            >
              {skill.name}
            </motion.text>
          );
        })}
      </svg>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Bento Tool Card
// ---------------------------------------------------------------------------

function ToolBentoCard({
  tool,
  index,
  isInView,
  isLarge,
}: {
  readonly tool: ToolData;
  readonly index: number;
  readonly isInView: boolean;
  readonly isLarge: boolean;
}) {
  // Determine if brand color is light (needs dark text/icon bg)
  const isLight = tool.color === '#FFE01B';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.92 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.4,
        delay: index * 0.04,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={isLarge ? 'col-span-1 sm:col-span-2' : ''}
    >
      <div className="group relative glass-card rounded-xl overflow-hidden transition-all duration-400 hover:border-teal-500/25 hover:scale-[1.03] cursor-default h-full">
        {/* Brand-colored glow on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 20% 50%, ${tool.color}12, transparent 70%)`,
          }}
        />

        <div className="relative flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-4">
          {/* Brand Logo Container */}
          <div
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
            style={{
              backgroundColor: `${tool.color}15`,
              boxShadow: `0 0 0 1px ${tool.color}25`,
            }}
          >
            <div className="w-5 h-5 sm:w-[22px] sm:h-[22px]" style={{ color: tool.color }}>
              {tool.logo}
            </div>
          </div>
          <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors duration-300 truncate">
            {tool.name}
          </span>
        </div>

        {/* Bottom edge accent in brand color */}
        <div
          className="absolute bottom-0 left-0 w-0 h-[2px] group-hover:w-full transition-all duration-500"
          style={{ background: `linear-gradient(to right, transparent, ${tool.color}, transparent)` }}
        />
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Why Choose Me Card
// ---------------------------------------------------------------------------

function WhyChooseMeCard({ isInView }: { readonly isInView: boolean }) {
  const iconMap = ['🎯', '⭐', '⚡', '💬', '🛡️'] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
      className="relative"
    >
      {/* Premium glass card with left gradient accent */}
      <div className="relative glass-card rounded-2xl overflow-hidden">
        {/* Left accent bar */}
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-teal-400 via-cyan-400 to-emerald-400" />

        {/* Inner glow */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative p-6 sm:p-8 pl-8 sm:pl-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 flex items-center justify-center border border-teal-500/20">
              <span className="text-lg">✦</span>
            </div>
            <h4 className="text-xl font-bold text-white">Why Choose Me?</h4>
          </div>

          {/* Items */}
          <ul className="space-y-4">
            {whyChooseMeItems.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -15 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
                className="flex items-start gap-3 group/item"
              >
                <span className="w-8 h-8 rounded-lg bg-slate-800/60 flex items-center justify-center text-sm shrink-0 group-hover/item:bg-teal-500/10 transition-colors duration-300 border border-slate-700/50 group-hover/item:border-teal-500/20">
                  {iconMap[i]}
                </span>
                <span className="text-sm text-slate-400 leading-relaxed group-hover/item:text-slate-300 transition-colors duration-300 pt-1">
                  {item}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Section Heading
// ---------------------------------------------------------------------------

function SectionHeading({ isInView }: { readonly isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="text-center mb-10 sm:mb-14"
    >
      <span className="text-teal-400 text-sm font-medium uppercase tracking-widest">
        What I Know
      </span>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3">
        Skills & <span className="gradient-text">Expertise</span>
      </h2>
      <span className="section-heading-line" />
      <p className="text-slate-400 mt-6 max-w-2xl mx-auto text-base sm:text-lg">
        Continuously honing my craft across a wide range of digital skills and tools
        — delivering measurable results for every project.
      </p>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main Export
// ---------------------------------------------------------------------------

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative py-16 sm:py-20 lg:py-24 overflow-hidden"
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-dots opacity-[0.12]" />
      <div className="absolute top-0 left-0 right-0 section-divider" />

      {/* Decorative blurs */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-teal-500/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-emerald-500/[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading isInView={isInView} />

        {/* ====== SKILL CARDS GRID ====== */}
        <div className="mb-14 sm:mb-20">
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-lg sm:text-xl font-bold text-white mb-6 sm:mb-8"
          >
            Core <span className="gradient-text">Proficiencies</span>
          </motion.h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {skills.map((skill, index) => (
              <SkillCard
                key={skill.name}
                skill={skill}
                index={index}
                isInView={isInView}
              />
            ))}
          </div>
        </div>

        {/* ====== RADAR + TOOLS + WHY CHOOSE ME ====== */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          {/* Left column: Radar Chart */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h3 className="text-lg sm:text-xl font-bold text-white mb-6 sm:mb-8 text-center lg:text-left">
              Skill <span className="gradient-text">Radar</span>
            </h3>
            <RadarChart isInView={isInView} />
          </motion.div>

          {/* Right column: Tools + Why Choose Me */}
          <div className="space-y-10 lg:space-y-12">
            {/* Tools & Technologies – Bento Grid */}
            <div>
              <motion.h3
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="text-lg sm:text-xl font-bold text-white mb-6 sm:mb-8"
              >
                Tools & <span className="gradient-text">Technologies</span>
              </motion.h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {tools.map((tool, index) => (
                  <ToolBentoCard
                    key={tool.name}
                    tool={tool}
                    index={index}
                    isInView={isInView}
                    isLarge={bentoLargeIndices.has(index)}
                  />
                ))}
              </div>
            </div>

            {/* Why Choose Me */}
            <WhyChooseMeCard isInView={isInView} />
          </div>
        </div>
      </div>
    </section>
  );
}
