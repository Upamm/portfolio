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
      {/* Wave Divider */}
      <div className="wave-divider">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path className="wave-accent" d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z" />
          <path className="wave-body" d="M0,55 C240,20 480,70 720,40 C960,10 1200,60 1440,55 L1440,80 L0,80 Z" />
        </svg>
      </div>

      {/* Background */}
      <div className="absolute inset-0 footer-bg" style={{ top: '60px' }} />

      {/* CTA Banner */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="glass-card rounded-2xl p-6 sm:p-10 lg:p-12 mb-6 sm:mb-10 lg:mb-14 text-center relative overflow-hidden">
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
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 mb-8 text-center">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex justify-center">
              <Logo size="sm" onClick={() => onNavigate('home')} />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">
              WordPress Virtual Assistant & B2B Lead Generation specialist helping businesses grow online since 2016.
            </p>
            <div className="flex gap-2.5 mt-4 justify-center">
              <a href="https://www.fiverr.com/upam1721" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 transition-all" aria-label="Fiverr">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M23.004 15.588a.995.995 0 10.002-1.99.995.995 0 00-.002 1.99zm-.996-3.705h-.857c-.084-.654-.27-1.269-.54-1.834l.602-.602a.996.996 0 10-1.408-1.408l-.46.46A6.018 6.018 0 0016.5 7.29V5.005a1 1 0 10-2 0V7.29a6.022 6.022 0 00-2.846 1.21l-.46-.46a.996.996 0 10-1.408 1.408l.602.602a5.974 5.974 0 00-.54 1.834h-.856a1 1 0 100 2h.856c.084.654.27 1.269.54 1.834l-.602.602a.996.996 0 101.408 1.408l.46-.46c.83.542 1.792.92 2.846 1.046v2.284a1 1 0 102 0V17.8a6.022 6.022 0 002.846-1.21l.46.46a.996.996 0 101.408-1.408l-.602-.602c.27-.565.456-1.18.54-1.834h.857a1 1 0 100-2zm-6.006 2.943a4.01 4.01 0 110-8.018 4.01 4.01 0 010 8.018zm0-5.014a1.003 1.003 0 100 2.007 1.003 1.003 0 000-2.007z" /></svg>
              </a>
              <a href="https://twitter.com/upam1721" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 transition-all" aria-label="Twitter (X)">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
            </div>
          </div>

          {/* Quick Links - hidden on mobile & tablet */}
          <div className="hidden lg:block lg:col-span-1">
            <h4 className="text-white font-semibold mb-3 text-sm">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.key} className="flex justify-center">
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
          <div className="hidden lg:block">
            <h4 className="text-white font-semibold mb-3 text-sm">Services</h4>
            <ul className="space-y-2">
              {['WordPress Development', 'Speed Optimization', 'B2B Lead Generation', 'Virtual Assistant', 'Data Entry & Research', 'WordPress Maintenance'].map((s) => (
                <li key={s}><span className="text-slate-400 text-sm">{s}</span></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-6 flex flex-col lg:flex-row items-center justify-between gap-3 text-center">
          <p className="text-slate-500 text-xs">&copy; {new Date().getFullYear()} Upam. All Rights Reserved.</p>
          <p className="text-slate-600 text-xs">WordPress Virtual Assistant & Web Designer</p>
        </div>
      </div>
    </footer>
  );
}
