'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const categories = ['All', 'WordPress', 'E-Commerce', 'Lead Gen', 'Design'];

const projects = [
  {
    title: 'E-Commerce WordPress Store',
    category: 'E-Commerce',
    description: 'Full-featured WooCommerce store with payment integration',
    fullDescription: 'Built a complete e-commerce platform using WooCommerce with secure payment gateway integration, inventory management, order tracking, and a responsive design that increased online sales by 35%.',
    gradient: 'from-teal-600 to-cyan-600',
    tags: ['WooCommerce', 'Elementor'],
  },
  {
    title: 'Business Corporate Website',
    category: 'WordPress',
    description: 'Professional corporate site with custom theme and animations',
    fullDescription: 'Designed and developed a modern corporate website with custom theme development, smooth animations, responsive layout, and SEO optimization that improved organic traffic by 45%.',
    gradient: 'from-emerald-600 to-teal-600',
    tags: ['Custom Theme', 'Astra'],
  },
  {
    title: 'Real Estate Portal',
    category: 'WordPress',
    description: 'Property listing website with advanced search and filtering',
    fullDescription: 'Created a comprehensive real estate portal with advanced property search, map integration, virtual tours, agent management system, and lead capture forms for a major property agency.',
    gradient: 'from-cyan-600 to-teal-600',
    tags: ['WP Residence', 'Maps API'],
  },
  {
    title: 'Healthcare Website',
    category: 'WordPress',
    description: 'Medical practice website with appointment booking system',
    fullDescription: 'Developed a healthcare website for a medical practice featuring online appointment booking, patient portal, doctor profiles, service listings, and HIPAA-compliant contact forms.',
    gradient: 'from-teal-500 to-emerald-500',
    tags: ['Healthcare', 'Booking'],
  },
  {
    title: 'Restaurant & Food Delivery',
    category: 'E-Commerce',
    description: 'Restaurant website with online ordering and delivery tracking',
    fullDescription: 'Built a restaurant website with full online ordering system, menu management, delivery tracking integration, table reservation system, and customer loyalty program.',
    gradient: 'from-emerald-500 to-cyan-500',
    tags: ['Food Delivery', 'WooCommerce'],
  },
  {
    title: 'B2B Lead Generation Campaign',
    category: 'Lead Gen',
    description: 'Comprehensive lead research campaign with 5000+ verified contacts',
    fullDescription: 'Executed a large-scale B2B lead generation campaign delivering 5000+ verified contacts across multiple industries with decision-maker contacts, company profiles, and verified email addresses.',
    gradient: 'from-cyan-500 to-teal-500',
    tags: ['Data Research', 'LinkedIn'],
  },
];

export default function PortfolioSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredProjects =
    activeFilter === 'All'
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  const openProjectDetail = useCallback((project: (typeof projects)[0]) => {
    setSelectedProject(project);
    // Use requestAnimationFrame to ensure state is set before dialog opens
    requestAnimationFrame(() => {
      setDialogOpen(true);
    });
  }, []);

  const handleDialogChange = useCallback((open: boolean) => {
    if (!open) {
      setDialogOpen(false);
      // Delay clearing selected project to allow close animation
      setTimeout(() => setSelectedProject(null), 200);
    }
  }, []);

  return (
    <section id="portfolio" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dots opacity-15" />
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
          <span className="section-heading-line" />
          <p className="text-slate-400 mt-6 max-w-2xl mx-auto">
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
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="glass-card rounded-2xl overflow-hidden group cursor-pointer hover-glow"
                onClick={() => openProjectDetail(project)}
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
          </AnimatePresence>
        </div>
      </div>

      {/* Project Detail Modal */}
      <Dialog open={dialogOpen} onOpenChange={handleDialogChange} modal>
        <DialogContent className="sm:max-w-lg bg-[#0f1f38] border border-teal-500/20 text-slate-200 p-0 overflow-hidden">
          {selectedProject && (
            <>
              {/* Gradient header image */}
              <div className={`relative h-48 sm:h-56 bg-gradient-to-br ${selectedProject.gradient}`}>
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full border-2 border-white/20 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full border-2 border-white/30" />
                  </div>
                </div>
                {/* Category badge */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-black/30 backdrop-blur-sm text-white border-white/10 text-xs">
                    {selectedProject.category}
                  </Badge>
                </div>
              </div>

              <div className="p-6">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-white mt-2">
                    {selectedProject.title}
                  </DialogTitle>
                  <DialogDescription className="text-slate-400 text-sm mt-2 leading-relaxed">
                    {selectedProject.fullDescription}
                  </DialogDescription>
                </DialogHeader>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <DialogFooter className="mt-6 gap-3">
                  <Button
                    asChild
                    className="btn-shine bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-medium shadow-lg shadow-teal-500/20"
                  >
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Live Site
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDialogChange(false)}
                    className="border-slate-600/50 text-slate-300 hover:text-white hover:border-slate-500"
                  >
                    Close
                  </Button>
                </DialogFooter>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
