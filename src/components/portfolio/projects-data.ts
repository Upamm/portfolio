import {
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
  Target,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface Project {
  id: string;
  title: string;
  category: 'WordPress' | 'E-Commerce' | 'Lead Gen' | 'Design' | 'Healthcare' | 'Education' | 'Real Estate';
  description: string;
  fullDescription: string;
  image: string;
  gradient: string;
  icon: LucideIcon;
  tags: string[];
}

export const allProjects: Project[] = [
  {
    id: 'ecommerce',
    title: 'ShopEase WooCommerce Store',
    category: 'E-Commerce',
    description: 'Full-featured WooCommerce store with 5,000+ products, custom checkout, and 95+ PageSpeed score.',
    fullDescription: 'Built a complete e-commerce platform using WooCommerce with secure payment gateway integration, inventory management, order tracking, and a responsive design. Generated $2M+ in annual revenue for the client with a 35% increase in online sales.',
    image: '/featured-ecommerce.png',
    gradient: 'from-teal-600 to-cyan-600',
    icon: ShoppingCart,
    tags: ['WooCommerce', 'Elementor', 'Payment Gateway'],
  },
  {
    id: 'healthcare',
    title: 'MedCare Health Portal',
    category: 'Healthcare',
    description: 'HIPAA-compliant patient portal with appointment booking and telemedicine integration.',
    fullDescription: 'Developed a healthcare website for a medical practice featuring online appointment booking, patient portal, telemedicine integration, doctor profiles, service listings, and HIPAA-compliant contact forms.',
    image: '/featured-healthcare.png',
    gradient: 'from-emerald-600 to-teal-600',
    icon: Heart,
    tags: ['Healthcare', 'Booking', 'HIPAA'],
  },
  {
    id: 'realestate',
    title: 'PropTech Real Estate Portal',
    category: 'Real Estate',
    description: 'Property listing platform with MLS/IDX integration, virtual tours, and mortgage calculator.',
    fullDescription: 'Created a comprehensive real estate portal with advanced property search, map integration, virtual tours, agent management system, MLS/IDX integration, and lead capture forms. 300% increase in leads generated.',
    image: '/featured-realestate.png',
    gradient: 'from-cyan-600 to-teal-600',
    icon: Building2,
    tags: ['WP Residence', 'Maps API', 'MLS'],
  },
  {
    id: 'restaurant',
    title: 'FreshBite Restaurant',
    category: 'E-Commerce',
    description: 'Restaurant website with online ordering system, delivery tracking, and table reservations.',
    fullDescription: 'Built a restaurant website with full online ordering system, menu management, delivery tracking integration, table reservation system, and customer loyalty program. 45% increase in online orders.',
    image: '/featured-restaurant.png',
    gradient: 'from-emerald-500 to-cyan-500',
    icon: UtensilsCrossed,
    tags: ['Food Delivery', 'WooCommerce', 'Reservations'],
  },
  {
    id: 'education',
    title: 'EduLearn Academy',
    category: 'Education',
    description: 'Learning management system with video courses, quizzes, certificates, and 10,000+ students.',
    fullDescription: 'Built an online learning platform with video courses, interactive quizzes, completion certificates, student progress tracking, and instructor dashboards. Serving 10,000+ active students.',
    image: '/featured-education.png',
    gradient: 'from-teal-500 to-emerald-500',
    icon: GraduationCap,
    tags: ['LMS', 'LearnDash', 'Video Courses'],
  },
  {
    id: 'fitness',
    title: 'FitLife Gym & Fitness',
    category: 'Design',
    description: 'Fitness center website with class scheduling, membership management, and trainer profiles.',
    fullDescription: 'Designed and developed a modern fitness center website with class scheduling system, membership management portal, personal trainer profiles, workout tracking integration, and mobile-responsive layout.',
    image: '/featured-fitness.png',
    gradient: 'from-cyan-500 to-teal-500',
    icon: Dumbbell,
    tags: ['Custom Theme', 'Booking System', 'Responsive'],
  },
  {
    id: 'travel',
    title: 'TravelVista Agency',
    category: 'WordPress',
    description: 'Travel booking platform with destination guides, hotel search, and itinerary builder.',
    fullDescription: 'Created a travel agency website with destination guide library, hotel search engine, itinerary builder tool, real-time availability checking, and integrated booking management system.',
    image: '/featured-travel.png',
    gradient: 'from-teal-500 to-cyan-500',
    icon: Plane,
    tags: ['Custom Theme', 'Booking API', 'Maps'],
  },
  {
    id: 'legal',
    title: 'LegalEdge Law Firm',
    category: 'WordPress',
    description: 'Professional law firm website with attorney profiles, practice areas, and case results.',
    fullDescription: 'Built a professional law firm website featuring attorney profile pages, detailed practice area descriptions, case results showcase, online consultation booking, and client testimonial section.',
    image: '/featured-legal.png',
    gradient: 'from-emerald-500 to-teal-500',
    icon: Scale,
    tags: ['Custom Theme', 'Astra', 'SEO'],
  },
  {
    id: 'startup',
    title: 'TechStart SaaS Hub',
    category: 'Design',
    description: 'Startup landing page with feature showcases, pricing tables, and analytics dashboard.',
    fullDescription: 'Designed a high-converting SaaS startup landing page with animated feature showcases, interactive pricing tables, API documentation section, analytics dashboard preview, and lead capture funnel.',
    image: '/featured-startup.png',
    gradient: 'from-cyan-500 to-emerald-500',
    icon: Cpu,
    tags: ['Landing Page', 'Astra', 'Animations'],
  },
  {
    id: 'energy',
    title: 'GreenSolar Energy',
    category: 'WordPress',
    description: 'Solar energy company website with energy calculator, service area map, and quote request system.',
    fullDescription: 'Created a solar energy company website with interactive energy savings calculator, service area coverage map, project photo gallery, customer testimonial carousel, and automated quote request system.',
    image: '/featured-energy.png',
    gradient: 'from-teal-500 to-emerald-500',
    icon: Sun,
    tags: ['Custom Theme', 'Calculator', 'Maps'],
  },
  {
    id: 'fashion',
    title: 'FashionNova Boutique',
    category: 'E-Commerce',
    description: 'Luxury fashion online store with lookbook gallery, wishlist, and seamless checkout.',
    fullDescription: 'Built a luxury fashion e-commerce store with seasonal lookbook gallery, advanced wishlist system, size guide integration, product zoom features, and seamless multi-step checkout experience.',
    image: '/featured-fashion.png',
    gradient: 'from-emerald-500 to-cyan-500',
    icon: Shirt,
    tags: ['WooCommerce', 'Product Gallery', 'UX'],
  },
  {
    id: 'leadgen',
    title: 'B2B Lead Generation Campaign',
    category: 'Lead Gen',
    description: 'Comprehensive lead research campaign delivering 5,000+ verified decision-maker contacts.',
    fullDescription: 'Executed a large-scale B2B lead generation campaign delivering 5,000+ verified contacts across multiple industries with decision-maker contacts, company profiles, verified email addresses, and CRM integration.',
    image: '/featured-veterinary.png',
    gradient: 'from-cyan-500 to-teal-500',
    icon: Target,
    tags: ['Data Research', 'LinkedIn', 'CRM'],
  },
];

/** First 4 projects shown on the homepage */
export const homeFeaturedProjects = allProjects.slice(0, 4);

/** All unique categories */
export const projectCategories = ['All', ...Array.from(new Set(allProjects.map((p) => p.category)))];
