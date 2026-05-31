'use client';

import { ArrowRight } from 'lucide-react';
import type { PageKey } from './PortfolioApp';

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
          <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z" fill="rgba(6, 182, 212, 0.04)" />
          <path d="M0,55 C240,20 480,70 720,40 C960,10 1200,60 1440,55 L1440,80 L0,80 Z" fill="rgba(6, 15, 29, 1)" />
        </svg>
      </div>

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060f1d] to-[#040b16]" style={{ top: '60px' }} />

      {/* CTA Banner */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <div className="glass-card rounded-2xl p-6 sm:p-10 lg:p-12 mb-10 sm:mb-14 lg:mb-20 text-center relative overflow-hidden">
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 mb-8">
          {/* Brand */}
          <div>
            <button
              onClick={() => onNavigate('home')}
              className="text-xl font-bold tracking-wider mb-3 block"
            >
              <span className="gradient-text">UPAM</span>
            </button>
            <p className="text-slate-400 text-sm leading-relaxed">
              WordPress Virtual Assistant & B2B Lead Generation specialist helping businesses grow online since 2016.
            </p>
            <div className="flex gap-2.5 mt-4">
              <a href="https://wa.me/8801316020499" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-green-400 hover:bg-green-500/10 transition-all" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              </a>
              <a href="mailto:mailupamm@gmail.com" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 transition-all" aria-label="Email">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              </a>
              <a href="https://www.fiverr.com/upam1721" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 transition-all" aria-label="Fiverr">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M23.004 15.588a.995.995 0 10.002-1.99.995.995 0 00-.002 1.99zm-.996-3.705h-.857c-.084-.654-.27-1.269-.54-1.834l.602-.602a.996.996 0 10-1.408-1.408l-.46.46A6.018 6.018 0 0016.5 7.29V5.005a1 1 0 10-2 0V7.29a6.022 6.022 0 00-2.846 1.21l-.46-.46a.996.996 0 10-1.408 1.408l.602.602a5.974 5.974 0 00-.54 1.834h-.856a1 1 0 100 2h.856c.084.654.27 1.269.54 1.834l-.602.602a.996.996 0 101.408 1.408l.46-.46c.83.542 1.792.92 2.846 1.046v2.284a1 1 0 102 0V17.8a6.022 6.022 0 002.846-1.21l.46.46a.996.996 0 101.408-1.408l-.602-.602c.27-.565.456-1.18.54-1.834h.857a1 1 0 100-2zm-6.006 2.943a4.01 4.01 0 110-8.018 4.01 4.01 0 010 8.018zm0-5.014a1.003 1.003 0 100 2.007 1.003 1.003 0 000-2.007z" /></svg>
              </a>
              <a href="https://twitter.com/upam1721" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 transition-all" aria-label="Twitter">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href="https://www.linkedin.com/in/upam1721" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 transition-all" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.key}>
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

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Services</h4>
            <ul className="space-y-2">
              {['WordPress Development', 'Speed Optimization', 'B2B Lead Generation', 'Virtual Assistant', 'Data Entry & Research', 'WordPress Maintenance'].map((s) => (
                <li key={s}><span className="text-slate-400 text-sm">{s}</span></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-xs">&copy; {new Date().getFullYear()} Upam. All Rights Reserved.</p>
          <p className="text-slate-600 text-xs">WordPress Virtual Assistant & Web Designer</p>
        </div>
      </div>
    </footer>
  );
}
