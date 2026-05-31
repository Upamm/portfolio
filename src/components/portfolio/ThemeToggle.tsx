'use client';

import { useState, useCallback, useEffect, useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { getCookie, setCookie, COOKIES } from '@/lib/cookies';

// Custom event for theme changes within the same tab
const THEME_CHANGE_EVENT = 'theme-change';

// Shared subscribe function for useSyncExternalStore
function subscribeTheme(callback: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, callback);
  return () => window.removeEventListener(THEME_CHANGE_EVENT, callback);
}

function getThemeSnapshot(): boolean {
  return getCookie(COOKIES.THEME) !== 'light';
}

// Server always returns dark (matches the blocking script in layout.tsx)
function getThemeServerSnapshot(): boolean {
  return true;
}

const noOpSubscribe = () => () => {};

export default function ThemeToggle() {
  // Track theme reactively via useSyncExternalStore (no setState-in-effect)
  const isDark = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getThemeServerSnapshot);

  // Track mounting for SSR safety
  const mounted = useSyncExternalStore(noOpSubscribe, () => true, () => false);

  // Sync DOM classes on mount and listen for external changes
  useEffect(() => {
    if (!mounted) return;
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDark, mounted]);

  const toggle = useCallback(() => {
    const currentIsDark = getCookie(COOKIES.THEME) !== 'light';
    const newIsDark = !currentIsDark;
    const newTheme = newIsDark ? 'dark' : 'light';

    setCookie(COOKIES.THEME, newTheme);

    if (newIsDark) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }

    // Notify all ThemeToggle instances to re-read cookie
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
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
      <motion.div
        animate={{ rotate: isDark ? 0 : 180 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative w-5 h-5"
      >
        {isDark ? (
          <Moon className="w-5 h-5 text-teal-400 transition-colors" />
        ) : (
          <Sun className="w-5 h-5 text-yellow-400 transition-colors" />
        )}
      </motion.div>
    </motion.button>
  );
}
