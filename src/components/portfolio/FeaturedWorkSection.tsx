'use client';

import { useRef, useCallback, useState } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight,
  ExternalLink,
  ShoppingCart,
  Heart,
  Building2,
  UtensilsCrossed,
  GraduationCap,
  Dumbbell,
  Plane,
  Scale,
  Cpu,
  Sun,
  Shirt,
  PawPrint,
} from 'lucide-react';

interface FeaturedWorkSectionProps {
  onNavigate?: (page: string) => void;
}

const featuredProjects = [
  {
    title: 'ShopEase WooCommerce Store',
    tag: 'eCommerce',
    description:
      'Full WooCommerce build with 5,000+ products, custom checkout flow, and 95+ PageSpeed score. Generated $2M+ in annual revenue.',
    image: '/featured-ecommerce.png',
    icon: ShoppingCart,
    accent: 'from-teal-500 to-cyan-500',
  },
  {
    title: 'MedCare Health Portal',
    tag: 'Healthcare',
    description:
      'HIPAA-compliant patient portal with appointment booking, telemedicine integration, and medical records management.',
    image: '/featured-healthcare.png',
    icon: Heart,
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    title: 'PropTech Real Estate',
    tag: 'Real Estate',
    description:
      'Property listing platform with MLS/IDX integration, virtual tours, and mortgage calculator. 300% increase in leads.',
    image: '/featured-realestate.png',
    icon: Building2,
    accent: 'from-cyan-500 to-emerald-500',
  },
  {
    title: 'FreshBite Restaurant',
    tag: 'Restaurant',
    description:
      'Online ordering system with real-time menu, table reservations, and delivery tracking. 45% increase in online orders.',
    image: '/featured-restaurant.png',
    icon: UtensilsCrossed,
    accent: 'from-teal-500 to-emerald-500',
  },
  {
    title: 'EduLearn Academy',
    tag: 'Education',
    description:
      'Learning management system with video courses, quizzes, certificates, and student progress tracking for 10,000+ students.',
    image: '/featured-education.png',
    icon: GraduationCap,
    accent: 'from-emerald-500 to-cyan-500',
  },
  {
    title: 'FitLife Gym & Fitness',
    tag: 'Fitness',
    description:
      'Fitness center website with class scheduling, membership management, trainer profiles, and workout tracking integration.',
    image: '/featured-fitness.png',
    icon: Dumbbell,
    accent: 'from-cyan-500 to-teal-500',
  },
  {
    title: 'TravelVista Agency',
    tag: 'Travel',
    description:
      'Travel booking platform with destination guides, hotel search, itinerary builder, and real-time availability checker.',
    image: '/featured-travel.png',
    icon: Plane,
    accent: 'from-teal-500 to-cyan-500',
  },
  {
    title: 'LegalEdge Law Firm',
    tag: 'Legal',
    description:
      'Professional law firm website with attorney profiles, practice areas, case results, and online consultation booking.',
    image: '/featured-legal.png',
    icon: Scale,
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    title: 'TechStart SaaS Hub',
    tag: 'SaaS',
    description:
      'Startup landing page with feature showcases, pricing tables, API documentation, and analytics dashboard integration.',
    image: '/featured-startup.png',
    icon: Cpu,
    accent: 'from-cyan-500 to-emerald-500',
  },
  {
    title: 'GreenSolar Energy',
    tag: 'Energy',
    description:
      'Solar energy company website with energy calculator, service area map, project gallery, and quote request system.',
    image: '/featured-energy.png',
    icon: Sun,
    accent: 'from-teal-500 to-emerald-500',
  },
  {
    title: 'FashionNova Boutique',
    tag: 'Fashion',
    description:
      'Luxury fashion online store with lookbook gallery, size guide, wishlist, and seamless checkout experience.',
    image: '/featured-fashion.png',
    icon: Shirt,
    accent: 'from-emerald-500 to-cyan-500',
  },
  {
    title: 'PetCare Veterinary Clinic',
    tag: 'Veterinary',
    description:
      'Veterinary clinic website with appointment booking, pet health records, service catalog, and emergency contact system.',
    image: '/featured-veterinary.png',
    icon: PawPrint,
    accent: 'from-cyan-500 to-teal-500',
  },
];

