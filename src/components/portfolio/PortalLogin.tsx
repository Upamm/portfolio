'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Building2, ArrowLeft, Loader2, Shield, Sparkles, KeyRound, RotateCcw } from 'lucide-react';

export interface PortalLoginProps {
  onLogin: (token: string, user: { name: string; email: string; role: string }) => void;
  onBack?: () => void;
}

type AuthMode = 'login' | 'register';
type RegStep = 'form' | 'otp';

interface FormErrors {
  name?: string;
  email?: string;
  company?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

// OTP timer: 120 seconds = 2 min cooldown before resend
const RESEND_COOLDOWN = 120;

export default function PortalLogin({ onLogin, onBack }: PortalLoginProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [regStep, setRegStep] = useState<RegStep>('form');
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

  // OTP state
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');
  const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);
  const [otpAttemptsLeft, setOtpAttemptsLeft] = useState(5);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend timer countdown
  useEffect(() => {
    if (regStep !== 'otp' || resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [regStep, resendTimer]);

  // Auto-focus first OTP input when OTP step appears
  useEffect(() => {
    if (regStep === 'otp') {
      setTimeout(() => inputRefs.current[0]?.focus(), 200);
    }
  }, [regStep]);

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

  // ── Login Submit ──
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ general: data.error || data.message || 'Something went wrong. Please try again.' });
        return;
      }

      // Store token in cookie
      document.cookie = `portal_token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;

      onLogin(data.token, { name: data.user?.name || 'Client', email: data.user?.email || formData.email, role: data.user?.role || 'client' });
    } catch {
      setErrors({ general: 'Network error. Please check your connection and try again.' });
    } finally {
      setLoading(false);
    }
  };

  // ── Register Step 1: Send OTP ──
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ general: data.error || 'Something went wrong. Please try again.' });
        return;
      }

      // Move to OTP verification step
      setRegStep('otp');
      setResendTimer(RESEND_COOLDOWN);
      setOtpDigits(['', '', '', '']);
      setOtpError('');
      setOtpSuccess(data.message || 'Verification code sent to your email');
    } catch {
      setErrors({ general: 'Network error. Please check your connection and try again.' });
    } finally {
      setLoading(false);
    }
  };

  // ── Register Step 2: Verify OTP ──
  const handleOtpVerify = async () => {
    const code = otpDigits.join('');
    if (code.length !== 4) {
      setOtpError('Please enter all 4 digits');
      return;
    }

    setOtpLoading(true);
    setOtpError('');

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp: code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setOtpError(data.error || 'Invalid verification code');
        setOtpDigits(['', '', '', '']);
        setTimeout(() => inputRefs.current[0]?.focus(), 100);

        // Calculate remaining attempts from error message
        const match = data.error?.match(/(\d+)\s*attempt/);
        if (match) setOtpAttemptsLeft(parseInt(match[1]));
        return;
      }

      // Account created — auto login
      document.cookie = `portal_token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      onLogin(data.token, { name: data.user?.name || 'Client', email: data.user?.email || formData.email, role: data.user?.role || 'client' });
    } catch {
      setOtpError('Network error. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  // ── Resend OTP ──
  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    setOtpLoading(true);
    setOtpError('');
    setOtpSuccess('');

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          password: formData.password,
          resend: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setOtpError(data.error || 'Failed to resend code');
        return;
      }

      setResendTimer(RESEND_COOLDOWN);
      setOtpDigits(['', '', '', '']);
      setOtpAttemptsLeft(5);
      setOtpSuccess(data.message || 'New verification code sent');
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch {
      setOtpError('Network error. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  // ── OTP Input Handler ──
  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '');
    const newDigits = [...otpDigits];
    newDigits[index] = digit.charAt(0) || '';
    setOtpDigits(newDigits);
    setOtpError('');

    // Auto-advance to next input
    if (digit && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 4 digits filled
    if (newDigits.every(d => d !== '') && newDigits.join('').length === 4) {
      // Small delay for visual feedback
      setTimeout(handleOtpVerify, 300);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter') {
      handleOtpVerify();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (pasted.length === 4) {
      const newDigits = pasted.split('');
      setOtpDigits(newDigits);
      setOtpError('');
      inputRefs.current[3]?.focus();
      setTimeout(handleOtpVerify, 300);
    }
  };

  const switchMode = () => {
    setMode(prev => prev === 'login' ? 'register' : 'login');
    setRegStep('form');
    setErrors({});
    setSuccess('');
    setOtpError('');
    setOtpSuccess('');
  };

  const backToRegisterForm = () => {
    setRegStep('form');
    setOtpDigits(['', '', '', '']);
    setOtpError('');
    setOtpSuccess('');
  };

  const fadeVariants = {
    initial: { opacity: 0, x: mode === 'login' ? -20 : 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: mode === 'login' ? 20 : -20 },
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
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
              {mode === 'login'
                ? 'Sign in to access your projects'
                : regStep === 'otp'
                  ? 'Verify your email address'
                  : 'Create an account to get started'}
            </p>
          </div>

          {/* Mode Toggle — only show on form steps */}
          {(regStep === 'form') && (
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
          )}

          {/* Form */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {/* ── OTP Verification Step ── */}
              {mode === 'register' && regStep === 'otp' && (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Email indicator */}
                  <div className="flex items-center gap-2 text-sm text-slate-400 bg-white/5 rounded-xl p-3 border border-white/5">
                    <Mail className="w-4 h-4 text-teal-400 flex-shrink-0" />
                    <span>Code sent to <span className="text-teal-400 font-medium">{formData.email}</span></span>
                  </div>

                  {/* OTP Success */}
                  {otpSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 flex-shrink-0" />
                      {otpSuccess}
                    </motion.div>
                  )}

                  {/* OTP Error */}
                  {otpError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                    >
                      {otpError}
                    </motion.div>
                  )}

                  {/* OTP Input Boxes */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex gap-3" onPaste={handleOtpPaste}>
                      {otpDigits.map((digit, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <input
                            ref={(el) => { inputRefs.current[i] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(i, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(i, e)}
                            className={`w-14 h-16 text-center text-2xl font-bold bg-white/5 border rounded-xl text-white placeholder-slate-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500/60 ${
                              digit
                                ? 'border-teal-500/40 bg-teal-500/5'
                                : otpError
                                  ? 'border-red-500/40'
                                  : 'border-white/10'
                            }`}
                            autoComplete="one-time-code"
                          />
                        </motion.div>
                      ))}
                    </div>

                    {/* Attempts counter */}
                    <div className="flex items-center justify-between w-full text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <KeyRound className="w-3 h-3" />
                        {otpAttemptsLeft} attempt{otpAttemptsLeft > 1 ? 's' : ''} remaining
                      </span>
                      <span>Code expires in 5 min</span>
                    </div>
                  </div>

                  {/* Verify Button */}
                  <button
                    onClick={handleOtpVerify}
                    disabled={otpLoading || otpDigits.some(d => !d)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 btn-shine"
                  >
                    {otpLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4" />
                        Verify & Create Account
                      </>
                    )}
                  </button>

                  {/* Resend */}
                  <div className="text-center">
                    <button
                      onClick={handleResendOTP}
                      disabled={resendTimer > 0 || otpLoading}
                      className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-teal-400 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
                    >
                      <RotateCcw className={`w-3.5 h-3.5 ${resendTimer === 0 ? 'animate-none' : ''}`} />
                      {resendTimer > 0 ? (
                        <>Resend code in <span className="font-mono text-slate-300">{formatTimer(resendTimer)}</span></>
                      ) : (
                        'Resend verification code'
                      )}
                    </button>
                  </div>

                  {/* Back to register form */}
                  <button
                    onClick={backToRegisterForm}
                    className="w-full py-2.5 rounded-xl border border-white/10 text-slate-400 text-sm hover:text-slate-300 hover:border-white/20 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to registration form
                  </button>
                </motion.div>
              )}

              {/* ── Login / Register Form ── */}
              {(mode === 'login' || regStep === 'form') && (
                <motion.form
                  key={mode}
                  variants={fadeVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.25 }}
                  onSubmit={mode === 'login' ? handleLoginSubmit : handleRegisterSubmit}
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
                        {mode === 'login' ? 'Signing in...' : 'Sending verification code...'}
                      </>
                    ) : (
                      mode === 'login' ? 'Sign In' : 'Create Account'
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Footer — only show on form steps */}
          {regStep === 'form' && (
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
          )}
        </div>

        {/* Bottom decoration */}
        <p className="text-center text-slate-600 text-xs mt-4">
          Secured with end-to-end encryption
        </p>
      </motion.div>
    </div>
  );
}
