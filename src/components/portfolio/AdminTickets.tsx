'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ticket,
  Search,
  Send,
  ArrowLeft,
  Loader2,
  Trash2,
  X,
  MessageCircle,
  ChevronDown,
  Calendar,
  User,
  Building2,
  Mail,
  Inbox,
  Clock,
  AlertTriangle,
  ShieldCheck,
  CircleSlash,
  CircleCheck,
  Timer,
  Flame,
  HelpCircle,
  Bug,
  Lightbulb,
  Receipt,
  HeadsetIcon,
  RefreshCw,
  Filter,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/* ─────────────────────── Types ─────────────────────── */

interface AdminTicketsProps {
  getAuthHeaders: () => Record<string, string>;
}

type TicketStatus = 'all' | 'open' | 'in-progress' | 'resolved' | 'closed';

interface TicketClient {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  avatar?: string | null;
}

interface TicketReply {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface TicketListItem {
  id: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  clientId: string;
  client: TicketClient;
  _count: { replies: number };
}

interface TicketDetail extends Omit<TicketListItem, '_count'> {
  replies: TicketReply[];
}

/* ─────────────────────── Constants ─────────────────────── */

const POLL_INTERVAL = 30_000;
const MAX_REPLY_LENGTH = 5000;

const statusTabs: { key: TicketStatus; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'open', label: 'Open' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'resolved', label: 'Resolved' },
  { key: 'closed', label: 'Closed' },
];

const statusChangeOptions = [
  { value: 'open', label: 'Open', icon: CircleCheck },
  { value: 'in-progress', label: 'In Progress', icon: Timer },
  { value: 'resolved', label: 'Resolved', icon: ShieldCheck },
  { value: 'closed', label: 'Closed', icon: CircleSlash },
];

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const categoryOptions = [
  { value: 'general', label: 'General' },
  { value: 'bug', label: 'Bug' },
  { value: 'feature', label: 'Feature' },
  { value: 'billing', label: 'Billing' },
  { value: 'support', label: 'Support' },
];

const statusStyles: Record<string, string> = {
  open: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  'in-progress': 'bg-sky-500/15 text-sky-400 border-sky-500/25',
  resolved: 'bg-teal-500/15 text-teal-400 border-teal-500/25',
  closed: 'bg-slate-500/15 text-slate-400 border-slate-500/25',
};

const statusBadgeStyles: Record<string, string> = {
  open: 'bg-emerald-500/10 text-emerald-400',
  'in-progress': 'bg-sky-500/10 text-sky-400',
  resolved: 'bg-teal-500/10 text-teal-400',
  closed: 'bg-slate-500/10 text-slate-400',
};

const priorityStyles: Record<string, string> = {
  low: 'bg-emerald-500/10 text-emerald-400',
  medium: 'bg-yellow-500/10 text-yellow-400',
  high: 'bg-orange-500/10 text-orange-400',
  urgent: 'bg-red-500/10 text-red-400',
};

const priorityBorderColors: Record<string, string> = {
  low: 'border-l-emerald-500',
  medium: 'border-l-yellow-500',
  high: 'border-l-orange-500',
  urgent: 'border-l-red-500',
};

const categoryConfig: Record<string, { label: string; icon: React.ElementType; style: string }> = {
  general: { label: 'General', icon: HelpCircle, style: 'bg-slate-500/15 text-slate-300 border-slate-500/25' },
  bug: { label: 'Bug Report', icon: Bug, style: 'bg-red-500/15 text-red-400 border-red-500/25' },
  feature: { label: 'Feature Request', icon: Lightbulb, style: 'bg-amber-500/15 text-amber-400 border-amber-500/25' },
  billing: { label: 'Billing', icon: Receipt, style: 'bg-violet-500/15 text-violet-400 border-violet-500/25' },
  support: { label: 'Support', icon: HeadsetIcon, style: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25' },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

const replyBubbleVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25, ease: 'easeOut' } },
};

/* ─────────────────────── Helpers ─────────────────────── */

function formatDate(d: string): string {
  if (!d) return '';
  try {
    const date = new Date(d);
    const now = Date.now();
    const diff = now - date.getTime();
    const minutes = Math.floor(diff / 60_000);
    const hours = Math.floor(diff / 3_600_000);
    const days = Math.floor(diff / 86_400_000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    });
  } catch {
    return d;
  }
}

