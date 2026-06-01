'use client';

import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { setCookie, COOKIES } from '@/lib/cookies';

// Custom event for syncing between multiple ThemeToggle instances
const THEME_EVENT = 'theme-change';

// Track current theme in module-level variable for instant reads
let currentTheme: 'dark' | 'light' = 'dark';
const listeners = new Set<() => void>();

function setTheme(theme: 'dark' | 'light') {
  currentTheme = theme;
  setCookie(COOKIES.THEME, theme);
  listeners.forEach(fn => fn());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => { listeners.delete(cb); };
}

function getSnapshot(): boolean {
  return currentTheme === 'dark';
}

function getServerSnapshot(): boolean {
  return true; // Server defaults to dark
}

const noOpSubscribe = () => () => {};

export function isThemeDark(): boolean {
  return currentTheme === 'dark';
}

export function initThemeFromCookie(): void {
  try {
    const cookies = document.cookie.split('; ');
    for (const c of cookies) {
      const [key, ...rest] = c.split('=');
      if (key === COOKIES.THEME && rest.length > 0) {
        const val = decodeURIComponent(rest.join('='));
        currentTheme = val === 'light' ? 'light' : 'dark';
        return;
      }
    }
  } catch { /* ignore */ }
}

export default function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const mounted = useSyncExternalStore(noOpSubscribe, () => true, () => false);
  const initialized = useRef(false);

  // On first mount, read cookie and sync
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    initThemeFromCookie();
    applyThemeToDOM(currentTheme);
  }, []);

  // Sync DOM whenever isDark changes
  useEffect(() => {
    if (!mounted || !initialized.current) return;
    applyThemeToDOM(currentTheme);
  }, [isDark, mounted]);

  const toggle = useCallback(() => {
    const newTheme: 'dark' | 'light' = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    applyThemeToDOM(newTheme);
    // Also notify via custom event for any external listeners
    window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: { theme: newTheme } }));
  }, []);

  if (!mounted) return null;

  return (
    <motion.button
      onClick={toggle}
      className="w-10 h-10 rounded-xl glass-card flex items-center justify-center hover:border-teal-500/20 transition-all duration-300 group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25 }}
            className="relative w-5 h-5"
          >
            <Moon className="w-5 h-5 text-teal-400" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25 }}
            className="relative w-5 h-5"
          >
            <Sun className="w-5 h-5 text-amber-500" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

function applyThemeToDOM(theme: 'dark' | 'light') {
  const root = document.documentElement;
  // Add transitioning class for smooth CSS transition
  root.classList.add('transitioning');
  if (theme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
  }
  // Remove transitioning class after transition completes
  const timer = setTimeout(() => {
    root.classList.remove('transitioning');
  }, 500);
  // Store timer ref for cleanup
  if (typeof window !== 'undefined') {
    (window as unknown as Record<string, unknown>).__themeTimer = timer;
  }
}
