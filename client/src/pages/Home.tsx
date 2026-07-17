/*
 * FREONN HOME PAGE — Bold Technical Expressionism
 * Assembles all sections in order matching ceds.ru structure
 */
import { useSEO } from "@/hooks/useSEO";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import { useEffect, useState } from "react";
import type { ComponentType } from "react";

const BelowFoldPlaceholder = () => (
  <div className="min-h-[800px] bg-[#F7F8FF] animate-pulse" aria-hidden="true" />
);

export default function Home() {
  const [HomeBelowFold, setHomeBelowFold] = useState<ComponentType | null>(null);

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

  useEffect(() => {
    // Откладываем загрузку нижних секций, чтобы не конкурировать за сеть/CPU
    // с критичным First Contentful / Largest Contentful Paint (хедер + hero).
    const load = () => {
      import("./HomeBelowFold").then((m) => setHomeBelowFold(() => m.default));
    };

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    // На мобильном даём больше времени для отрисовки hero; на десктопе — меньше.
    const delay = isMobile ? 2200 : 800;
    const timer = setTimeout(load, delay);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        {HomeBelowFold ? <HomeBelowFold /> : <BelowFoldPlaceholder />}
      </main>
    </div>
  );
}
