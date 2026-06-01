'use client';

import { useState, useEffect, useCallback, useRef, Suspense, useTransition, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import { getCookie, setCookie, COOKIES } from '@/lib/cookies';

// Lazy-loaded page sections
const HeroSection = dynamic(() => import('./HeroSection'), { ssr: false });
const MarqueeBar = dynamic(() => import('./MarqueeBar'), { ssr: false });
const AboutSection = dynamic(() => import('./AboutSection'), { ssr: false });
const ExperienceSection = dynamic(() => import('./ExperienceSection'), { ssr: false });
const ServicesSection = dynamic(() => import('./ServicesSection'), { ssr: false });
const ProcessSection = dynamic(() => import('./ProcessSection'), { ssr: false });
const PortfolioSection = dynamic(() => import('./PortfolioSection'), { ssr: false });
const ValuesSection = dynamic(() => import('./ValuesSection'), { ssr: false });
const PricingSection = dynamic(() => import('./PricingSection'), { ssr: false });
const SkillsSection = dynamic(() => import('./SkillsSection'), { ssr: false });
const StatsBanner = dynamic(() => import('./StatsBanner'), { ssr: false });
const ClientsSection = dynamic(() => import('./ClientsSection'), { ssr: false });
const TestimonialsSection = dynamic(() => import('./TestimonialsSection'), { ssr: false });
const CertificationsSection = dynamic(() => import('./CertificationsSection'), { ssr: false });
const IndustriesServedSection = dynamic(() => import('./IndustriesServedSection'), { ssr: false });
const FeaturedWorkSection = dynamic(() => import('./FeaturedWorkSection'), { ssr: false });
const WorkWithMeSection = dynamic(() => import('./WorkWithMeSection'), { ssr: false });
const BlogSection = dynamic(() => import('./BlogSection'), { ssr: false });
const FAQSection = dynamic(() => import('./FAQSection'), { ssr: false });
const ContactSection = dynamic(() => import('./ContactSection'), { ssr: false });

// Global components (always loaded)
import CookieConsent from './CookieConsent';
import ScrollToTop from './ScrollToTop';

// Portal is loaded dynamically (only when accessed)
const ClientPortal = dynamic(() => import('./ClientPortal'), { ssr: false });

export type PageKey = 'home' | 'about' | 'services' | 'portfolio' | 'pricing' | 'blog' | 'faq' | 'contact' | 'portal';

const pageList: PageKey[] = ['home', 'about', 'services', 'portfolio', 'pricing', 'blog', 'faq', 'contact', 'portal'];

// Loading spinner for lazy-loaded pages
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-3 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
    </div>
  );
}

