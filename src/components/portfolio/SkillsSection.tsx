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
  readonly icon: string;
  readonly particles: readonly string[];
}

const skills: readonly SkillData[] = [
  { name: 'WordPress', percentage: 95, color: '#06b6d4', glowColor: 'rgba(6,182,212,0.35)', icon: 'W', particles: ['⚪', '🔷', '⬡'] },
  { name: 'Theme Customization', percentage: 90, color: '#22d3ee', glowColor: 'rgba(34,211,238,0.35)', icon: '🎨', particles: ['◆', '◇', '✦'] },
  { name: 'Plugin Development', percentage: 85, color: '#10b981', glowColor: 'rgba(16,185,129,0.35)', icon: '⚡', particles: ['⚡', '⎔', '✧'] },
  { name: 'SEO Optimization', percentage: 88, color: '#14b8a6', glowColor: 'rgba(20,184,166,0.35)', icon: '🔍', particles: ['↑', '📊', '✦'] },
  { name: 'Speed Optimization', percentage: 92, color: '#2dd4bf', glowColor: 'rgba(45,212,191,0.35)', icon: '🚀', particles: ['»', '≫', '⟫'] },
  { name: 'B2B Lead Generation', percentage: 90, color: '#34d399', glowColor: 'rgba(52,211,153,0.35)', icon: '🎯', particles: ['◎', '◉', '⊕'] },
  { name: 'Data Research', percentage: 95, color: '#06b6d4', glowColor: 'rgba(6,182,212,0.35)', icon: '📈', particles: ['◐', '◑', '◈'] },
  { name: 'Virtual Assistance', percentage: 93, color: '#22d3ee', glowColor: 'rgba(34,211,238,0.35)', icon: '🤝', particles: ['✉', '☑', '⬢'] },
] as const;

interface ToolData {
  readonly name: string;
  readonly color: string;
  readonly logoFile: string;
  readonly category: 'cms' | 'plugin' | 'seo' | 'marketing' | 'analytics' | 'automation';
  readonly description: string;
}

const tools: readonly ToolData[] = [
  { name: 'WordPress',       color: '#21759B', logoFile: 'wordpress',     category: 'cms',         description: 'Content Management System' },
  { name: 'WooCommerce',     color: '#96588A', logoFile: 'woocommerce',   category: 'cms',         description: 'E-Commerce Platform' },
  { name: 'Elementor',       color: '#92003B', logoFile: 'elementor',     category: 'plugin',      description: 'Page Builder' },
  { name: 'Astra',           color: '#0369A1', logoFile: 'astra',         category: 'cms',         description: 'Theme Framework' },
  { name: 'Divi',            color: '#EB4D4D', logoFile: 'divi',          category: 'cms',         description: 'Theme & Builder' },
  { name: 'Yoast SEO',       color: '#1A428A', logoFile: 'yoast',         category: 'seo',         description: 'SEO Plugin' },
  { name: 'Rank Math',       color: '#E8553D', logoFile: 'rankmath',      category: 'seo',         description: 'SEO Plugin' },
  { name: 'Contact Form 7',  color: '#2E6AB0', logoFile: 'contactform7',  category: 'plugin',      description: 'Form Builder' },
  { name: 'WP Rocket',      color: '#F56640', logoFile: 'wprocket',      category: 'plugin',      description: 'Caching & Speed' },
  { name: 'Google Analytics', color: '#E37400', logoFile: 'googleanalytics', category: 'analytics', description: 'Web Analytics' },
  { name: 'Mailchimp',      color: '#FFE01B', logoFile: 'mailchimp',     category: 'marketing',   description: 'Email Marketing' },
  { name: 'HubSpot',         color: '#FF7A59', logoFile: 'hubspot',       category: 'marketing',   description: 'CRM & Marketing' },
  { name: 'LinkedIn Sales Nav', color: '#0A66C2', logoFile: 'linkedin',  category: 'marketing',   description: 'B2B Lead Generation' },
  { name: 'Zapier',          color: '#FF4A00', logoFile: 'zapier',       category: 'automation',  description: 'Workflow Automation' },
] as const;

