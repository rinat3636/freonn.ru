import PageLayout from "@/components/PageLayout";
import ContactSection from "@/components/ContactSection";
import NotFound from "@/pages/NotFound";
import { useSEO } from "@/hooks/useSEO";
import { CASE_STUDY_BY_SLUG } from "@shared/caseStudies";
import { buildServiceLocationPath, SERVICE_SEO } from "@shared/geoRoutes";
import { shouldNoIndexForSeoPhase } from "@shared/seoMatrix";
import { ArrowRight } from "lucide-react";

export default function CaseStudyPage({ slug }: { slug: string }) {
  const study = CASE_STUDY_BY_SLUG[slug];
  if (!study) return <NotFound />;

  const canonical = `/kejs/${slug}`;

  useSEO({
    title: `${study.title} — кейс Freonn`,
    description: study.summary,
    canonical,
    noIndex: shouldNoIndexForSeoPhase(canonical),
    breadcrumbs: [
      { name: "Объекты", url: "/obekty" },
      { name: study.title, url: canonical },
    ],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: study.title,
      description: study.summary,
      url: `https://freonn.ru${canonical}`,
      author: { "@id": "https://freonn.ru/#organization" },
      publisher: { "@id": "https://freonn.ru/#organization" },
    },
  });

  return (
    <PageLayout
      title={study.title}
      breadcrumb={[
        { label: "Объекты", href: "/obekty" },
        { label: study.title },
      ]}
    >
      <article className="py-14 bg-white">
        <div className="container max-w-3xl">
          <p className="text-sm text-gray-500 mb-4">{study.city} · {study.area}</p>
          <p className="text-gray-700 font-body leading-relaxed mb-6">{study.summary}</p>
          {study.body.map((p) => (
            <p key={p} className="text-gray-600 font-body leading-relaxed mb-4">{p}</p>
          ))}
          <div className="flex flex-wrap gap-2 mt-8">
            {study.services.map((svc) => {
              const service = SERVICE_SEO[svc as keyof typeof SERVICE_SEO];
              if (!service) return null;
              return (
                <a
                  key={svc}
                  href={buildServiceLocationPath(svc, study.citySlug)}
                  className="px-4 py-2 bg-[#F7F8FF] hover:bg-[#0F1340] hover:text-white rounded-full text-sm transition-colors"
                >
                  {service.name} {study.city}
                </a>
              );
            })}
          </div>
          <a href="/obekty" className="btn-dark inline-flex items-center gap-2 mt-8">
            Все объекты <ArrowRight size={16} />
          </a>
        </div>
      </article>
      <ContactSection />
    </PageLayout>
  );
}
