'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Award,
  Shield,
  Code,
  Zap,
  FolderCheck,
  Globe,
} from 'lucide-react';

const certifications = [
  {
    icon: Award,
    title: 'Fiverr Level 2 Seller',
    description:
      'Fiverr platform badge, earned through consistent 5-star reviews and high volume.',
    gradientFrom: 'from-cyan-500',
    gradientTo: 'to-emerald-500',
  },
  {
    icon: Shield,
    title: 'Top Rated Plus',
    description:
      'Fiverr achievement, recognizing top-tier freelancers.',
    gradientFrom: 'from-teal-400',
    gradientTo: 'to-cyan-500',
  },
  {
    icon: Code,
    title: 'WordPress Expert',
    description:
      '8+ years of WordPress development and customization.',
    gradientFrom: 'from-emerald-400',
    gradientTo: 'to-teal-500',
  },
  {
    icon: Zap,
    title: 'Speed Optimization Certified',
    description:
      'Specialized in WordPress performance tuning (90+ PageSpeed scores).',
    gradientFrom: 'from-cyan-400',
    gradientTo: 'to-teal-500',
  },
  {
    icon: FolderCheck,
    title: '500+ Projects Delivered',
    description:
      'Milestone achievement across web development, lead gen, and VA services.',
    gradientFrom: 'from-emerald-500',
    gradientTo: 'to-cyan-400',
  },
  {
    icon: Globe,
    title: '847+ Happy Clients',
    description:
      'Client satisfaction across 50+ countries worldwide.',
    gradientFrom: 'from-teal-500',
    gradientTo: 'to-emerald-400',
  },
];

const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty(
    '--mouse-x',
    `${((e.clientX - rect.left) / rect.width) * 100}%`
  );
  e.currentTarget.style.setProperty(
    '--mouse-y',
    `${((e.clientY - rect.top) / rect.height) * 100}%`
  );
};

export default function CertificationsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      id="certifications"
      ref={sectionRef}
      className="relative py-16 sm:py-32 overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 bg-dots opacity-30" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-teal-500/10 to-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="text-teal-400 text-sm font-medium uppercase tracking-widest">
            Recognition
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3">
            Certifications &amp; <span className="gradient-text">Awards</span>
          </h2>
          <span className="section-heading-line" />
          <p className="text-slate-400 mt-6 max-w-2xl mx-auto">
            Recognized achievements and milestones throughout my career
          </p>
        </motion.div>

        {/* Certifications grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {certifications.map((cert, index) => {
            const Icon = cert.icon;

            return (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: 0.1 * index,
                  ease: 'easeOut',
                }}
                onMouseMove={handleMouseMove}
                className="group relative glass-card rounded-2xl p-6 sm:p-8 card-spotlight hover-glow flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-1"
              >
                {/* Icon container */}
                <div
                  className={`
                    mb-5 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full
                    bg-gradient-to-br ${cert.gradientFrom} ${cert.gradientTo}
                    shadow-lg transition-transform duration-300 group-hover:scale-110
                  `}
                >
                  <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-white" strokeWidth={1.8} />
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2 group-hover:text-cyan-300 transition-colors duration-300">
                  {cert.title}
                </h3>

                {/* Description */}
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                  {cert.description}
                </p>

                {/* Animated bottom accent bar */}
                <div className="absolute bottom-0 left-0 right-0 h-[3px] rounded-b-2xl overflow-hidden">
                  <div
                    className={`
                      h-full bg-gradient-to-r ${cert.gradientFrom} ${cert.gradientTo}
                      transform scale-x-0 origin-left transition-transform duration-500
                      group-hover:scale-x-100
                    `}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
