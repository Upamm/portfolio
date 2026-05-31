'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
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
import { allProjects, projectCategories } from './projects-data';

export default function PortfolioSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<(typeof allProjects)[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredProjects =
    activeFilter === 'All'
      ? allProjects
      : allProjects.filter((p) => p.category === activeFilter);

  const openProjectDetail = useCallback((project: (typeof allProjects)[0]) => {
    setSelectedProject(project);
    requestAnimationFrame(() => {
      setDialogOpen(true);
    });
  }, []);

  const handleDialogChange = useCallback((open: boolean) => {
    if (!open) {
      setDialogOpen(false);
      setTimeout(() => setSelectedProject(null), 200);
    }
  }, []);

  return (
    <section id="portfolio" className="relative py-10 sm:py-16 overflow-hidden">
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
          className="text-center mb-6 sm:mb-10"
        >
          <span className="text-teal-400 text-sm font-medium uppercase tracking-widest">
            My Work
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3">
            Project <span className="gradient-text">Portfolio</span>
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
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8"
        >
          {projectCategories.map((category) => (
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => {
              const IconComp = project.icon;
              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="glass-card card-spotlight rounded-2xl overflow-hidden group cursor-pointer hover-glow hover-lift"
                  onClick={() => openProjectDetail(project)}
                >
                  {/* Project Image */}
                  <div className="relative h-48 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                    {project.image && (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    )}
                    <div className="absolute inset-0 project-card-image-fade" />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 card-hover-overlay">
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
                        <IconComp className="w-3 h-3 mr-1" />
                        {project.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-teal-300 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">{project.description}</p>
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
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Project Detail Modal */}
      <Dialog open={dialogOpen} onOpenChange={handleDialogChange} modal>
        <DialogContent className="sm:max-w-lg bg-[#0f1f38] border border-teal-500/20 text-slate-200 p-0 overflow-hidden">
          {selectedProject && (
            <>
              {/* Project image in modal */}
              <div className="relative h-48 sm:h-56 bg-gradient-to-br from-slate-800 to-slate-900">
                {selectedProject.image && (
                  <Image
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 512px"
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 modal-card-image-fade" />
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
                    <a href="https://www.fiverr.com/upam1721" target="_blank" rel="noopener noreferrer">
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
