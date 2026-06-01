'use client';

import { useState, useEffect, useCallback } from 'react';
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
} from 'lucide-react';

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

interface AdminDashboardProps {
  userName: string;
  onBack: () => void;
  onLogout: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export default function AdminPanel({ userName, onBack, onLogout }: AdminDashboardProps) {
  const [activeView, setActiveView] = useState<'overview' | 'clients' | 'clientDetail'>('overview');
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

  const getAuthHeaders = useCallback(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('portal_token='))?.split('=')[1];
    return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : {};
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/stats', { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setStats(data.data.overview);
        setRecentClients(data.data.recentClients || []);
      }
    } catch {
      // fallback
    }
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
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    Promise.all([fetchStats(), fetchClients()]);
  }, [fetchStats, fetchClients]);

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

  const statCards = stats ? [
    { label: 'Total Clients', value: stats.totalClients, icon: Users, gradient: 'from-teal-500/20 to-teal-600/10', iconColor: 'text-teal-400', borderColor: 'border-teal-500/20' },
    { label: 'Active Clients', value: stats.activeClients, icon: CheckCircle2, gradient: 'from-emerald-500/20 to-emerald-600/10', iconColor: 'text-emerald-400', borderColor: 'border-emerald-500/20' },
    { label: 'Total Projects', value: stats.totalProjects, icon: FolderKanban, gradient: 'from-sky-500/20 to-sky-600/10', iconColor: 'text-sky-400', borderColor: 'border-sky-500/20' },
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, gradient: 'from-yellow-500/20 to-amber-600/10', iconColor: 'text-yellow-400', borderColor: 'border-yellow-500/20' },
    { label: 'Open Tickets', value: stats.openTickets, icon: Ticket, gradient: 'from-red-500/20 to-red-600/10', iconColor: 'text-red-400', borderColor: 'border-red-500/20' },
    { label: 'Messages', value: stats.totalMessages, icon: MessageSquare, gradient: 'from-violet-500/20 to-violet-600/10', iconColor: 'text-violet-400', borderColor: 'border-violet-500/20' },
  ] : [];

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

  return (
    <div className="min-h-screen bg-[#0a1628] flex">
      {/* Mobile Overlay */}
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

      {/* Admin Sidebar */}
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

        {/* Admin Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {[
            { key: 'overview' as const, label: 'Dashboard', icon: TrendingUp },
            { key: 'clients' as const, label: 'All Clients', icon: Users },
          ].map(item => {
            const isActive = activeView === item.key || (activeView === 'clientDetail' && item.key === 'clients');
            return (
              <button
                key={item.key}
                onClick={() => { setActiveView(item.key); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive ? 'bg-gradient-to-r from-amber-500/15 to-orange-500/10 text-amber-400 border border-amber-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
              >
                <item.icon className={`w-4.5 h-4.5 flex-shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-500 group-hover:text-amber-400'}`} />
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#0a1628]/90 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors lg:hidden">
                <Menu className="w-5 h-5" />
              </button>
              <button onClick={onBack} className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 transition-colors hidden sm:flex" title="Back to Portfolio">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h1 className="text-white font-semibold text-sm sm:text-base flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400 sm:hidden" />
                  {activeView === 'overview' && 'Admin Dashboard'}
                  {activeView === 'clients' && 'All Clients'}
                  {activeView === 'clientDetail' && selectedClient?.name}
                </h1>
                <p className="text-slate-500 text-xs hidden sm:block">
                  {activeView === 'clientDetail' ? 'Client detail and management' : 'Manage your client portal'}
                </p>
              </div>
            </div>
            <button onClick={() => { fetchStats(); fetchClients(searchQuery, filterStatus); }} className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 transition-colors" title="Refresh">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {/* ── OVERVIEW ── */}
          {activeView === 'overview' && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
              {/* Welcome */}
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
                    <button onClick={() => setActiveView('clients')} className="text-amber-400 text-xs font-medium hover:text-amber-300 flex items-center gap-1 transition-colors">
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
                          onClick={() => handleViewClient(c)}
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
                        <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500" style={{ width: `${stats.totalProjects > 0 ? (stats.completedProjects / stats.totalProjects) * 100 : 0}%` }} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Paid Invoices</span>
                        <span className="text-emerald-400 font-semibold">{stats.paidInvoices}/{stats.totalInvoices}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/5">
                        <div className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-amber-500" style={{ width: `${stats.totalInvoices > 0 ? (stats.paidInvoices / stats.totalInvoices) * 100 : 0}%` }} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Resolved Tickets</span>
                        <span className="text-emerald-400 font-semibold">{stats.resolvedTickets}/{stats.openTickets + stats.resolvedTickets}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/5">
                        <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-500" style={{ width: `${(stats.openTickets + stats.resolvedTickets) > 0 ? (stats.resolvedTickets / (stats.openTickets + stats.resolvedTickets)) * 100 : 0}%` }} />
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

          {/* ── CLIENTS LIST ── */}
          {activeView === 'clients' && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
              <motion.div variants={itemVariants}>
                <h2 className="text-xl font-bold text-white">All Registered Clients</h2>
                <p className="text-slate-400 text-sm mt-1">View and manage all client accounts</p>
              </motion.div>

              {/* Search & Filter */}
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
              </motion.div>

              {/* Client Table/Cards */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                </div>
              ) : clients.length === 0 ? (
                <div className="glass-card rounded-xl p-12 text-center">
                  <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 font-medium">No clients found</p>
                  <p className="text-slate-500 text-sm mt-1">
                    {searchQuery || filterStatus !== 'all' ? 'Try adjusting your search or filters' : 'Clients will appear here when they register on your website'}
                  </p>
                </div>
              ) : (
                <motion.div variants={itemVariants}>
                  <div className="glass-card rounded-xl overflow-hidden">
                    {/* Desktop Table Header */}
                    <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 bg-white/5 border-b border-white/5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      <div className="col-span-3">Client</div>
                      <div className="col-span-2">Company</div>
                      <div className="col-span-1">Status</div>
                      <div className="col-span-2">Last Login</div>
                      <div className="col-span-2">Stats</div>
                      <div className="col-span-2 text-right">Actions</div>
                    </div>

                    {clients.map((client, i) => (
                      <motion.div
                        key={client.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-6 py-4 border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors"
                      >
                        {/* Client Info */}
                        <div className="sm:col-span-3 flex items-center gap-3 cursor-pointer" onClick={() => handleViewClient(client)}>
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${client.isActive ? 'bg-teal-500/20 text-teal-400 border border-teal-500/20' : 'bg-slate-500/20 text-slate-400 border border-slate-500/20'}`}>
                            {client.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-white text-sm font-medium truncate hover:text-amber-400 transition-colors">{client.name}</p>
                            <p className="text-slate-500 text-xs truncate flex items-center gap-1">
                              <Mail className="w-3 h-3 flex-shrink-0" /> {client.email}
                            </p>
                          </div>
                        </div>

                        {/* Company */}
                        <div className="sm:col-span-2 flex items-center">
                          <p className="text-slate-400 text-sm truncate">{client.company || '—'}</p>
                        </div>

                        {/* Status */}
                        <div className="sm:col-span-1 flex items-center">
                          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${client.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${client.isActive ? 'bg-emerald-400' : 'bg-red-400'}`} />
                            {client.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>

                        {/* Last Login */}
                        <div className="sm:col-span-2 flex items-center">
                          <p className="text-slate-400 text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3 flex-shrink-0" /> {formatDate(client.lastLogin)}
                          </p>
                        </div>

                        {/* Stats */}
                        <div className="sm:col-span-2 flex items-center gap-2">
                          <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-slate-400">{client._count.projects}P</span>
                          <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-slate-400">{client._count.invoices}I</span>
                          <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-slate-400">{client._count.tickets}T</span>
                          <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-slate-400">{client._count.messages}M</span>
                        </div>

                        {/* Actions */}
                        <div className="sm:col-span-2 flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewClient(client)}
                            className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleActive(client)}
                            disabled={actionLoading === client.id}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${client.isActive ? 'bg-emerald-500/10 text-emerald-400 hover:bg-red-500/10 hover:text-red-400' : 'bg-red-500/10 text-red-400 hover:bg-emerald-500/10 hover:text-emerald-400'}`}
                            title={client.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {actionLoading === client.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : client.isActive ? <Ban className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleDeleteClient(client)}
                            disabled={actionLoading === client.id}
                            className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete Client"
                          >
                            {actionLoading === client.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ── CLIENT DETAIL ── */}
          {activeView === 'clientDetail' && selectedClient && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
              {/* Back + Client Header */}
              <motion.div variants={itemVariants}>
                <button onClick={() => { setActiveView('clients'); setSelectedClient(null); setClientDetail(null); }} className="flex items-center gap-1.5 text-slate-400 hover:text-amber-400 transition-colors text-sm mb-4">
                  <ArrowLeft className="w-4 h-4" /> Back to Clients
                </button>
                <div className="glass-card rounded-xl p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold ${selectedClient.isActive ? 'bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/20 text-teal-400' : 'bg-gradient-to-br from-slate-500/20 to-slate-600/10 border border-slate-500/20 text-slate-400'}`}>
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
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleActive(selectedClient)}
                        disabled={actionLoading === selectedClient.id}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedClient.isActive ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'}`}
                      >
                        {actionLoading === selectedClient.id ? <Loader2 className="w-4 h-4 animate-spin" /> : selectedClient.isActive ? <Ban className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                        {selectedClient.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => { handleDeleteClient(selectedClient); }}
                        disabled={actionLoading === selectedClient.id}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
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
                  { label: 'Projects', value: selectedClient._count.projects, icon: FolderKanban, color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
                  { label: 'Invoices', value: selectedClient._count.invoices, icon: Receipt, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
                  { label: 'Tickets', value: selectedClient._count.tickets, icon: Ticket, color: 'text-red-400 bg-red-500/10 border-red-500/20' },
                  { label: 'Messages', value: selectedClient._count.messages, icon: MessageSquare, color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
                  { label: 'Notifications', value: selectedClient._count.notifications, icon: Bell, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
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
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(String(p.status))}`}>
                            {String(p.status)}
                          </span>
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
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getInvoiceStatusColor(String(inv.status))}`}>
                            {String(inv.status)}
                          </span>
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
                          <p className="text-slate-500 text-xs">{formatDate(String(t.createdAt))}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-slate-400">{String(t.category)}</span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getTicketStatusColor(String(t.status))}`}>
                            {String(t.status)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Danger Zone */}
              <motion.div variants={itemVariants} className="glass-card rounded-xl p-6 border border-red-500/10">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <h3 className="text-lg font-semibold text-red-400">Danger Zone</h3>
                </div>
                <p className="text-slate-400 text-sm mb-4">Deleting this client will permanently remove all their data including projects, invoices, tickets, messages, files, and notifications. This action cannot be undone.</p>
                <button
                  onClick={() => handleDeleteClient(selectedClient)}
                  disabled={actionLoading === selectedClient.id}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-all"
                >
                  {actionLoading === selectedClient.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Delete &quot;{selectedClient.name}&quot; Permanently
                </button>
              </motion.div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}

function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    'in-progress': 'bg-sky-500/10 text-sky-400',
    'completed': 'bg-emerald-500/10 text-emerald-400',
    'pending': 'bg-yellow-500/10 text-yellow-400',
    'review': 'bg-amber-500/10 text-amber-400',
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
  };
  return map[status] || 'bg-white/10 text-slate-300';
}

function getTicketStatusColor(status: string): string {
  const map: Record<string, string> = {
    open: 'bg-teal-500/10 text-teal-400',
    'in-progress': 'bg-sky-500/10 text-sky-400',
    resolved: 'bg-emerald-500/10 text-emerald-400',
    closed: 'bg-slate-500/10 text-slate-400',
  };
  return map[status] || 'bg-white/10 text-slate-300';
}
