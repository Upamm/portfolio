'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Send,
  ArrowLeft,
  MessageSquare,
  Loader2,
  Star,
  StarOff,
  Reply,
  Trash2,
  Pencil,
  X,
  Check,
  CheckCheck,
  SmilePlus,
  Flame,
  ChevronDown,
  Zap,
  Inbox,
} from 'lucide-react';

/* ─────────────────────── Types ─────────────────────── */

interface AdminMessagesProps {
  userName: string;
  getAuthHeaders: () => Record<string, string>;
}

interface Conversation {
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientCompany?: string | null;
  clientAvatar?: string | null;
  clientActive?: boolean;
  totalMessages?: number;
  lastMessage: string;
  lastMessageAt: string;
  lastMessageRole?: string;
  unreadCount: number;
}

interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  messageType?: string;
  attachmentUrl?: string | null;
  attachmentName?: string | null;
  attachmentSize?: number | null;
  replyToId?: string | null;
  replyTo?: ChatMessage | null;
  starred: boolean;
  isRead: boolean;
  editedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  reactions?: Record<string, string[]>;
}

/* ─────────────────────── Constants ─────────────────────── */

const QUICK_EMOJIS = ['👍', '❤️', '😂', '🎉', '🔥', '👏', '😮', '😢'];

const QUICK_REPLIES = [
  'Thanks for reaching out! I\'ll get back to you shortly.',
  'Your project is currently in progress. ETA: 2-3 business days.',
  'I\'ve reviewed your request. Let me update you soon.',
  'Could you please provide more details about this?',
  'Payment received. Thank you!',
];

const msgVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25, ease: 'easeOut' } },
};

/* ─────────────────────── Helpers ─────────────────────── */

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function formatDateSeparator(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear();

  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function isSameDay(a: string, b: string): boolean {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getDate() === db.getDate() &&
    da.getMonth() === db.getMonth() &&
    da.getFullYear() === db.getFullYear()
  );
}

function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-amber-500/40 text-amber-100 rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

/* ─────────────────────── Component ─────────────────────── */

