'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Rocket, Award, TrendingUp, Trophy, Target } from 'lucide-react';

const milestones = [
  {
    year: '2016',
    title: 'Started Freelancing',
    description: 'Began my WordPress career on Fiverr, building websites and learning the craft of web development.',
    icon: Rocket,
    gradient: 'from-teal-500 to-cyan-500',
  },
  {
    year: '2018',
    title: 'First 100 Projects',
    description: 'Achieved 100 completed projects milestone, building expertise across WordPress, WooCommerce, and lead generation.',
    icon: Award,
    gradient: 'from-cyan-500 to-teal-500',
  },
  {
    year: '2020',
    title: 'Level 2 Seller',
    description: 'Reached Fiverr Level 2 status, recognized for exceptional client satisfaction and consistent delivery quality.',
    icon: TrendingUp,
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    year: '2022',
    title: '500+ Projects',
    description: 'Crossed 500 successful projects, expanding services to include B2B lead generation and virtual assistance.',
    icon: Trophy,
    gradient: 'from-teal-500 to-emerald-500',
  },
  {
    year: '2024',
    title: 'B2B Lead Generation',
    description: 'Expanded to comprehensive lead generation services, helping businesses find qualified prospects and grow their sales pipeline.',
    icon: Target,
    gradient: 'from-emerald-500 to-cyan-500',
  },
];

export default function ExperienceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="experience" className="relative py-16 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dots opacity-15" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl" />

      <div ref={ref} className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="text-teal-400 text-sm font-medium uppercase tracking-widest">
            My Journey
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3">
            Work <span className="gradient-text">Experience</span>
          </h2>
          <span className="section-heading-line" />
          <p className="text-slate-400 mt-6 max-w-2xl mx-auto">
            A timeline of key milestones in my freelancing career, from starting out to becoming an established WordPress VA and lead generation expert.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical connecting line */}
          <div className="absolute left-6 sm:left-1/2 sm:-translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-teal-500/30 via-teal-500/50 to-emerald-500/30" />

          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 * index }}
                className={`relative flex items-start gap-6 sm:gap-0 ${
                  index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-6 sm:left-1/2 sm:-translate-x-1/2 z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{
                      duration: 0.4,
                      delay: 0.2 + index * 0.15,
                      type: 'spring',
                      stiffness: 200,
                    }}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/20"
                  >
                    <milestone.icon className="w-5 h-5 text-white" />
                  </motion.div>
                </div>

                {/* Content card - Left side (even) */}
                <div className={`ml-20 sm:ml-0 sm:w-[calc(50%-40px)] ${index % 2 === 0 ? 'sm:text-right sm:pr-0' : 'sm:text-left sm:pl-0 sm:ml-auto'}`}>
                  <motion.div
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
                    className="glass-card rounded-xl p-5 sm:p-6 group hover-glow"
                  >
                    {/* Year badge */}
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${milestone.gradient} text-white mb-3`}>
                      {milestone.year}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-teal-300 transition-colors">
                      {milestone.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {milestone.description}
                    </p>
                  </motion.div>
                </div>

                {/* Spacer for the other side */}
                <div className="hidden sm:block sm:w-[calc(50%-40px)]" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
