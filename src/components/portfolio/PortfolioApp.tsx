'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';

// Lazy-loaded page sections
const HeroSection = dynamic(() => import('./HeroSection'), { ssr: false });
const MarqueeBar = dynamic(() => import('./MarqueeBar'), { ssr: false });
const AboutSection = dynamic(() => import('./AboutSection'), { ssr: false });
const ExperienceSection = dynamic(() => import('./ExperienceSection'), { ssr: false });
const ServicesSection = dynamic(() => import('./ServicesSection'), { ssr: false });
const ProcessSection = dynamic(() => import('./ProcessSection'), { ssr: false });
const PortfolioSection = dynamic(() => import('./PortfolioSection'), { ssr: false });
const ToolsGrid = dynamic(() => import('./ToolsGrid'), { ssr: false });
const ValuesSection = dynamic(() => import('./ValuesSection'), { ssr: false });
const PricingSection = dynamic(() => import('./PricingSection'), { ssr: false });
const SkillsSection = dynamic(() => import('./SkillsSection'), { ssr: false });
const StatsBanner = dynamic(() => import('./StatsBanner'), { ssr: false });
const ClientsSection = dynamic(() => import('./ClientsSection'), { ssr: false });
const TestimonialsSection = dynamic(() => import('./TestimonialsSection'), { ssr: false });
const CertificationsSection = dynamic(() => import('./CertificationsSection'), { ssr: false });
const BlogSection = dynamic(() => import('./BlogSection'), { ssr: false });
const FAQSection = dynamic(() => import('./FAQSection'), { ssr: false });
const ContactSection = dynamic(() => import('./ContactSection'), { ssr: false });

// Global components (always loaded)
import FloatingHireFAB from './FloatingHireFAB';
import WhatsAppFAB from './WhatsAppFAB';
import ScrollProgress from './ScrollProgress';
import ScrollToTop from './ScrollToTop';
import CookieConsent from './CookieConsent';

export type PageKey = 'home' | 'about' | 'services' | 'portfolio' | 'pricing' | 'blog' | 'faq' | 'contact';

const pageList: PageKey[] = ['home', 'about', 'services', 'portfolio', 'pricing', 'blog', 'faq', 'contact'];

// Loading spinner for lazy-loaded pages
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-3 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
    </div>
  );
}

function HomePage() {
  return (
    <>
      <HeroSection />
      <MarqueeBar />
      <StatsBanner />
      <ClientsSection />
      <TestimonialsSection />
      <CertificationsSection />
    </>
  );
}

function AboutPage() {
  return (
    <>
      <AboutSection />
      <ExperienceSection />
      <ValuesSection />
    </>
  );
}

function ServicesPage() {
  return (
    <>
      <ServicesSection />
      <ProcessSection />
      <SkillsSection />
      <ToolsGrid />
    </>
  );
}

function PortfolioPage() {
  return <PortfolioSection />;
}

function PricingPage() {
  return <PricingSection />;
}

function BlogPage() {
  return <BlogSection />;
}

function FAQPage() {
  return <FAQSection />;
}

function ContactPage() {
  return <ContactSection />;
}

const pages: Record<PageKey, () => React.ReactNode> = {
  home: HomePage,
  about: AboutPage,
  services: ServicesPage,
  portfolio: PortfolioPage,
  pricing: PricingPage,
  blog: BlogPage,
  faq: FAQPage,
  contact: ContactPage,
};

export default function PortfolioApp() {
  const [currentPage, setCurrentPage] = useState<PageKey>('home');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Hash-based routing
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') as PageKey;
      if (pageList.includes(hash)) {
        setCurrentPage(hash);
      }
    };

    // Initial check
    if (window.location.hash) {
      handleHash();
    }

    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Navigate function
  const navigateTo = useCallback((page: PageKey) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(page);
      window.location.hash = page;
      window.scrollTo({ top: 0, behavior: 'instant' });
      setIsTransitioning(false);
    }, 150);
  }, []);

  // Expose navigateTo globally for Navbar/Footer
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__navigateTo = navigateTo;
    return () => {
      delete (window as unknown as Record<string, unknown>).__navigateTo;
    };
  }, [navigateTo]);

  const PageComponent = pages[currentPage];

  return (
    <>
      <Navbar currentPage={currentPage} onNavigate={navigateTo} />
      <ScrollProgress />

      <main className="min-h-screen flex flex-col">
        <AnimatePresence mode="wait">
          {!isTransitioning && (
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="flex-1"
            >
              <Suspense fallback={<PageLoader />}>
                <PageComponent />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer onNavigate={navigateTo} />
      <FloatingHireFAB />
      <WhatsAppFAB />
      <ScrollToTop />
      <CookieConsent />
    </>
  );
}
