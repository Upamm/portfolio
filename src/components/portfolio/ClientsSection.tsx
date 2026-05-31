'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const clients = [
  { name: 'TechStart Inc.', category: 'Tech' },
  { name: 'GreenLeaf Agency', category: 'Marketing' },
  { name: 'Bright Horizons', category: 'Business' },
  { name: 'Nexus Digital', category: 'Digital' },
  { name: 'Urban Eats Co.', category: 'Food' },
  { name: 'CloudNine Labs', category: 'SaaS' },
  { name: 'AquaFlow Corp', category: 'Industrial' },
  { name: 'PrimeWave Media', category: 'Media' },
  { name: 'SolarEdge Tech', category: 'Energy' },
  { name: 'DataPulse AI', category: 'AI' },
  { name: 'Zenith Studios', category: 'Design' },
  { name: 'Velocity Brands', category: 'E-commerce' },
];

export default function ClientsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Duplicate for seamless loop
  const doubled = [...clients, ...clients];

  return (
    <section id="clients" className="relative py-16 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-teal-500/[0.02] to-transparent" />

      {/* Top separator */}
      <div className="absolute top-0 left-0 right-0 section-divider" />

      <div ref={ref} className="relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <span className="text-teal-400 text-sm font-medium uppercase tracking-widest">
            Trusted By
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white mt-2">
            Clients I&apos;ve Worked <span className="gradient-text">With</span>
          </h3>
        </motion.div>

        {/* Row 1 - Left to Right */}
        <div className="mb-6 sm:mb-8 overflow-hidden">
          <div className="flex animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused]">
            {doubled.map((client, index) => (
              <div
                key={`r1-${client.name}-${index}`}
                className="flex-shrink-0 mx-3 sm:mx-4"
              >
                <div className="glass-card rounded-xl px-5 sm:px-6 py-3 sm:py-4 flex items-center gap-3 whitespace-nowrap group hover:border-teal-500/20 transition-all duration-300">
                  {/* Avatar initials */}
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500/20 to-emerald-500/20 flex items-center justify-center text-teal-400 font-bold text-xs group-hover:from-teal-500/30 group-hover:to-emerald-500/30 transition-all">
                    {client.name.split(' ').map(w => w[0]).join('').substring(0, 2)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                      {client.name}
                    </div>
                    <div className="text-xs text-slate-500">{client.category}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 - Right to Left (reverse) */}
        <div className="overflow-hidden">
          <div
            className="flex animate-[marquee-reverse_30s_linear_infinite] hover:[animation-play-state:paused]"
          >
            {[...doubled].reverse().map((client, index) => (
              <div
                key={`r2-${client.name}-${index}`}
                className="flex-shrink-0 mx-3 sm:mx-4"
              >
                <div className="glass-card rounded-xl px-5 sm:px-6 py-3 sm:py-4 flex items-center gap-3 whitespace-nowrap group hover:border-teal-500/20 transition-all duration-300">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs group-hover:from-emerald-500/30 group-hover:to-cyan-500/30 transition-all">
                    {client.name.split(' ').map(w => w[0]).join('').substring(0, 2)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                      {client.name}
                    </div>
                    <div className="text-xs text-slate-500">{client.category}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom separator */}
      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  );
}
