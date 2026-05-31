'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import type { PageKey } from './PortfolioApp';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';

interface NavLinkItem {
  label: string;
  key: PageKey;
  children?: { label: string; key: PageKey }[];
}

const navLinks: NavLinkItem[] = [
  { label: 'Home', key: 'home' },
  { label: 'About', key: 'about' },
  {
    label: 'Services',
    key: 'services',
    children: [
      { label: 'All Services', key: 'services' },
      { label: 'FAQ', key: 'faq' },
    ],
  },
  { label: 'Portfolio', key: 'portfolio' },
  { label: 'Pricing', key: 'pricing' },
  { label: 'Blog', key: 'blog' },
  { label: 'Contact', key: 'contact' },
];

interface NavbarProps {
  currentPage: PageKey;
  onNavigate: (page: PageKey) => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close services dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClick = (key: PageKey) => {
    setIsOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
    onNavigate(key);
  };

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setServicesOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setServicesOpen(false);
    }, 150);
  };

  const isServicesActive = currentPage === 'services' || currentPage === 'faq';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        scrolled
          ? 'nav-scrolled-enhanced py-0'
          : 'bg-transparent py-1'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 transition-all duration-500">
          {/* Logo */}
          <Logo size="sm" onClick={() => handleClick('home')} />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-0.5">
            <ThemeToggle />
            {navLinks.map((link) =>
              link.children ? (
                /* Services with dropdown */
                <div
                  key={link.key}
                  ref={dropdownRef}
                  className="relative"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    onClick={() => handleClick(link.key)}
                    className={`relative flex items-center gap-1 px-2.5 py-2 rounded-lg transition-all duration-200 group ${
                      isServicesActive
                        ? 'text-teal-400'
                        : 'text-slate-300 hover:text-white'
                    }`}
                    style={{
                      fontFamily: 'var(--font-space-grotesk), var(--font-inter), system-ui, sans-serif',
                      fontWeight: 500,
                      fontSize: '0.82rem',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {isServicesActive && (
                      <motion.span
                        layoutId="activeNav"
                        className="absolute inset-0 rounded-lg bg-teal-500/10 border border-teal-500/20"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                    <ChevronDown
                      className={`relative z-10 w-3 h-3 transition-transform duration-200 ${
                        servicesOpen ? 'rotate-180' : ''
                      } ${isServicesActive ? 'text-teal-400' : 'text-slate-500 group-hover:text-slate-300'}`}
                    />
                  </button>

                  {/* Desktop dropdown */}
                  <AnimatePresence>
                    {servicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute top-full left-0 mt-1.5 w-52 rounded-xl overflow-hidden"
                        style={{
                          backdropFilter: 'blur(20px)',
                          WebkitBackdropFilter: 'blur(20px)',
                          backgroundColor: 'rgba(10, 22, 40, 0.85)',
                          border: '1px solid rgba(6, 182, 212, 0.12)',
                          boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03) inset',
                        }}
                      >
                        <div className="py-1.5">
                          {link.children.map((child) => (
                            <button
                              key={child.key}
                              onClick={() => handleClick(child.key)}
                              className={`w-full text-left px-4 py-2.5 transition-all duration-150 flex items-center gap-2.5 ${
                                currentPage === child.key
                                  ? 'text-teal-400 bg-teal-500/10'
                                  : 'text-slate-300 hover:text-white hover:bg-white/5'
                              }`}
                              style={{
                                fontFamily: 'var(--font-space-grotesk), var(--font-inter), system-ui, sans-serif',
                                fontWeight: currentPage === child.key ? 500 : 400,
                                fontSize: '0.82rem',
                                letterSpacing: '0.02em',
                              }}
                            >
                              {currentPage === child.key && (
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" />
                              )}
                              <span className="flex-1">{child.label}</span>
                              {child.key === 'faq' && (
                                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">
                                  FAQ
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Regular nav links */
                <button
                  key={link.key}
                  onClick={() => handleClick(link.key)}
                  className={`relative px-2.5 py-2 rounded-lg transition-all duration-200 ${
                    currentPage === link.key
                      ? 'text-teal-400'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                  style={{
                    fontFamily: 'var(--font-space-grotesk), var(--font-inter), system-ui, sans-serif',
                    fontWeight: currentPage === link.key ? 500 : 400,
                    fontSize: '0.82rem',
                    letterSpacing: '0.04em',
                  }}
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
              )
            )}
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
              {navLinks.map((link, index) =>
                link.children ? (
                  /* Mobile Services with nested FAQ */
                  <div key={link.key}>
                    <motion.button
                      onClick={() => {
                        handleClick(link.key);
                        setMobileServicesOpen(!mobileServicesOpen);
                      }}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={`w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center justify-between ${
                        isServicesActive
                          ? 'text-teal-400 bg-teal-500/10 border-l-2 border-teal-400'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                      style={{
                        fontFamily: 'var(--font-space-grotesk), var(--font-inter), system-ui, sans-serif',
                        fontWeight: isServicesActive ? 500 : 400,
                        fontSize: '0.82rem',
                        letterSpacing: '0.04em',
                      }}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          mobileServicesOpen ? 'rotate-180' : ''
                        } ${isServicesActive ? 'text-teal-400' : 'text-slate-500'}`}
                      />
                    </motion.button>

                    <AnimatePresence>
                      {mobileServicesOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden ml-3 border-l border-teal-500/10"
                        >
                          <div className="py-1 space-y-0.5">
                            {link.children.map((child) => (
                              <motion.button
                                key={child.key}
                                onClick={() => handleClick(child.key)}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.05 }}
                                className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                                  currentPage === child.key
                                    ? 'text-teal-400 bg-teal-500/10'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                                style={{
                                  fontFamily: 'var(--font-space-grotesk), var(--font-inter), system-ui, sans-serif',
                                  fontWeight: currentPage === child.key ? 500 : 400,
                                  fontSize: '0.78rem',
                                  letterSpacing: '0.03em',
                                }}
                              >
                                {child.label}
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  /* Regular mobile nav links */
                  <motion.button
                    key={link.key}
                    onClick={() => handleClick(link.key)}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={`w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200 ${
                      currentPage === link.key
                        ? 'text-teal-400 bg-teal-500/10 border-l-2 border-teal-400'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                    style={{
                      fontFamily: 'var(--font-space-grotesk), var(--font-inter), system-ui, sans-serif',
                      fontWeight: currentPage === link.key ? 500 : 400,
                      fontSize: '0.82rem',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {link.label}
                  </motion.button>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
