'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  FolderKanban,
  Receipt,
  Ticket,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Eye,
  Ban,
  CheckCircle2,
  XCircle,
  Trash2,
  ChevronRight,
  Loader2,
  Search,
  AlertTriangle,
  Shield,
  Crown,
  ArrowLeft,
  Menu,
  X,
  LogOut,
  RefreshCw,
  Clock,
  Mail,
  Building2,
  UserPlus,
  Bell,
  Send,
  Plus,
  EyeOff,
  Phone,
  Calendar,
  FileText,
  BarChart3,
  Inbox,
  MoreHorizontal,
  ChevronDown,
  CalendarDays,
  Flame,
  Download,
  LayoutGrid,
  List,
  MapPin,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

/* ─────────────────────── Types ─────────────────────── */

interface AdminClient {
  id: string;
  name: string;
  email: string;
  company: string | null;
  role: string;
  avatar: string;
  phone: string | null;
  address: string | null;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
  totalBudget: number;
  unreadMessages: number;
  _count: {
    projects: number;
    invoices: number;
    messages: number;
    tickets: number;
    notifications: number;
  };
}

interface AdminStats {
  totalClients: number;
  activeClients: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalInvoices: number;
  pendingInvoices: number;
  paidInvoices: number;
  totalRevenue: number;
  openTickets: number;
  resolvedTickets: number;
  totalMessages: number;
  unreadMessages: number;
}

interface AdminMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  createdAt: string;
  read: boolean;
}

interface Conversation {
  clientId: string;
  clientName: string;
  clientEmail: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

interface AdminInvoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: string;
  dueDate: string;
  createdAt: string;
  clientName: string;
  clientId: string;
}

interface AdminProject {
  id: string;
  title: string;
  status: string;
  progress: number;
  priority: string;
  deadline: string | null;
  createdAt: string;
  clientName: string;
  clientId: string;
}

interface AdminDashboardProps {
  userName: string;
  onBack: () => void;
  onLogout: () => void;
}

type AdminView = 'overview' | 'clients' | 'clientDetail' | 'messages' | 'invoices' | 'projects';
type ClientsViewMode = 'card' | 'table';

/* ─────────────────────── Helpers ─────────────────────── */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    'in-progress': 'bg-sky-500/10 text-sky-400',
    'completed': 'bg-emerald-500/10 text-emerald-400',
    'pending': 'bg-yellow-500/10 text-yellow-400',
    'review': 'bg-violet-500/10 text-violet-400',
    'paused': 'bg-slate-500/10 text-slate-400',
  };
  return map[status] || 'bg-white/10 text-slate-300';
}

function getInvoiceStatusColor(status: string): string {
  const map: Record<string, string> = {
    paid: 'bg-emerald-500/10 text-emerald-400',
    pending: 'bg-yellow-500/10 text-yellow-400',
    overdue: 'bg-red-500/10 text-red-400',
    cancelled: 'bg-slate-500/10 text-slate-400',
    refunded: 'bg-purple-500/10 text-purple-400',
  };
  return map[status] || 'bg-white/10 text-slate-300';
}

function getPriorityColor(priority: string): string {
  const map: Record<string, string> = {
    high: 'bg-red-500/10 text-red-400',
    medium: 'bg-yellow-500/10 text-yellow-400',
    low: 'bg-emerald-500/10 text-emerald-400',
  };
  return map[priority] || 'bg-white/10 text-slate-300';
}

