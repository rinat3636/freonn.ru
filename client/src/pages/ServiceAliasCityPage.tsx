import PageLayout from "@/components/PageLayout";
import ContactSection from "@/components/ContactSection";
import { useSEO } from "@/hooks/useSEO";
import { ymGoal } from "@/lib/ym";
import { getCityEntry, getCityAreaType, buildServiceLocationPath, SERVICE_SEO } from "@shared/geoRoutes";
import { getAliasCityParagraph } from "@shared/cityContent";
import {
  buildServiceAliasCityPath,
  SERVICE_ALIASES,
  shouldNoIndexForSeoPhase,
} from "@shared/seoMatrix";
import { ArrowRight, Phone } from "lucide-react";

interface ServiceAliasCityPageProps {
  aliasSlug: string;
  citySlug: string;
}

export default function ServiceAliasCityPage({ aliasSlug, citySlug }: ServiceAliasCityPageProps) {
  const alias = SERVICE_ALIASES.find((a) => a.slug === aliasSlug);
  const city = getCityEntry(citySlug);
  if (!alias || !city) return null;

  const canonical = buildServiceAliasCityPath(aliasSlug, citySlug);
  const title = `${alias.name} ${city.phrase}`;
  const bodyText = getAliasCityParagraph(alias.name, city.phrase, citySlug, city.name);

  useSEO({
    title: `${title} — Freonn`,
    description: `${alias.name} ${city.phrase} для коммерческих и промышленных объектов. Выезд инженера, смета, гарантия.`,
    canonical,
    omitRegionMeta: true,
    noIndex: shouldNoIndexForSeoPhase(canonical),
    breadcrumbs: [
      { name: "Услуги", url: "/uslugi" },
      { name: alias.name, url: `/${aliasSlug}` },
      { name: city.name, url: canonical },
    ],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: title,
      url: `https://freonn.ru${canonical}`,
      provider: { "@id": "https://freonn.ru/#organization" },
      areaServed: { "@type": getCityAreaType(citySlug), name: city.name },
    },
  });

  return (
    <PageLayout
      title={title}
      breadcrumb={[
        { label: "Услуги", href: "/uslugi" },
        { label: alias.name, href: `/${aliasSlug}` },
        { label: city.name },
      ]}
    >
      <section className="py-14 bg-white">
        <div className="container max-w-3xl">
          <p className="text-gray-600 font-body leading-relaxed mb-4">{bodyText}</p>
          <p className="text-gray-600 font-body leading-relaxed mb-6">
            Связанная услуга —{" "}
            <a href={buildServiceLocationPath(alias.serviceSlug, citySlug)} className="text-[#2D3092] font-semibold hover:underline">
              {SERVICE_SEO[alias.serviceSlug as keyof typeof SERVICE_SEO]?.name} {city.phrase}
            </a>
            . Передаём исполнительную документацию, акты и паспорта оборудования после сдачи объекта.
          </p>
          <div className="flex flex-wrap gap-2 mb-8">
            <a href={buildServiceLocationPath(alias.serviceSlug, citySlug)} className="px-4 py-2 bg-[#F7F8FF] rounded-full text-sm">
              Основная услуга {city.phrase}
            </a>
            <a href={`/${citySlug}`} className="px-4 py-2 bg-[#F7F8FF] rounded-full text-sm">
              {city.name}
            </a>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="/contacts" className="btn-dark inline-flex items-center gap-2 justify-center">
              Получить расчёт <ArrowRight size={16} />
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
