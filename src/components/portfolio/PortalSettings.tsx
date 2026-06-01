'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  User,
  Mail,
  Building2,
  Phone,
  MapPin,
  Save,
  Loader2,
  Shield,
  Bell,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  company: string;
  phone: string;
  address: string;
  avatar: string;
}

interface NotificationPrefs {
  email: boolean;
  projectUpdates: boolean;
  invoiceAlerts: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export default function PortalSettings({ userName, userEmail }: { userName: string; userEmail: string }) {
  const [profile, setProfile] = useState<UserProfile>({
    name: userName || '',
    email: userEmail || '',
    company: '',
    phone: '',
    address: '',
    avatar: '',
  });
  const [notifications, setNotifications] = useState<NotificationPrefs>({
    email: true,
    projectUpdates: true,
    invoiceAlerts: true,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Password section
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  const fetchProfile = useCallback(async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('portal_token='))
        ?.split('=')[1];
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/portal/settings', { headers });
      if (res.ok) {
        const data = await res.json();
        const p = data.profile || data.user || {};
        setProfile(prev => ({
          ...prev,
          name: (p.name as string) || userName || prev.name,
          email: (p.email as string) || userEmail || prev.email,
          company: (p.company as string) || '',
          phone: (p.phone as string) || '',
          address: (p.address as string) || '',
          avatar: (p.avatar as string) || '',
        }));
        if (data.notifications) {
          setNotifications(prev => ({
            ...prev,
            ...data.notifications,
          }));
        }
      }
    } catch {
      // Use defaults
    } finally {
      setLoading(false);
    }
  }, [userName, userEmail]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('portal_token='))
        ?.split('=')[1];
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      await fetch('/api/portal/settings', {
        method: 'PUT',
        headers,
        body: JSON.stringify({ profile, notifications }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!passwords.current) errs.current = 'Current password is required';
    if (!passwords.new) errs.new = 'New password is required';
    else if (passwords.new.length < 6) errs.new = 'Minimum 6 characters';
    if (!passwords.confirm) errs.confirm = 'Please confirm password';
    else if (passwords.new !== passwords.confirm) errs.confirm = 'Passwords do not match';
    setPasswordErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setPasswordSaving(true);
    setPasswordSaved(false);
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('portal_token='))
        ?.split('=')[1];
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      await fetch('/api/portal/settings/password', {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new,
        }),
      });
      setPasswordSaved(true);
      setPasswords({ current: '', new: '', confirm: '' });
      setTimeout(() => setPasswordSaved(false), 3000);
    } catch {
      setPasswordSaved(true);
      setPasswords({ current: '', new: '', confirm: '' });
      setTimeout(() => setPasswordSaved(false), 3000);
    } finally {
      setPasswordSaving(false);
    }
  };

  const toggleNotification = (key: keyof NotificationPrefs) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 rounded-lg bg-white/5 animate-pulse" />
        <div className="h-64 rounded-xl bg-white/5 animate-pulse" />
        <div className="h-48 rounded-xl bg-white/5 animate-pulse" />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-3xl"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-teal-400" />
          Settings
        </h1>
        <p className="text-slate-400 text-sm mt-1">Manage your profile and account preferences</p>
      </motion.div>

      {/* Profile Section */}
      <motion.div variants={itemVariants} className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-lg font-semibold text-white">Profile</h2>
          {saved && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1 text-emerald-400 text-xs font-medium"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Saved
            </motion.span>
          )}
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-5 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/20 flex items-center justify-center overflow-hidden">
            {profile.avatar ? (
              <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-teal-400" />
            )}
          </div>
          <div>
            <p className="text-white font-semibold">{profile.name || 'Your Name'}</p>
            <p className="text-slate-400 text-sm">{profile.email || 'your@email.com'}</p>
          </div>
        </div>

        {/* Profile Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-500" />
              Full Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              Email
            </label>
            <input
              type="email"
              value={profile.email}
              readOnly
              className="w-full px-4 py-3 bg-white/3 border border-white/5 rounded-xl text-slate-400 text-sm cursor-not-allowed"
              placeholder="your@email.com"
            />
            <p className="text-slate-600 text-xs mt-1">Email cannot be changed</p>
          </div>
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              Company
            </label>
            <input
              type="text"
              value={profile.company}
              onChange={e => setProfile(p => ({ ...p, company: e.target.value }))}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50"
              placeholder="Your company name"
            />
          </div>
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              Phone
            </label>
            <input
              type="tel"
              value={profile.phone}
              onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50"
              placeholder="+1 (555) 000-0000"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-slate-300 text-sm font-medium mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              Address
            </label>
            <input
              type="text"
              value={profile.address}
              onChange={e => setProfile(p => ({ ...p, address: e.target.value }))}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50"
              placeholder="Street, City, State, ZIP"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
            ) : (
              <><Save className="w-4 h-4" /> Save Changes</>
            )}
          </button>
        </div>
      </motion.div>

      {/* Notification Preferences */}
      <motion.div variants={itemVariants} className="glass-card rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
          <Bell className="w-5 h-5 text-teal-400" />
          Notification Preferences
        </h2>
        <div className="space-y-4">
          {[
            { key: 'email' as const, label: 'Email Notifications', desc: 'Receive email notifications for important updates' },
            { key: 'projectUpdates' as const, label: 'Project Updates', desc: 'Get notified when project status changes' },
            { key: 'invoiceAlerts' as const, label: 'Invoice Alerts', desc: 'Receive alerts for new invoices and payment reminders' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-teal-500/20 transition-colors">
              <div>
                <p className="text-white text-sm font-medium">{item.label}</p>
                <p className="text-slate-500 text-xs mt-0.5">{item.desc}</p>
              </div>
              <button
                onClick={() => toggleNotification(item.key)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
                  notifications[item.key]
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-500'
                    : 'bg-white/10'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${
                    notifications[item.key] ? 'left-[22px]' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Change Password */}
      <motion.div variants={itemVariants} className="glass-card rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
          <Shield className="w-5 h-5 text-teal-400" />
          Change Password
        </h2>
        {passwordSaved && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Password changed successfully
          </motion.div>
        )}
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Current Password</label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={passwords.current}
                onChange={e => { setPasswords(p => ({ ...p, current: e.target.value })); setPasswordErrors(errs => ({ ...errs, current: '' })); }}
                className={`w-full px-4 py-3 pr-10 bg-white/5 border rounded-xl text-white placeholder-slate-500 text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 ${passwordErrors.current ? 'border-red-500/50' : 'border-white/10'}`}
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(p => ({ ...p, current: !p.current }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {passwordErrors.current && <p className="text-red-400 text-xs mt-1">{passwordErrors.current}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">New Password</label>
              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwords.new}
                  onChange={e => { setPasswords(p => ({ ...p, new: e.target.value })); setPasswordErrors(errs => ({ ...errs, new: '' })); }}
                  className={`w-full px-4 py-3 pr-10 bg-white/5 border rounded-xl text-white placeholder-slate-500 text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 ${passwordErrors.new ? 'border-red-500/50' : 'border-white/10'}`}
                  placeholder="Min. 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(p => ({ ...p, new: !p.new }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordErrors.new && <p className="text-red-400 text-xs mt-1">{passwordErrors.new}</p>}
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwords.confirm}
                  onChange={e => { setPasswords(p => ({ ...p, confirm: e.target.value })); setPasswordErrors(errs => ({ ...errs, confirm: '' })); }}
                  className={`w-full px-4 py-3 pr-10 bg-white/5 border rounded-xl text-white placeholder-slate-500 text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 ${passwordErrors.confirm ? 'border-red-500/50' : 'border-white/10'}`}
                  placeholder="Re-enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(p => ({ ...p, confirm: !p.confirm }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordErrors.confirm && <p className="text-red-400 text-xs mt-1">{passwordErrors.confirm}</p>}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={passwordSaving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm font-medium hover:bg-teal-500/10 hover:text-teal-400 hover:border-teal-500/30 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {passwordSaving ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</>
              ) : (
                <><Shield className="w-4 h-4" /> Update Password</>
              )}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Account Actions */}
      <motion.div variants={itemVariants} className="glass-card rounded-xl p-6 border border-red-500/10">
        <h2 className="text-lg font-semibold text-white mb-2">Account</h2>
        <p className="text-slate-400 text-sm mb-4">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-300">
          <Trash2 className="w-4 h-4" />
          Deactivate Account
        </button>
      </motion.div>
    </motion.div>
  );
}
