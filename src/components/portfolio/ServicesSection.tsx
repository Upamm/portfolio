'use client';

import { useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { useState } from 'react';
import {
  Code,
  Zap,
  Target,
  Headphones,
  Database,
  Shield,
} from 'lucide-react';

const services = [
  {
    icon: Code,
    title: 'WordPress Development',
    description:
      'Complete WordPress site management including custom theme customization, responsive design implementation, and plugin configuration for optimal functionality.',
    gradient: 'from-teal-500 to-cyan-500',
  },
  {
    icon: Zap,
    title: 'Website Speed Optimization',
    description:
      'Performance tuning with advanced caching strategies, image optimization, code minification, and server-side improvements for lightning-fast load times.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Target,
    title: 'B2B Lead Generation',
    description:
      'Targeted prospect list building, company research, decision-maker identification, and verified contact information for your outreach campaigns.',
    gradient: 'from-cyan-500 to-teal-500',
  },
  {
    icon: Headphones,
    title: 'Virtual Assistant',
    description:
      'Comprehensive admin support including email management, calendar scheduling, data entry, CRM management, and daily operational tasks.',
    gradient: 'from-teal-500 to-emerald-500',
  },
  {
    icon: Database,
    title: 'Data Entry & Research',
    description:
      'Accurate web research, data scraping, LinkedIn contact extraction, email hunting, and organized data compilation in your preferred format.',
    gradient: 'from-emerald-500 to-cyan-500',
  },
  {
    icon: Shield,
    title: 'WordPress Maintenance',
    description:
      'Regular updates, security monitoring, automated backups, malware scanning, uptime monitoring, and performance checks for peace of mind.',
    gradient: 'from-cyan-500 to-teal-500',
  },
];

function TiltCard({
  service,
  index,
  isInView,
}: {
  service: (typeof services)[0];
  index: number;
  isInView: boolean;
}) {
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  const [shinePosition, setShinePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`);
    setShinePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)');
    setShinePosition({ x: 50, y: 50 });
  }, []);

  return (
    <motion.div
      key={service.title}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      className="glass-card service-card-enhanced rounded-2xl p-6 sm:p-8 group cursor-pointer relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: 'transform 0.15s ease-out',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Gradient shine that follows mouse */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
        style={{
          background: `radial-gradient(circle at ${shinePosition.x}% ${shinePosition.y}%, rgba(6, 182, 212, 0.08) 0%, transparent 60%)`,
        }}
      />

      {/* Icon */}
      <div
        className={`service-icon-glow w-14 h-14 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
        style={{ transform: 'translateZ(20px)' }}
      >
        <service.icon className="w-7 h-7 text-white" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-teal-300 transition-colors">
        {service.title}
      </h3>

      {/* Description */}
      <p className="text-slate-400 text-sm leading-relaxed">
        {service.description}
      </p>

      {/* Bottom accent */}
      <div className="mt-6 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500" />
    </motion.div>
  );
}

export default function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="services" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dots opacity-20" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-teal-400 text-sm font-medium uppercase tracking-widest">
            What I Offer
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3">
            My <span className="gradient-text">Services</span>
          </h2>
          <span className="section-heading-line" />
          <p className="text-slate-400 mt-6 max-w-2xl mx-auto">
            Delivering professional solutions to help businesses grow their online
            presence and streamline operations.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <TiltCard
              key={service.title}
              service={service}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
