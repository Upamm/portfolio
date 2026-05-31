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

const tools: readonly string[] = [
  'WordPress',
  'WooCommerce',
  'Elementor',
  'Yoast SEO',
  'Astra',
  'Divi',
  'Contact Form 7',
  'WP Rocket',
  'Rank Math',
  'Mailchimp',
  'HubSpot',
  'LinkedIn Sales Nav',
  'Google Analytics',
  'Upwork',
  'Fiverr',
  'Zapier',
] as const;

const whyChooseMeItems: readonly string[] = [
  '8+ years of hands-on WordPress experience',
  '4.8/5 rating across 847+ completed projects',
  'Quick turnaround with no compromise on quality',
  'Clear communication and regular progress updates',
  'Post-project support and maintenance available',
] as const;

// Indices of tools that should span 2 columns in the bento grid
const bentoLargeIndices = new Set([0, 5, 9, 14]);

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
  readonly tool: string;
  readonly index: number;
  readonly isInView: boolean;
  readonly isLarge: boolean;
}) {
  // Alternate icon symbols for visual interest
  const icons = ['◆', '◉', '▲', '●', '★', '⬡', '♦', '◈', '▶', '⊕', '⊗', '⬢', '◎', '⬟', '⏣', '⎔'];
  const icon = icons[index % icons.length];

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
        {/* Gradient shimmer on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 via-transparent to-emerald-500/0 group-hover:from-teal-500/5 group-hover:via-transparent group-hover:to-emerald-500/5 transition-all duration-500" />

        <div className="relative flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-4">
          <span className="text-teal-400/60 text-base sm:text-lg shrink-0 group-hover:text-teal-300 transition-colors duration-300 group-hover:scale-110 transform">
            {icon}
          </span>
          <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors duration-300 truncate">
            {tool}
          </span>
        </div>

        {/* Bottom edge accent */}
        <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-teal-400 to-emerald-400 group-hover:w-full transition-all duration-500" />
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
                    key={tool}
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