function formatThreadTime(ts: string): string {
  if (!ts) return '';
  try {
    const date = new Date(ts);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return ts;
  }
}

function mapTicketFromApi(t: Record<string, unknown>): TicketListItem {
  const client = (t.client as Record<string, unknown>) || {};
  return {
    id: String(t.id),
    subject: (t.subject as string) || 'Untitled',
    description: (t.description as string) || '',
    status: (t.status as string) || 'open',
    priority: (t.priority as string) || 'medium',
    category: (t.category as string) || 'general',
    createdAt: (t.createdAt as string) || '',
    updatedAt: (t.updatedAt as string) || '',
    clientId: (t.clientId as string) || '',
    client: {
      id: String(client.id || ''),
      name: (client.name as string) || 'Unknown',
      email: (client.email as string) || '',
      company: (client.company as string) || null,
      avatar: (client.avatar as string) || null,
    },
    _count: {
      replies: Number((t._count as Record<string, unknown>)?.replies || 0),
    },
  };
}

function mapDetailFromApi(t: Record<string, unknown>): TicketDetail {
  const client = (t.client as Record<string, unknown>) || {};
  return {
    id: String(t.id),
    subject: (t.subject as string) || 'Untitled',
    description: (t.description as string) || '',
    status: (t.status as string) || 'open',
    priority: (t.priority as string) || 'medium',
    category: (t.category as string) || 'general',
    createdAt: (t.createdAt as string) || '',
    updatedAt: (t.updatedAt as string) || '',
    clientId: (t.clientId as string) || '',
    client: {
      id: String(client.id || ''),
      name: (client.name as string) || 'Unknown',
      email: (client.email as string) || '',
      company: (client.company as string) || null,
      avatar: (client.avatar as string) || null,
    },
    replies: Array.isArray(t.replies)
      ? t.replies.map((r: Record<string, unknown>) => ({
          id: String(r.id),
          senderId: String(r.senderId || ''),
          senderName: (r.senderName as string) || 'Unknown',
          senderRole: (r.senderRole as string) || 'client',
          content: (r.content as string) || '',
          createdAt: (r.createdAt as string) || '',
          updatedAt: (r.updatedAt as string) || '',
        }))
      : [],
  };
}

/* ─────────────────────── Category Badge ─────────────────────── */

