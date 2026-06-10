import PageLayout from "@/components/PageLayout";
import ContactSection from "@/components/ContactSection";
import ProcessSection from "@/components/ProcessSection";
import { useSEO } from "@/hooks/useSEO";
import { ymGoal } from "@/lib/ym";
import {
  getCityAreaType,
  getCityEntry,
  getNearbyCityLinks,
  buildServiceLocationPath,
  SERVICE_SEO,
} from "@shared/geoRoutes";
import {
  buildServiceObjectCityPath,
  OBJECT_SEO,
  shouldNoIndexForSeoPhase,
  type ObjectSlug,
} from "@shared/seoMatrix";
import { getObjectCityBullets, getObjectCityExtra } from "@shared/cityContent";
import { getCityTier, getTier1NearbyLinks } from "@shared/geoTiers";
import { ArrowRight, CheckCircle, Phone } from "lucide-react";

interface ServiceObjectCityPageProps {
  serviceSlug: string;
  objectSlug: ObjectSlug;
  citySlug: string;
}

export default function ServiceObjectCityPage({
  serviceSlug,
  objectSlug,
  citySlug,
}: ServiceObjectCityPageProps) {
  const service = SERVICE_SEO[serviceSlug as keyof typeof SERVICE_SEO];
  const object = OBJECT_SEO[objectSlug];
  const city = getCityEntry(citySlug);
  if (!service || !object || !city) return null;

  const canonical = buildServiceObjectCityPath(serviceSlug, objectSlug, citySlug);
  const title = `${service.name} ${object.nameGen} ${city.phrase}`;
  const description = `Монтаж ${service.genitive} ${object.namePrep} ${city.phrase}. Проектирование, монтаж и пусконаладка для объектов от 500 м².`;

  useSEO({
    title: `${title} — Freonn`,
    description,
    keywords: `${service.name.toLowerCase()} ${object.name} ${city.name}, монтаж ${service.genitive} ${city.name}`,
    canonical,
    omitRegionMeta: true,
    noIndex: shouldNoIndexForSeoPhase(canonical),
    breadcrumbs: [
      { name: "Услуги", url: "/uslugi" },
      { name: service.name, url: `/${serviceSlug}` },
      { name: city.name, url: buildServiceLocationPath(serviceSlug, citySlug) },
      { name: title, url: canonical },
    ],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: title,
      description,
      url: `https://freonn.ru${canonical}`,
      provider: { "@id": "https://freonn.ru/#organization" },
      areaServed: { "@type": getCityAreaType(citySlug), name: city.name },
      serviceType: service.name,
    },
  });

  const nearby =
    getCityTier(citySlug) <= 1
      ? getTier1NearbyLinks(citySlug, 5)
      : getNearbyCityLinks(citySlug, 3);
  const objectExtra = getObjectCityExtra(objectSlug, city.name, city.phrase);
  const objectBullets = getObjectCityBullets(objectSlug);

  return (
    <PageLayout
      title={title}
      breadcrumb={[
        { label: "Услуги", href: "/uslugi" },
        { label: service.name, href: `/${serviceSlug}` },
        { label: city.name, href: `/${citySlug}` },
        { label: object.name },
      ]}
    >
      <section className="py-14 bg-white">
        <div className="container max-w-4xl">
          <h2 className="font-heading font-bold text-[#0F1340] text-2xl mb-4">
            Монтаж {service.genitive} {object.namePrep} {city.phrase}
          </h2>
          <p className="text-gray-600 font-body leading-relaxed mb-4">
            Freonn проектирует и монтирует {service.genitive.toLowerCase()} для {object.nameGen} {city.phrase}.
            Выезд инженера, подбор оборудования, монтаж силами собственных бригад, исполнительная документация и гарантия.
          </p>
          <p className="text-gray-600 font-body leading-relaxed mb-6">{objectExtra}</p>
          <div className="flex flex-wrap gap-2 mb-8">
            <a href={buildServiceLocationPath(serviceSlug, citySlug)} className="px-4 py-2 bg-[#F7F8FF] rounded-full text-sm">
              Все услуги {city.phrase}
            </a>
            <a href={`/${serviceSlug}-${objectSlug}`} className="px-4 py-2 bg-[#F7F8FF] rounded-full text-sm">
              {service.name} для {object.nameGen}
            </a>
            <a href={`/${citySlug}`} className="px-4 py-2 bg-[#F7F8FF] rounded-full text-sm">
              {city.name}
            </a>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 mb-8">
            {objectBullets.map((item) => (
              <div key={item} className="flex items-start gap-2">
                <CheckCircle size={16} className="mt-0.5 text-[#2D3092]" />
                <span className="text-sm text-gray-700 font-body">{item}</span>
              </div>
            ))}
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

      {nearby.length > 0 && (
        <section className="py-10 bg-[#F7F8FF]">
          <div className="container">
            <h2 className="font-heading font-bold text-[#0F1340] text-xl mb-4">Рядом с {city.name}</h2>
            <div className="flex flex-wrap gap-2">
              {nearby.map((link) => (
                <a key={link.href} href={link.href} className="px-4 py-2 bg-white rounded-full text-sm hover:bg-[#0F1340] hover:text-white transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <ProcessSection />
      <ContactSection />
    </PageLayout>
  );
}
