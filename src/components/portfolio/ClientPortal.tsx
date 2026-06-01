'use client';

import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FolderKanban,
  Receipt,
  MessageSquare,
  FileText,
  Ticket,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  ArrowLeft,
  Loader2,
  Shield,
} from 'lucide-react';
import VerifiedSticker from './VerifiedSticker';

// Lazy-load tab components for performance
const PortalLogin = lazy(() => import('./PortalLogin'));
const PortalDashboard = lazy(() => import('./PortalDashboard'));
const PortalProjects = lazy(() => import('./PortalProjects'));
const PortalInvoices = lazy(() => import('./PortalInvoices'));
const PortalMessages = lazy(() => import('./PortalMessages'));
const PortalFiles = lazy(() => import('./PortalFiles'));
const PortalTickets = lazy(() => import('./PortalTickets'));
const PortalSettings = lazy(() => import('./PortalSettings'));
const AdminPanel = lazy(() => import('./AdminPanel'));

export type PortalTab = 'dashboard' | 'projects' | 'invoices' | 'messages' | 'files' | 'tickets' | 'settings';

interface ClientPortalProps {
  onBack?: () => void;
}

interface NavItem {
  key: PortalTab;
  label: string;
  icon: typeof LayoutDashboard;
}

const navItems: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'projects', label: 'Projects', icon: FolderKanban },
  { key: 'invoices', label: 'Invoices', icon: Receipt },
  { key: 'messages', label: 'Messages', icon: MessageSquare },
  { key: 'files', label: 'Files', icon: FileText },
  { key: 'tickets', label: 'Tickets', icon: Ticket },
  { key: 'settings', label: 'Settings', icon: Settings },
];

const tabContent: Record<PortalTab, () => React.ReactNode> = {
  dashboard: () => <PlaceholderTab name="Dashboard" />,
  projects: () => <PlaceholderTab name="Projects" />,
  invoices: () => <PlaceholderTab name="Invoices" />,
  messages: () => <PlaceholderTab name="Messages" />,
  files: () => <PlaceholderTab name="Files" />,
  tickets: () => <PlaceholderTab name="Tickets" />,
  settings: () => <PlaceholderTab name="Settings" />,
};

function PlaceholderTab({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center h-64 text-slate-500">
      <Loader2 className="w-6 h-6 animate-spin mr-2" />
      Loading {name}...
    </div>
  );
}

function TabLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
    </div>
  );
}

export default function ClientPortal({ onBack }: ClientPortalProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<PortalTab>('dashboard');
  const [user, setUser] = useState({ name: '', email: '', role: 'client' });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('portal_token='))
      ?.split('=')[1];

    if (!token) {
      // No token — use microtask to avoid synchronous setState in effect
      Promise.resolve().then(() => setAuthChecked(true));
      return;
    }

    // Verify token with API
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Invalid token');
      })
      .then(data => {
        setUser({
          name: data.user?.name || data.name || 'Client',
          email: data.user?.email || data.email || '',
          role: data.user?.role || data.role || 'client',
        });
        setIsLoggedIn(true);
      })
      .catch(() => {
        // Token invalid, clear it
        document.cookie = 'portal_token=; path=/; max-age=0';
      })
      .finally(() => setAuthChecked(true));
  }, []);

  const handleLogin = useCallback((token: string, userData: { name: string; email: string; role: string }) => {
    setUser(userData);
    setIsLoggedIn(true);
    setSidebarOpen(false);
  }, []);

  const handleLogout = useCallback(() => {
    document.cookie = 'portal_token=; path=/; max-age=0';
    setIsLoggedIn(false);
    setUser({ name: '', email: '', role: 'client' });
    setActiveTab('dashboard');
    setSidebarOpen(false);
  }, []);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab as PortalTab);
    setSidebarOpen(false);
  }, []);

  // If auth check hasn't completed, show nothing
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-teal-400 animate-spin" />
      </div>
    );
  }

  // Not logged in — show login
  if (!isLoggedIn) {
    return <PortalLogin onLogin={handleLogin} onBack={onBack} />;
  }

  // Admin logged in — show admin panel
  if (user.role === 'admin') {
    return <AdminPanel userName={user.name} onBack={onBack || (() => {})} onLogout={handleLogout} />;
  }

  // Logged in — show portal layout
  const ActiveTabComponent = tabContent[activeTab];

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

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0a1628]/95 lg:bg-transparent border-r border-white/5 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo / Brand */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-sm leading-none">Client Portal</h2>
              <p className="text-slate-500 text-[10px] mt-0.5">by Upam</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleTabChange(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-500/15 to-emerald-500/10 text-teal-400 border border-teal-500/20'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <item.icon className={`w-4.5 h-4.5 flex-shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-500 group-hover:text-teal-400'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="portalActiveIndicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/20 flex items-center justify-center text-teal-400 text-xs font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{user.name || 'Client'}</p>
                <VerifiedSticker size="sm" />
              </div>
              <p className="text-slate-500 text-xs truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-slate-400 text-sm font-medium hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-[#0a1628]/90 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile hamburger */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Back to portfolio */}
              {onBack && (
                <button
                  onClick={onBack}
                  className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 transition-colors hidden sm:flex"
                  title="Back to Portfolio"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}

              {/* Page Title */}
              <div>
                <h1 className="text-white font-semibold text-sm sm:text-base">
                  {navItems.find(n => n.key === activeTab)?.label || 'Dashboard'}
                </h1>
                <p className="text-slate-500 text-xs hidden sm:block">
                  <span className="flex items-center gap-1">Welcome, {user.name || 'Client'}
                  <VerifiedSticker size="sm" /></span>
                </p>
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              {/* Notification Bell */}
              <button className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 transition-colors relative">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-400" />
              </button>

              {/* User avatar (mobile) */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/20 flex items-center justify-center text-teal-400 text-xs font-bold lg:hidden">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <Suspense fallback={<TabLoader />}>
            {activeTab === 'dashboard' && (
              <PortalDashboard userName={user.name || 'Client'} onNavigate={handleTabChange} />
            )}
            {activeTab === 'projects' && <PortalProjects />}
            {activeTab === 'invoices' && <PortalInvoices />}
            {activeTab === 'messages' && <PortalMessages />}
            {activeTab === 'files' && <PortalFiles />}
            {activeTab === 'tickets' && <PortalTickets />}
            {activeTab === 'settings' && <PortalSettings userName={user.name} userEmail={user.email} />}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