export default function AdminMessages({ userName, getAuthHeaders }: AdminMessagesProps) {
  /* ──── State ──── */
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [sending, setSending] = useState(false);
  const [convLoading, setConvLoading] = useState(false);
  const [msgLoading, setMsgLoading] = useState(false);

  // Search
  const [convSearch, setConvSearch] = useState('');
  const [msgSearch, setMsgSearch] = useState('');
  const [debouncedMsgSearch, setDebouncedMsgSearch] = useState('');

  // Star filter
  const [starFilter, setStarFilter] = useState(false);

  // Reply
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);

  // Edit
  const [editingMsg, setEditingMsg] = useState<ChatMessage | null>(null);
  const [editText, setEditText] = useState('');

  // Emoji picker
  const [emojiPickerMsg, setEmojiPickerMsg] = useState<string | null>(null);

  // Quick replies dropdown
  const [showQuickReplies, setShowQuickReplies] = useState(false);

  // Deleted messages
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  // Mobile: show list or chat
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  /* ──── Data Fetching ──── */

  const fetchConversations = useCallback(async () => {
    setConvLoading(true);
    try {
      const params = new URLSearchParams();
      if (convSearch.trim()) params.set('search', convSearch.trim());
      if (starFilter) params.set('starred', 'true');

      const res = await fetch(`/api/admin/messages?${params}`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setConversations(data.data || []);
      }
    } catch {
      /* fallback */
    } finally {
      setConvLoading(false);
    }
  }, [getAuthHeaders, convSearch, starFilter]);

  const fetchMessages = useCallback(
    async (clientId: string, silent = false) => {
      if (!silent) setMsgLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('clientId', clientId);
        const res = await fetch(`/api/admin/messages?${params}`, { headers: getAuthHeaders() });
        if (res.ok) {
          const data = await res.json();
          setMessages(data.data || []);
        }
        // Mark as read
        await fetch('/api/admin/messages/bulk-read', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ clientId }),
        });
      } catch {
        /* fallback */
      } finally {
        if (!silent) setMsgLoading(false);
      }
    },
    [getAuthHeaders],
  );

  /* ──── Polling ──── */

  useEffect(() => {
    fetchConversations();
    const convPoll = setInterval(fetchConversations, 5000);
    return () => clearInterval(convPoll);
  }, [fetchConversations]);

  useEffect(() => {
    if (!selectedConv) return;
    fetchMessages(selectedConv.clientId);
    const msgPoll = setInterval(() => {
      fetchMessages(selectedConv.clientId, true);
    }, 5000);
    return () => clearInterval(msgPoll);
  }, [selectedConv, fetchMessages]);

  /* ──── Auto-scroll ──── */

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* ──── Debounced message search ──── */

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedMsgSearch(msgSearch);
    }, 300);
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [msgSearch]);

  /* ──── Message filtering ──── */

  const filteredMessages = useMemo(() => {
    if (!debouncedMsgSearch.trim()) return messages;
    const q = debouncedMsgSearch.toLowerCase();
    return messages.filter((m) => m.content.toLowerCase().includes(q));
  }, [messages, debouncedMsgSearch]);

  /* ──── Handlers ──── */

  const handleSelectConv = useCallback(
    (conv: Conversation) => {
      setSelectedConv(conv);
      setMessages([]);
      setReplyTo(null);
      setEditingMsg(null);
      setEmojiPickerMsg(null);
      setMsgSearch('');
      setDeletedIds(new Set());
      setMobileShowChat(true);
    },
    [],
  );

  const handleBackToList = useCallback(() => {
    setMobileShowChat(false);
    setSelectedConv(null);
    setMessages([]);
    setReplyTo(null);
    setEditingMsg(null);
    setEmojiPickerMsg(null);
    setMsgSearch('');
    setDeletedIds(new Set());
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!messageInput.trim() || !selectedConv) return;
    setSending(true);
    const content = messageInput.trim();
    setMessageInput('');
    setReplyTo(null);
    try {
      const body: Record<string, unknown> = { content, clientId: selectedConv.clientId };
      if (replyTo) body.replyToId = replyTo.id;
      const res = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      });
      if (res.ok) {
        // Optimistic add
        const newMsg: ChatMessage = {
          id: 'temp-' + Date.now(),
          content,
          senderId: 'admin',
          senderName: userName,
          senderRole: 'admin',
          starred: false,
          isRead: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          reactions: {},
          replyToId: replyTo?.id || null,
          replyTo: replyTo || null,
        };
        setMessages((prev) => [...prev, newMsg]);
        fetchConversations();
      }
    } catch {
      /* fallback */
    } finally {
      setSending(false);
    }
  }, [messageInput, selectedConv, getAuthHeaders, userName, fetchConversations, replyTo]);

  const handleEditMessage = useCallback(async () => {
    if (!editingMsg || !editText.trim()) return;
    try {
      const res = await fetch(`/api/admin/messages/${editingMsg.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ content: editText.trim() }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === editingMsg.id
              ? { ...m, content: editText.trim(), editedAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
              : m,
          ),
        );
        setEditingMsg(null);
        setEditText('');
      }
    } catch {
      /* fallback */
    }
  }, [editingMsg, editText, getAuthHeaders]);

  const handleDeleteMessage = useCallback(
    async (msgId: string) => {
      try {
        const res = await fetch(`/api/admin/messages/${msgId}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          setDeletedIds((prev) => new Set(prev).add(msgId));
        }
      } catch {
        /* fallback */
      }
    },
    [getAuthHeaders],
  );

  const handleToggleStar = useCallback(
    async (msgId: string) => {
      try {
        const res = await fetch(`/api/admin/messages/${msgId}/star`, {
          method: 'POST',
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          setMessages((prev) =>
            prev.map((m) => (m.id === msgId ? { ...m, starred: !m.starred } : m)),
          );
        }
      } catch {
        /* fallback */
      }
    },
    [getAuthHeaders],
  );

  const handleToggleReaction = useCallback(
    async (msgId: string, emoji: string) => {
      try {
        const res = await fetch(`/api/admin/messages/${msgId}/react`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ emoji }),
        });
        if (res.ok) {
          setMessages((prev) =>
            prev.map((m) => {
              if (m.id !== msgId) return m;
              const reactions = { ...(m.reactions || {}) };
              if (reactions[emoji]) {
                const users = reactions[emoji].filter((u) => u !== userName);
                if (users.length === 0) {
                  delete reactions[emoji];
                } else {
                  reactions[emoji] = users;
                }
              } else {
                reactions[emoji] = [...(reactions[emoji] || []), userName];
              }
              return { ...m, reactions };
            }),
          );
        }
      } catch {
        /* fallback */
      }
    },
    [getAuthHeaders, userName],
  );

  const handleQuickReply = useCallback((text: string) => {
    setMessageInput(text);
    setShowQuickReplies(false);
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage],
  );

  /* ──── Computed ──── */

  const isAdminMsg = (msg: ChatMessage) => msg.senderRole === 'admin';

  /* ═══════════════════════ RENDER ═══════════════════════ */
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-[calc(100vh-140px)] min-h-[500px]"
    >
      <div className="glass-card rounded-xl h-full flex flex-col overflow-hidden">
        <div className="flex flex-col sm:flex-row flex-1 min-h-0">

          {/* ══════ CONVERSATION LIST ══════ */}
          <div
            className={`w-full sm:w-80 lg:w-96 border-b sm:border-b-0 sm:border-r border-white/5 flex flex-col flex-shrink-0 ${
              mobileShowChat ? 'hidden sm:flex' : 'flex'
            }`}
          >
            {/* List Header */}
            <div className="p-4 border-b border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Inbox className="w-4 h-4 text-amber-400" /> Conversations
                </h3>
                <button
                  onClick={() => setStarFilter(!starFilter)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    starFilter
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Flame className="w-3 h-3" /> Starred
                </button>
              </div>
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text"
                  value={convSearch}
                  onChange={(e) => setConvSearch(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition-all"
                />
              </div>
            </div>

            {/* List Body */}
            {convLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-6">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <MessageSquare className="w-9 h-9 opacity-30" />
                </div>
                <p className="text-sm font-medium">No conversations yet</p>
                <p className="text-xs text-slate-600 mt-1">Messages will appear here when clients reach out</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {conversations.map((conv) => (
                  <button
                    key={conv.clientId}
                    onClick={() => handleSelectConv(conv)}
                    className={`w-full text-left p-3.5 border-b border-white/[0.03] hover:bg-white/[0.03] transition-all duration-200 ${
                      selectedConv?.clientId === conv.clientId
                        ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/5 border-l-2 border-l-amber-500'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                            conv.clientActive !== false
                              ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/20'
                              : 'bg-white/5 text-slate-500 border border-white/10'
                          }`}
                        >
                          {conv.clientName.charAt(0).toUpperCase()}
                        </div>
                        {conv.unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-[#0a1628]">
                            {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-white text-sm font-medium truncate">
                            {conv.clientName}
                          </p>
                          <span className="text-[10px] text-slate-500 flex-shrink-0">
                            {formatTime(conv.lastMessageAt)}
                          </span>
                        </div>
                        <p className="text-slate-500 text-xs truncate mt-0.5 pr-2">
                          {conv.lastMessage}
                        </p>
                        {conv.clientCompany && (
                          <p className="text-slate-600 text-[10px] mt-0.5 truncate">
                            {conv.clientCompany}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ══════ CHAT PANEL ══════ */}
          <div
            className={`flex-1 flex flex-col min-h-0 ${
              !mobileShowChat ? 'hidden sm:flex' : 'flex'
            }`}
          >
            {!selectedConv ? (
              /* Empty state */
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-6">
                <div className="w-24 h-24 rounded-full bg-white/[0.03] flex items-center justify-center mb-4">
                  <MessageSquare className="w-11 h-11 opacity-15" />
                </div>
                <p className="text-lg font-medium text-slate-400">Select a conversation</p>
                <p className="text-sm mt-1 text-slate-600">Choose a client from the list to start chatting</p>
              </div>
            ) : (
              <>
                {/* ── Chat Header ── */}
                <div className="p-3 sm:p-4 border-b border-white/5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Mobile back */}
                    <button
                      onClick={handleBackToList}
                      className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors sm:hidden flex-shrink-0"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-bold flex-shrink-0">
                      {selectedConv.clientName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {selectedConv.clientName}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-slate-500 text-xs truncate">{selectedConv.clientEmail}</p>
                        {selectedConv.clientCompany && (
                          <>
                            <span className="text-slate-600 text-xs">·</span>
                            <p className="text-slate-600 text-xs truncate">{selectedConv.clientCompany}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Message search */}
                  <div className="relative flex-shrink-0 hidden sm:block">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
                    <input
                      type="text"
                      value={msgSearch}
                      onChange={(e) => setMsgSearch(e.target.value)}
                      placeholder="Search messages..."
                      className="w-44 pl-8 pr-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition-all"
                    />
                  </div>
                </div>

                {/* ── Messages Area ── */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1 custom-scrollbar">
                  {msgLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                      <div className="w-14 h-14 rounded-full bg-white/[0.03] flex items-center justify-center mb-3">
                        <Send className="w-6 h-6 opacity-30" />
                      </div>
                      <p className="text-sm font-medium text-slate-400">No messages yet</p>
                      <p className="text-xs text-slate-600 mt-1">Say hello to your client!</p>
                    </div>
                  ) : (
                    filteredMessages.map((msg, idx) => {
                      const isDeleted = deletedIds.has(msg.id);
                      const isEdit = editingMsg?.id === msg.id;
                      const isReply = !!msg.replyToId;
                      const isSenderAdmin = isAdminMsg(msg);

                      // Date separator
                      const showDateSeparator =
                        idx === 0 || !isSameDay(msg.createdAt, filteredMessages[idx - 1].createdAt);

                      // Grouping: show name only on first in consecutive same-sender group
                      const prevMsg = idx > 0 ? filteredMessages[idx - 1] : null;
                      const showName =
                        !prevMsg || prevMsg.senderId !== msg.senderId || !isSameDay(prevMsg.createdAt, msg.createdAt);

                      return (
                        <div key={msg.id}>
                          {/* Date Separator */}
                          {showDateSeparator && (
                            <div className="flex items-center justify-center py-3">
                              <span className="text-[10px] font-medium text-slate-500 bg-white/5 px-3 py-1 rounded-full">
                                {formatDateSeparator(msg.createdAt)}
                              </span>
                            </div>
                          )}

                          <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={msgVariants}
                            className={`flex ${isSenderAdmin ? 'justify-end' : 'justify-start'} ${!showName ? 'mt-0.5' : 'mt-3'}`}
                          >
                            {/* Reply reference line */}
                            {isReply && !isDeleted && (
                              <div className={`absolute ${isSenderAdmin ? 'right-0' : 'left-0'}`} />
                            )}

                            <div className={`max-w-[85%] sm:max-w-[70%] ${isSenderAdmin ? 'order-1' : ''}`}>
                              {/* Reply preview */}
                              {isReply && !isDeleted && msg.replyTo && (
                                <div
                                  className={`mb-1 px-3 py-1.5 rounded-lg border text-xs cursor-pointer ${
                                    isSenderAdmin
                                      ? 'bg-amber-500/10 border-amber-500/10 text-amber-300/70'
                                      : 'bg-white/5 border-white/5 text-slate-400'
                                  }`}
                                >
                                  <span className="font-semibold block text-[10px] uppercase tracking-wider">
                                    {msg.replyTo.senderName}
                                  </span>
                                  <span className="line-clamp-1">{msg.replyTo.content}</span>
                                </div>
                              )}

                              {/* Deleted placeholder */}
                              {isDeleted ? (
                                <div className="px-4 py-2.5 rounded-2xl bg-white/5 border border-white/5">
                                  <p className="text-slate-600 text-sm italic">This message was deleted</p>
                                </div>
                              ) : isEdit ? (
                                /* Edit mode */
                                <div className="space-y-2">
                                  <textarea
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white/5 border border-amber-500/30 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 resize-none min-h-[60px]"
                                    autoFocus
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleEditMessage();
                                      }
                                      if (e.key === 'Escape') {
                                        setEditingMsg(null);
                                        setEditText('');
                                      }
                                    }}
                                  />
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={handleEditMessage}
                                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-medium hover:bg-amber-600 transition-colors"
                                    >
                                      <Check className="w-3 h-3" /> Save
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditingMsg(null);
                                        setEditText('');
                                      }}
                                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 text-xs font-medium hover:bg-white/10 hover:text-white transition-colors"
                                    >
                                      <X className="w-3 h-3" /> Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                /* Normal message */
                                <div className="group relative">
                                  {/* Sender name */}
                                  {showName && (
                                    <p
                                      className={`text-[10px] font-semibold mb-1 px-1 ${
                                        isSenderAdmin ? 'text-amber-400/70 text-right' : 'text-slate-500'
                                      }`}
                                    >
                                      {msg.senderName}
                                    </p>
                                  )}

                                  {/* Message bubble */}
                                  <div
                                    className={`rounded-2xl px-4 py-2.5 relative ${
                                      isSenderAdmin
                                        ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/20 rounded-tr-md'
                                        : 'bg-white/10 border border-white/5 rounded-tl-md'
                                    }`}
                                  >
                                    <p className="text-sm text-white leading-relaxed break-words">
                                      {debouncedMsgSearch
                                        ? highlightText(msg.content, debouncedMsgSearch)
                                        : msg.content}
                                    </p>

                                    {/* Hover actions */}
                                    <div
                                      className={`absolute -top-7 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                                        isSenderAdmin ? 'right-2' : 'left-2'
                                      }`}
                                    >
                                      <button
                                        onClick={() => {
                                          setReplyTo(msg);
                                          inputRef.current?.focus();
                                        }}
                                        className="w-6 h-6 rounded-md bg-[#0a1628] border border-white/10 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:border-amber-500/30 transition-all"
                                        title="Reply"
                                      >
                                        <Reply className="w-3 h-3" />
                                      </button>
                                      <button
                                        onClick={() => handleToggleStar(msg.id)}
                                        className={`w-6 h-6 rounded-md bg-[#0a1628] border border-white/10 flex items-center justify-center transition-all ${
                                          msg.starred
                                            ? 'text-yellow-400 border-yellow-500/30'
                                            : 'text-slate-400 hover:text-yellow-400 hover:border-yellow-500/30'
                                        }`}
                                        title="Star"
                                      >
                                        {msg.starred ? <Star className="w-3 h-3 fill-yellow-400" /> : <StarOff className="w-3 h-3" />}
                                      </button>
                                      <div className="relative">
                                        <button
                                          onClick={() =>
                                            setEmojiPickerMsg(emojiPickerMsg === msg.id ? null : msg.id)
                                          }
                                          className="w-6 h-6 rounded-md bg-[#0a1628] border border-white/10 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:border-amber-500/30 transition-all"
                                          title="React"
                                        >
                                          <SmilePlus className="w-3 h-3" />
                                        </button>
                                        <AnimatePresence>
                                          {emojiPickerMsg === msg.id && (
                                            <motion.div
                                              initial={{ opacity: 0, y: 4, scale: 0.95 }}
                                              animate={{ opacity: 1, y: 0, scale: 1 }}
                                              exit={{ opacity: 0, y: 4, scale: 0.95 }}
                                              className={`absolute top-full mt-1 z-20 flex gap-0.5 p-1.5 bg-[#0d1a2d] border border-white/10 rounded-lg shadow-xl ${
                                                isSenderAdmin ? 'right-0' : 'left-0'
                                              }`}
                                            >
                                              {QUICK_EMOJIS.map((emoji) => (
                                                <button
                                                  key={emoji}
                                                  onClick={() => {
                                                    handleToggleReaction(msg.id, emoji);
                                                    setEmojiPickerMsg(null);
                                                  }}
                                                  className="w-7 h-7 rounded-md flex items-center justify-center text-sm hover:bg-white/10 transition-colors"
                                                >
                                                  {emoji}
                                                </button>
                                              ))}
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                      <button
                                        onClick={() => {
                                          setEditingMsg(msg);
                                          setEditText(msg.content);
                                        }}
                                        className="w-6 h-6 rounded-md bg-[#0a1628] border border-white/10 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:border-amber-500/30 transition-all"
                                        title="Edit"
                                      >
                                        <Pencil className="w-3 h-3" />
                                      </button>
                                      <button
                                        onClick={() => {
                                          if (confirm('Delete this message?')) {
                                            handleDeleteMessage(msg.id);
                                          }
                                        }}
                                        className="w-6 h-6 rounded-md bg-[#0a1628] border border-white/10 flex items-center justify-center text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-all"
                                        title="Delete"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Reactions */}
                                  {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1.5 px-1">
                                      {Object.entries(msg.reactions).map(([emoji, users]) => (
                                        <button
                                          key={emoji}
                                          onClick={() => handleToggleReaction(msg.id, emoji)}
                                          className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs hover:bg-white/10 transition-colors"
                                        >
                                          <span>{emoji}</span>
                                          <span className="text-[10px] text-slate-400">{users.length}</span>
                                        </button>
                                      ))}
                                    </div>
                                  )}

                                  {/* Timestamp & metadata */}
                                  <div
                                    className={`flex items-center gap-1.5 mt-1 px-1 ${
                                      isSenderAdmin ? 'justify-end' : 'justify-start'
                                    }`}
                                  >
                                    <span className="text-[10px] text-slate-600">
                                      {formatTime(msg.createdAt)}
                                    </span>
                                    {msg.editedAt && (
                                      <span className="text-[10px] text-slate-600 italic">(edited)</span>
                                    )}
                                    {/* Star indicator */}
                                    {msg.starred && (
                                      <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                                    )}
                                    {/* Read receipt for client messages */}
                                    {!isSenderAdmin && (
                                      <span className="ml-1">
                                        {msg.isRead ? (
                                          <CheckCheck className="w-3 h-3 text-amber-400/60" />
                                        ) : (
                                          <Check className="w-3 h-3 text-slate-600" />
                                        )}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        </div>
                      );
                    })
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* ── Reply Preview Bar ── */}
                <AnimatePresence>
                  {replyTo && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/5 overflow-hidden"
                    >
                      <div className="px-4 py-2.5 flex items-center gap-3 bg-amber-500/5">
                        <div className="w-1 h-8 rounded-full bg-amber-500/50 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
                            Replying to {replyTo.senderName}
                          </p>
                          <p className="text-xs text-slate-400 truncate">{replyTo.content}</p>
                        </div>
                        <button
                          onClick={() => setReplyTo(null)}
                          className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── Message Input ── */}
                <div className="p-3 sm:p-4 border-t border-white/5">
                  <div className="flex flex-col gap-2">
                    {/* Input row */}
                    <div className="flex items-end gap-2">
                      {/* Quick Replies */}
                      <div className="relative">
                        <button
                          onClick={() => setShowQuickReplies(!showQuickReplies)}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                            showQuickReplies
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              : 'bg-white/5 text-slate-400 border border-white/10 hover:text-amber-400 hover:border-amber-500/30'
                          }`}
                          title="Quick Replies"
                        >
                          <Zap className="w-4 h-4" />
                        </button>
                        <AnimatePresence>
                          {showQuickReplies && (
                            <motion.div
                              initial={{ opacity: 0, y: 4, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 4, scale: 0.95 }}
                              className="absolute bottom-full mb-2 left-0 w-72 z-30 bg-[#0d1a2d] border border-white/10 rounded-xl shadow-xl overflow-hidden"
                            >
                              <div className="p-2 border-b border-white/5">
                                <p className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider px-2">
                                  Quick Reply Templates
                                </p>
                              </div>
                              <div className="p-1.5 max-h-60 overflow-y-auto custom-scrollbar">
                                {QUICK_REPLIES.map((qr, i) => (
                                  <button
                                    key={i}
                                    onClick={() => handleQuickReply(qr)}
                                    className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                                  >
                                    {qr}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Textarea */}
                      <textarea
                        ref={inputRef}
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        rows={1}
                        className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition-all resize-none min-h-[40px] max-h-[120px]"
                        style={{ height: 'auto' }}
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = 'auto';
                          target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                        }}
                      />

                      {/* Send */}
                      <button
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim() || sending}
                        className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white hover:from-amber-600 hover:to-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-500/15 flex-shrink-0"
                      >
                        {sending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
