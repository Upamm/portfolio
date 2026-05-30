import Navbar from '@/components/portfolio/Navbar';
import HeroSection from '@/components/portfolio/HeroSection';
import AboutSection from '@/components/portfolio/AboutSection';
import ServicesSection from '@/components/portfolio/ServicesSection';
import PortfolioSection from '@/components/portfolio/PortfolioSection';
import SkillsSection from '@/components/portfolio/SkillsSection';
import TestimonialsSection from '@/components/portfolio/TestimonialsSection';
import ContactSection from '@/components/portfolio/ContactSection';
import Footer from '@/components/portfolio/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <PortfolioSection />
      <SkillsSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
