'use client';

import { useRef, useCallback, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';

interface FeaturedWorkSectionProps {
  onNavigate?: (page: string) => void;
}

const featuredProjects = [
  {
    title: 'ShopEase WooCommerce Store',
    tag: 'eCommerce',
    description:
      'Full WooCommerce build with 5,000+ products, custom checkout flow, and 95+ PageSpeed score. Generated $2M+ in annual revenue.',
    gradient: 'from-teal-500 to-cyan-500',
    geometricShape: 'circle',
  },
  {
    title: 'MedCare Health Portal',
    tag: 'Healthcare',
    description:
      'HIPAA-compliant patient portal with appointment booking, telemedicine integration, and medical records management system.',
    gradient: 'from-emerald-500 to-teal-500',
    geometricShape: 'square',
  },
  {
    title: 'PropTech Real Estate',
    tag: 'Real Estate',
    description:
      'Property listing platform with MLS/IDX integration, virtual tours, and mortgage calculator. 300% increase in leads.',
    gradient: 'from-cyan-500 to-emerald-500',
    geometricShape: 'circle',
  },
];

function FeaturedCard({
  project,
  index,
  isInView,
}: {
  project: (typeof featuredProjects)[0];
  index: number;
  isInView: boolean;
}) {
  const [shinePosition, setShinePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setShinePosition({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
      });

      card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    },
    [],
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setShinePosition({ x: 50, y: 50 });
      e.currentTarget.style.setProperty('--mouse-x', '50%');
      e.currentTarget.style.setProperty('--mouse-y', '50%');
    },
    [],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      className="glass-card card-spotlight rounded-2xl overflow-hidden group cursor-pointer hover-glow transition-transform duration-300 hover:-translate-y-1 relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Spotlight radial glow following mouse */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl z-10"
        style={{
          background: `radial-gradient(circle at ${shinePosition.x}% ${shinePosition.y}%, rgba(6, 182, 212, 0.07) 0%, transparent 60%)`,
        }}
      />

      {/* Gradient Placeholder Image Area */}
      <div
        className={`relative h-48 sm:h-56 lg:h-64 bg-gradient-to-br ${project.gradient} overflow-hidden`}
      >
        {/* Grid overlay pattern */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        {/* Dot overlay pattern */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Floating geometric shape */}
        {project.geometricShape === 'circle' ? (
          <div
            className={`absolute top-6 right-6 sm:top-10 sm:right-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${project.gradient} opacity-20 blur-[1px] group-hover:opacity-30 transition-opacity duration-500 group-hover:scale-110 transform`}
          />
        ) : (
          <div
            className={`absolute bottom-6 left-6 sm:bottom-10 sm:left-10 w-14 h-14 sm:w-18 sm:h-18 rounded-lg bg-gradient-to-br ${project.gradient} opacity-20 blur-[1px] rotate-12 group-hover:opacity-30 transition-opacity duration-500 group-hover:scale-110 transform`}
          />
        )}

        {/* Tag Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center text-xs font-medium px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-teal-300 border border-white/5">
            {project.tag}
          </span>
        </div>

        {/* External link icon on hover */}
        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
          <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <ExternalLink className="w-4 h-4 text-white/80" />
          </div>
        </div>

        {/* Bottom gradient fade into card */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0f1f38]/80 to-transparent" />
      </div>

      {/* Content Area */}
      <div className="p-5 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-teal-300 transition-colors duration-300">
          {project.title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mt-2">
          {project.description}
        </p>

        {/* View Details Link */}
        <div className="mt-4 flex items-center gap-1.5 text-teal-400 hover:text-teal-300 transition-colors duration-200 group/link cursor-pointer">
          <span className="text-sm font-medium">View Details</span>
          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform duration-200" />
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </motion.div>
  );
}

export default function FeaturedWorkSection({ onNavigate }: FeaturedWorkSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="featured-work" className="relative py-16 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dots opacity-20" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      {/* Decorative gradient blobs */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/[0.03] rounded-full blur-3xl" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="text-teal-400 text-sm font-medium uppercase tracking-widest">
            Portfolio
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <span className="section-heading-line" />
          <p className="text-slate-400 mt-6 max-w-2xl mx-auto">
            A selection of my best recent work
          </p>
        </motion.div>

        {/* Featured Cards — stacked on mobile, 3-col grid on desktop */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8">
          {featuredProjects.map((project, index) => (
            <FeaturedCard
              key={project.title}
              project={project}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center mt-10 sm:mt-16"
        >
          <button
            onClick={() => onNavigate?.('portfolio')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-teal-400 border border-teal-500/30 hover:border-teal-400/60 hover:bg-teal-500/10 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
          >
            View Full Portfolio
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
