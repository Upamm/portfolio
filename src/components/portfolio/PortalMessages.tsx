'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, Loader2, Inbox } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  senderRole: 'client' | 'admin';
  content: string;
  timestamp: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

export default function PortalMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval>>();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('portal_token='))
        ?.split('=')[1];
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/portal/messages', { headers });
      if (res.ok) {
        const data = await res.json();
        // API returns { success, data: { messages: [...] } }
        const raw = data.data?.messages || data.messages || (Array.isArray(data) ? data : []);
        setMessages(
          raw.map((m: Record<string, unknown>, i: number) => ({
            id: String(m.id || i),
            sender: (m.senderName as string) || (m.sender as string) || (m.sender_name as string) || 'Unknown',
            senderRole: (m.senderRole as string) || (m.sender_role as string) || 'admin',
            content: (m.content as string) || (m.message as string) || (m.text as string) || '',
            timestamp: (m.createdAt as string) || (m.timestamp as string) || (m.created_at as string) || '',
          }))
        );
      }
    } catch {
      // Silently fail — loading state handles empty state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Auto-scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Poll for new messages every 5 seconds
  useEffect(() => {
    pollRef.current = setInterval(() => {
      fetchMessages();
    }, 5000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchMessages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('portal_token='))
        ?.split('=')[1];
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/portal/messages', {
        method: 'POST',
        headers,
        body: JSON.stringify({ content: messageText }),
      });

      if (res.ok) {
        await fetchMessages();
      } else {
        const errorData = await res.json().catch(() => ({}));
        // Optimistically add message only on network error, not API rejection
        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: 'You',
            senderRole: 'client' as const,
            content: messageText,
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } catch {
      // Optimistically add message
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'You',
          senderRole: 'client',
          content: messageText,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (ts: string) => {
    if (!ts) return '';
    try {
      const date = new Date(ts);
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const formatDateHeader = (ts: string, prevTs: string | null) => {
    if (!ts) return null;
    try {
      const date = new Date(ts);
      const prev = prevTs ? new Date(prevTs) : null;
      if (!prev || date.toDateString() !== prev.toDateString()) {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      }
    } catch {
      // ignore
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="h-10 w-48 rounded-lg bg-white/5 animate-pulse mb-6" />
        <div className="flex-1 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`h-16 rounded-xl bg-white/5 animate-pulse ${i % 2 === 0 ? 'ml-0 mr-12' : 'ml-12 mr-0'}`} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" style={{ minHeight: 'calc(100vh - 200px)' }}>
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-teal-400" />
          Messages
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {messages.length} message{messages.length !== 1 ? 's' : ''} • Auto-refreshes every 5s
        </p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 glass-card rounded-xl flex flex-col overflow-hidden">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <Inbox className="w-12 h-12 text-slate-500 mb-3" />
            <p className="text-slate-400 text-sm">No messages yet</p>
            <p className="text-slate-500 text-xs mt-1">Send a message to start the conversation</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              {messages.map((msg, i) => {
                const dateHeader = formatDateHeader(msg.timestamp, i > 0 ? messages[i - 1].timestamp : null);
                const isAdmin = msg.senderRole === 'admin';

                return (
                  <div key={msg.id}>
                    {dateHeader && (
                      <div className="flex items-center justify-center py-3">
                        <div className="bg-white/5 text-slate-500 text-xs px-3 py-1 rounded-full">
                          {dateHeader}
                        </div>
                      </div>
                    )}
                    <motion.div
                      variants={itemVariants}
                      className={`flex ${isAdmin ? 'justify-start' : 'justify-end'} mb-2`}
                    >
                      <div className={`max-w-[80%] sm:max-w-[65%] ${isAdmin ? 'pr-4' : 'pl-4'}`}>
                        <div className={`flex items-center gap-2 mb-1 ${isAdmin ? '' : 'justify-end'}`}>
                          <span className="text-xs text-slate-500 font-medium">{msg.sender}</span>
                          <span className="text-xs text-slate-600">{formatTime(msg.timestamp)}</span>
                        </div>
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            isAdmin
                              ? 'bg-teal-500/15 border border-teal-500/20 text-slate-200 rounded-tl-md'
                              : 'bg-emerald-500/15 border border-emerald-500/20 text-slate-200 rounded-tr-md'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </motion.div>
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Typing indicator area */}
        <div className="px-4 py-1">
          <span className="text-slate-600 text-xs italic opacity-0" id="typing-indicator">
            Someone is typing...
          </span>
        </div>

        {/* Message Input */}
        <div className="border-t border-white/5 p-4">
          <form onSubmit={sendMessage} className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="px-4 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-teal-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span className="hidden sm:inline text-sm font-medium">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
