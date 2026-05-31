'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import type { PageKey } from './PortfolioApp';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';

const navLinks: { label: string; key: PageKey }[] = [
  { label: 'Home', key: 'home' },
  { label: 'About', key: 'about' },
  { label: 'Services', key: 'services' },
  { label: 'Portfolio', key: 'portfolio' },
  { label: 'Pricing', key: 'pricing' },
  { label: 'Blog', key: 'blog' },
  { label: 'FAQ', key: 'faq' },
  { label: 'Contact', key: 'contact' },
];

interface NavbarProps {
  currentPage: PageKey;
  onNavigate: (page: PageKey) => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (key: PageKey) => {
    setIsOpen(false);
    onNavigate(key);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a1628]/95 backdrop-blur-lg border-b border-teal-500/10 shadow-lg shadow-black/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Logo size="sm" onClick={() => handleClick('home')} />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-0.5">
            <ThemeToggle />
            {navLinks.map((link) => (
              <button
                key={link.key}
                onClick={() => handleClick(link.key)}
                className={`relative px-2.5 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  currentPage === link.key
                    ? 'text-teal-400'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {currentPage === link.key && (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-lg bg-teal-500/10 border border-teal-500/20"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </button>
            ))}
          </div>

          {/* Mobile: Theme Toggle + Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden border-t border-teal-500/10 mobile-menu-dropdown"
          >
            <div className="px-3 py-3 space-y-0.5">
              {navLinks.map((link, index) => (
                <motion.button
                  key={link.key}
                  onClick={() => handleClick(link.key)}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    currentPage === link.key
                      ? 'text-teal-400 bg-teal-500/10 border-l-2 border-teal-400'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