const whyChooseMeItems: readonly string[] = [
  '8+ years of hands-on WordPress experience',
  '4.8/5 rating across 847+ completed projects',
  'Quick turnaround with no compromise on quality',
  'Clear communication and regular progress updates',
  'Post-project support and maintenance available',
] as const;

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
      <div
        className="glass-card rounded-2xl p-5 sm:p-6 flex flex-col items-center gap-4 transition-all duration-500 hover:scale-[1.04] hover:border-teal-500/30 cursor-default relative overflow-hidden"
        onMouseMove={(e) => {
          const card = e.currentTarget;
          const rect = card.getBoundingClientRect();
          card.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
          card.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
        }}
      >
        {/* Mouse-following spotlight */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle 120px at var(--mouse-x, 50%) var(--mouse-y, 50%), ${skill.glowColor}, transparent 70%)`,
            }}
          />
        </div>

        {/* Hover glow backdrop */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 30%, ${skill.glowColor}, transparent 70%)`,
          }}
        />

        {/* Animated floating particles on hover */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          {skill.particles.map((particle, pIdx) => (
            <span
              key={pIdx}
              className="absolute text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{
                left: `${20 + pIdx * 30}%`,
                top: `${15 + ((pIdx + index) % 3) * 30}%`,
                animationDelay: `${pIdx * 0.4 + index * 0.2}s`,
                animation: 'skill-particle-float 3s ease-in-out infinite',
                filter: `drop-shadow(0 0 4px ${skill.color})`,
                color: skill.color,
                fontSize: '10px',
              }}
              aria-hidden="true"
            >
              {particle}
            </span>
          ))}
          {/* Extra small dots */}
          {[0, 1, 2].map((d) => (
            <span
              key={`dot-${d}`}
              className="absolute w-1 h-1 rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-500"
              style={{
                left: `${10 + d * 35 + index * 5}%`,
                top: `${60 + d * 15}%`,
                backgroundColor: skill.color,
                animation: `skill-particle-float ${2.5 + d * 0.5}s ease-in-out infinite`,
                animationDelay: `${d * 0.6}s`,
              }}
              aria-hidden="true"
            />
          ))}
        </div>

        {/* Scanning line effect on hover */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div
            className="absolute left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100"
            style={{
              background: `linear-gradient(to right, transparent, ${skill.color}, transparent)`,
              animation: 'skill-scan-line 2.5s ease-in-out infinite',
            }}
          />
        </div>

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
// Radar Chart
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

        {[1, 2, 3, 4, 5].map((level) => (
          <polygon
            key={level}
            points={gridPoints(level)}
            fill="none"
            stroke="rgba(6,182,212,0.07)"
            strokeWidth="1"
          />
        ))}

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

        {dataPoints.map((p, i) => (
          <g key={i}>
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
// Tool Brand Logo Card
// ---------------------------------------------------------------------------

function ToolBrandCard({
  tool,
  index,
  isInView,
}: {
  readonly tool: ToolData;
  readonly index: number;
  readonly isInView: boolean;
}) {
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
      className="group"
    >
      <div className="relative glass-card rounded-xl overflow-hidden transition-all duration-400 hover:border-teal-500/25 hover:scale-[1.03] cursor-default h-full">
        {/* Brand-colored glow on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 20% 50%, ${tool.color}12, transparent 70%)`,
          }}
        />

        <div className="relative flex items-center gap-3.5 px-4 py-3.5 sm:px-5 sm:py-4">
          {/* Brand Logo Container */}
          <div
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
            style={{
              backgroundColor: `${tool.color}15`,
              boxShadow: `0 0 0 1px ${tool.color}25`,
            }}
          >
            {/* CSS Mask: SVG acts as shape, brand color fills it */}
            <div
              className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px]"
              style={{
                WebkitMaskImage: `url(/logos/${tool.logoFile}.svg)`,
                maskImage: `url(/logos/${tool.logoFile}.svg)`,
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                backgroundColor: tool.color,
              }}
              aria-hidden="true"
            />
          </div>

          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors duration-300 truncate">
              {tool.name}
            </span>
            <span className="text-[11px] text-slate-500 group-hover:text-slate-400 transition-colors duration-300 truncate">
              {tool.description}
            </span>
          </div>
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

          {/* Right column: Tools & Technologies + Why Choose Me */}
          <div className="space-y-10 lg:space-y-12">
            {/* Tools & Technologies – Brand Logo Grid */}
            <div>
              <motion.h3
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="text-lg sm:text-xl font-bold text-white mb-6 sm:mb-8"
              >
                Tools & <span className="gradient-text">Technologies</span>
              </motion.h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {tools.map((tool, index) => (
                  <ToolBrandCard
                    key={tool.name}
                    tool={tool}
                    index={index}
                    isInView={isInView}
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