function HomePage({ onNavigate }: { onNavigate: (page: PageKey) => void }) {
  return (
    <>
      <HeroSection />
      <MarqueeBar />
      <StatsBanner />
      <ClientsSection />
      <IndustriesServedSection />
      <FeaturedWorkSection onNavigate={onNavigate} />
      <TestimonialsSection />
      <CertificationsSection />
      <WorkWithMeSection />
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

function PortalPage({ onNavigate }: { onNavigate: (page: PageKey) => void }) {
  return <ClientPortal onBack={() => onNavigate('home')} />;
}

const getPages = (onNavigate: (page: PageKey) => void): Record<PageKey, () => React.ReactNode> => ({
  home: () => <HomePage onNavigate={onNavigate} />,
  about: () => <AboutPage />,
  services: () => <ServicesPage />,
  portfolio: () => <PortfolioPage />,
  pricing: () => <PricingPage />,
  blog: () => <BlogPage />,
  faq: () => <FAQPage />,
  contact: () => <ContactPage />,
  portal: () => <PortalPage onNavigate={onNavigate} />,
});

export default function PortfolioApp() {
  // Default to home; cookie/hash sync happens in useEffect on mount
  const [currentPage, setCurrentPage] = useState<PageKey>('home');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPending, startTransition] = useTransition();
  const navTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Restore last visited page from cookie or URL hash on mount (avoids hydration mismatch)
  useEffect(() => {
    const saved = getCookie(COOKIES.LAST_PAGE);
    if (saved && pageList.includes(saved as PageKey)) {
      setCurrentPage(saved as PageKey);
      return;
    }
    const hash = window.location.hash.replace('#', '');
    if (hash && pageList.includes(hash as PageKey)) {
      setCurrentPage(hash as PageKey);
    }
  }, []);

  // Save current page to cookie on change (persists across reloads)
  useEffect(() => {
    setCookie(COOKIES.LAST_PAGE, currentPage);
  }, [currentPage]);

  // Preload all page chunks after initial mount for fast navigation
  useEffect(() => {
    const preloadTimer = setTimeout(() => {
      // Eagerly trigger dynamic imports so chunks are cached in memory
      // This makes subsequent navigation instant since chunks are already loaded
      void import('./AboutSection');
      void import('./ExperienceSection');
      void import('./ServicesSection');
      void import('./ProcessSection');
      void import('./PortfolioSection');
      void import('./ValuesSection');
      void import('./PricingSection');
      void import('./SkillsSection');
      void import('./StatsBanner');
      void import('./ClientsSection');
      void import('./TestimonialsSection');
      void import('./CertificationsSection');
      void import('./IndustriesServedSection');
      void import('./FeaturedWorkSection');
      void import('./WorkWithMeSection');
      void import('./BlogSection');
      void import('./FAQSection');
      void import('./ContactSection');
      void import('./HeroSection');
      void import('./MarqueeBar');
    }, 2000); // Wait 2s after initial page load to avoid blocking
    return () => clearTimeout(preloadTimer);
  }, []);

  // Hash-based routing
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') as PageKey;
      if (pageList.includes(hash)) {
        startTransition(() => {
          setCurrentPage(hash);
        });
      }
    };

    // Sync initial hash — read it OR write it
    const existingHash = window.location.hash.replace('#', '') as PageKey;
    if (existingHash && pageList.includes(existingHash)) {
      setCurrentPage(existingHash);
    } else if (!window.location.hash) {
      window.location.hash = currentPage;
    }

    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Navigate function with optimized transition
  const navigateTo = useCallback((page: PageKey) => {
    if (page === currentPage) return; // Skip if already on this page

    setIsTransitioning(true);
    // Reduced transition delay for snappier feel
    navTimeoutRef.current = setTimeout(() => {
      startTransition(() => {
        setCurrentPage(page);
        window.location.hash = page;
        window.scrollTo({ top: 0, behavior: 'instant' });
      });
      setIsTransitioning(false);
    }, 80); // Reduced from 150ms for faster feel
  }, [currentPage]);

  // Cleanup nav timeout on unmount
  useEffect(() => {
    return () => {
      if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
    };
  }, []);

  // Expose navigateTo globally for Navbar/Footer
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__navigateTo = navigateTo;
    return () => {
      delete (window as unknown as Record<string, unknown>).__navigateTo;
    };
  }, [navigateTo]);

  const pages = useMemo(() => getPages(navigateTo), [navigateTo]);
  const PageComponent = pages[currentPage];

  // Portal page has its own full layout (sidebar, header), no navbar/footer needed
  const isPortal = currentPage === 'portal';

  return (
    <>
      {!isPortal && <Navbar currentPage={currentPage} onNavigate={navigateTo} />}

      <main className="min-h-screen flex flex-col">
        <AnimatePresence mode="wait">
          {!isTransitioning && (
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className={isPortal ? '' : 'flex-1'}
            >
              <Suspense fallback={<PageLoader />}>
                <PageComponent />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {!isPortal && <Footer onNavigate={navigateTo} />}
      <ScrollToTop />
      <CookieConsent />
    </>
  );
}
