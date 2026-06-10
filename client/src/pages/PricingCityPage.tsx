import PageLayout from "@/components/PageLayout";
import ContactSection from "@/components/ContactSection";
import { useSEO } from "@/hooks/useSEO";
import { ymGoal } from "@/lib/ym";
import { getCityEntry, SERVICE_SEO } from "@shared/geoRoutes";
import { buildPriceCityPath, shouldNoIndexForSeoPhase } from "@shared/seoMatrix";
import { ArrowRight, Phone } from "lucide-react";

interface PricingCityPageProps {
  serviceSlug: string;
  citySlug: string;
}

export default function PricingCityPage({ serviceSlug, citySlug }: PricingCityPageProps) {
  const service = SERVICE_SEO[serviceSlug as keyof typeof SERVICE_SEO];
  const city = getCityEntry(citySlug);
  if (!service || !city) return null;

  const canonical = buildPriceCityPath(serviceSlug, citySlug);
  const title = `Цены на монтаж ${service.genitive} ${city.phrase}`;

  useSEO({
    title: `${title} — Freonn`,
    description: `Ориентиры по стоимости монтажа ${service.genitive} ${city.phrase}. Точный расчёт после обследования объекта — бесплатно.`,
    canonical,
    omitRegionMeta: true,
    noIndex: shouldNoIndexForSeoPhase(canonical),
    breadcrumbs: [
      { name: "Цены", url: "/ceny" },
      { name: service.name, url: `/${serviceSlug}` },
      { name: city.name, url: canonical },
    ],
  });

  return (
    <PageLayout
      title={title}
      breadcrumb={[
        { label: "Цены", href: "/ceny" },
        { label: service.name, href: `/${serviceSlug}` },
        { label: city.name },
      ]}
    >
      <section className="py-14 bg-white">
        <div className="container max-w-3xl">
          <p className="text-gray-600 font-body leading-relaxed mb-6">
            Стоимость монтажа {service.genitive} {city.phrase} зависит от площади, мощности, трассировки
            и требований к автоматике. Freonn готовит точную смету после выезда инженера на объект.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-600 font-body mb-8">
            <li>Бесплатный выезд инженера {city.phrase}</li>
            <li>Работаем с объектами от 500 м²</li>
            <li>Фиксированная смета до начала монтажа</li>
          </ul>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="/contacts" className="btn-dark inline-flex items-center gap-2 justify-center">
              Запросить расчёт <ArrowRight size={16} />
            </a>
            <a href="tel:88001012009" onClick={() => ymGoal("phone_click")} className="btn-dark inline-flex items-center gap-2 justify-center">
              <Phone size={16} /> 8(800)101-2009
            </a>
          </div>
        </div>
      </section>
      <ContactSection />
    </PageLayout>
  );
}
