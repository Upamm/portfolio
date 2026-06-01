'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Building2, ArrowLeft, Loader2, Shield, Sparkles } from 'lucide-react';

export interface PortalLoginProps {
  onLogin: (token: string, user: { name: string; email: string; role: string }) => void;
  onBack?: () => void;
}

type AuthMode = 'login' | 'register';

interface FormErrors {
  name?: string;
  email?: string;
  company?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export default function PortalLogin({ onLogin, onBack }: PortalLoginProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: '',
  });

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (mode === 'register' && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (mode === 'register') {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, mode]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');

    if (!validate()) return;

    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = mode === 'login'
        ? { email: formData.email, password: formData.password }
        : {
            name: formData.name,
            email: formData.email,
            company: formData.company,
            password: formData.password,
          };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ general: data.error || data.message || 'Something went wrong. Please try again.' });
        return;
      }

      // Store token in cookie
      document.cookie = `portal_token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;

      if (mode === 'register') {
        setSuccess('Account created successfully! You can now log in.');
        setMode('login');
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      } else {
        onLogin(data.token, { name: data.user?.name || 'Client', email: data.user?.email || formData.email, role: data.user?.role || 'client' });
      }
    } catch {
      setErrors({ general: 'Network error. Please check your connection and try again.' });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(prev => prev === 'login' ? 'register' : 'login');
    setErrors({});
    setSuccess('');
  };

  const fadeVariants = {
    initial: { opacity: 0, x: mode === 'login' ? -20 : 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: mode === 'login' ? 20 : -20 },
  };

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-dots opacity-30" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Back to Home */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-teal-400 transition-colors mb-6 text-sm group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
        )}

        {/* Main Card */}
        <div className="glass-card rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="p-6 pb-0 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/20 flex items-center justify-center">
              <Shield className="w-8 h-8 text-teal-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Client Portal</h2>
            <p className="text-slate-400 text-sm">
              {mode === 'login' ? 'Sign in to access your projects' : 'Create an account to get started'}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="px-6 pt-6">
            <div className="flex bg-white/5 rounded-xl p-1 border border-white/5">
              <button
                onClick={() => mode !== 'login' && switchMode()}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  mode === 'login'
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/20'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => mode !== 'register' && switchMode()}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  mode === 'register'
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/20'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                Register
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.form
                key={mode}
                variants={fadeVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.25 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {/* Success Message */}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 flex-shrink-0" />
                    {success}
                  </motion.div>
                )}

                {/* Error Message */}
                {errors.general && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                  >
                    {errors.general}
                  </motion.div>
                )}

                {/* Name (Register only) */}
                {mode === 'register' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block text-slate-300 text-sm font-medium mb-1.5">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={e => handleInputChange('name', e.target.value)}
                        placeholder="John Doe"
                        className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-500 text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 ${
                          errors.name ? 'border-red-500/50' : 'border-white/10'
                        }`}
                      />
                    </div>
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </motion.div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1.5">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => handleInputChange('email', e.target.value)}
                      placeholder="you@example.com"
                      className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-500 text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 ${
                        errors.email ? 'border-red-500/50' : 'border-white/10'
                      }`}
                    />
                  </div>
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Company (Register only, optional) */}
                {mode === 'register' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block text-slate-300 text-sm font-medium mb-1.5">
                      Company <span className="text-slate-500">(optional)</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        value={formData.company}
                        onChange={e => handleInputChange('company', e.target.value)}
                        placeholder="Your Company"
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Password */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1.5">Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={e => handleInputChange('password', e.target.value)}
                      placeholder="Min. 6 characters"
                      className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-500 text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 ${
                        errors.password ? 'border-red-500/50' : 'border-white/10'
                      }`}
                    />
                  </div>
                  {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                </div>

                {/* Confirm Password (Register only) */}
                {mode === 'register' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block text-slate-300 text-sm font-medium mb-1.5">Confirm Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={e => handleInputChange('confirmPassword', e.target.value)}
                        placeholder="Re-enter your password"
                        className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-500 text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 ${
                          errors.confirmPassword ? 'border-red-500/50' : 'border-white/10'
                        }`}
                      />
                    </div>
                    {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                  </motion.div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 btn-shine"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                    </>
                  ) : (
                    mode === 'login' ? 'Sign In' : 'Create Account'
                  )}
                </button>
              </motion.form>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 text-center">
            <p className="text-slate-500 text-sm">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={switchMode}
                className="text-teal-400 hover:text-teal-300 font-medium transition-colors"
              >
                {mode === 'login' ? 'Register' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>

        {/* Bottom decoration */}
        <p className="text-center text-slate-600 text-xs mt-4">
          Secured with end-to-end encryption
        </p>
      </motion.div>
    </div>
  );
}
