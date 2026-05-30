'use client';

import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const footerLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Services', href: '#services' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative mt-auto overflow-hidden">
      {/* Wave Divider */}
      <div className="wave-divider">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z"
            fill="rgba(6, 182, 212, 0.05)"
          />
          <path
            d="M0,50 C240,20 480,70 720,40 C960,10 1200,60 1440,50 L1440,80 L0,80 Z"
            fill="rgba(6, 15, 29, 1)"
          />
        </svg>
      </div>

      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 section-divider" style={{ top: '60px' }} />

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060f1d] to-[#040b16]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
        {/* Main Footer Content */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollToTop();
              }}
              className="inline-block text-2xl font-bold tracking-wider mb-4"
            >
              <span className="gradient-text">UPAM</span>
            </a>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              WordPress Virtual Assistant & B2B Lead Generation specialist
              helping businesses grow online since 2016.
            </p>
            {/* Social icons */}
            <div className="flex gap-3 mt-6">
              <a
                href="https://www.fiverr.com/upam1721"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 transition-all duration-300"
                aria-label="Fiverr"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M23.004 15.588a.995.995 0 10.002-1.99.995.995 0 00-.002 1.99zm-.996-3.705h-.857c-.084-.654-.27-1.269-.54-1.834l.602-.602a.996.996 0 10-1.408-1.408l-.46.46A6.018 6.018 0 0016.5 7.29V5.005a1 1 0 10-2 0V7.29a6.022 6.022 0 00-2.846 1.21l-.46-.46a.996.996 0 10-1.408 1.408l.602.602a5.974 5.974 0 00-.54 1.834h-.856a1 1 0 100 2h.856c.084.654.27 1.269.54 1.834l-.602.602a.996.996 0 101.408 1.408l.46-.46c.83.542 1.792.92 2.846 1.046v2.284a1 1 0 102 0V17.8a6.022 6.022 0 002.846-1.21l.46.46a.996.996 0 101.408-1.408l-.602-.602c.27-.565.456-1.18.54-1.834h.857a1 1 0 100-2zm-6.006 2.943a4.01 4.01 0 110-8.018 4.01 4.01 0 010 8.018zm0-5.014a1.003 1.003 0 100 2.007 1.003 1.003 0 000-2.007z" />
                </svg>
              </a>
              <a
                href="https://twitter.com/upam1721"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 transition-all duration-300"
                aria-label="Twitter / X"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/upam1721"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleClick(link.href);
                    }}
                    className="text-slate-400 text-sm hover:text-teal-400 transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2.5">
              {[
                'WordPress Development',
                'Speed Optimization',
                'B2B Lead Generation',
                'Virtual Assistant',
                'Data Entry & Research',
                'WordPress Maintenance',
              ].map((service) => (
                <li key={service}>
                  <span className="text-slate-400 text-sm">{service}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            &copy; 2025 Upam. All Rights Reserved.
          </p>
          <p className="text-slate-600 text-xs">
            WordPress Virtual Assistant & Web Designer
          </p>
        </div>
      </div>

      {/* Back to Top Button */}
      <motion.button
        onClick={scrollToTop}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 hover:scale-110 transition-all duration-300 z-40"
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </footer>
  );
}
