/*
 * FREONN HOME PAGE — Bold Technical Expressionism
 * Assembles all sections in order matching ceds.ru structure
 */
import { useSEO } from "@/hooks/useSEO";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import ObjectsSection from "@/components/ObjectsSection";
import ProcessSection from "@/components/ProcessSection";
import PricingSection from "@/components/PricingSection";
import ProjectsSection from "@/components/ProjectsSection";
import AdvantagesSection from "@/components/AdvantagesSection";
import PartnersSection from "@/components/PartnersSection";
import BlogSection from "@/components/BlogSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import HomeGeoSection from "@/components/HomeGeoSection";
import FloatingButtons from "@/components/FloatingButtons";

export default function Home() {
  useSEO({
    title: "Freonn — инженерная компания | Монтаж вентиляции, кондиционирования в Москве",
    description: "Freonn — проектирование, монтаж и обслуживание вентиляции, кондиционирования, дымоудаления, отопления и электроснабжения в Москве и МО. Более 1280 объектов. Гарантия 1 год на монтажные работы. Бесплатный выезд инженера.",
    keywords: "монтаж вентиляции Москва, кондиционирование офиса, дымоудаление монтаж, инженерные системы Москва, проектирование вентиляции МО, монтаж инженерных систем под ключ, ОВиК, воздушное отопление, монтаж кондиционеров",
    canonical: "/",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": "https://freonn.ru/#webpage",
      url: "https://freonn.ru/",
      name: "Монтаж инженерных систем в Москве и МО — Freonn",
      isPartOf: { "@id": "https://freonn.ru/#website" },
      about: { "@id": "https://freonn.ru/#business" },
      description:
        "Проектирование, монтаж и обслуживание инженерных систем: вентиляция, кондиционирование, дымоудаление, отопление, электроснабжение в Москве и МО.",
      inLanguage: "ru-RU",
      dateModified: "2026-05-11T00:00:00+03:00",
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ServicesSection />
        <AboutSection />
        <ObjectsSection />
        <ProcessSection />
        <PricingSection />
        <ProjectsSection />
        <AdvantagesSection />
        <PartnersSection />
        <BlogSection />
        <FAQSection />
        <HomeGeoSection />
        <ContactSection />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}
