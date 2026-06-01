'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderKanban,
  Calendar,
  DollarSign,
  CheckCircle2,
  X,
  Loader2,
  Inbox,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

type ProjectStatus = 'all' | 'pending' | 'in-progress' | 'review' | 'completed' | 'paused';

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  progress: number;
  priority: string;
  category: string;
  deadline: string;
  budget: string;
  milestones: { id: string; title: string; completed: boolean }[];
  notes: string;
}

const statusFilters: { key: ProjectStatus; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'review', label: 'Review' },
  { key: 'completed', label: 'Completed' },
  { key: 'paused', label: 'Paused' },
];

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25',
  'in-progress': 'bg-sky-500/15 text-sky-400 border-sky-500/25',
  review: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  completed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  paused: 'bg-slate-500/15 text-slate-400 border-slate-500/25',
};

const priorityStyles: Record<string, string> = {
  low: 'bg-emerald-500/10 text-emerald-400',
  medium: 'bg-yellow-500/10 text-yellow-400',
  high: 'bg-orange-500/10 text-orange-400',
  urgent: 'bg-red-500/10 text-red-400',
};

const progressColor = (pct: number) => {
  if (pct >= 75) return 'from-emerald-500 to-teal-400';
  if (pct >= 40) return 'from-teal-500 to-sky-400';
  if (pct >= 15) return 'from-yellow-500 to-amber-400';
  return 'from-red-500 to-orange-400';
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export default function PortalProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<ProjectStatus>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [milestonesOpen, setMilestonesOpen] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('portal_token='))
        ?.split('=')[1];
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/portal/projects', { headers });
      if (res.ok) {
        const data = await res.json();
        const list = data.data || (Array.isArray(data) ? data : []);
        setProjects(
          list.map((p: Record<string, unknown>) => ({
            id: String(p.id || Math.random().toString(36).slice(2)),
            title: (p.title as string) || 'Untitled Project',
            description: (p.description as string) || '',
            status: (p.status as string) || 'pending',
            progress: Number(p.progress) || 0,
            priority: (p.priority as string) || 'medium',
            category: (p.category as string) || 'General',
            deadline: (p.deadline as string) || (p.due_date as string) || '',
            budget: (p.budget as string) || '',
            milestones: Array.isArray(p.milestones)
              ? p.milestones.map((m: Record<string, unknown>) => ({
                  id: String(m.id || Math.random().toString(36).slice(2)),
                  title: (m.title as string) || 'Milestone',
                  completed: Boolean(m.completed),
                }))
              : [],
            notes: (p.notes as string) || '',
          }))
        );
      }
    } catch {
      // Fallback demo data
      setProjects([
        {
          id: '1',
          title: 'E-Commerce Website Redesign',
          description: 'Complete redesign of the client e-commerce platform with modern UI/UX patterns, optimized checkout flow, and mobile-first responsive design.',
          status: 'in-progress',
          progress: 65,
          priority: 'high',
          category: 'WordPress',
          deadline: '2025-08-15',
          budget: '$2,500',
          milestones: [
            { id: 'm1', title: 'Wireframes & Design Mockups', completed: true },
            { id: 'm2', title: 'Frontend Development', completed: true },
            { id: 'm3', title: 'Backend Integration', completed: false },
            { id: 'm4', title: 'Testing & QA', completed: false },
          ],
          notes: 'Client prefers a clean minimalist design with teal accents.',
        },
        {
          id: '2',
          title: 'SEO Optimization Campaign',
          description: 'Comprehensive SEO audit and optimization for the corporate website, including on-page SEO, technical fixes, and content strategy.',
          status: 'completed',
          progress: 100,
          priority: 'medium',
          category: 'SEO',
          deadline: '2025-06-30',
          budget: '$800',
          milestones: [
            { id: 'm5', title: 'SEO Audit Report', completed: true },
            { id: 'm6', title: 'On-Page Optimization', completed: true },
            { id: 'm7', title: 'Performance Optimization', completed: true },
          ],
          notes: 'Significant improvement in page speed scores achieved.',
        },
        {
          id: '3',
          title: 'Blog Content Management Setup',
          description: 'Set up a content management system for the blog section with categories, tags, and scheduled publishing.',
          status: 'pending',
          progress: 10,
          priority: 'low',
          category: 'WordPress',
          deadline: '2025-09-01',
          budget: '$1,200',
          milestones: [
            { id: 'm8', title: 'Requirements Gathering', completed: true },
            { id: 'm9', title: 'CMS Configuration', completed: false },
            { id: 'm10', title: 'Content Migration', completed: false },
          ],
          notes: '',
        },
        {
          id: '4',
          title: 'Lead Generation Landing Pages',
          description: 'Design and develop 5 high-converting landing pages for B2B lead generation campaigns with A/B testing setup.',
          status: 'review',
          progress: 85,
          priority: 'urgent',
          category: 'Design',
          deadline: '2025-07-20',
          budget: '$1,800',
          milestones: [
            { id: 'm11', title: 'Copy & Wireframes', completed: true },
            { id: 'm12', title: 'Design & Development', completed: true },
            { id: 'm13', title: 'Client Review', completed: false },
          ],
          notes: 'Waiting for client feedback on the hero section design.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filteredProjects =
    filter === 'all'
      ? projects
      : projects.filter(p => p.status.toLowerCase().replace(/\s+/g, '-') === filter);

  const formatDate = (d: string) => {
    if (!d) return 'TBD';
    try {
      return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return d;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 rounded-lg bg-white/5 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-52 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <FolderKanban className="w-6 h-6 text-teal-400" />
          Projects
        </h1>
        <span className="text-slate-400 text-sm">{filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map(sf => (
          <button
            key={sf.key}
            onClick={() => setFilter(sf.key)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === sf.key
                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/20'
                : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-teal-500/10 hover:text-teal-400 hover:border-teal-500/30'
            }`}
          >
            {sf.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-xl p-12 text-center"
        >
          <Inbox className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-400">No projects found</p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {filteredProjects.map(project => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              className="glass-card rounded-xl p-5 cursor-pointer hover-glow group"
              onClick={() => { setSelectedProject(project); setMilestonesOpen(false); }}
            >
              {/* Title & Status */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="text-white font-semibold text-sm leading-snug group-hover:text-teal-300 transition-colors">
                  {project.title}
                </h3>
                <span className={`text-xs px-2 py-0.5 rounded-md border flex-shrink-0 ${statusStyles[project.status.toLowerCase().replace(/\s+/g, '-')] || 'bg-slate-500/15 text-slate-400 border-slate-500/25'}`}>
                  {project.status}
                </span>
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-slate-300 font-medium">{project.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full bg-gradient-to-r ${progressColor(project.progress)}`}
                  />
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs">
                <span className={`px-2 py-0.5 rounded-md font-medium ${priorityStyles[project.priority] || 'bg-slate-500/10 text-slate-400'}`}>
                  {project.priority}
                </span>
                <span className="text-slate-500 flex items-center gap-1">
                  <FolderKanban className="w-3 h-3" />
                  {project.category}
                </span>
                <span className="text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(project.deadline)}
                </span>
                {project.budget && (
                  <span className="text-slate-500 flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    {project.budget}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="glass-card rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedProject.title}</h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-md border ${statusStyles[selectedProject.status.toLowerCase().replace(/\s+/g, '-')] || 'bg-slate-500/15 text-slate-400 border-slate-500/25'}`}>
                      {selectedProject.status}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${priorityStyles[selectedProject.priority] || 'bg-slate-500/10 text-slate-400'}`}>
                      {selectedProject.priority} priority
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300 font-medium">Progress</span>
                    <span className="text-white font-bold">{selectedProject.progress}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedProject.progress}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={`h-full rounded-full bg-gradient-to-r ${progressColor(selectedProject.progress)}`}
                    />
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-slate-500 text-xs mb-0.5">Category</p>
                    <p className="text-white text-sm font-medium">{selectedProject.category}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-slate-500 text-xs mb-0.5">Deadline</p>
                    <p className="text-white text-sm font-medium">{formatDate(selectedProject.deadline)}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-slate-500 text-xs mb-0.5">Budget</p>
                    <p className="text-white text-sm font-medium">{selectedProject.budget || 'N/A'}</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-white font-semibold text-sm mb-2">Description</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{selectedProject.description}</p>
                </div>

                {/* Milestones */}
                {selectedProject.milestones.length > 0 && (
                  <div>
                    <button
                      onClick={() => setMilestonesOpen(!milestonesOpen)}
                      className="flex items-center gap-2 text-white font-semibold text-sm mb-2 hover:text-teal-400 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4 text-teal-400" />
                      Milestones
                      {milestonesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <AnimatePresence>
                      {milestonesOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2 overflow-hidden"
                        >
                          {selectedProject.milestones.map(m => (
                            <div key={m.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                m.completed
                                  ? 'bg-emerald-500 border-emerald-500'
                                  : 'border-slate-500'
                              }`}>
                                {m.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                              </div>
                              <span className={`text-sm ${m.completed ? 'text-slate-400 line-through' : 'text-white'}`}>
                                {m.title}
                              </span>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Notes */}
                {selectedProject.notes && (
                  <div>
                    <h3 className="text-white font-semibold text-sm mb-2">Notes</h3>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                      <p className="text-slate-400 text-sm leading-relaxed">{selectedProject.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
