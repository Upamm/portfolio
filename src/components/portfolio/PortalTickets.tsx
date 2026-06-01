'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ticket,
  Plus,
  X,
  Loader2,
  Inbox,
  Send,
  MessageCircle,
  Calendar,
  User,
} from 'lucide-react';

type TicketStatus = 'all' | 'open' | 'in-progress' | 'resolved' | 'closed';

interface TicketReply {
  id: string;
  sender: string;
  senderRole: string;
  content: string;
  createdAt: string;
}

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  createdAt: string;
  replyCount: number;
  replies: TicketReply[];
}

const statusFilters: { key: TicketStatus; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'open', label: 'Open' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'resolved', label: 'Resolved' },
  { key: 'closed', label: 'Closed' },
];

const statusStyles: Record<string, string> = {
  open: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  'in-progress': 'bg-sky-500/15 text-sky-400 border-sky-500/25',
  resolved: 'bg-teal-500/15 text-teal-400 border-teal-500/25',
  closed: 'bg-slate-500/15 text-slate-400 border-slate-500/25',
};

const priorityStyles: Record<string, string> = {
  low: 'bg-emerald-500/10 text-emerald-400',
  medium: 'bg-yellow-500/10 text-yellow-400',
  high: 'bg-orange-500/10 text-orange-400',
  urgent: 'bg-red-500/10 text-red-400',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

const categoryOptions = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'project', label: 'Project Related' },
  { value: 'billing', label: 'Billing' },
  { value: 'technical', label: 'Technical Issue' },
  { value: 'feature', label: 'Feature Request' },
];

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export default function PortalTickets() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [filter, setFilter] = useState<TicketStatus>('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newReply, setNewReply] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [submittingTicket, setSubmittingTicket] = useState(false);
  const threadEndRef = useRef<HTMLDivElement>(null);

  // New ticket form
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    category: 'general',
    priority: 'medium',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const fetchTickets = useCallback(async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('portal_token='))
        ?.split('=')[1];
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/portal/tickets', { headers });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.tickets || [];
        setTickets(
          list.map((t: Record<string, unknown>, i: number) => ({
            id: String(t.id || i),
            subject: (t.subject as string) || (t.title as string) || 'Untitled',
            description: (t.description as string) || '',
            status: (t.status as string) || 'open',
            priority: (t.priority as string) || 'medium',
            category: (t.category as string) || 'general',
            createdAt: (t.createdAt as string) || (t.created_at as string) || '',
            replyCount: Number(t.replyCount || t.reply_count || 0),
            replies: Array.isArray(t.replies)
              ? t.replies.map((r: Record<string, unknown>) => ({
                  id: String(r.id || Math.random().toString(36).slice(2)),
                  sender: (r.sender as string) || (r.sender_name as string) || 'Unknown',
                  senderRole: (r.senderRole as string) || (r.sender_role as string) || 'admin',
                  content: (r.content as string) || (r.message as string) || (r.text as string) || '',
                  createdAt: (r.createdAt as string) || (r.created_at as string) || '',
                }))
              : [],
          }))
        );
      }
    } catch {
      // Fallback demo data
      setTickets([
        {
          id: '1',
          subject: 'Website loading speed issue on mobile',
          description: 'The website takes more than 10 seconds to fully load on mobile devices. This is affecting our conversion rate.',
          status: 'open',
          priority: 'high',
          category: 'technical',
          createdAt: '2025-06-18',
          replyCount: 2,
          replies: [
            { id: 'r1', sender: 'Client', senderRole: 'client', content: 'The website takes more than 10 seconds to fully load on mobile devices. This is affecting our conversion rate.', createdAt: '2025-06-18T09:00:00Z' },
            { id: 'r2', sender: 'Upam', senderRole: 'admin', content: 'Thanks for reporting this. I\'ve identified several optimization opportunities — large uncompressed images, render-blocking JavaScript, and missing browser caching headers. I\'ll prepare a fix.', createdAt: '2025-06-18T10:30:00Z' },
          ],
        },
        {
          id: '2',
          subject: 'Request for additional blog functionality',
          description: 'We need a blog section with categories, tags, search, and author profiles.',
          status: 'in-progress',
          priority: 'medium',
          category: 'feature',
          createdAt: '2025-06-15',
          replyCount: 3,
          replies: [
            { id: 'r3', sender: 'Client', senderRole: 'client', content: 'We need a blog section with categories, tags, search, and author profiles.', createdAt: '2025-06-15T14:00:00Z' },
            { id: 'r4', sender: 'Upam', senderRole: 'admin', content: 'Great idea! I can implement this using a custom post type setup. Estimated timeline: 5-7 business days.', createdAt: '2025-06-15T15:00:00Z' },
            { id: 'r5', sender: 'Client', senderRole: 'client', content: 'That sounds good. Let\'s proceed with the implementation.', createdAt: '2025-06-16T09:00:00Z' },
          ],
        },
        {
          id: '3',
          subject: 'Monthly invoice clarification',
          description: 'Need clarification on the maintenance fee line item in the June invoice.',
          status: 'resolved',
          priority: 'low',
          category: 'billing',
          createdAt: '2025-06-10',
          replyCount: 2,
          replies: [
            { id: 'r6', sender: 'Client', senderRole: 'client', content: 'Need clarification on the maintenance fee line item in the June invoice.', createdAt: '2025-06-10T11:00:00Z' },
            { id: 'r7', sender: 'Upam', senderRole: 'admin', content: 'The maintenance fee covers monthly plugin updates, security scans, and daily backups. I\'ve sent a detailed breakdown to your email.', createdAt: '2025-06-10T12:00:00Z' },
          ],
        },
        {
          id: '4',
          subject: 'Color theme inconsistency on inner pages',
          description: 'Some inner pages have different header colors than the homepage.',
          status: 'closed',
          priority: 'medium',
          category: 'project',
          createdAt: '2025-06-05',
          replyCount: 3,
          replies: [
            { id: 'r8', sender: 'Client', senderRole: 'client', content: 'Some inner pages have different header colors than the homepage.', createdAt: '2025-06-05T16:00:00Z' },
            { id: 'r9', sender: 'Upam', senderRole: 'admin', content: 'Fixed! All pages now use the consistent navy header. Please clear your browser cache and check.', createdAt: '2025-06-06T09:00:00Z' },
            { id: 'r10', sender: 'Client', senderRole: 'client', content: 'Looks perfect now. Thank you!', createdAt: '2025-06-06T14:00:00Z' },
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedTicket?.replies]);

  const filtered =
    filter === 'all'
      ? tickets
      : tickets.filter(t => t.status.toLowerCase().replace(/\s+/g, '-') === filter);

  const formatDate = (d: string) => {
    if (!d) return '';
    try {
      return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return d;
    }
  };

  const formatTime = (ts: string) => {
    if (!ts) return '';
    try {
      return new Date(ts).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    } catch {
      return ts;
    }
  };

  const handleNewTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!newTicket.subject.trim()) errs.subject = 'Subject is required';
    if (!newTicket.description.trim()) errs.description = 'Description is required';
    setFormErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmittingTicket(true);
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('portal_token='))
        ?.split('=')[1];
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/portal/tickets', {
        method: 'POST',
        headers,
        body: JSON.stringify(newTicket),
      });

      if (res.ok) {
        await fetchTickets();
        setShowNewForm(false);
        setNewTicket({ subject: '', description: '', category: 'general', priority: 'medium' });
      } else {
        // Optimistic add
        setTickets(prev => [
          {
            id: Date.now().toString(),
            subject: newTicket.subject,
            description: newTicket.description,
            status: 'open',
            priority: newTicket.priority,
            category: newTicket.category,
            createdAt: new Date().toISOString(),
            replyCount: 0,
            replies: [{ id: 'r-new', sender: 'You', senderRole: 'client', content: newTicket.description, createdAt: new Date().toISOString() }],
          },
          ...prev,
        ]);
        setShowNewForm(false);
        setNewTicket({ subject: '', description: '', category: 'general', priority: 'medium' });
      }
    } catch {
      // Optimistic add
      setTickets(prev => [
        {
          id: Date.now().toString(),
          subject: newTicket.subject,
          description: newTicket.description,
          status: 'open',
          priority: newTicket.priority,
          category: newTicket.category,
          createdAt: new Date().toISOString(),
          replyCount: 0,
          replies: [{ id: 'r-new', sender: 'You', senderRole: 'client', content: newTicket.description, createdAt: new Date().toISOString() }],
        },
        ...prev,
      ]);
      setShowNewForm(false);
      setNewTicket({ subject: '', description: '', category: 'general', priority: 'medium' });
    } finally {
      setSubmittingTicket(false);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReply.trim() || !selectedTicket || sendingReply) return;

    const replyText = newReply.trim();
    setNewReply('');
    setSendingReply(true);

    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('portal_token='))
        ?.split('=')[1];
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      await fetch(`/api/portal/tickets/${selectedTicket.id}/replies`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ content: replyText }),
      });

      await fetchTickets();
      // Refresh selected ticket
      const updated = await (await fetch('/api/portal/tickets', { headers })).json();
      const list = Array.isArray(updated) ? updated : updated.tickets || [];
      const refreshed = list.find((t: Record<string, unknown>) => String(t.id) === selectedTicket.id);
      if (refreshed) {
        setSelectedTicket(prev => prev ? {
          ...prev,
          replies: [...prev.replies, {
            id: Date.now().toString(),
            sender: 'You',
            senderRole: 'client',
            content: replyText,
            createdAt: new Date().toISOString(),
          }],
          replyCount: prev.replyCount + 1,
        } : null);
      }
    } catch {
      setSelectedTicket(prev => prev ? {
        ...prev,
        replies: [...prev.replies, {
          id: Date.now().toString(),
          sender: 'You',
          senderRole: 'client',
          content: replyText,
          createdAt: new Date().toISOString(),
        }],
        replyCount: prev.replyCount + 1,
      } : null);
    } finally {
      setSendingReply(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 rounded-lg bg-white/5 animate-pulse" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Ticket className="w-6 h-6 text-teal-400" />
            Support Tickets
          </h1>
          <p className="text-slate-400 text-sm mt-1">{filtered.length} ticket{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowNewForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-teal-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          New Ticket
        </button>
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

      {/* Tickets List */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-xl p-12 text-center"
        >
          <Inbox className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-400">No tickets found</p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {filtered.map(ticket => (
            <motion.div
              key={ticket.id}
              variants={itemVariants}
              className="glass-card rounded-xl p-4 sm:p-5 cursor-pointer hover-glow group"
              onClick={() => setSelectedTicket(ticket)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <h3 className="text-white font-semibold text-sm group-hover:text-teal-300 transition-colors truncate">
                      {ticket.subject}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs">
                    <span className={`px-2 py-0.5 rounded-md border text-xs font-medium ${statusStyles[ticket.status.toLowerCase().replace(/\s+/g, '-')] || statusStyles.open}`}>
                      {ticket.status}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md font-medium ${priorityStyles[ticket.priority] || priorityStyles.medium}`}>
                      {ticket.priority}
                    </span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(ticket.createdAt)}
                    </span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {ticket.replyCount} {ticket.replyCount === 1 ? 'reply' : 'replies'}
                    </span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-teal-400 group-hover:bg-teal-500/10 transition-colors flex-shrink-0">
                  <Ticket className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* New Ticket Modal */}
      <AnimatePresence>
        {showNewForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowNewForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="glass-card rounded-2xl w-full max-w-lg"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h2 className="text-lg font-bold text-white">New Support Ticket</h2>
                <button
                  onClick={() => setShowNewForm(false)}
                  className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleNewTicket} className="p-6 space-y-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1.5">Subject *</label>
                  <input
                    type="text"
                    value={newTicket.subject}
                    onChange={e => { setNewTicket(p => ({ ...p, subject: e.target.value })); setFormErrors(p => ({ ...p, subject: '' })); }}
                    placeholder="Brief description of the issue"
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-500 text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 ${formErrors.subject ? 'border-red-500/50' : 'border-white/10'}`}
                  />
                  {formErrors.subject && <p className="text-red-400 text-xs mt-1">{formErrors.subject}</p>}
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1.5">Description *</label>
                  <textarea
                    value={newTicket.description}
                    onChange={e => { setNewTicket(p => ({ ...p, description: e.target.value })); setFormErrors(p => ({ ...p, description: '' })); }}
                    placeholder="Provide detailed information about the issue"
                    rows={4}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-500 text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 resize-none ${formErrors.description ? 'border-red-500/50' : 'border-white/10'}`}
                  />
                  {formErrors.description && <p className="text-red-400 text-xs mt-1">{formErrors.description}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-1.5">Category</label>
                    <select
                      value={newTicket.category}
                      onChange={e => setNewTicket(p => ({ ...p, category: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 appearance-none"
                    >
                      {categoryOptions.map(c => (
                        <option key={c.value} value={c.value} className="bg-[#0a1628]">{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-1.5">Priority</label>
                    <select
                      value={newTicket.priority}
                      onChange={e => setNewTicket(p => ({ ...p, priority: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 appearance-none"
                    >
                      {priorityOptions.map(p => (
                        <option key={p.value} value={p.value} className="bg-[#0a1628]">{p.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={submittingTicket}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submittingTicket ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</>
                  ) : (
                    <><Plus className="w-4 h-4" /> Create Ticket</>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ticket Detail Modal */}
      <AnimatePresence>
        {selectedTicket && !showNewForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedTicket(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="glass-card rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between p-6 border-b border-white/5 flex-shrink-0">
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-bold text-white">{selectedTicket.subject}</h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-md border ${statusStyles[selectedTicket.status.toLowerCase().replace(/\s+/g, '-')] || statusStyles.open}`}>
                      {selectedTicket.status}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${priorityStyles[selectedTicket.priority] || priorityStyles.medium}`}>
                      {selectedTicket.priority}
                    </span>
                    <span className="text-xs text-slate-500">{selectedTicket.category}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0 ml-3"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Thread */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {selectedTicket.replies.map(reply => {
                  const isClient = reply.senderRole === 'client';
                  return (
                    <motion.div
                      key={reply.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isClient ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] sm:max-w-[70%] ${isClient ? 'order-1' : ''}`}>
                        <div className="flex items-center gap-2 mb-1.5">
                          <User className="w-3 h-3 text-slate-500" />
                          <span className="text-xs text-slate-400 font-medium">{reply.sender}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded ${
                            isClient ? 'bg-emerald-500/10 text-emerald-400' : 'bg-teal-500/10 text-teal-400'
                          }`}>
                            {reply.senderRole}
                          </span>
                          <span className="text-xs text-slate-600">{formatTime(reply.createdAt)}</span>
                        </div>
                        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          isClient
                            ? 'bg-emerald-500/10 border border-emerald-500/15 text-slate-200 rounded-tr-md'
                            : 'bg-teal-500/10 border border-teal-500/15 text-slate-200 rounded-tl-md'
                        }`}>
                          {reply.content}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={threadEndRef} />
              </div>

              {/* Reply Input */}
              <div className="border-t border-white/5 p-4 flex-shrink-0">
                <form onSubmit={handleReply} className="flex gap-3">
                  <input
                    type="text"
                    value={newReply}
                    onChange={e => setNewReply(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50"
                    disabled={sendingReply}
                  />
                  <button
                    type="submit"
                    disabled={!newReply.trim() || sendingReply}
                    className="px-4 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-teal-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendingReply ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
