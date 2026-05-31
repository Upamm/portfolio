'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { homeFeaturedProjects } from './projects-data';
import type { PageKey } from './PortfolioApp';

interface FeaturedWorkSectionProps {
  onNavigate?: (page: PageKey) => void;
}

function FeaturedCard({
  project,
  index,
  isInView,
  onNavigate,
}: {
  project: (typeof homeFeaturedProjects)[0];
  index: number;
  isInView: boolean;
  onNavigate?: (page: PageKey) => void;
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const IconComp = project.icon;

  const handleClick = () => {
    onNavigate?.('portfolio');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
      className="glass-card card-spotlight rounded-2xl overflow-hidden group cursor-pointer hover-glow transition-transform duration-300 hover:-translate-y-1 relative"
      onMouseMove={(e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
        card.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
      }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
    >
      {/* Image Area */}
      <div className="relative h-44 sm:h-52 lg:h-56 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
        {/* AI-generated image */}
        <Image
          src={project.image}
          alt={project.title}
          fill
          className={`object-cover transition-all duration-700 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          onLoad={() => setImgLoaded(true)}
        />

        {/* Fallback illustration icon while image loads */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${imgLoaded ? 'opacity-0' : 'opacity-100'}`}
        >
          <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${project.gradient} flex items-center justify-center shadow-xl opacity-30`}>
            <IconComp className="w-8 h-8 sm:w-10 sm:h-10 text-white" strokeWidth={1.5} />
          </div>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10">
          <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-medium px-2.5 sm:px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-teal-300 border border-white/10">
            <IconComp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            {project.category}
          </span>
        </div>

        {/* External link on hover */}
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10">
            <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/80" />
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0a1628] to-transparent" />
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 lg:p-6">
        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white group-hover:text-teal-300 transition-colors duration-300">
          {project.title}
        </h3>
        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mt-2 line-clamp-2">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* View Details Link */}
        <div className="mt-3 sm:mt-4 flex items-center gap-1.5 text-teal-400 hover:text-teal-300 transition-colors duration-200 group/link cursor-pointer" onClick={(e) => { e.stopPropagation(); handleClick(); }}>
          <span className="text-xs sm:text-sm font-medium">View Details</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/link:translate-x-0.5 transition-transform duration-200" />
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </motion.div>
  );
}

export default function FeaturedWorkSection({ onNavigate }: FeaturedWorkSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="featured-work" className="relative py-16 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dots opacity-20" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl" />

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
            A selection of my best recent work across diverse industries
          </p>
        </motion.div>

        {/* Featured Cards — 1 col mobile, 2 col sm, 4 col lg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {homeFeaturedProjects.map((project, index) => (
            <FeaturedCard
              key={project.id}
              project={project}
              index={index}
              isInView={isInView}
              onNavigate={onNavigate}
            />
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex justify-center mt-10 sm:mt-16"
        >
          <button
            onClick={() => onNavigate?.('portfolio')}
            className="btn-shine inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 transition-all duration-300 shadow-lg shadow-teal-500/20 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
          >
            View All Projects
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
