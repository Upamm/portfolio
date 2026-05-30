import Navbar from '@/components/portfolio/Navbar';
import HeroSection from '@/components/portfolio/HeroSection';
import MarqueeBar from '@/components/portfolio/MarqueeBar';
import AboutSection from '@/components/portfolio/AboutSection';
import ExperienceSection from '@/components/portfolio/ExperienceSection';
import ServicesSection from '@/components/portfolio/ServicesSection';
import ProcessSection from '@/components/portfolio/ProcessSection';
import PortfolioSection from '@/components/portfolio/PortfolioSection';
import SkillsSection from '@/components/portfolio/SkillsSection';
import PricingSection from '@/components/portfolio/PricingSection';
import StatsBanner from '@/components/portfolio/StatsBanner';
import ClientsSection from '@/components/portfolio/ClientsSection';
import TestimonialsSection from '@/components/portfolio/TestimonialsSection';
import BlogSection from '@/components/portfolio/BlogSection';
import FAQSection from '@/components/portfolio/FAQSection';
import ContactSection from '@/components/portfolio/ContactSection';
import Footer from '@/components/portfolio/Footer';
import FloatingHireFAB from '@/components/portfolio/FloatingHireFAB';
import ScrollProgress from '@/components/portfolio/ScrollProgress';
import ScrollToTop from '@/components/portfolio/ScrollToTop';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSection />
      <MarqueeBar />
      <AboutSection />
      <ExperienceSection />
      <ServicesSection />
      <ProcessSection />
      <PortfolioSection />
      <SkillsSection />
      <PricingSection />
      <StatsBanner />
      <ClientsSection />
      <TestimonialsSection />
      <BlogSection />
      <FAQSection />
      <ContactSection />
      <Footer />
      <FloatingHireFAB />
      <ScrollProgress />
      <ScrollToTop />
    </main>
  );
}
