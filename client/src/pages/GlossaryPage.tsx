import { Link } from "wouter";
import PageLayout from "@/components/PageLayout";
import { useSEO } from "@/hooks/useSEO";
import { GLOSSARY_TERMS } from "@shared/glossaryTerms";

export default function GlossaryPage() {
  useSEO({
    title: "Словарь ОВиК — термины инженерных систем — Freonn",
    description: "Словарь терминов по вентиляции, кондиционированию, дымоудалению и другим инженерным системам.",
    canonical: "/slovar",
    breadcrumbs: [{ name: "Словарь ОВиК", url: "/slovar" }],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "DefinedTermSet",
      name: "Словарь ОВиК Freonn",
      url: "https://freonn.ru/slovar",
    },
  });

  return (
    <PageLayout title="Словарь ОВиК" breadcrumb={[{ label: "Словарь ОВиК" }]}>
      <section className="py-14 bg-white">
        <div className="container max-w-3xl">
          <p className="text-gray-600 font-body mb-8">
            Краткие определения терминов по проектированию и монтажу инженерных систем.
          </p>
          <ul className="space-y-4">
            {GLOSSARY_TERMS.map((term) => (
              <li key={term.slug}>
                <Link href={`/slovar/${term.slug}`} className="text-[#2D3092] hover:text-[#B91C1C] font-heading font-semibold">
                  {term.term}
                </Link>
                <p className="text-gray-500 text-sm font-body mt-1 line-clamp-2">{term.definition}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageLayout>
  );
}