function escapeCSV(value: string | null | undefined): string {
  if (value == null) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/* ─────────────────────── Component ─────────────────────── */

export default function AdminPanel({ userName, onBack, onLogout }: AdminDashboardProps) {
  /* ──── State ──── */
  const [activeView, setActiveView] = useState<AdminView>('overview');
  const [selectedClient, setSelectedClient] = useState<AdminClient | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [clients, setClients] = useState<AdminClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [clientDetail, setClientDetail] = useState<Record<string, unknown> | null>(null);
  const [recentClients, setRecentClients] = useState<AdminClient[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clientsViewMode, setClientsViewMode] = useState<ClientsViewMode>('table');

  // Create client modal
  const [showCreateClient, setShowCreateClient] = useState(false);
  const [createClientForm, setCreateClientForm] = useState({ name: '', email: '', password: '', company: '', phone: '', address: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [createClientLoading, setCreateClientLoading] = useState(false);

  // Messages
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [chatMessages, setChatMessages] = useState<AdminMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Invoices
  const [invoices, setInvoices] = useState<AdminInvoice[]>([]);
  const [invoiceFilter, setInvoiceFilter] = useState('all');
  const [invoicesLoading, setInvoicesLoading] = useState(false);

  // Projects
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [projectFilter, setProjectFilter] = useState('all');
  const [projectsLoading, setProjectsLoading] = useState(false);

  // Send Message dialog (from client detail)
  const [showSendMessage, setShowSendMessage] = useState(false);
  const [quickMessage, setQuickMessage] = useState('');
  const [sendingQuickMessage, setSendingQuickMessage] = useState(false);

  // Create Project dialog (from client detail)
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [projectForm, setProjectForm] = useState({ title: '', description: '', deadline: '' });
  const [creatingProject, setCreatingProject] = useState(false);

  // Create Invoice dialog (from client detail)
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({ amount: '', dueDate: '', items: '' });
  const [creatingInvoice, setCreatingInvoice] = useState(false);

  /* ──── Auth ──── */
  const getAuthHeaders = useCallback(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('portal_token='))?.split('=')[1];
    return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : {};
  }, []);

  /* ──── Data Fetching ──── */
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/stats', { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setStats(data.data.overview);
        setRecentClients(data.data.recentClients || []);
      }
    } catch { /* fallback */ }
  }, [getAuthHeaders]);

  const fetchClients = useCallback(async (search = '', status = 'all') => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (status !== 'all') params.set('status', status);
      params.set('limit', '50');

      const res = await fetch(`/api/admin/clients?${params}`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setClients(data.data || []);
      }
    } catch { /* fallback */ }
    finally { setLoading(false); }
  }, [getAuthHeaders]);

  const fetchConversations = useCallback(async () => {
    setConversationsLoading(true);
    try {
      const res = await fetch('/api/admin/messages', { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setConversations(data.data || []);
      }
    } catch { /* fallback */ }
    finally { setConversationsLoading(false); }
  }, [getAuthHeaders]);

  const fetchMessages = useCallback(async (clientId: string) => {
    setMessagesLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('clientId', clientId);
      const res = await fetch(`/api/admin/messages?${params}`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setChatMessages(data.data || []);
      }
      // Mark as read
      await fetch('/api/admin/messages/bulk-read', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ clientId }),
      });
      fetchStats();
    } catch { /* fallback */ }
    finally { setMessagesLoading(false); }
  }, [getAuthHeaders, fetchStats]);

  const fetchInvoices = useCallback(async (status = 'all') => {
    setInvoicesLoading(true);
    try {
      const params = new URLSearchParams();
      if (status !== 'all') params.set('status', status);
      const res = await fetch(`/api/admin/invoices?${params}`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setInvoices(data.data || []);
      }
    } catch { /* fallback */ }
    finally { setInvoicesLoading(false); }
  }, [getAuthHeaders]);

  const fetchProjects = useCallback(async (status = 'all') => {
    setProjectsLoading(true);
    try {
      const params = new URLSearchParams();
      if (status !== 'all') params.set('status', status);
      const res = await fetch(`/api/admin/projects?${params}`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setProjects(data.data || []);
      }
    } catch { /* fallback */ }
    finally { setProjectsLoading(false); }
  }, [getAuthHeaders]);

  useEffect(() => {
    Promise.all([fetchStats(), fetchClients()]);
  }, [fetchStats, fetchClients]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  /* ──── Handlers ──── */
  const handleToggleActive = async (client: AdminClient) => {
    setActionLoading(client.id);
    try {
      const res = await fetch(`/api/admin/clients/${client.id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isActive: !client.isActive }),
      });
      if (res.ok) {
        setClients(prev => prev.map(c => c.id === client.id ? { ...c, isActive: !c.isActive } : c));
        if (selectedClient?.id === client.id) {
          setSelectedClient(prev => prev ? { ...prev, isActive: !prev.isActive } : prev);
        }
      }
    } catch { /* ignore */ }
    finally { setActionLoading(null); }
  };

  const handleDeleteClient = async (client: AdminClient) => {
    if (!confirm(`Are you sure you want to delete "${client.name}" and ALL their data? This cannot be undone.`)) return;
    setActionLoading(client.id);
    try {
      const res = await fetch(`/api/admin/clients/${client.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setClients(prev => prev.filter(c => c.id !== client.id));
        if (selectedClient?.id === client.id) {
          setActiveView('clients');
          setSelectedClient(null);
        }
        fetchStats();
      }
    } catch { /* ignore */ }
    finally { setActionLoading(null); }
  };

  const handleViewClient = async (client: AdminClient) => {
    setSelectedClient(client);
    setActiveView('clientDetail');
    try {
      const res = await fetch(`/api/admin/clients/${client.id}`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setClientDetail(data.data);
      }
    } catch { /* ignore */ }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    fetchClients(query, filterStatus);
  };

  const handleFilterChange = (status: 'all' | 'active' | 'inactive') => {
    setFilterStatus(status);
    fetchClients(searchQuery, status);
  };

  // Create Client
  const handleCreateClient = async () => {
    if (!createClientForm.name || !createClientForm.email || !createClientForm.password) return;
    setCreateClientLoading(true);
    try {
      const res = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(createClientForm),
      });
      if (res.ok) {
        setShowCreateClient(false);
        setCreateClientForm({ name: '', email: '', password: '', company: '', phone: '', address: '' });
        fetchClients(searchQuery, filterStatus);
        fetchStats();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to create client');
      }
    } catch {
      alert('Failed to create client');
    }
    finally { setCreateClientLoading(false); }
  };

  // CSV Export
  const handleExportCSV = useCallback(() => {
    const headers = [
      'Name', 'Email', 'Company', 'Phone', 'Address', 'Status',
      'Last Login', 'Total Projects', 'Total Invoices', 'Joined Date',
    ];
    const rows = clients.map(c => [
      escapeCSV(c.name),
      escapeCSV(c.email),
      escapeCSV(c.company),
      escapeCSV(c.phone),
      escapeCSV(c.address),
      c.isActive ? 'Active' : 'Inactive',
      c.lastLogin ? formatDate(c.lastLogin) : 'Never',
      String(c._count.projects),
      String(c._count.invoices),
      formatDate(c.createdAt),
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `clients-export-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [clients]);

  // Send Message (from chat)
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;
    setSendingMessage(true);
    const content = messageInput.trim();
    setMessageInput('');
    try {
      const res = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ content, clientId: selectedConversation.clientId }),
      });
      if (res.ok) {
        // Optimistic add
        const newMsg: AdminMessage = {
          id: 'temp-' + Date.now(),
          content,
          senderId: 'admin',
          senderName: userName,
          senderRole: 'admin',
          createdAt: new Date().toISOString(),
          read: true,
        };
        setChatMessages(prev => [...prev, newMsg]);
        // Refresh conversations
        fetchConversations();
      }
    } catch { /* ignore */ }
    finally { setSendingMessage(false); }
  };

  // Send Quick Message (from client detail)
  const handleQuickMessage = async () => {
    if (!quickMessage.trim() || !selectedClient) return;
    setSendingQuickMessage(true);
    try {
      const res = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ content: quickMessage.trim(), clientId: selectedClient.id }),
      });
      if (res.ok) {
        setShowSendMessage(false);
        setQuickMessage('');
        fetchStats();
      }
    } catch { /* ignore */ }
    finally { setSendingQuickMessage(false); }
  };

  // Create Project
  const handleCreateProject = async () => {
    if (!projectForm.title || !selectedClient) return;
    setCreatingProject(true);
    try {
      const res = await fetch('/api/portal/projects', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ ...projectForm, clientId: selectedClient.id }),
      });
      if (res.ok) {
        setShowCreateProject(false);
        setProjectForm({ title: '', description: '', deadline: '' });
        handleViewClient(selectedClient);
        fetchStats();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to create project');
      }
    } catch {
      alert('Failed to create project');
    }
    finally { setCreatingProject(false); }
  };

  // Create Invoice
  const handleCreateInvoice = async () => {
    if (!invoiceForm.amount || !selectedClient) return;
    setCreatingInvoice(true);
    try {
      const res = await fetch('/api/portal/invoices', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ clientId: selectedClient.id, amount: parseFloat(invoiceForm.amount), dueDate: invoiceForm.dueDate }),
      });
      if (res.ok) {
        setShowCreateInvoice(false);
        setInvoiceForm({ amount: '', dueDate: '', items: '' });
        handleViewClient(selectedClient);
        fetchStats();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to create invoice');
      }
    } catch {
      alert('Failed to create invoice');
    }
    finally { setCreatingInvoice(false); }
  };

  // Update Invoice Status
  const handleUpdateInvoiceStatus = async (invoiceId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/invoices/${invoiceId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status } : inv));
        fetchStats();
      }
    } catch { /* ignore */ }
  };

  // Delete Invoice
  const handleDeleteInvoice = async (invoiceId: string) => {
    if (!confirm('Delete this invoice? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/admin/invoices/${invoiceId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setInvoices(prev => prev.filter(inv => inv.id !== invoiceId));
        fetchStats();
      }
    } catch { /* ignore */ }
  };

  // Update Project
  const handleUpdateProject = async (projectId: string, updates: { status?: string; progress?: number }) => {
    try {
      const res = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...updates } : p));
      }
    } catch { /* ignore */ }
  };

  // Refresh all
  const handleRefreshAll = () => {
    fetchStats();
    fetchClients(searchQuery, filterStatus);
    if (activeView === 'messages') fetchConversations();
    if (activeView === 'invoices') fetchInvoices(invoiceFilter);
    if (activeView === 'projects') fetchProjects(projectFilter);
  };

  // View switch
  const handleViewSwitch = (view: AdminView) => {
    setActiveView(view);
    setSidebarOpen(false);
    if (view === 'messages') fetchConversations();
    if (view === 'invoices') fetchInvoices(invoiceFilter);
    if (view === 'projects') fetchProjects(projectFilter);
  };

  /* ──── Formatters ──── */
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Never';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return 'Never';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  /* ──── Stat Cards ──── */
  const statCards = stats ? [
    { label: 'Total Clients', value: stats.totalClients, icon: Users, gradient: 'from-amber-500/20 to-orange-600/10', iconColor: 'text-amber-400', borderColor: 'border-amber-500/20' },
    { label: 'Active Projects', value: stats.activeProjects, icon: FolderKanban, gradient: 'from-emerald-500/20 to-emerald-600/10', iconColor: 'text-emerald-400', borderColor: 'border-emerald-500/20' },
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, gradient: 'from-yellow-500/20 to-amber-600/10', iconColor: 'text-yellow-400', borderColor: 'border-yellow-500/20' },
    { label: 'Pending Invoices', value: stats.pendingInvoices, icon: Receipt, gradient: 'from-orange-500/20 to-red-600/10', iconColor: 'text-orange-400', borderColor: 'border-orange-500/20' },
    { label: 'Open Tickets', value: stats.openTickets, icon: Ticket, gradient: 'from-red-500/20 to-red-600/10', iconColor: 'text-red-400', borderColor: 'border-red-500/20' },
    { label: 'Unread Messages', value: stats.unreadMessages, icon: Bell, gradient: 'from-violet-500/20 to-violet-600/10', iconColor: 'text-violet-400', borderColor: 'border-violet-500/20' },
  ] : [];

  /* ──── Navigation items ──── */
  const navItems: { key: AdminView; label: string; icon: React.ElementType }[] = [
    { key: 'overview', label: 'Dashboard', icon: TrendingUp },
    { key: 'clients', label: 'All Clients', icon: Users },
    { key: 'messages', label: 'Messages', icon: MessageSquare },
    { key: 'invoices', label: 'Invoices', icon: Receipt },
    { key: 'projects', label: 'Projects', icon: FolderKanban },
  ];

  /* ──── Input classes ──── */
  const inputClass = 'w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition-all';

  /* ═══════════════════════ RENDER ═══════════════════════ */
  return (
    <div className="min-h-screen bg-[#0a1628] flex">
      {/* ── Mobile Overlay ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ══════ SIDEBAR ══════ */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0d1a2d]/95 lg:bg-transparent border-r border-white/5 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Brand */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 flex items-center justify-center">
              <Crown className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-sm leading-none">Admin Panel</h2>
              <p className="text-slate-500 text-[10px] mt-0.5">Master Control</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors lg:hidden">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(item => {
            const isActive = activeView === item.key || (activeView === 'clientDetail' && item.key === 'clients');
            return (
              <button
                key={item.key}
                onClick={() => handleViewSwitch(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive ? 'bg-gradient-to-r from-amber-500/15 to-orange-500/10 text-amber-400 border border-amber-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
              >
                <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-500 group-hover:text-amber-400'}`} />
                <span>{item.label}</span>
                {isActive && <motion.div layoutId="adminActiveIndicator" className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400" />}
              </button>
            );
          })}
        </nav>

        {/* Admin User Info */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-sm font-medium truncate">{userName}</p>
              <p className="text-amber-500 text-[10px] font-semibold flex items-center gap-1">
                <Crown className="w-3 h-3" /> MASTER ADMIN
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={onBack} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-slate-400 text-xs font-medium hover:bg-white/10 hover:text-white transition-all duration-200">
              <ArrowLeft className="w-3.5 h-3.5" /> Portfolio
            </button>
            <button onClick={onLogout} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-slate-400 text-xs font-medium hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all duration-200">
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* ══════ MAIN CONTENT ══════ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ── Header ── */}
        <header className="sticky top-0 z-30 bg-[#0a1628]/90 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors lg:hidden">
                <Menu className="w-5 h-5" />
              </button>
              <button onClick={onBack} className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors hidden sm:flex" title="Back to Portfolio">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h1 className="text-white font-semibold text-sm sm:text-base flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400 sm:hidden" />
                  {activeView === 'overview' && 'Admin Dashboard'}
                  {activeView === 'clients' && 'All Clients'}
                  {activeView === 'clientDetail' && selectedClient?.name}
                  {activeView === 'messages' && 'Messages'}
                  {activeView === 'invoices' && 'Invoices'}
                  {activeView === 'projects' && 'Projects'}
                </h1>
                <p className="text-slate-500 text-xs hidden sm:block">
                  {activeView === 'overview' && 'Manage your client portal'}
                  {activeView === 'clients' && 'View and manage all client accounts'}
                  {activeView === 'clientDetail' && 'Client detail and management'}
                  {activeView === 'messages' && 'Chat with your clients'}
                  {activeView === 'invoices' && 'Manage all invoices'}
                  {activeView === 'projects' && 'Manage all projects'}
                </p>
              </div>
            </div>
            <button onClick={handleRefreshAll} className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors" title="Refresh">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* ── Content Area ── */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">

          {/* ═══════════════ OVERVIEW ═══════════════ */}
          {activeView === 'overview' && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
              <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-bold text-white">
                  Welcome, <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">{userName}</span>
                </h2>
                <p className="text-slate-400 text-sm mt-1">Here&apos;s your admin overview.</p>
              </motion.div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {statCards.map((card) => (
                  <motion.div key={card.label} variants={itemVariants}>
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

              {/* Recent Clients + Quick Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Clients */}
                <motion.div variants={itemVariants} className="glass-card rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Recent Registrations</h3>
                    <button onClick={() => handleViewSwitch('clients')} className="text-amber-400 text-xs font-medium hover:text-amber-300 flex items-center gap-1 transition-colors">
                      View All <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  {recentClients.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <UserPlus className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">No clients registered yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-72 overflow-y-auto">
                      {recentClients.map((c, i) => (
                        <motion.div
                          key={c.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                          onClick={() => handleViewClient(c as AdminClient)}
                        >
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${c.isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/20 text-red-400 border border-red-500/20'}`}>
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-white text-sm font-medium truncate">{c.name}</p>
                            <p className="text-slate-500 text-xs truncate">{c.email}</p>
                          </div>
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${c.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                            {c.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* Quick Stats */}
                <motion.div variants={itemVariants} className="glass-card rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
                  {stats ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Completed Projects</span>
                        <span className="text-emerald-400 font-semibold">{stats.completedProjects}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/5">
                        <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500" style={{ width: `${stats.totalProjects > 0 ? (stats.completedProjects / stats.totalProjects) * 100 : 0}%` }} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Paid Invoices</span>
                        <span className="text-emerald-400 font-semibold">{stats.paidInvoices}/{stats.totalInvoices}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/5">
                        <div className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 transition-all duration-500" style={{ width: `${stats.totalInvoices > 0 ? (stats.paidInvoices / stats.totalInvoices) * 100 : 0}%` }} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Resolved Tickets</span>
                        <span className="text-emerald-400 font-semibold">{stats.resolvedTickets}/{stats.openTickets + stats.resolvedTickets}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/5">
                        <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-500" style={{ width: `${(stats.openTickets + stats.resolvedTickets) > 0 ? (stats.resolvedTickets / (stats.openTickets + stats.resolvedTickets)) * 100 : 0}%` }} />
                      </div>
                      <div className="pt-3 mt-3 border-t border-white/5">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-sm">Pending Invoices</span>
                          <span className="text-yellow-400 font-semibold">{stats.pendingInvoices}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-slate-400 text-sm">Unread Messages</span>
                          <span className="text-violet-400 font-semibold">{stats.unreadMessages}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ═══════════════ ALL CLIENTS ═══════════════ */}
          {activeView === 'clients' && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
              {/* Header with actions */}
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-white">All Registered Clients</h2>
                  <p className="text-slate-400 text-sm mt-1">View and manage all client accounts</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {/* CSV Export */}
                  <button
                    onClick={handleExportCSV}
                    disabled={clients.length === 0}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4" /> Export CSV
                  </button>
                  {/* Create Client */}
                  <button
                    onClick={() => setShowCreateClient(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/20"
                  >
                    <UserPlus className="w-4 h-4" /> Create Client
                  </button>
                </div>
              </motion.div>

              {/* Search & Filter & View Toggle */}
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => handleSearch(e.target.value)}
                    placeholder="Search by name, email, or company..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition-all"
                  />
                </div>
                <div className="flex bg-white/5 rounded-xl p-1 border border-white/5">
                  {(['all', 'active', 'inactive'] as const).map(status => (
                    <button
                      key={status}
                      onClick={() => handleFilterChange(status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${filterStatus === status ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
                {/* View Mode Toggle */}
                <div className="flex bg-white/5 rounded-xl p-1 border border-white/5">
                  <button
                    onClick={() => setClientsViewMode('table')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${clientsViewMode === 'table' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}
                    title="Table View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setClientsViewMode('card')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${clientsViewMode === 'card' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}
                    title="Card View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>

              {/* Client Listing */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                </div>
              ) : clients.length === 0 ? (
                <div className="glass-card rounded-xl p-12 text-center">
                  <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 font-medium">No clients found</p>
                  <p className="text-slate-500 text-sm mt-1">
                    {searchQuery || filterStatus !== 'all' ? 'Try adjusting your search or filters' : 'Clients will appear here when they register'}
                  </p>
                </div>
              ) : (
                <motion.div variants={itemVariants}>
                  {/* ═══ TABLE VIEW (spreadsheet-style) ═══ */}
                  {clientsViewMode === 'table' && (
                    <div className="glass-card rounded-xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[1100px]">
                          <thead>
                            <tr className="px-6 py-3 bg-white/5 border-b border-white/5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                              <th className="text-left px-6 py-3">Client</th>
                              <th className="text-left px-4 py-3">Company</th>
                              <th className="text-left px-4 py-3">Status</th>
                              <th className="text-left px-4 py-3">Phone</th>
                              <th className="text-left px-4 py-3">Address</th>
                              <th className="text-right px-4 py-3">Budget</th>
                              <th className="text-center px-4 py-3">Unread</th>
                              <th className="text-left px-4 py-3">Last Login</th>
                              <th className="text-left px-4 py-3">Joined</th>
                              <th className="text-left px-4 py-3">Stats</th>
                              <th className="text-right px-6 py-3">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {clients.map((client, i) => (
                              <motion.tr
                                key={client.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                                className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors"
                              >
                                {/* Client */}
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleViewClient(client)}>
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${client.isActive ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' : 'bg-slate-500/20 text-slate-400 border border-slate-500/20'}`}>
                                      {client.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-white text-sm font-medium truncate hover:text-amber-400 transition-colors">{client.name}</p>
                                      <p className="text-slate-500 text-xs truncate flex items-center gap-1">
                                        <Mail className="w-3 h-3 flex-shrink-0" /> {client.email}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                {/* Company */}
                                <td className="px-4 py-4">
                                  <p className="text-slate-400 text-sm truncate max-w-[140px]">{client.company || '—'}</p>
                                </td>
                                {/* Status */}
                                <td className="px-4 py-4">
                                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${client.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${client.isActive ? 'bg-emerald-400' : 'bg-red-400'}`} />
                                    {client.isActive ? 'Active' : 'Inactive'}
                                  </span>
                                </td>
                                {/* Phone */}
                                <td className="px-4 py-4">
                                  <p className="text-slate-400 text-xs flex items-center gap-1">
                                    {client.phone ? <><Phone className="w-3 h-3 flex-shrink-0" /> {client.phone}</> : <span className="text-slate-600">—</span>}
                                  </p>
                                </td>
                                {/* Address */}
                                <td className="px-4 py-4">
                                  <p className="text-slate-400 text-xs truncate max-w-[140px] flex items-center gap-1">
                                    {client.address ? <><MapPin className="w-3 h-3 flex-shrink-0" /> {client.address}</> : <span className="text-slate-600">—</span>}
                                  </p>
                                </td>
                                {/* Total Budget */}
                                <td className="px-4 py-4 text-right">
                                  <span className={`text-sm font-semibold ${(client.totalBudget || 0) > 0 ? 'text-emerald-400' : 'text-slate-600'}`}>
                                    ${(client.totalBudget || 0).toFixed(2)}
                                  </span>
                                </td>
                                {/* Unread Messages */}
                                <td className="px-4 py-4 text-center">
                                  {client.unreadMessages > 0 ? (
                                    <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                                      {client.unreadMessages}
                                    </span>
                                  ) : (
                                    <span className="text-slate-600 text-xs">0</span>
                                  )}
                                </td>
                                {/* Last Login */}
                                <td className="px-4 py-4">
                                  <p className="text-slate-400 text-xs flex items-center gap-1">
                                    <Clock className="w-3 h-3 flex-shrink-0" /> {formatDate(client.lastLogin)}
                                  </p>
                                </td>
                                {/* Joined Date */}
                                <td className="px-4 py-4">
                                  <p className="text-slate-400 text-xs flex items-center gap-1">
                                    <CalendarDays className="w-3 h-3 flex-shrink-0" /> {formatDate(client.createdAt)}
                                  </p>
                                </td>
                                {/* Stats */}
                                <td className="px-4 py-4">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-slate-400">{client._count.projects}P</span>
                                    <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-slate-400">{client._count.invoices}I</span>
                                    <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-slate-400">{client._count.tickets}T</span>
                                  </div>
                                </td>
                                {/* Actions */}
                                <td className="px-6 py-4">
                                  <div className="flex items-center justify-end gap-2">
                                    <button onClick={() => handleViewClient(client)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors" title="View">
                                      <Eye className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={() => handleToggleActive(client)} disabled={actionLoading === client.id} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${client.isActive ? 'bg-emerald-500/10 text-emerald-400 hover:bg-red-500/10 hover:text-red-400' : 'bg-red-500/10 text-red-400 hover:bg-emerald-500/10 hover:text-emerald-400'}`} title={client.isActive ? 'Deactivate' : 'Activate'}>
                                      {actionLoading === client.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : client.isActive ? <Ban className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                    </button>
                                    <button onClick={() => handleDeleteClient(client)} disabled={actionLoading === client.id} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Delete">
                                      {actionLoading === client.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                    </button>
                                  </div>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* ═══ CARD VIEW (responsive mobile-friendly) ═══ */}
                  {clientsViewMode === 'card' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {clients.map((client, i) => (
                        <motion.div
                          key={client.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="glass-card rounded-xl p-5 border border-white/5 hover:border-amber-500/20 transition-all group cursor-pointer"
                          onClick={() => handleViewClient(client)}
                        >
                          {/* Card Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${client.isActive ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 text-amber-400' : 'bg-slate-500/20 border border-slate-500/20 text-slate-400'}`}>
                                {client.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="text-white text-sm font-semibold truncate">{client.name}</p>
                                <p className="text-slate-500 text-xs truncate">{client.email}</p>
                              </div>
                            </div>
                            <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${client.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${client.isActive ? 'bg-emerald-400' : 'bg-red-400'}`} />
                              {client.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>

                          {/* Card Info */}
                          <div className="space-y-2 mb-4">
                            {client.company && (
                              <p className="text-slate-400 text-xs flex items-center gap-1.5">
                                <Building2 className="w-3 h-3 flex-shrink-0 text-slate-500" />
                                <span className="truncate">{client.company}</span>
                              </p>
                            )}
                            {client.phone && (
                              <p className="text-slate-400 text-xs flex items-center gap-1.5">
                                <Phone className="w-3 h-3 flex-shrink-0 text-slate-500" />
                                <span className="truncate">{client.phone}</span>
                              </p>
                            )}
                            {client.address && (
                              <p className="text-slate-400 text-xs flex items-center gap-1.5">
                                <MapPin className="w-3 h-3 flex-shrink-0 text-slate-500" />
                                <span className="truncate">{client.address}</span>
                              </p>
                            )}
                          </div>

                          {/* Card Stats Row */}
                          <div className="flex items-center justify-between pt-3 border-t border-white/5">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] bg-white/5 px-2 py-1 rounded-lg text-slate-400 font-medium">{client._count.projects} Projects</span>
                              <span className="text-[10px] bg-white/5 px-2 py-1 rounded-lg text-slate-400 font-medium">{client._count.invoices} Invoices</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {(client.totalBudget || 0) > 0 && (
                                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-lg font-medium">${client.totalBudget.toFixed(0)}</span>
                              )}
                              {client.unreadMessages > 0 && (
                                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center justify-center">{client.unreadMessages}</span>
                              )}
                            </div>
                          </div>

                          {/* Card Actions */}
                          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5" onClick={e => e.stopPropagation()}>
                            <button onClick={() => handleViewClient(client)} className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-white/5 text-slate-400 text-xs font-medium hover:text-amber-400 hover:bg-amber-500/10 transition-all">
                              <Eye className="w-3 h-3" /> View
                            </button>
                            <button onClick={() => handleToggleActive(client)} disabled={actionLoading === client.id} className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${client.isActive ? 'bg-emerald-500/10 text-emerald-400 hover:bg-red-500/10 hover:text-red-400' : 'bg-red-500/10 text-red-400 hover:bg-emerald-500/10 hover:text-emerald-400'}`}>
                              {actionLoading === client.id ? <Loader2 className="w-3 h-3 animate-spin" /> : client.isActive ? <Ban className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                              {client.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ═══════════════ CLIENT DETAIL ═══════════════ */}
          {activeView === 'clientDetail' && selectedClient && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
              <motion.div variants={itemVariants}>
                <button onClick={() => { setActiveView('clients'); setSelectedClient(null); setClientDetail(null); }} className="flex items-center gap-1.5 text-slate-400 hover:text-amber-400 transition-colors text-sm mb-4">
                  <ArrowLeft className="w-4 h-4" /> Back to Clients
                </button>
                <div className="glass-card rounded-xl p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0 ${selectedClient.isActive ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 text-amber-400' : 'bg-gradient-to-br from-slate-500/20 to-slate-600/10 border border-slate-500/20 text-slate-400'}`}>
                      {selectedClient.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-bold text-white">{selectedClient.name}</h2>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-slate-400 text-sm flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {selectedClient.email}</span>
                        {selectedClient.company && <span className="text-slate-400 text-sm flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {selectedClient.company}</span>}
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${selectedClient.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${selectedClient.isActive ? 'bg-emerald-400' : 'bg-red-400'}`} />
                          {selectedClient.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => setShowSendMessage(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-all">
                        <Send className="w-3.5 h-3.5" /> Message
                      </button>
                      <button onClick={() => setShowCreateProject(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 transition-all">
                        <Plus className="w-3.5 h-3.5" /> Project
                      </button>
                      <button onClick={() => setShowCreateInvoice(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 transition-all">
                        <Plus className="w-3.5 h-3.5" /> Invoice
                      </button>
                      <button onClick={() => handleToggleActive(selectedClient)} disabled={actionLoading === selectedClient.id} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${selectedClient.isActive ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'}`}>
                        {actionLoading === selectedClient.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : selectedClient.isActive ? <Ban className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                        {selectedClient.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => handleDeleteClient(selectedClient)} disabled={actionLoading === selectedClient.id} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/5">
                    <div>
                      <p className="text-slate-500 text-xs mb-0.5">Registered</p>
                      <p className="text-white text-sm font-medium">{formatDate(selectedClient.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-0.5">Last Login</p>
                      <p className="text-white text-sm font-medium">{formatDateTime(selectedClient.lastLogin)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-0.5">Phone</p>
                      <p className="text-white text-sm font-medium">{selectedClient.phone || '—'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-0.5">Role</p>
                      <p className="text-white text-sm font-medium capitalize">{selectedClient.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Client Stats */}
              <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { label: 'Projects', value: selectedClient._count.projects, icon: FolderKanban, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                  { label: 'Invoices', value: selectedClient._count.invoices, icon: Receipt, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
                  { label: 'Tickets', value: selectedClient._count.tickets, icon: Ticket, color: 'text-red-400 bg-red-500/10 border-red-500/20' },
                  { label: 'Messages', value: selectedClient._count.messages, icon: MessageSquare, color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
                  { label: 'Notifications', value: selectedClient._count.notifications, icon: Bell, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                ].map(s => (
                  <div key={s.label} className={`glass-card rounded-xl p-4 border ${s.color.split(' ').slice(1).join(' ')}`}>
                    <s.icon className={`w-5 h-5 ${s.color.split(' ')[0]} mb-2`} />
                    <p className="text-2xl font-bold text-white">{s.value}</p>
                    <p className="text-slate-400 text-xs">{s.label}</p>
                  </div>
                ))}
              </motion.div>

              {/* Client Projects */}
              {clientDetail && (clientDetail.projects as unknown[])?.length > 0 && (
                <motion.div variants={itemVariants} className="glass-card rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Projects</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {(clientDetail.projects as Array<Record<string, unknown>>).map((p) => (
                      <div key={String(p.id)} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                        <div>
                          <p className="text-white text-sm font-medium">{String(p.title)}</p>
                          <p className="text-slate-500 text-xs">Created {formatDate(String(p.createdAt))}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          {p.deadline && <span className="text-slate-400 text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDate(String(p.deadline))}</span>}
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(String(p.status))}`}>{String(p.status)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Client Invoices */}
              {clientDetail && (clientDetail.invoices as unknown[])?.length > 0 && (
                <motion.div variants={itemVariants} className="glass-card rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Invoices</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {(clientDetail.invoices as Array<Record<string, unknown>>).map((inv) => (
                      <div key={String(inv.id)} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                        <div>
                          <p className="text-white text-sm font-medium">{String(inv.invoiceNumber)}</p>
                          <p className="text-slate-500 text-xs">Due {formatDate(String(inv.dueDate))}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-white text-sm font-semibold">${Number(inv.amount).toFixed(2)}</span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getInvoiceStatusColor(String(inv.status))}`}>{String(inv.status)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Client Tickets */}
              {clientDetail && (clientDetail.tickets as unknown[])?.length > 0 && (
                <motion.div variants={itemVariants} className="glass-card rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Tickets</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {(clientDetail.tickets as Array<Record<string, unknown>>).map((t) => (
                      <div key={String(t.id)} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                        <div>
                          <p className="text-white text-sm font-medium">{String(t.subject)}</p>
                          <p className="text-slate-500 text-xs">Created {formatDate(String(t.createdAt))}</p>
                        </div>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(String(t.status))}`}>{String(t.status)}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ═══════════════ MESSAGES / CHAT ═══════════════ */}
          {activeView === 'messages' && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="h-[calc(100vh-140px)] min-h-[500px]">
              <motion.div variants={itemVariants} className="glass-card rounded-xl h-full flex flex-col overflow-hidden">
                <div className="flex flex-col sm:flex-row flex-1 min-h-0">
                  {/* Conversation List */}
                  <div className={`w-full sm:w-72 border-b sm:border-b-0 sm:border-r border-white/5 flex flex-col ${selectedConversation ? 'hidden sm:flex' : 'flex'}`}>
                    <div className="p-4 border-b border-white/5">
                      <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                        <Inbox className="w-4 h-4 text-amber-400" /> Conversations
                      </h3>
                    </div>
                    {conversationsLoading ? (
                      <div className="flex-1 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
                      </div>
                    ) : conversations.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-6">
                        <MessageSquare className="w-10 h-10 mb-2 opacity-30" />
                        <p className="text-sm">No conversations yet</p>
                      </div>
                    ) : (
                      <div className="flex-1 overflow-y-auto">
                        {conversations.map((conv) => (
                          <button
                            key={conv.clientId}
                            onClick={() => {
                              setSelectedConversation(conv);
                              fetchMessages(conv.clientId);
                            }}
                            className={`w-full text-left p-3 border-b border-white/5 hover:bg-white/[0.03] transition-colors ${selectedConversation?.clientId === conv.clientId ? 'bg-amber-500/10 border-l-2 border-l-amber-500' : ''}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                {conv.clientName.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="text-white text-sm font-medium truncate">{conv.clientName}</p>
                                  <span className="text-[10px] text-slate-500 flex-shrink-0 ml-2">{formatTime(conv.lastMessageAt)}</span>
                                </div>
                                <div className="flex items-center justify-between mt-0.5">
                                  <p className="text-slate-500 text-xs truncate pr-2">{conv.lastMessage}</p>
                                  {conv.unreadCount > 0 && (
                                    <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                                      {conv.unreadCount}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Chat Panel */}
                  <div className={`flex-1 flex flex-col min-h-0 ${!selectedConversation ? 'hidden sm:flex' : 'flex'}`}>
                    {!selectedConversation ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-6">
                        <MessageSquare className="w-16 h-16 mb-3 opacity-20" />
                        <p className="text-lg font-medium">Select a conversation</p>
                        <p className="text-sm mt-1">Choose a client from the left to start chatting</p>
                      </div>
                    ) : (
                      <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button onClick={() => { setSelectedConversation(null); setChatMessages([]); }} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors sm:hidden">
                              <ArrowLeft className="w-4 h-4" />
                            </button>
                            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold">
                              {selectedConversation.clientName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-white text-sm font-medium">{selectedConversation.clientName}</p>
                              <p className="text-slate-500 text-xs">{selectedConversation.clientEmail}</p>
                            </div>
                          </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                          {messagesLoading ? (
                            <div className="flex items-center justify-center py-8">
                              <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
                            </div>
                          ) : chatMessages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-slate-500">
                              <Send className="w-8 h-8 mb-2 opacity-30" />
                              <p className="text-sm">No messages yet. Say hello!</p>
                            </div>
                          ) : (
                            chatMessages.map((msg) => {
                              const isAdmin = msg.senderRole === 'admin';
                              return (
                                <motion.div
                                  key={msg.id}
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                                >
                                  <div className={`max-w-[80%] sm:max-w-[70%] ${isAdmin ? 'order-1' : ''}`}>
                                    <div className={`rounded-2xl px-4 py-2.5 ${isAdmin ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/20 text-white' : 'bg-white/10 border border-white/5 text-white'}`}>
                                      <p className="text-sm">{msg.content}</p>
                                    </div>
                                    <div className={`flex items-center gap-2 mt-1 px-1 ${isAdmin ? 'justify-end' : ''}`}>
                                      <span className="text-[10px] text-slate-500">{msg.senderName}</span>
                                      <span className="text-[10px] text-slate-600">{formatTime(msg.createdAt)}</span>
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })
                          )}
                          <div ref={chatEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="p-4 border-t border-white/5">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={messageInput}
                              onChange={e => setMessageInput(e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                              placeholder="Type a message..."
                              className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition-all"
                            />
                            <button
                              onClick={handleSendMessage}
                              disabled={!messageInput.trim() || sendingMessage}
                              className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                              {sendingMessage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ═══════════════ INVOICES ═══════════════ */}
          {activeView === 'invoices' && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-white">All Invoices</h2>
                  <p className="text-slate-400 text-sm mt-1">Manage invoices across all clients</p>
                </div>
                <div className="flex bg-white/5 rounded-xl p-1 border border-white/5">
                  {['all', 'pending', 'paid', 'overdue', 'cancelled', 'refunded'].map(status => (
                    <button
                      key={status}
                      onClick={() => { setInvoiceFilter(status); fetchInvoices(status); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 capitalize ${invoiceFilter === status ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </motion.div>

              {invoicesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                </div>
              ) : invoices.length === 0 ? (
                <div className="glass-card rounded-xl p-12 text-center">
                  <Receipt className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 font-medium">No invoices found</p>
                  <p className="text-slate-500 text-sm mt-1">Invoices will appear here when created</p>
                </div>
              ) : (
                <motion.div variants={itemVariants}>
                  <div className="glass-card rounded-xl overflow-hidden">
                    <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 bg-white/5 border-b border-white/5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      <div className="col-span-3">Invoice</div>
                      <div className="col-span-2">Client</div>
                      <div className="col-span-2">Amount</div>
                      <div className="col-span-2">Status</div>
                      <div className="col-span-2">Due Date</div>
                      <div className="col-span-1 text-right">Actions</div>
                    </div>

                    {invoices.map((inv, i) => (
                      <motion.div
                        key={inv.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-6 py-4 border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors"
                      >
                        <div className="sm:col-span-3 flex items-center">
                          <p className="text-white text-sm font-medium flex items-center gap-2">
                            <FileText className="w-4 h-4 text-amber-400 flex-shrink-0" />
                            {inv.invoiceNumber}
                          </p>
                        </div>
                        <div className="sm:col-span-2 flex items-center">
                          <p className="text-slate-400 text-sm truncate">{inv.clientName}</p>
                        </div>
                        <div className="sm:col-span-2 flex items-center">
                          <span className="text-white text-sm font-semibold">${Number(inv.amount).toFixed(2)}</span>
                        </div>
                        <div className="sm:col-span-2 flex items-center">
                          <select
                            value={inv.status}
                            onChange={e => handleUpdateInvoiceStatus(inv.id, e.target.value)}
                            className={`text-xs font-medium px-2.5 py-1 rounded-lg border-0 cursor-pointer appearance-none text-center ${getInvoiceStatusColor(inv.status)} bg-inherit`}
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="overdue">Overdue</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="refunded">Refunded</option>
                          </select>
                        </div>
                        <div className="sm:col-span-2 flex items-center">
                          <p className="text-slate-400 text-xs flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {formatDate(inv.dueDate)}
                          </p>
                        </div>
                        <div className="sm:col-span-1 flex items-center justify-end">
                          <button
                            onClick={() => handleDeleteInvoice(inv.id)}
                            className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete Invoice"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ═══════════════ PROJECTS ═══════════════ */}
          {activeView === 'projects' && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-white">All Projects</h2>
                  <p className="text-slate-400 text-sm mt-1">Manage projects across all clients</p>
                </div>
                <div className="flex bg-white/5 rounded-xl p-1 border border-white/5">
                  {['all', 'pending', 'in-progress', 'review', 'completed', 'paused'].map(status => (
                    <button
                      key={status}
                      onClick={() => { setProjectFilter(status); fetchProjects(status); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 capitalize ${projectFilter === status ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </motion.div>

              {projectsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                </div>
              ) : projects.length === 0 ? (
                <div className="glass-card rounded-xl p-12 text-center">
                  <FolderKanban className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 font-medium">No projects found</p>
                  <p className="text-slate-500 text-sm mt-1">Projects will appear here when created</p>
                </div>
              ) : (
                <motion.div variants={itemVariants}>
                  <div className="glass-card rounded-xl overflow-hidden">
                    <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 bg-white/5 border-b border-white/5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      <div className="col-span-3">Project</div>
                      <div className="col-span-2">Client</div>
                      <div className="col-span-1">Status</div>
                      <div className="col-span-3">Progress</div>
                      <div className="col-span-1">Priority</div>
                      <div className="col-span-2">Deadline</div>
                    </div>

                    {projects.map((proj, i) => (
                      <motion.div
                        key={proj.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-6 py-4 border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors"
                      >
                        <div className="sm:col-span-3 flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0">
                            <FolderKanban className="w-4 h-4" />
                          </div>
                          <p className="text-white text-sm font-medium truncate">{proj.title}</p>
                        </div>
                        <div className="sm:col-span-2 flex items-center">
                          <p className="text-slate-400 text-sm truncate">{proj.clientName}</p>
                        </div>
                        <div className="sm:col-span-1 flex items-center">
                          <select
                            value={proj.status}
                            onChange={e => handleUpdateProject(proj.id, { status: e.target.value })}
                            className={`text-xs font-medium px-2 py-0.5 rounded-lg border-0 cursor-pointer appearance-none text-center ${getStatusColor(proj.status)} bg-inherit`}
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="review">Review</option>
                            <option value="completed">Completed</option>
                            <option value="paused">Paused</option>
                          </select>
                        </div>
                        <div className="sm:col-span-3 flex items-center gap-3">
                          <div className="flex-1">
                            <div className="w-full h-1.5 rounded-full bg-white/5">
                              <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300" style={{ width: `${proj.progress}%` }} />
                            </div>
                          </div>
                          <span className="text-xs text-slate-400 w-8 text-right">{proj.progress}%</span>
                        </div>
                        <div className="sm:col-span-1 flex items-center">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getPriorityColor(proj.priority)}`}>
                            {proj.priority}
                          </span>
                        </div>
                        <div className="sm:col-span-2 flex items-center">
                          <p className="text-slate-400 text-xs flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {formatDate(proj.deadline)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </main>
      </div>

      {/* ═══════════════ MODALS ═══════════════ */}

      {/* Create Client Dialog */}
      <Dialog open={showCreateClient} onOpenChange={setShowCreateClient}>
        <DialogContent className="bg-[#0d1a2d] border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-400">
              <UserPlus className="w-5 h-5" /> Create Client Account
            </DialogTitle>
            <DialogDescription className="text-slate-400">Create a new client account for the portal.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2 max-h-[60vh] overflow-y-auto pr-1">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Full Name *</label>
              <input type="text" value={createClientForm.name} onChange={e => setCreateClientForm(p => ({ ...p, name: e.target.value }))} placeholder="John Doe" className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Email *</label>
              <input type="email" value={createClientForm.email} onChange={e => setCreateClientForm(p => ({ ...p, email: e.target.value }))} placeholder="john@example.com" className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Password *</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={createClientForm.password} onChange={e => setCreateClientForm(p => ({ ...p, password: e.target.value }))} placeholder="Min. 6 characters" className={`${inputClass} pr-10`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Company</label>
              <input type="text" value={createClientForm.company} onChange={e => setCreateClientForm(p => ({ ...p, company: e.target.value }))} placeholder="Acme Inc." className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Phone</label>
              <input type="tel" value={createClientForm.phone} onChange={e => setCreateClientForm(p => ({ ...p, phone: e.target.value }))} placeholder="+1 (555) 000-0000" className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Address</label>
              <input type="text" value={createClientForm.address} onChange={e => setCreateClientForm(p => ({ ...p, address: e.target.value }))} placeholder="123 Main St, City, State" className={inputClass} />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <button onClick={() => setShowCreateClient(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/10 transition-all">
              Cancel
            </button>
            <button onClick={handleCreateClient} disabled={createClientLoading || !createClientForm.name || !createClientForm.email || !createClientForm.password} className="px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2">
              {createClientLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Client
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Quick Message Dialog */}
      <Dialog open={showSendMessage} onOpenChange={setShowSendMessage}>
        <DialogContent className="bg-[#0d1a2d] border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-400">
              <Send className="w-5 h-5" /> Send Message to {selectedClient?.name}
            </DialogTitle>
            <DialogDescription className="text-slate-400">Send a quick message to this client.</DialogDescription>
          </DialogHeader>
          <div className="mt-2">
            <textarea
              value={quickMessage}
              onChange={e => setQuickMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={4}
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition-all resize-none"
            />
          </div>
          <DialogFooter className="mt-4">
            <button onClick={() => setShowSendMessage(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/10 transition-all">
              Cancel
            </button>
            <button onClick={handleQuickMessage} disabled={!quickMessage.trim() || sendingQuickMessage} className="px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2">
              {sendingQuickMessage && <Loader2 className="w-4 h-4 animate-spin" />}
              <Send className="w-4 h-4" /> Send
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Project Dialog */}
      <Dialog open={showCreateProject} onOpenChange={setShowCreateProject}>
        <DialogContent className="bg-[#0d1a2d] border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-400">
              <FolderKanban className="w-5 h-5" /> Create Project for {selectedClient?.name}
            </DialogTitle>
            <DialogDescription className="text-slate-400">Create a new project for this client.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Project Title *</label>
              <input type="text" value={projectForm.title} onChange={e => setProjectForm(p => ({ ...p, title: e.target.value }))} placeholder="Website Redesign" className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Description</label>
              <textarea value={projectForm.description} onChange={e => setProjectForm(p => ({ ...p, description: e.target.value }))} placeholder="Project details..." rows={3} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition-all resize-none" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Deadline</label>
              <input type="date" value={projectForm.deadline} onChange={e => setProjectForm(p => ({ ...p, deadline: e.target.value }))} className={inputClass} />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <button onClick={() => setShowCreateProject(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/10 transition-all">
              Cancel
            </button>
            <button onClick={handleCreateProject} disabled={!projectForm.title || creatingProject} className="px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2">
              {creatingProject && <Loader2 className="w-4 h-4 animate-spin" />}
              <Plus className="w-4 h-4" /> Create Project
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Invoice Dialog */}
      <Dialog open={showCreateInvoice} onOpenChange={setShowCreateInvoice}>
        <DialogContent className="bg-[#0d1a2d] border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-400">
              <Receipt className="w-5 h-5" /> Create Invoice for {selectedClient?.name}
            </DialogTitle>
            <DialogDescription className="text-slate-400">Create a new invoice for this client.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Amount ($) *</label>
              <input type="number" step="0.01" value={invoiceForm.amount} onChange={e => setInvoiceForm(p => ({ ...p, amount: e.target.value }))} placeholder="500.00" className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Due Date</label>
              <input type="date" value={invoiceForm.dueDate} onChange={e => setInvoiceForm(p => ({ ...p, dueDate: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Items / Description</label>
              <textarea value={invoiceForm.items} onChange={e => setInvoiceForm(p => ({ ...p, items: e.target.value }))} placeholder="Website design, hosting..." rows={3} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition-all resize-none" />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <button onClick={() => setShowCreateInvoice(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/10 transition-all">
              Cancel
            </button>
            <button onClick={handleCreateInvoice} disabled={!invoiceForm.amount || creatingInvoice} className="px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2">
              {creatingInvoice && <Loader2 className="w-4 h-4 animate-spin" />}
              <Plus className="w-4 h-4" /> Create Invoice
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