function FeaturedCard({
  project,
  index,
  isInView,
}: {
  project: (typeof featuredProjects)[0];
  index: number;
  isInView: boolean;
}) {
  const [shinePosition, setShinePosition] = useState({ x: 50, y: 50 });
  const [imgLoaded, setImgLoaded] = useState(false);
  const IconComp = project.icon;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setShinePosition({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
      });

      card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    },
    [],
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setShinePosition({ x: 50, y: 50 });
      e.currentTarget.style.setProperty('--mouse-x', '50%');
      e.currentTarget.style.setProperty('--mouse-y', '50%');
    },
    [],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.08 + index * 0.06 }}
      className="glass-card card-spotlight rounded-2xl overflow-hidden group cursor-pointer hover-glow transition-transform duration-300 hover:-translate-y-1 relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Spotlight radial glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl z-10"
        style={{
          background: `radial-gradient(circle at ${shinePosition.x}% ${shinePosition.y}%, rgba(6, 182, 212, 0.07) 0%, transparent 60%)`,
        }}
      />

      {/* Image Area */}
      <div className="relative h-44 sm:h-52 lg:h-56 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
        {/* AI-generated image */}
        <Image
          src={project.image}
          alt={project.title}
          fill
          className={`object-cover transition-all duration-700 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onLoad={() => setImgLoaded(true)}
        />

        {/* Fallback: illustration icon while image loads */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${imgLoaded ? 'opacity-0' : 'opacity-100'}`}
        >
          <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${project.accent} flex items-center justify-center shadow-xl opacity-30`}>
            <IconComp className="w-8 h-8 sm:w-10 sm:h-10 text-white" strokeWidth={1.5} />
          </div>
        </div>

        {/* Tag Badge */}
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10">
          <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-medium px-2.5 sm:px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-teal-300 border border-white/10">
            <IconComp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            {project.tag}
          </span>
        </div>

        {/* External link icon on hover */}
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10">
            <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/80" />
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0a1628] to-transparent" />
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 lg:p-6">
        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white group-hover:text-teal-300 transition-colors duration-300 line-clamp-1">
          {project.title}
        </h3>
        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mt-2 line-clamp-2">
          {project.description}
        </p>

        {/* View Details Link */}
        <div className="mt-3 sm:mt-4 flex items-center gap-1.5 text-teal-400 hover:text-teal-300 transition-colors duration-200 group/link cursor-pointer">
          <span className="text-xs sm:text-sm font-medium">View Details</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/link:translate-x-0.5 transition-transform duration-200" />
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </motion.div>
  );
}

export default function FeaturedWorkSection({ onNavigate }: FeaturedWorkSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="featured-work" className="relative py-16 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dots opacity-20" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/[0.03] rounded-full blur-3xl" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="text-teal-400 text-sm font-medium uppercase tracking-widest">
            Portfolio
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <span className="section-heading-line" />
          <p className="text-slate-400 mt-6 max-w-2xl mx-auto">
            A selection of my best recent work across diverse industries
          </p>
        </motion.div>

        {/* Featured Cards Grid — 1 col mobile, 2 col sm/md, 3 col lg, 4 col xl */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-6">
          {featuredProjects.map((project, index) => (
            <FeaturedCard
              key={project.title}
              project={project}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex justify-center mt-10 sm:mt-16"
        >
          <button
            onClick={() => onNavigate?.('portfolio')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-teal-400 border border-teal-500/30 hover:border-teal-400/60 hover:bg-teal-500/10 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
          >
            View Full Portfolio
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