function CategoryBadge({ category }: { category: string }) {
  const cfg = categoryConfig[category] || categoryConfig.general;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-medium ${cfg.style}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

/* ─────────────────────── Component ─────────────────────── */

export default function AdminTickets({ getAuthHeaders }: AdminTicketsProps) {
  const { toast } = useToast();

  /* ──── Data State ──── */
  const [tickets, setTickets] = useState<TicketListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<TicketDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  /* ──── Filter State ──── */
  const [statusFilter, setStatusFilter] = useState<TicketStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  /* ──── UI State ──── */
  const [mobileShowDetail, setMobileShowDetail] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const threadEndRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const priorityDropdownRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval>>();

  /* ──── Input class ──── */
  const inputClass = 'w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition-all';
  const selectClass = 'w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition-all appearance-none cursor-pointer';

  /* ──── Data Fetching ──── */

  const fetchTickets = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.set('limit', '50');
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (priorityFilter) params.set('priority', priorityFilter);
      if (categoryFilter) params.set('category', categoryFilter);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());

      const res = await fetch(`/api/admin/tickets?${params}`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        const list: Record<string, unknown>[] = data.data || [];
        setTickets(list.map(mapTicketFromApi));
        setTotal(data.total ?? list.length);
      }
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders, statusFilter, priorityFilter, categoryFilter, searchQuery]);

  const fetchTicketDetail = useCallback(
    async (id: string, silent = false) => {
      if (!silent) setDetailLoading(true);
      try {
        const res = await fetch(`/api/admin/tickets/${id}`, {
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.data) {
            const detail = mapDetailFromApi(data.data);
            setSelectedTicket(detail);
            // Update ticket in list with latest status/priority
            setTickets((prev) =>
              prev.map((t) =>
                t.id === id
                  ? {
                      ...t,
                      status: detail.status,
                      priority: detail.priority,
                      category: detail.category,
                      _count: { replies: detail.replies.length },
                    }
                  : t,
              ),
            );
          }
        }
      } catch {
        /* silent */
      } finally {
        if (!silent) setDetailLoading(false);
      }
    },
    [getAuthHeaders],
  );

  /* ──── Polling ──── */

  useEffect(() => {
    fetchTickets();
    pollRef.current = setInterval(() => {
      fetchTickets();
      if (selectedTicket) {
        fetchTicketDetail(selectedTicket.id, true);
      }
    }, POLL_INTERVAL);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchTickets, selectedTicket, fetchTicketDetail]);

  /* ──── Auto-scroll thread ──── */

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedTicket?.replies?.length]);

  /* ──── Close dropdowns on outside click ──── */

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(e.target as Node)) {
        setShowStatusDropdown(false);
      }
      if (priorityDropdownRef.current && !priorityDropdownRef.current.contains(e.target as Node)) {
        setShowPriorityDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* ──── Handlers ──── */

  const handleSelectTicket = useCallback(
    (ticket: TicketListItem) => {
      setSelectedTicket(null);
      setMobileShowDetail(true);
      setReplyText('');
      setShowStatusDropdown(false);
      setShowPriorityDropdown(false);
      setShowDeleteConfirm(false);
      fetchTicketDetail(ticket.id);
    },
    [fetchTicketDetail],
  );

  const handleBackToList = useCallback(() => {
    setMobileShowDetail(false);
    setSelectedTicket(null);
    setReplyText('');
    setShowStatusDropdown(false);
    setShowPriorityDropdown(false);
    setShowDeleteConfirm(false);
  }, []);

  const handleReply = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!replyText.trim() || !selectedTicket || sendingReply) return;

      const content = replyText.trim();
      setReplyText('');
      setSendingReply(true);

      try {
        const res = await fetch(`/api/admin/tickets/${selectedTicket.id}/replies`, {
          method: 'POST',
          headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
          body: JSON.stringify({ content }),
        });

        if (res.ok) {
          await fetchTicketDetail(selectedTicket.id, true);
          await fetchTickets();
          toast({ title: 'Reply Sent', description: 'Your reply has been posted to the ticket.' });
        } else {
          setReplyText(content);
          toast({ title: 'Error', description: 'Failed to send reply. Please try again.' });
        }
      } catch {
        setReplyText(content);
        toast({ title: 'Error', description: 'Network error. Please check your connection.' });
      } finally {
        setSendingReply(false);
      }
    },
    [replyText, selectedTicket, sendingReply, getAuthHeaders, fetchTicketDetail, fetchTickets, toast],
  );

  const handleChangeStatus = useCallback(
    async (newStatus: string) => {
      if (!selectedTicket || newStatus === selectedTicket.status) {
        setShowStatusDropdown(false);
        return;
      }
      setActionLoading('status');
      setShowStatusDropdown(false);
      try {
        const res = await fetch(`/api/admin/tickets/${selectedTicket.id}`, {
          method: 'PATCH',
          headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });
        if (res.ok) {
          await fetchTicketDetail(selectedTicket.id);
          await fetchTickets();
          toast({ title: 'Status Updated', description: `Ticket status changed to "${newStatus}".` });
        } else {
          toast({ title: 'Error', description: 'Failed to update ticket status.' });
        }
      } catch {
        toast({ title: 'Error', description: 'Network error. Please try again.' });
      } finally {
        setActionLoading(null);
      }
    },
    [selectedTicket, getAuthHeaders, fetchTicketDetail, fetchTickets, toast],
  );

  const handleChangePriority = useCallback(
    async (newPriority: string) => {
      if (!selectedTicket || newPriority === selectedTicket.priority) {
        setShowPriorityDropdown(false);
        return;
      }
      setActionLoading('priority');
      setShowPriorityDropdown(false);
      try {
        const res = await fetch(`/api/admin/tickets/${selectedTicket.id}`, {
          method: 'PATCH',
          headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
          body: JSON.stringify({ priority: newPriority }),
        });
        if (res.ok) {
          await fetchTicketDetail(selectedTicket.id);
          await fetchTickets();
          toast({ title: 'Priority Updated', description: `Ticket priority changed to "${newPriority}".` });
        } else {
          toast({ title: 'Error', description: 'Failed to update ticket priority.' });
        }
      } catch {
        toast({ title: 'Error', description: 'Network error. Please try again.' });
      } finally {
        setActionLoading(null);
      }
    },
    [selectedTicket, getAuthHeaders, fetchTicketDetail, fetchTickets, toast],
  );

  const handleDeleteTicket = useCallback(async () => {
    if (!selectedTicket) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/tickets/${selectedTicket.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        toast({ title: 'Ticket Deleted', description: `"${selectedTicket.subject}" has been permanently deleted.` });
        handleBackToList();
        await fetchTickets();
      } else {
        toast({ title: 'Error', description: 'Failed to delete ticket.' });
      }
    } catch {
      toast({ title: 'Error', description: 'Network error. Please try again.' });
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  }, [selectedTicket, getAuthHeaders, handleBackToList, fetchTickets, toast]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleReply(e);
      }
    },
    [handleReply],
  );

  /* ──── Empty state message ──── */

  const getEmptyMessage = () => {
    if (searchQuery.trim()) {
      return { title: 'No results found', sub: `No tickets match "${searchQuery}"` };
    }
    if (priorityFilter) {
      return { title: `No ${priorityFilter} priority tickets`, sub: 'Try adjusting your filters' };
    }
    if (categoryFilter) {
      const cfg = categoryConfig[categoryFilter];
      return { title: `No ${cfg?.label || categoryFilter} tickets`, sub: 'Try adjusting your filters' };
    }
    switch (statusFilter) {
      case 'open':
        return { title: 'No open tickets', sub: 'All tickets have been addressed' };
      case 'in-progress':
        return { title: 'No tickets in progress', sub: 'Nothing is being worked on right now' };
      case 'resolved':
        return { title: 'No resolved tickets', sub: 'Resolved tickets will appear here' };
      case 'closed':
        return { title: 'No closed tickets', sub: 'Closed tickets will appear here' };
      default:
        return { title: 'No tickets yet', sub: 'Tickets will appear here when clients submit them' };
    }
  };

  /* ──── Loading skeleton ──── */

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="h-8 w-64 rounded-lg bg-white/5 animate-pulse" />
        <div className="h-10 w-full rounded-xl bg-white/5 animate-pulse" />
        <div className="flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 w-20 rounded-lg bg-white/5 animate-pulse" />
          ))}
        </div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      </motion.div>
    );
  }

  /* ═══════════════════════ RENDER ═══════════════════════ */
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* ══════ HEADER ══════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Ticket className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
            Ticket Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {total} ticket{total !== 1 ? 's' : ''} across all clients
          </p>
        </div>
        <button
          onClick={() => {
            fetchTickets();
            if (selectedTicket) fetchTicketDetail(selectedTicket.id, true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/10 hover:text-white transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* ══════ FILTER BAR ══════ */}
      <div className="space-y-3">
        {/* Search row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by subject, description, or client..."
              className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {/* Priority filter */}
          <div className="relative sm:w-36">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className={selectClass}
            >
              <option value="">All Priorities</option>
              {priorityOptions.map((o) => (
                <option key={o.value} value={o.value} className="bg-[#0a1628]">
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          {/* Category filter */}
          <div className="relative sm:w-40">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={selectClass}
            >
              <option value="">All Categories</option>
              {categoryOptions.map((o) => (
                <option key={o.value} value={o.value} className="bg-[#0a1628]">
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status tabs */}
        <div className="flex flex-wrap gap-2">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                statusFilter === tab.key
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20'
                  : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ══════ MAIN CONTENT: LIST + DETAIL SPLIT ══════ */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* ──── TICKET LIST PANEL ──── */}
        <div
          className={`w-full lg:w-[420px] xl:w-[480px] flex-shrink-0 ${
            mobileShowDetail ? 'hidden lg:block' : 'block'
          }`}
        >
          {tickets.length === 0 ? (
            <div className="glass-card rounded-xl p-12 text-center">
              <Inbox className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-300 font-medium">{getEmptyMessage().title}</p>
              <p className="text-slate-500 text-sm mt-1">{getEmptyMessage().sub}</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-2 max-h-[calc(100vh-320px)] overflow-y-auto custom-scrollbar-thin pr-1"
            >
              {tickets.map((ticket) => (
                <motion.div
                  key={ticket.id}
                  variants={itemVariants}
                  className={`glass-card rounded-xl p-4 cursor-pointer hover-glow group border-l-[3px] ${
                    priorityBorderColors[ticket.priority] || priorityBorderColors.medium
                  } ${
                    selectedTicket?.id === ticket.id
                      ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/20'
                      : ''
                  }`}
                  onClick={() => handleSelectTicket(ticket)}
                >
                  <div className="flex items-start gap-3">
                    {/* Priority dot */}
                    <div
                      className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${
                        ticket.priority === 'urgent'
                          ? 'bg-red-500 shadow-lg shadow-red-500/50'
                          : ticket.priority === 'high'
                            ? 'bg-orange-500 shadow-lg shadow-orange-500/40'
                            : ticket.priority === 'medium'
                              ? 'bg-yellow-500'
                              : 'bg-emerald-500'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      {/* Subject */}
                      <h3 className="text-white text-sm font-semibold truncate group-hover:text-amber-300 transition-colors">
                        {ticket.subject}
                      </h3>

                      {/* Client info */}
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                        <User className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{ticket.client.name}</span>
                        {ticket.client.company && (
                          <>
                            <span className="text-slate-600">·</span>
                            <Building2 className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{ticket.client.company}</span>
                          </>
                        )}
                      </div>

                      {/* Badges row */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        <span
                          className={`px-1.5 py-0.5 rounded-md border text-[10px] font-medium ${
                            statusStyles[ticket.status] || statusStyles.open
                          }`}
                        >
                          {ticket.status}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded-md text-[10px] font-medium ${
                            priorityStyles[ticket.priority] || priorityStyles.medium
                          }`}
                        >
                          {ticket.priority === 'urgent' ? (
                            <span className="flex items-center gap-0.5">
                              <Flame className="w-2.5 h-2.5" /> Urgent
                            </span>
                          ) : (
                            ticket.priority
                          )}
                        </span>
                        <CategoryBadge category={ticket.category} />
                        <span className="text-slate-500 text-[10px] flex items-center gap-0.5 ml-auto">
                          <MessageCircle className="w-2.5 h-2.5" />
                          {ticket._count.replies}
                        </span>
                        <span className="text-slate-600 text-[10px] flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          {formatDate(ticket.updatedAt)}
                        </span>
                      </div>
                    </div>

                    {/* Chevron */}
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-amber-400 group-hover:bg-amber-500/10 transition-colors">
                        <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* ──── TICKET DETAIL PANEL ──── */}
        <div
          className={`flex-1 min-w-0 ${
            !mobileShowDetail ? 'hidden lg:block' : 'block'
          }`}
        >
          {selectedTicket ? (
            detailLoading && !selectedTicket ? (
              <div className="glass-card rounded-xl h-96 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
              </div>
            ) : (
              <div className="glass-card rounded-xl flex flex-col overflow-hidden" style={{ minHeight: '500px', maxHeight: 'calc(100vh - 320px)' }}>
                {/* ── Detail Header ── */}
                <div className="p-4 sm:p-5 border-b border-white/5 flex-shrink-0">
                  {/* Mobile back button */}
                  <button
                    onClick={handleBackToList}
                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors mb-3 lg:hidden"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  {/* Subject + Badges */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-white text-base sm:text-lg font-bold leading-tight">
                        {selectedTicket.subject}
                      </h2>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-md border ${
                            statusStyles[selectedTicket.status] || statusStyles.open
                          }`}
                        >
                          {selectedTicket.status}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                            priorityStyles[selectedTicket.priority] || priorityStyles.medium
                          }`}
                        >
                          {selectedTicket.priority === 'urgent' ? (
                            <span className="flex items-center gap-0.5">
                              <Flame className="w-3 h-3" /> Urgent
                            </span>
                          ) : (
                            selectedTicket.priority
                          )}
                        </span>
                        <CategoryBadge category={selectedTicket.category} />
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(selectedTicket.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Status dropdown */}
                      <div className="relative" ref={statusDropdownRef}>
                        <button
                          onClick={() => {
                            setShowStatusDropdown(!showStatusDropdown);
                            setShowPriorityDropdown(false);
                          }}
                          disabled={actionLoading === 'status'}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs font-medium hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
                        >
                          {actionLoading === 'status' ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Timer className="w-3 h-3" />
                          )}
                          Status
                          <ChevronDown className="w-3 h-3" />
                        </button>
                        <AnimatePresence>
                          {showStatusDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: -4, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -4, scale: 0.95 }}
                              className="absolute right-0 top-full mt-1 z-20 w-40 bg-[#0d1a2d] border border-white/10 rounded-xl shadow-xl overflow-hidden"
                            >
                              {statusChangeOptions.map((opt) => {
                                const Icon = opt.icon;
                                return (
                                  <button
                                    key={opt.value}
                                    onClick={() => handleChangeStatus(opt.value)}
                                    className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs font-medium transition-colors ${
                                      selectedTicket.status === opt.value
                                        ? 'bg-amber-500/10 text-amber-400'
                                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                    }`}
                                  >
                                    <Icon className="w-3.5 h-3.5" />
                                    {opt.label}
                                    {selectedTicket.status === opt.value && (
                                      <span className="ml-auto text-amber-500 text-[10px]">Current</span>
                                    )}
                                  </button>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Priority dropdown */}
                      <div className="relative" ref={priorityDropdownRef}>
                        <button
                          onClick={() => {
                            setShowPriorityDropdown(!showPriorityDropdown);
                            setShowStatusDropdown(false);
                          }}
                          disabled={actionLoading === 'priority'}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs font-medium hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
                        >
                          {actionLoading === 'priority' ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Flame className="w-3 h-3" />
                          )}
                          Priority
                          <ChevronDown className="w-3 h-3" />
                        </button>
                        <AnimatePresence>
                          {showPriorityDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: -4, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -4, scale: 0.95 }}
                              className="absolute right-0 top-full mt-1 z-20 w-36 bg-[#0d1a2d] border border-white/10 rounded-xl shadow-xl overflow-hidden"
                            >
                              {priorityOptions.map((opt) => (
                                <button
                                  key={opt.value}
                                  onClick={() => handleChangePriority(opt.value)}
                                  className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs font-medium transition-colors ${
                                    selectedTicket.priority === opt.value
                                      ? 'bg-amber-500/10 text-amber-400'
                                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                  }`}
                                >
                                  <div
                                    className={`w-2 h-2 rounded-full ${
                                      opt.value === 'urgent'
                                        ? 'bg-red-500'
                                        : opt.value === 'high'
                                          ? 'bg-orange-500'
                                          : opt.value === 'medium'
                                            ? 'bg-yellow-500'
                                            : 'bg-emerald-500'
                                    }`}
                                  />
                                  {opt.label}
                                  {selectedTicket.priority === opt.value && (
                                    <span className="ml-auto text-amber-500 text-[10px]">Current</span>
                                  )}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Delete button */}
                      {!showDeleteConfirm ? (
                        <button
                          onClick={() => setShowDeleteConfirm(true)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-xs font-medium hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      ) : (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={handleDeleteTicket}
                            disabled={deleting}
                            className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/30 transition-all disabled:opacity-50"
                          >
                            {deleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <AlertTriangle className="w-3 h-3" />}
                            Confirm
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="px-2 py-2 rounded-xl bg-white/5 text-slate-400 text-xs hover:bg-white/10 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Client info bar */}
                  <div className="flex items-center gap-3 mt-3 p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-bold flex-shrink-0">
                      {selectedTicket.client.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-xs font-medium truncate">{selectedTicket.client.name}</p>
                      <div className="flex items-center gap-2 text-slate-500">
                        <span className="text-[10px] flex items-center gap-0.5 truncate">
                          <Mail className="w-2.5 h-2.5 flex-shrink-0" />
                          {selectedTicket.client.email}
                        </span>
                        {selectedTicket.client.company && (
                          <>
                            <span className="text-slate-700 text-[10px]">·</span>
                            <span className="text-[10px] flex items-center gap-0.5 truncate">
                              <Building2 className="w-2.5 h-2.5 flex-shrink-0" />
                              {selectedTicket.client.company}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Conversation Thread ── */}
                {detailLoading ? (
                  <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar-thin">
                    {/* Original description as first message */}
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={replyBubbleVariants}
                      className="flex justify-end"
                    >
                      <div className="max-w-[85%] sm:max-w-[75%]">
                        <div className="flex items-center gap-2 mb-1.5 justify-end">
                          <span className="text-[10px] text-slate-500">
                            {formatThreadTime(selectedTicket.createdAt)}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                            client
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            {selectedTicket.client.name}
                          </span>
                          <User className="w-3 h-3 text-slate-500" />
                        </div>
                        <div className="px-4 py-3 rounded-2xl rounded-tr-md bg-emerald-500/10 border border-emerald-500/15 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                          {selectedTicket.description}
                        </div>
                      </div>
                    </motion.div>

                    {/* Reply messages */}
                    {selectedTicket.replies.map((reply) => {
                      const isClient = reply.senderRole === 'client';
                      return (
                        <motion.div
                          key={reply.id}
                          initial="hidden"
                          animate="visible"
                          variants={replyBubbleVariants}
                          className={`flex ${isClient ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[85%] sm:max-w-[75%] ${isClient ? 'order-1' : ''}`}>
                            <div className={`flex items-center gap-2 mb-1.5 ${isClient ? 'justify-end' : ''}`}>
                              {!isClient && <ShieldCheck className="w-3 h-3 text-amber-400" />}
                              <span className="text-xs text-slate-400 font-medium">{reply.senderName}</span>
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded ${
                                  isClient
                                    ? 'bg-emerald-500/10 text-emerald-400'
                                    : 'bg-amber-500/10 text-amber-400'
                                }`}
                              >
                                {isClient ? 'client' : 'admin'}
                              </span>
                              <span className="text-[10px] text-slate-600">
                                {formatThreadTime(reply.createdAt)}
                              </span>
                              {isClient && <User className="w-3 h-3 text-slate-500" />}
                            </div>
                            <div
                              className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                                isClient
                                  ? 'bg-emerald-500/10 border border-emerald-500/15 text-slate-200 rounded-tr-md'
                                  : 'bg-gradient-to-r from-amber-500/15 to-orange-500/10 border border-amber-500/15 text-slate-200 rounded-tl-md'
                              }`}
                            >
                              {reply.content}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}

                    {selectedTicket.replies.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-8 text-slate-500">
                        <MessageCircle className="w-8 h-8 opacity-20 mb-2" />
                        <p className="text-sm">No replies yet — be the first to respond</p>
                      </div>
                    )}

                    <div ref={threadEndRef} />
                  </div>
                )}

                {/* ── Reply Input ── */}
                <div className="border-t border-white/5 p-4 flex-shrink-0">
                  <form onSubmit={handleReply} className="space-y-2">
                    <textarea
                      value={replyText}
                      onChange={(e) => {
                        if (e.target.value.length <= MAX_REPLY_LENGTH) setReplyText(e.target.value);
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your reply as admin... (Ctrl+Enter to send)"
                      rows={3}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 resize-none transition-all"
                      disabled={sendingReply}
                    />
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] transition-colors ${
                          replyText.length > MAX_REPLY_LENGTH * 0.9 ? 'text-red-400' : 'text-slate-600'
                        }`}
                      >
                        {replyText.length} / {MAX_REPLY_LENGTH}
                      </span>
                      <button
                        type="submit"
                        disabled={!replyText.trim() || sendingReply}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-amber-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {sendingReply ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" /> Send Reply
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )
          ) : (
            /* Empty detail state */
            <div className="glass-card rounded-xl h-full min-h-[500px] flex flex-col items-center justify-center text-slate-500 p-6">
              <div className="w-20 h-20 rounded-full bg-white/[0.03] flex items-center justify-center mb-4">
                <Ticket className="w-10 h-10 opacity-15" />
              </div>
              <p className="text-lg font-medium text-slate-400">Select a ticket</p>
              <p className="text-sm mt-1 text-slate-600">
                Choose a ticket from the list to view details and reply
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
