'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Shield } from 'lucide-react';
import type { PageKey } from './PortfolioApp';
import ThemeToggle, { isThemeDark } from './ThemeToggle';
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
      { label: 'Pricing', key: 'pricing' },
      { label: 'FAQ', key: 'faq' },
    ],
  },
  { label: 'Portfolio', key: 'portfolio' },
  { label: 'Blog', key: 'blog' },
  { label: 'Contact', key: 'contact' },
];

const portalLink: NavLinkItem = { label: 'Client Portal', key: 'portal' };

interface NavbarProps {
  currentPage: PageKey;
  onNavigate: (page: PageKey) => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync theme state
  useEffect(() => {
    const checkTheme = () => setIsDark(isThemeDark());
    checkTheme();
    const listener = window.addEventListener('theme-change', checkTheme);
    // Also poll every 100ms for reliability
    const interval = setInterval(checkTheme, 100);
    return () => {
      (window.removeEventListener as typeof window.addEventListener)('theme-change', checkTheme);
      clearInterval(interval);
    };
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

  const handleServicesToggle = () => {
    setServicesOpen((prev) => !prev);
  };

  const isServicesActive = currentPage === 'services' || currentPage === 'faq' || currentPage === 'pricing';

  // Text color classes based on theme
  const navBase = isDark
    ? 'text-slate-300 hover:text-white hover:bg-white/5'
    : 'nav-text-dark hover:!bg-transparent';
  const navActive = isDark ? 'text-teal-400' : 'nav-text-active';
  const chevronColor = isDark
    ? (isServicesActive ? 'text-teal-400' : 'text-slate-500 group-hover:text-slate-300')
    : (isServicesActive ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-600');
  const dropItem = isDark
    ? 'text-slate-300 hover:text-white hover:bg-white/5'
    : 'nav-dropdown-item hover:!bg-transparent';
  const dropActive = isDark
    ? 'text-teal-400 bg-teal-500/10'
    : 'nav-dropdown-active';
  const dropSubtle = isDark ? 'text-slate-500' : 'nav-dropdown-subtle';
  const mobileBase = isDark
    ? 'text-slate-300 hover:text-white hover:bg-white/5'
    : 'nav-mobile-bg';
  const mobileActive = isDark
    ? 'text-teal-400 bg-teal-500/10 border-l-2 border-teal-400'
    : 'nav-mobile-active border-l-2';
  const mobileSubItem = isDark
    ? 'text-slate-400 hover:text-white hover:bg-white/5'
    : 'nav-mobile-bg';
  const mobileSubActive = isDark
    ? 'text-teal-400 bg-teal-500/10'
    : 'nav-dropdown-active';
  const mobileSubtle = isDark ? 'text-slate-500' : 'nav-dropdown-subtle';
  const mobileBorder = isDark ? 'border-teal-500/10' : 'nav-mobile-services-border';
  const hamburgerColor = isDark
    ? 'text-slate-300 hover:text-white hover:bg-white/5'
    : 'nav-hamburger-btn';
  const portalBtnDesktop = isDark
    ? 'bg-gradient-to-r from-teal-500/15 to-emerald-500/15 border border-teal-500/25 text-teal-300 hover:text-teal-200 hover:border-teal-500/40 hover:from-teal-500/25 hover:to-emerald-500/25'
    : 'nav-portal-btn border';
  const portalBtnMobile = isDark
    ? 'bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-500/20 text-teal-300 hover:text-teal-200'
    : 'nav-portal-mobile border';

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
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleServicesToggle();
                    }}
                    className={`relative flex items-center gap-1 px-2.5 py-2 rounded-lg transition-all duration-200 group ${
                      isServicesActive ? navActive : navBase
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
                        className={`absolute inset-0 rounded-lg ${isDark ? 'bg-teal-500/10 border border-teal-500/20' : 'bg-teal-500/8 border border-teal-500/15'}`}
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                    <ChevronDown
                      className={`relative z-10 w-3 h-3 transition-transform duration-200 ${
                        servicesOpen ? 'rotate-180' : ''
                      } ${chevronColor}`}
                    />
                  </button>

                  {/* Desktop dropdown - uses CSS class instead of inline style */}
                  <AnimatePresence>
                    {servicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute top-full left-0 mt-1.5 w-52 rounded-xl overflow-hidden services-dropdown"
                      >
                        <div className="py-1.5">
                          {link.children.map((child) => (
                            <button
                              key={child.key}
                              onClick={() => handleClick(child.key)}
                              className={`w-full text-left px-4 py-2.5 transition-all duration-150 flex items-center gap-2.5 ${
                                currentPage === child.key ? dropActive : dropItem
                              }`}
                              style={{
                                fontFamily: 'var(--font-space-grotesk), var(--font-inter), system-ui, sans-serif',
                                fontWeight: currentPage === child.key ? 500 : 400,
                                fontSize: '0.82rem',
                                letterSpacing: '0.02em',
                              }}
                            >
                              {currentPage === child.key && (
                                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isDark ? 'bg-teal-400' : 'bg-teal-500'}`} />
                              )}
                              <span className="flex-1">{child.label}</span>
                              {child.key === 'faq' && (
                                <span className={`text-[10px] uppercase tracking-wider font-medium ${dropSubtle}`}>
                                  FAQ
                                </span>
                              )}
                              {child.key === 'pricing' && (
                                <span className={`text-[10px] uppercase tracking-wider font-medium ${dropSubtle}`}>
                                  $$$
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
                    currentPage === link.key ? navActive : navBase
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
                      className={`absolute inset-0 rounded-lg ${isDark ? 'bg-teal-500/10 border border-teal-500/20' : 'bg-teal-500/8 border border-teal-500/15'}`}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </button>
              )
            )}
            {/* Client Portal — special highlighted button (desktop) */}
            <button
              onClick={() => handleClick('portal')}
              className={`relative px-3.5 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1.5 ml-1 ${portalBtnDesktop}`}
              style={{
                fontFamily: 'var(--font-space-grotesk), var(--font-inter), system-ui, sans-serif',
                fontWeight: 500,
                fontSize: '0.78rem',
                letterSpacing: '0.04em',
              }}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Portal</span>
            </button>
          </div>

          {/* Mobile: Theme Toggle + Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${hamburgerColor}`}
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
            className={`md:hidden overflow-hidden border-t mobile-menu-dropdown ${isDark ? 'border-teal-500/10' : 'nav-mobile-border'}`}
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
                        isServicesActive ? mobileActive : mobileBase
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
                        } ${isServicesActive ? (isDark ? 'text-teal-400' : 'text-teal-600') : mobileSubtle}`}
                      />
                    </motion.button>

                    <AnimatePresence>
                      {mobileServicesOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`overflow-hidden ml-3 border-l ${mobileBorder}`}
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
                                  currentPage === child.key ? mobileSubActive : mobileSubItem
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
                      currentPage === link.key ? mobileActive : mobileBase
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
              {/* Divider before portal */}
              <div className={`border-t my-2 ${isDark ? 'border-white/5' : 'nav-mobile-divider'}`} />
              {/* Client Portal mobile */}
              <motion.button
                onClick={() => handleClick('portal')}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.03 }}
                className={`w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 ${portalBtnMobile}`}
                style={{
                  fontFamily: 'var(--font-space-grotesk), var(--font-inter), system-ui, sans-serif',
                  fontWeight: 500,
                  fontSize: '0.82rem',
                  letterSpacing: '0.04em',
                }}
              >
                <Shield className="w-4 h-4" />
                <span>Client Portal</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
