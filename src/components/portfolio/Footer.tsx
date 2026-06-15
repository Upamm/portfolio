'use client';

import { ArrowRight } from 'lucide-react';
import type { PageKey } from './PortfolioApp';
import Logo from './Logo';

const footerLinks: { label: string; key: PageKey }[] = [
  { label: 'About', key: 'about' },
  { label: 'Services', key: 'services' },
  { label: 'Portfolio', key: 'portfolio' },
  { label: 'Pricing', key: 'pricing' },
  { label: 'Blog', key: 'blog' },
  { label: 'FAQ', key: 'faq' },
  { label: 'Contact', key: 'contact' },
];

interface FooterProps {
  onNavigate: (page: PageKey) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="relative mt-auto overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 footer-bg" />

      {/* CTA Banner */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 lg:pt-16">
        <div className="glass-card rounded-2xl p-8 sm:p-10 lg:p-12 mb-10 sm:mb-14 lg:mb-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/40 to-transparent" />
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3">
            Ready to Start Your <span className="gradient-text">Project</span>?
          </h3>
          <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto mb-5 sm:mb-7">
            Let&apos;s work together. Contact me today for a free consultation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('contact')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 transition-all duration-200 shadow-lg shadow-teal-500/20 hover:scale-[1.03]"
            >
              Get In Touch
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="https://www.fiverr.com/upam1721"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium text-teal-400 border border-teal-500/30 hover:border-teal-400/60 hover:bg-teal-500/10 transition-all duration-200"
            >
              Hire Me on Fiverr
            </a>
          </div>
        </div>
      </div>

      {/* Footer Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 sm:gap-12 mb-10 text-center items-stretch">
          {/* Brand */}
          <div className="flex flex-col lg:text-left lg:items-start">
            <div className="flex justify-center lg:justify-start">
              <Logo size="sm" onClick={() => onNavigate('home')} />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto lg:mx-0 mt-4">
              WordPress Virtual Assistant & B2B Lead Generation specialist helping businesses grow online since 2016.
            </p>
            <div className="flex gap-2.5 mt-5 justify-center lg:justify-start">
              <a href="https://www.fiverr.com/upam1721" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 transition-all" aria-label="Fiverr">
                <img src="https://fiverr-res.cloudinary.com/npm-assets/layout-service/favicon-32x32.8f21439.png" alt="Fiverr" className="w-4 h-4" />
              </a>
              <a href="https://twitter.com/upam1721" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 transition-all" aria-label="Twitter (X)">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
            </div>
          </div>

          {/* Quick Links - hidden on mobile & tablet */}
          <div className="hidden lg:flex flex-col lg:text-left lg:items-start">
            <h4 className="text-white font-semibold mb-4 text-sm">Quick Links</h4>
            <ul className="space-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.key} className="flex justify-center lg:justify-start">
                  <button
                    onClick={() => onNavigate(link.key)}
                    className="text-slate-400 text-sm hover:text-teal-400 transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services - hidden on mobile & tablet */}
          <div className="hidden lg:flex flex-col lg:text-left lg:items-start">
            <h4 className="text-white font-semibold mb-4 text-sm">Services</h4>
            <ul className="space-y-2.5">
              {['WordPress Development', 'Speed Optimization', 'B2B Lead Generation', 'Virtual Assistant', 'Data Entry & Research', 'WordPress Maintenance'].map((s) => (
                <li key={s}><span className="text-slate-400 text-sm">{s}</span></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-col lg:flex-row items-center justify-between gap-3 text-center">
          <p className="text-slate-500 text-xs">&copy; {new Date().getFullYear()} Upam. All Rights Reserved.</p>
          <p className="text-slate-600 text-xs">WordPress Virtual Assistant & Web Designer</p>
        </div>
      </div>
    </footer>
  );
}
