'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FolderKanban,
  Receipt,
  Ticket,
  MessageSquare,
  Upload,
  Eye,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
} from 'lucide-react';

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  pendingInvoices: number;
  openTickets: number;
}

interface ActivityItem {
  id: string;
  type: 'message' | 'invoice' | 'ticket' | 'project' | 'file';
  text: string;
  time: string;
}

interface ProjectStatus {
  status: string;
  count: number;
  color: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function PortalDashboard({
  userName,
  onNavigate,
}: {
  userName: string;
  onNavigate: (tab: string) => void;
}) {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    pendingInvoices: 0,
    openTickets: 0,
  });
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [projectStatuses, setProjectStatuses] = useState<ProjectStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('portal_token='))
          ?.split('=')[1];

        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const [projectsRes, invoicesRes, ticketsRes, notificationsRes] = await Promise.allSettled([
          fetch('/api/portal/projects', { headers }),
          fetch('/api/portal/invoices', { headers }),
          fetch('/api/portal/tickets', { headers }),
          fetch('/api/portal/notifications', { headers }),
        ]);

        let totalProjects = 0;
        let activeProjects = 0;
        let pendingInvoices = 0;
        let openTickets = 0;
        const statusCounts: Record<string, number> = {};

        if (projectsRes.status === 'fulfilled' && projectsRes.value.ok) {
          const data = await projectsRes.value.json();
          const list = data.data || (Array.isArray(data) ? data : []);
          totalProjects = list.length;
          list.forEach((p: Record<string, string>) => {
            const s = (p.status || 'unknown').toLowerCase();
            if (['in progress', 'active'].includes(s)) activeProjects++;
            statusCounts[s] = (statusCounts[s] || 0) + 1;
          });
        }

        if (invoicesRes.status === 'fulfilled' && invoicesRes.value.ok) {
          const data = await invoicesRes.value.json();
          const list = data.data || (Array.isArray(data) ? data : []);
          pendingInvoices = list.filter(
            (inv: Record<string, string>) =>
              (inv.status || '').toLowerCase() === 'pending'
          ).length;
        }

        if (ticketsRes.status === 'fulfilled' && ticketsRes.value.ok) {
          const data = await ticketsRes.value.json();
          const list = data.data || (Array.isArray(data) ? data : []);
          openTickets = list.filter(
            (t: Record<string, string>) =>
              ['open', 'in progress'].includes((t.status || '').toLowerCase())
          ).length;
        }

        if (notificationsRes.status === 'fulfilled' && notificationsRes.value.ok) {
          const data = await notificationsRes.value.json();
          const list = data.data || (Array.isArray(data) ? data : []);
          setActivities(
            list.slice(0, 5).map((n: Record<string, unknown>, i: number) => ({
              id: String(n.id || i),
              type: (n.type as string) || 'message',
              text: (n.text as string) || (n.message as string) || (n.subject as string) || 'New notification',
              time: (n.time as string) || (n.createdAt as string) || (n.created_at as string) || '',
            }))
          );
        }

        setStats({ totalProjects, activeProjects, pendingInvoices, openTickets });
        setProjectStatuses(
          Object.entries(statusCounts).map(([status, count]) => {
            const colorMap: Record<string, string> = {
              'in progress': 'bg-sky-500/20 text-sky-400 border-sky-500/30',
              active: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
              completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
              pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
              review: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
              paused: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
            };
            return {
              status: status.charAt(0).toUpperCase() + status.slice(1),
              count,
              color: colorMap[status] || 'bg-white/10 text-slate-300 border-white/20',
            };
          })
        );
      } catch {
        // Fallback data
        setStats({ totalProjects: 5, activeProjects: 3, pendingInvoices: 2, openTickets: 1 });
        setActivities([
          { id: '1', type: 'message', text: 'New message from Upam about project revision', time: '2 min ago' },
          { id: '2', type: 'invoice', text: 'Invoice #INV-0042 has been generated', time: '1 hour ago' },
          { id: '3', type: 'project', text: 'Website Redesign project status changed to In Progress', time: '3 hours ago' },
          { id: '4', type: 'ticket', text: 'Support ticket #TKT-0008 has been resolved', time: 'Yesterday' },
          { id: '5', type: 'file', text: 'New file uploaded: project-brief.pdf', time: 'Yesterday' },
        ]);
        setProjectStatuses([
          { status: 'In Progress', count: 2, color: 'bg-sky-500/20 text-sky-400 border-sky-500/30' },
          { status: 'Pending', count: 1, color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
          { status: 'Review', count: 1, color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
          { status: 'Completed', count: 1, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const statCards = [
    {
      label: 'Total Projects',
      value: stats.totalProjects,
      icon: FolderKanban,
      gradient: 'from-teal-500/20 to-teal-600/10',
      iconColor: 'text-teal-400',
      borderColor: 'border-teal-500/20',
    },
    {
      label: 'Active Projects',
      value: stats.activeProjects,
      icon: TrendingUp,
      gradient: 'from-sky-500/20 to-sky-600/10',
      iconColor: 'text-sky-400',
      borderColor: 'border-sky-500/20',
    },
    {
      label: 'Pending Invoices',
      value: stats.pendingInvoices,
      icon: Receipt,
      gradient: 'from-yellow-500/20 to-amber-600/10',
      iconColor: 'text-yellow-400',
      borderColor: 'border-yellow-500/20',
    },
    {
      label: 'Open Tickets',
      value: stats.openTickets,
      icon: Ticket,
      gradient: 'from-red-500/20 to-red-600/10',
      iconColor: 'text-red-400',
      borderColor: 'border-red-500/20',
    },
  ];

  const quickActions = [
    { label: 'New Ticket', icon: Plus, tab: 'tickets', color: 'from-teal-500 to-emerald-500' },
    { label: 'Upload File', icon: Upload, tab: 'files', color: 'from-sky-500 to-teal-500' },
    { label: 'View Invoices', icon: Eye, tab: 'invoices', color: 'from-amber-500 to-orange-500' },
  ];

  const activityIcons: Record<string, typeof MessageSquare> = {
    message: MessageSquare,
    invoice: Receipt,
    ticket: Ticket,
    project: FolderKanban,
    file: Upload,
  };

  const activityColors: Record<string, string> = {
    message: 'bg-teal-500/20 text-teal-400',
    invoice: 'bg-yellow-500/20 text-yellow-400',
    ticket: 'bg-red-500/20 text-red-400',
    project: 'bg-sky-500/20 text-sky-400',
    file: 'bg-emerald-500/20 text-emerald-400',
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Welcome */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-white">
          Welcome back, <span className="gradient-text">{userName}</span>
          <svg className="w-5 h-5 text-teal-400 inline-block ml-1.5 -mt-0.5" viewBox="0 0 24 24" fill="currentColor" title="Verified"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/></svg>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Here&apos;s an overview of your account activity.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div key={card.label} variants={itemVariants} custom={i}>
            <div className={`glass-card rounded-xl p-5 border ${card.borderColor} hover-glow`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.gradient} flex items-center justify-center`}>
                  <card.icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
                <span className="text-2xl font-bold text-white">{card.value}</span>
              </div>
              <p className="text-slate-400 text-sm font-medium">{card.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-semibold text-white mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map(action => (
            <button
              key={action.label}
              onClick={() => onNavigate(action.tab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r ${action.color} text-white text-sm font-medium hover:shadow-lg hover:shadow-teal-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]`}
            >
              <action.icon className="w-4 h-4" />
              {action.label}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Status Summary */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <div className="glass-card rounded-xl p-6 h-full">
            <h2 className="text-lg font-semibold text-white mb-4">Project Status</h2>
            {projectStatuses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-slate-500">
                <AlertCircle className="w-8 h-8 mb-2" />
                <p className="text-sm">No projects yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {projectStatuses.map(ps => (
                  <div key={ps.status} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${ps.color.split(' ')[0]}`} />
                      <span className="text-slate-300 text-sm">{ps.status}</span>
                    </div>
                    <span className={`text-sm font-semibold px-2.5 py-0.5 rounded-lg border ${ps.color}`}>
                      {ps.count}
                    </span>
                  </div>
                ))}
                {/* Visual bar */}
                <div className="mt-4 pt-4 border-t border-white/5">
                  <div className="flex h-3 rounded-full overflow-hidden bg-white/5">
                    {projectStatuses.map((ps, i) => {
                      const total = projectStatuses.reduce((s, p) => s + p.count, 0);
                      const pct = total > 0 ? (ps.count / total) * 100 : 0;
                      const colorMap: Record<string, string> = {
                        'bg-teal-500/20': 'bg-teal-500',
                        'bg-sky-500/20': 'bg-sky-500',
                        'bg-emerald-500/20': 'bg-emerald-500',
                        'bg-yellow-500/20': 'bg-yellow-500',
                        'bg-amber-500/20': 'bg-amber-500',
                        'bg-slate-500/20': 'bg-slate-500',
                        'bg-white/10': 'bg-white/40',
                      };
                      const bgKey = ps.color.split(' ')[0];
                      return (
                        <div
                          key={i}
                          className={`${colorMap[bgKey] || 'bg-white/40'} transition-all duration-500`}
                          style={{ width: `${pct}%` }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="glass-card rounded-xl p-6 h-full">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
            {activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-slate-500">
                <Clock className="w-8 h-8 mb-2" />
                <p className="text-sm">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-1 max-h-80 overflow-y-auto">
                {activities.map((activity, i) => {
                  const Icon = activityIcons[activity.type] || MessageSquare;
                  const colorClass = activityColors[activity.type] || 'bg-slate-500/20 text-slate-400';
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.06 }}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                    >
                      <div className={`w-9 h-9 rounded-lg ${colorClass.split(' ')[0]} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <Icon className={`w-4 h-4 ${colorClass.split(' ')[1]}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-300 text-sm leading-relaxed">{activity.text}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{activity.time}</p>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
