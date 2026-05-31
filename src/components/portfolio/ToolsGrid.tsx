'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface Tool {
  name: string;
  description: string;
  color: string;
  logo: React.ReactNode;
}

const toolsData: Tool[] = [
  {
    name: 'WordPress',
    description: 'Complete website management & customization',
    color: '#21759b',
    logo: (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <circle cx="16" cy="16" r="16" fill="#21759b" />
        <path d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm0 25.6A11.6 11.6 0 015 17.2l4.8-4.8 3 3-2.8 2.8L16 24.4 27.2 13.2A11.5 11.5 0 0127.6 16 11.6 11.6 0 0116 27.6zm0-23.2A11.6 11.6 0 0127 12.4L16 23.4 10.6 18l-2.4 2.4A11.6 11.6 0 0116 4.4z" fill="white" />
      </svg>
    ),
  },
  {
    name: 'WooCommerce',
    description: 'E-commerce solutions & online stores',
    color: '#7f54b3',
    logo: (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <circle cx="16" cy="16" r="16" fill="#7f54b3" />
        <text x="16" y="22" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="Arial">W</text>
      </svg>
    ),
  },
  {
    name: 'Elementor',
    description: 'Visual page builder & design',
    color: '#92003b',
    logo: (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <rect width="32" height="32" rx="8" fill="#92003b" />
        <path d="M8 16l5.5-7.5h5L13 16l5.5 7.5h-5L8 16zm10.5 0L24 8.5h-4l-3 7.5 3 7.5h4L18.5 16z" fill="white" />
      </svg>
    ),
  },
  {
    name: 'Yoast SEO',
    description: 'Search engine optimization',
    color: '#a4286a',
    logo: (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <circle cx="16" cy="16" r="16" fill="#a4286a" />
        <text x="16" y="21" textAnchor="middle" fill="white" fontSize="15" fontWeight="bold" fontFamily="Arial">Y</text>
      </svg>
    ),
  },
  {
    name: 'WP Rocket',
    description: 'Performance & caching',
    color: '#f97316',
    logo: (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <circle cx="16" cy="16" r="16" fill="#f97316" />
        <path d="M16 6l-2 6h-6l5 4-2 6 5-4 5 4-2-6 5-4h-6L16 6z" fill="white" />
      </svg>
    ),
  },
  {
    name: 'Rank Math',
    description: 'Advanced SEO analytics',
    color: '#00875a',
    logo: (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <circle cx="16" cy="16" r="16" fill="#00875a" />
        <text x="16" y="22" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="Arial">R</text>
      </svg>
    ),
  },
  {
    name: 'Astra',
    description: 'Lightweight theme framework',
    color: '#3c50e0',
    logo: (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <rect width="32" height="32" rx="8" fill="#3c50e0" />
        <path d="M10 10h12v2H10zm2 4h8v2h-8zm1 4h6v2h-6z" fill="white" />
      </svg>
    ),
  },
  {
    name: 'Divi',
    description: 'Premium WordPress theme',
    color: '#9b51e0',
    logo: (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <circle cx="16" cy="16" r="16" fill="#9b51e0" />
        <text x="16" y="21" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="serif">D</text>
      </svg>
    ),
  },
  {
    name: 'HubSpot',
    description: 'CRM & marketing automation',
    color: '#ff7a59',
    logo: (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <circle cx="16" cy="16" r="16" fill="#ff7a59" />
        <text x="16" y="21" textAnchor="middle" fill="white" fontSize="15" fontWeight="bold" fontFamily="Arial">H</text>
      </svg>
    ),
  },
  {
    name: 'Mailchimp',
    description: 'Email marketing campaigns',
    color: '#ffe01b',
    logo: (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <circle cx="16" cy="16" r="16" fill="#ffe01b" />
        <path d="M10 15c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6-6-2.7-6-6zm6-4c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm-1 3a1 1 0 100 2 1 1 0 000-2z" fill="#1a1a1a" />
      </svg>
    ),
  },
  {
    name: 'Zapier',
    description: 'Workflow automation',
    color: '#ff4a00',
    logo: (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <rect width="32" height="32" rx="8" fill="#ff4a00" />
        <path d="M18 7l-2 5h-7l6 5-2 8 7-6 1 0-2 8 7-6-1 0 6-5h-7l2-5z" fill="white" />
      </svg>
    ),
  },
  {
    name: 'Google Analytics',
    description: 'Traffic & behavior tracking',
    color: '#f9ab00',
    logo: (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <circle cx="16" cy="16" r="16" fill="#f9ab00" />
        <rect x="10" y="18" width="3" height="6" rx="1" fill="white" />
        <rect x="14.5" y="14" width="3" height="10" rx="1" fill="white" />
        <rect x="19" y="10" width="3" height="14" rx="1" fill="white" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    description: 'Professional networking & outreach',
    color: '#0a66c2',
    logo: (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <rect width="32" height="32" rx="6" fill="#0a66c2" />
        <path d="M11 14v8H8v-8h3zm0-4a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm3.5 4l.3 1h-.3v7h-3v-8h3zm8 0c-1.5 0-2.5.8-2.8 1.5V14H15v8h2.7v-4c0-1.2.5-2 1.8-2s1.5 1 1.5 2v4H24v-4.5c0-3-1.5-4.5-3.5-4.5z" fill="white" />
      </svg>
    ),
  },
  {
    name: 'Hunter.io',
    description: 'Email finder & verification',
    color: '#39c5bb',
    logo: (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <rect width="32" height="32" rx="8" fill="#39c5bb" />
        <text x="16" y="22" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="Arial">H</text>
      </svg>
    ),
  },
  {
    name: 'Notion',
    description: 'Project management & notes',
    color: '#ffffff',
    logo: (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <rect width="32" height="32" rx="6" fill="#1a1a1a" />
        <path d="M7 7h8v2H9v3h6v2H9v4h6v2H7V7zm12 0h2v8l3-4h2.5l-3 4 3.5 5H22l-2.5-3.5L17 22v-7l2-3V7z" fill="white" />
      </svg>
    ),
  },
  {
    name: 'Canva',
    description: 'Graphic design & branding',
    color: '#7d2ae8',
    logo: (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <circle cx="16" cy="16" r="16" fill="#7d2ae8" />
        <text x="16" y="22" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="Arial">C</text>
      </svg>
    ),
  },
];

function ToolCard({
  tool,
  index,
  isInView,
}: {
  tool: Tool;
  index: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.45, delay: 0.08 + index * 0.06, ease: 'easeOut' }}
      className="group relative"
      onMouseMove={(e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
        card.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
      }}
    >
      <div
        className="glass-card card-spotlight hover-glow rounded-2xl p-3 sm:p-5 w-full flex flex-col items-center justify-start gap-2 sm:gap-3 cursor-default transition-all duration-300 hover:-translate-y-1.5 h-full min-h-[90px] sm:min-h-0"
      >
        {/* Brand Logo */}
        <div
          className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl shrink-0 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl overflow-hidden ring-1 ring-white/10"
        >
          {tool.logo}
        </div>

        {/* Tool Name — always visible, truncated on mobile */}
        <span className="text-[10px] sm:text-sm font-semibold text-slate-300 group-hover:text-white transition-colors duration-300 leading-tight text-center line-clamp-1">
          {tool.name}
        </span>

        {/* Description — visible on sm+, hidden on mobile */}
        <p className="hidden sm:block text-xs text-slate-500 group-hover:text-slate-400 leading-relaxed text-center transition-colors duration-300">
          {tool.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function ToolsGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="tools" className="relative py-16 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dots opacity-15" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="text-teal-400 text-sm font-medium uppercase tracking-widest">
            My Arsenal
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3">
            Tools &amp; <span className="gradient-text">Technologies</span>
          </h2>
          <span className="section-heading-line" />
          <p className="text-slate-400 mt-6 max-w-2xl mx-auto">
            Powering my workflow with the best tools in the industry
          </p>
        </motion.div>

        {/* Tools Grid — 3 cols mobile, 4 cols sm, 6 cols lg, 8 cols xl */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4">
          {toolsData.map((tool, index) => (
            <ToolCard
              key={tool.name}
              tool={tool}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
