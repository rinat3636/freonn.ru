import PageLayout from "@/components/PageLayout";
import NotFound from "@/pages/NotFound";
import { useSEO } from "@/hooks/useSEO";
import { GLOSSARY_BY_SLUG } from "@shared/glossaryTerms";

export default function GlossaryTermPage({ slug }: { slug: string }) {
  const term = GLOSSARY_BY_SLUG[slug];
  if (!term) return <NotFound />;

  useSEO({
    title: `${term.term} — словарь ОВиК — Freonn`,
    description: term.definition,
    canonical: `/slovar/${slug}`,
    breadcrumbs: [
      { name: "Словарь", url: "/slovar" },
      { name: term.term, url: `/slovar/${slug}` },
    ],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      name: term.term,
      description: term.definition,
      url: `https://freonn.ru/slovar/${slug}`,
      inDefinedTermSet: "https://freonn.ru/slovar",
    },
  });

  return (
    <PageLayout
      title={term.term}
      breadcrumb={[
        { label: "Словарь", href: "/slovar" },
        { label: term.term },
      ]}
    >
      <section className="py-14 bg-white">
        <div className="container max-w-2xl">
          <p className="text-gray-700 font-body leading-relaxed text-lg mb-6">{term.definition}</p>
          {term.relatedHref && (
            <a href={term.relatedHref} className="text-[#B91C1C] font-semibold hover:underline">
              Подробнее об услуге →
            </a>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
