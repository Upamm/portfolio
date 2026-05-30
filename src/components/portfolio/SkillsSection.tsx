'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const skills = [
  { name: 'WordPress', percentage: 95, color: 'from-teal-500 to-cyan-500' },
  { name: 'Theme Customization', percentage: 90, color: 'from-cyan-500 to-teal-500' },
  { name: 'Plugin Development', percentage: 85, color: 'from-emerald-500 to-teal-500' },
  { name: 'SEO Optimization', percentage: 88, color: 'from-teal-500 to-emerald-500' },
  { name: 'Speed Optimization', percentage: 92, color: 'from-cyan-500 to-emerald-500' },
  { name: 'B2B Lead Generation', percentage: 90, color: 'from-emerald-500 to-cyan-500' },
  { name: 'Data Research', percentage: 95, color: 'from-teal-400 to-cyan-400' },
  { name: 'Virtual Assistance', percentage: 93, color: 'from-cyan-400 to-teal-400' },
];

const tools = [
  'WordPress',
  'WooCommerce',
  'Elementor',
  'Yoast SEO',
  'Astra',
  'Divi',
  'Contact Form 7',
  'WP Rocket',
  'Rank Math',
  'Mailchimp',
  'HubSpot',
  'LinkedIn Sales Nav',
  'Google Analytics',
  'Upwork',
  'Fiverr',
  'Zapier',
];

function ProgressBar({
  skill,
  index,
  isInView,
}: {
  skill: (typeof skills)[0];
  index: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
          {skill.name}
        </span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 + index * 0.08 }}
          className="text-sm font-semibold text-teal-400"
        >
          {skill.percentage}%
        </motion.span>
      </div>
      <div className="h-2.5 rounded-full bg-slate-700/50 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${skill.percentage}%` } : {}}
          transition={{ duration: 1, delay: 0.3 + index * 0.08, ease: 'easeOut' }}
          className={`h-full rounded-full bg-gradient-to-r ${skill.color} relative`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0" />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function SkillsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="skills" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dots opacity-15" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="absolute bottom-1/3 left-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-teal-400 text-sm font-medium uppercase tracking-widest">
            What I Know
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3">
            Skills & <span className="gradient-text">Expertise</span>
          </h2>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
            Continuously honing my craft across a wide range of digital skills
            and tools.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Progress Bars */}
          <div className="space-y-5">
            {skills.map((skill, index) => (
              <ProgressBar
                key={skill.name}
                skill={skill}
                index={index}
                isInView={isInView}
              />
            ))}
          </div>

          {/* Tools & Technologies */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h3 className="text-xl font-bold text-white mb-6">
              Tools & Technologies
            </h3>
            <div className="flex flex-wrap gap-3">
              {tools.map((tool, index) => (
                <motion.span
                  key={tool}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.03 }}
                  className="px-4 py-2.5 rounded-xl glass-card text-sm font-medium text-slate-300 hover:text-teal-300 hover:border-teal-500/30 cursor-default transition-all duration-300"
                >
                  {tool}
                </motion.span>
              ))}
            </div>

            {/* Additional info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-10 glass-card rounded-2xl p-6 sm:p-8"
            >
              <h4 className="text-lg font-bold text-white mb-3">
                Why Choose Me?
              </h4>
              <ul className="space-y-3">
                {[
                  '8+ years of hands-on WordPress experience',
                  '4.8/5 rating across 847+ completed projects',
                  'Quick turnaround with no compromise on quality',
                  'Clear communication and regular progress updates',
                  'Post-project support and maintenance available',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
