'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const toolsData = [
  { shortCode: 'WP', name: 'WordPress', description: 'Complete website management & customization' },
  { shortCode: 'WC', name: 'WooCommerce', description: 'E-commerce solutions & online stores' },
  { shortCode: 'EL', name: 'Elementor', description: 'Visual page builder & design' },
  { shortCode: 'YS', name: 'Yoast SEO', description: 'Search engine optimization' },
  { shortCode: 'WR', name: 'WP Rocket', description: 'Performance & caching' },
  { shortCode: 'RM', name: 'Rank Math', description: 'Advanced SEO analytics' },
  { shortCode: 'AS', name: 'Astra', description: 'Lightweight theme framework' },
  { shortCode: 'DV', name: 'Divi', description: 'Premium WordPress theme' },
  { shortCode: 'HS', name: 'HubSpot', description: 'CRM & marketing automation' },
  { shortCode: 'MC', name: 'Mailchimp', description: 'Email marketing campaigns' },
  { shortCode: 'ZP', name: 'Zapier', description: 'Workflow automation' },
  { shortCode: 'GA', name: 'Google Analytics', description: 'Traffic & behavior tracking' },
  { shortCode: 'LI', name: 'LinkedIn', description: 'Professional networking & outreach' },
  { shortCode: 'HU', name: 'Hunter.io', description: 'Email finder & verification' },
  { shortCode: 'NO', name: 'Notion', description: 'Project management & notes' },
  { shortCode: 'CA', name: 'Canva', description: 'Graphic design & branding' },
];

function ToolCard({
  tool,
  index,
  isInView,
}: {
  tool: (typeof toolsData)[0];
  index: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.45, delay: 0.08 + index * 0.06, ease: 'easeOut' }}
      className="group relative flex flex-col items-center text-center"
      onMouseMove={(e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
        card.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
      }}
    >
      <div className="glass-card card-spotlight hover-glow rounded-2xl p-4 sm:p-5 w-full flex flex-col items-center gap-3 cursor-default transition-all duration-300 hover:-translate-y-1.5">
        {/* Short code circle */}
        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:shadow-teal-500/40 group-hover:scale-110 transition-all duration-300">
          <span className="text-sm sm:text-base font-bold text-white tracking-wide">
            {tool.shortCode}
          </span>
        </div>

        {/* Tool name */}
        <span className="text-xs sm:text-sm font-semibold text-slate-300 group-hover:text-teal-300 transition-colors duration-300 leading-tight">
          {tool.name}
        </span>

        {/* Description — slides up on hover */}
        <motion.p
          initial={false}
          className="text-[10px] sm:text-xs text-slate-500 group-hover:text-slate-400 leading-relaxed opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none"
        >
          {tool.description}
        </motion.p>
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
            Tools & <span className="gradient-text">Technologies</span>
          </h2>
          <span className="section-heading-line" />
          <p className="text-slate-400 mt-6 max-w-2xl mx-auto">
            Powering my workflow with the best tools in the industry
          </p>
        </motion.div>

        {/* Tools Grid — 4 cols mobile, 6 cols tablet, 8 cols desktop */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4">
          {toolsData.map((tool, index) => (
            <ToolCard
              key={tool.shortCode}
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
