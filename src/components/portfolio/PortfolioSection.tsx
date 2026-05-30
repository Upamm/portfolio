'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const categories = ['All', 'WordPress', 'E-Commerce', 'Lead Gen', 'Design'];

const projects = [
  {
    title: 'E-Commerce WordPress Store',
    category: 'E-Commerce',
    description: 'Full-featured WooCommerce store with payment integration',
    gradient: 'from-teal-600 to-cyan-600',
    tags: ['WooCommerce', 'Elementor'],
  },
  {
    title: 'Business Corporate Website',
    category: 'WordPress',
    description: 'Professional corporate site with custom theme and animations',
    gradient: 'from-emerald-600 to-teal-600',
    tags: ['Custom Theme', 'Astra'],
  },
  {
    title: 'Real Estate Portal',
    category: 'WordPress',
    description: 'Property listing website with advanced search and filtering',
    gradient: 'from-cyan-600 to-teal-600',
    tags: ['WP Residence', 'Maps API'],
  },
  {
    title: 'Healthcare Website',
    category: 'WordPress',
    description: 'Medical practice website with appointment booking system',
    gradient: 'from-teal-500 to-emerald-500',
    tags: ['Healthcare', 'Booking'],
  },
  {
    title: 'Restaurant & Food Delivery',
    category: 'E-Commerce',
    description: 'Restaurant website with online ordering and delivery tracking',
    gradient: 'from-emerald-500 to-cyan-500',
    tags: ['Food Delivery', 'WooCommerce'],
  },
  {
    title: 'B2B Lead Generation Campaign',
    category: 'Lead Gen',
    description: 'Comprehensive lead research campaign with 5000+ verified contacts',
    gradient: 'from-cyan-500 to-teal-500',
    tags: ['Data Research', 'LinkedIn'],
  },
];

export default function PortfolioSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredProjects =
    activeFilter === 'All'
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <section id="portfolio" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-15" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-teal-400 text-sm font-medium uppercase tracking-widest">
            My Work
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
            A showcase of my recent work across various industries and technologies.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-4 sm:px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === category
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/20'
                  : 'glass-card text-slate-300 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.title}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="glass-card rounded-2xl overflow-hidden group cursor-pointer hover-glow"
            >
              {/* Image Placeholder */}
              <div
                className={`relative h-48 bg-gradient-to-br ${project.gradient} overflow-hidden`}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                {/* Decorative elements */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-white/30" />
                  </div>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform">
                    <ExternalLink className="w-5 h-5 text-white" />
                  </div>
                </div>
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <Badge
                    variant="secondary"
                    className="bg-black/30 backdrop-blur-sm text-white border-white/10 text-xs"
                  >
                    {project.category}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-teal-300 transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-400 text-sm mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
