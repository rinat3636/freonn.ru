import PageLayout from "@/components/PageLayout";
import ContactSection from "@/components/ContactSection";
import ProcessSection from "@/components/ProcessSection";
import { useSEO } from "@/hooks/useSEO";
import { ymGoal } from "@/lib/ym";
import { buildServiceLocationPath, getCityEntry, SERVICE_SEO } from "@shared/geoRoutes";
import { getCityContent, getPriceCityBullets, getPriceCityExtra } from "@shared/cityContent";
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
  const priceBullets = getPriceCityBullets(service.genitive, city.phrase);
  const priceExtra = getPriceCityExtra(service.genitive, city.phrase, citySlug, city.name);
  const cityContent = getCityContent(citySlug, city.name);

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
          <p className="text-gray-600 font-body leading-relaxed mb-4">{priceExtra}</p>
          <p className="text-gray-600 font-body leading-relaxed mb-6">{cityContent.lsi}</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-600 font-body mb-6">
            {priceBullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="text-gray-600 font-body text-sm mb-8">
            Общие ориентиры по ценам:{" "}
            <a href={`/ceny/${serviceSlug}`} className="text-[#2D3092] font-semibold hover:underline">
              прайс {service.genitive}
            </a>
            . Коммерческое предложение {city.phrase}:{" "}
            <a href={buildServiceLocationPath(serviceSlug, citySlug)} className="text-[#2D3092] font-semibold hover:underline">
              {service.name} {city.phrase}
            </a>
            .
          </p>
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
      <ProcessSection />
      <ContactSection />
    </PageLayout>
  );
}
