/*
 * FREONN HOME PAGE — Bold Technical Expressionism
 * Assembles all sections in order matching ceds.ru structure
 */
import { useSEO } from "@/hooks/useSEO";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";

const BelowFoldPlaceholder = () => (
  <div className="min-h-[800px] bg-[#F7F8FF] animate-pulse" aria-hidden="true" />
);

export default function Home() {
  const [HomeBelowFold, setHomeBelowFold] = useState<ComponentType | null>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);

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
    // Загружаем нижние секции только при приближении к viewport или по таймауту.
    // Это освобождает сеть/CPU для критичного First/Largest Contentful Paint.
    const load = () => {
      import("./HomeBelowFold").then((m) => setHomeBelowFold(() => m.default));
    };

    // Fallback: загрузить через 8 секунд, даже если никто не скроллил.
    const fallbackTimer = setTimeout(load, 8000);

    if ("IntersectionObserver" in window) {
      const el = placeholderRef.current;
      if (!el) return () => clearTimeout(fallbackTimer);
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            load();
            observer.disconnect();
            clearTimeout(fallbackTimer);
          }
        },
        { rootMargin: "0px 0px 200px 0px" }
      );
      observer.observe(el);
      return () => {
        observer.disconnect();
        clearTimeout(fallbackTimer);
      };
    }

    return () => clearTimeout(fallbackTimer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <div ref={placeholderRef}>
          {HomeBelowFold ? <HomeBelowFold /> : <BelowFoldPlaceholder />}
        </div>
      </main>
    </div>
  );
}
