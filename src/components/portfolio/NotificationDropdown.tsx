'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Check,
  CheckCheck,
  FolderKanban,
  Receipt,
  MessageSquare,
  Ticket,
  FileText,
  LayoutDashboard,
  Settings,
  Info,
  Sparkles,
  AlertTriangle,
  XCircle,
  X,
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  category: string;
  link: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationDropdownProps {
  onNavigate?: (tab: string) => void;
}

const TYPE_CONFIG: Record<string, { icon: typeof Info; color: string; bg: string; border: string }> = {
  info: { icon: Info, color: 'text-sky-400', bg: 'bg-sky-500/15', border: 'border-sky-500/25' },
  success: { icon: Sparkles, color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/25' },
  warning: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/25' },
  error: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500/25' },
};

const CATEGORY_CONFIG: Record<string, { icon: typeof LayoutDashboard; label: string }> = {
  general: { icon: LayoutDashboard, label: 'General' },
  project: { icon: FolderKanban, label: 'Project' },
  invoice: { icon: Receipt, label: 'Invoice' },
  ticket: { icon: Ticket, label: 'Ticket' },
  message: { icon: MessageSquare, label: 'Message' },
  file: { icon: FileText, label: 'File' },
};

function formatTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;

  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getAuthHeaders() {
  const token = document.cookie.split('; ').find(row => row.startsWith('portal_token='))?.split('=')[1];
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : {};
}

export default function NotificationDropdown({ onNavigate }: NotificationDropdownProps) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/portal/notifications', { headers: getAuthHeaders() });
      if (res.ok) {
        const json = await res.json();
        setNotifications(json.data || []);
        setUnreadCount(json.meta?.unreadCount || 0);
      }
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Poll every 15s when dropdown is open
  useEffect(() => {
    if (!open) return;
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [open, fetchNotifications]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch(`/api/portal/notifications/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch { /* ignore */ }
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      await fetch('/api/portal/notifications', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ action: 'mark-all-read' }),
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch { /* ignore */ }
    finally { setMarkingAll(false); }
  };

  const handleClickNotification = (notification: Notification) => {
    // Mark as read
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    // Navigate to linked section
    if (notification.link && onNavigate) {
      onNavigate(notification.link);
    }
    setOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors relative ${
          open
            ? 'bg-teal-500/15 text-teal-400'
            : 'bg-white/5 text-slate-400 hover:text-teal-400 hover:bg-teal-500/10'
        }`}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <motion.span
            key={unreadCount}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-teal-500 text-white text-[10px] font-bold flex items-center justify-center leading-none"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 z-50 rounded-xl border border-white/10 bg-[#0d1f35]/95 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-teal-400" />
                <h3 className="text-white text-sm font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-md bg-teal-500/15 text-teal-400 text-[10px] font-semibold">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    disabled={markingAll}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 transition-colors disabled:opacity-50"
                  >
                    <CheckCheck className="w-3 h-3" />
                    {markingAll ? '...' : 'All read'}
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="max-h-80 overflow-y-auto custom-scrollbar-thin">
              {loading && notifications.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-slate-500">
                  <div className="w-5 h-5 border-2 border-teal-500/30 border-t-teal-400 rounded-full animate-spin" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                  <Bell className="w-8 h-8 mb-2 opacity-30" />
                  <p className="text-sm">No notifications yet</p>
                  <p className="text-xs mt-1 opacity-60">We&apos;ll let you know when something arrives</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {notifications.map((notification) => {
                    const typeConf = TYPE_CONFIG[notification.type] || TYPE_CONFIG.info;
                    const catConf = CATEGORY_CONFIG[notification.category] || CATEGORY_CONFIG.general;
                    const TypeIcon = typeConf.icon;
                    const CatIcon = catConf.icon;

                    return (
                      <motion.div
                        key={notification.id}
                        layout
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`group relative flex items-start gap-3 px-4 py-3 transition-colors cursor-pointer ${
                          notification.isRead
                            ? 'hover:bg-white/[0.03]'
                            : 'bg-teal-500/[0.04] hover:bg-teal-500/[0.07]'
                        }`}
                        onClick={() => handleClickNotification(notification)}
                      >
                        {/* Icon */}
                        <div className={`w-8 h-8 rounded-lg ${typeConf.bg} border ${typeConf.border} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <TypeIcon className={`w-3.5 h-3.5 ${typeConf.color}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className={`text-sm font-medium truncate ${notification.isRead ? 'text-slate-400' : 'text-white'}`}>
                              {notification.title}
                            </p>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] text-slate-600">{formatTime(notification.createdAt)}</span>
                            {notification.category !== 'general' && (
                              <span className="flex items-center gap-0.5 text-[10px] text-slate-600">
                                <CatIcon className="w-2.5 h-2.5" />
                                {catConf.label}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Unread indicator + mark read */}
                        <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                          {!notification.isRead && (
                            <div className="w-2 h-2 rounded-full bg-teal-400 mt-1" />
                          )}
                          {!notification.isRead && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                              className="w-5 h-5 rounded-md flex items-center justify-center text-slate-600 hover:text-teal-400 hover:bg-teal-500/10 transition-colors opacity-0 group-hover:opacity-100"
                              title="Mark as read"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-2.5 border-t border-white/5 bg-white/[0.02]">
                <p className="text-[10px] text-slate-600 text-center">
                  Click a notification to view details
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
