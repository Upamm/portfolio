'use client';

import { useCallback, useSyncExternalStore, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { getCookie, setCookie, COOKIES } from '@/lib/cookies';

const emptySubscribe = () => () => {};

function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

function useTheme() {
  const getSnapshot = () => getCookie(COOKIES.THEME) !== 'light';
  // Default to dark on server (matches the blocking script in layout)
  const getServerSnapshot = () => true;
  return useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);
}

export default function ThemeToggle() {
  const isDark = useTheme();
  const mounted = useMounted();

  const toggle = useCallback(() => {
    const currentIsDark = getCookie(COOKIES.THEME) !== 'light';
    const newIsDark = !currentIsDark;
    const newTheme = newIsDark ? 'dark' : 'light';

    // Persist to cookie (survives across sessions, no flash on reload)
    setCookie(COOKIES.THEME, newTheme);

    if (newIsDark) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    // Trigger re-render
    window.dispatchEvent(new Event('storage'));
  }, []);

  // Sync cookie value to DOM classes on mount (in case cookie was set externally)
  useEffect(() => {
    if (!mounted) return;
    const theme = getCookie(COOKIES.THEME) || 'dark';
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [mounted]);

  if (!mounted) return null;

  return (
    <motion.button
      onClick={toggle}
      className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-slate-300 hover:text-teal-400 hover:border-teal-500/20 transition-all duration-300 group"
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
