import PageLayout from "@/components/PageLayout";
import ContactSection from "@/components/ContactSection";
import ProcessSection from "@/components/ProcessSection";
import { useSEO } from "@/hooks/useSEO";
import { ymGoal } from "@/lib/ym";
import { getCityEntry, buildServiceLocationPath, SERVICE_SEO } from "@shared/geoRoutes";
import { getAliasCityParagraph, getAliasCitySteps, getCityContent } from "@shared/cityContent";
import {
  buildServiceAliasCityPath,
  SERVICE_ALIASES,
  shouldNoIndexForSeoPhase,
} from "@shared/seoMatrix";
import { ArrowRight, CheckCircle, Phone } from "lucide-react";

interface ServiceAliasCityPageProps {
  aliasSlug: string;
  citySlug: string;
}

export default function ServiceAliasCityPage({ aliasSlug, citySlug }: ServiceAliasCityPageProps) {
  const alias = SERVICE_ALIASES.find((a) => a.slug === aliasSlug);
  const city = getCityEntry(citySlug);
  if (!alias || !city) return null;

  const primaryService = SERVICE_SEO[alias.serviceSlug as keyof typeof SERVICE_SEO];
  const canonical = buildServiceAliasCityPath(aliasSlug, citySlug);
  const primaryHref = buildServiceLocationPath(alias.serviceSlug, citySlug);
  const title = `${alias.name} ${city.phrase}`;
  const bodyText = getAliasCityParagraph(alias.name, city.phrase, citySlug, city.name);
  const cityContent = getCityContent(citySlug, city.name);
  const steps = getAliasCitySteps(alias.name);

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
          <p className="text-gray-600 font-body leading-relaxed mb-4">
            Основная коммерческая страница услуги —{" "}
            <a href={primaryHref} className="text-[#2D3092] font-semibold hover:underline">
              {primaryService?.name} {city.phrase}
            </a>
            . Страница «{alias.name}» описывает тот же intent с акцентом на монтаж и пусконаладку {city.phrase}.
          </p>
          <p className="text-gray-600 font-body leading-relaxed mb-6">{cityContent.lsi}</p>
          <div className="grid sm:grid-cols-2 gap-3 mb-8">
            {steps.map((item) => (
              <div key={item} className="flex items-start gap-2">
                <CheckCircle size={16} className="mt-0.5 text-[#2D3092]" />
                <span className="text-sm text-gray-700 font-body">{item}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mb-8">
            <a href={primaryHref} className="px-4 py-2 bg-[#F7F8FF] rounded-full text-sm">
              {primaryService?.name} {city.phrase}
            </a>
            <a href={`/${citySlug}`} className="px-4 py-2 bg-[#F7F8FF] rounded-full text-sm">
              {city.name}
            </a>
            <a href={`/${alias.serviceSlug}`} className="px-4 py-2 bg-[#F7F8FF] rounded-full text-sm">
              {primaryService?.name} — общая услуга
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
      <ProcessSection />
      <ContactSection />
    </PageLayout>
  );
}
