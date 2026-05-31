'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

// Row 1 clients — unique set
const row1Clients = [
  { name: 'TechStart Inc.', category: 'Tech' },
  { name: 'GreenLeaf Agency', category: 'Marketing' },
  { name: 'Bright Horizons', category: 'Business' },
  { name: 'Nexus Digital', category: 'Digital' },
  { name: 'Urban Eats Co.', category: 'Food & Beverage' },
  { name: 'CloudNine Labs', category: 'SaaS' },
  { name: 'AquaFlow Corp', category: 'Industrial' },
  { name: 'PrimeWave Media', category: 'Media' },
  { name: 'SolarEdge Tech', category: 'Energy' },
  { name: 'DataPulse AI', category: 'Artificial Intelligence' },
  { name: 'Zenith Studios', category: 'Design' },
  { name: 'Velocity Brands', category: 'E-commerce' },
  { name: 'BluePeak Ventures', category: 'Finance' },
  { name: 'EverGreen Solutions', category: 'Sustainability' },
  { name: 'CoreStack Systems', category: 'Infrastructure' },
];

// Row 2 clients — different set, no duplicates with Row 1
const row2Clients = [
  { name: 'SilverBridge Co.', category: 'Consulting' },
  { name: 'Horizon Health', category: 'Healthcare' },
  { name: 'MapleTech Group', category: 'IT Services' },
  { name: 'CrestView Realty', category: 'Real Estate' },
  { name: 'PixelForge Studio', category: 'Creative Agency' },
  { name: 'TidalWave Logistics', category: 'Supply Chain' },
  { name: 'NovaSpark Edu', category: 'Education' },
  { name: 'IronClad Security', category: 'Cybersecurity' },
  { name: 'FreshHarvest Foods', category: 'Agriculture' },
  { name: 'QuantumLeap Dev', category: 'Software' },
  { name: 'Stellaris Finance', category: 'Fintech' },
  { name: 'Arcline Architects', category: 'Architecture' },
  { name: 'Redwood Dynamics', category: 'Engineering' },
  { name: 'CrystalBay Hotels', category: 'Hospitality' },
  { name: 'OpalNet Communications', category: 'Telecom' },
];

export default function ClientsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="clients" className="relative py-10 sm:py-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-teal-500/[0.02] to-transparent" />

      {/* Top separator */}
      <div className="absolute top-0 left-0 right-0 section-divider" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-10"
        >
          <span className="text-teal-400 text-sm font-medium uppercase tracking-widest">
            Trusted By
          </span>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-3">
            Clients I&apos;ve Worked <span className="gradient-text">With</span>
          </h3>
          <span className="section-heading-line" />
          <p className="text-slate-400 mt-6 max-w-2xl mx-auto">
            Trusted by businesses across diverse industries worldwide.
          </p>
        </motion.div>

        {/* Row 1 - Right to Left */}
        <div className="mb-4 sm:mb-6 overflow-hidden">
          <div className="flex animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused]">
            {[...row1Clients, ...row1Clients].map((client, index) => (
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

        {/* Row 2 - Left to Right (opposite of Row 1) */}
        <div className="overflow-hidden">
          <div className="flex animate-[marquee-reverse_30s_linear_infinite] hover:[animation-play-state:paused]">
            {[...row2Clients, ...row2Clients].map((client, index) => (
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
