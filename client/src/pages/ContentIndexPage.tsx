import PageLayout from "@/components/PageLayout";
import { useSEO } from "@/hooks/useSEO";
import { CONTENT_PAGES } from "@shared/contentPages";
import { ArrowRight, BookOpen } from "lucide-react";

export default function ContentIndexPage() {
  useSEO({
    title: "Полезные статьи — гайды и сравнения по инженерным системам — Freonn",
    description:
      "Экспертные статьи, сравнения и гайды по вентиляции, кондиционированию, дымоудалению и отоплению. Практические рекомендации инженеров Freonn для владельцев бизнеса и проектировщиков.",
    keywords:
      "статьи вентиляция, гид кондиционирование, сравнение систем дымоудаления, инженерные системы гайд, Freonn",
    canonical: "/stati",
  });

  return (
    <PageLayout
      title="Полезные статьи"
      breadcrumb={[{ label: "Статьи" }]}
    >
      <section className="bg-white">
        <div className="container py-14">
          <p className="font-body text-gray-700 max-w-3xl mb-10">
            Собрали практические материалы по выбору, расчёту и монтажу инженерных систем. Статьи обновляются и дополняются по мере появления новых норм и технологий.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CONTENT_PAGES.map((p) => (
              <a
                key={p.slug}
                href={`/stati/${p.slug}`}
                className="group block p-6 bg-[#0F1340]/5 rounded-lg hover:bg-[#0F1340]/10 transition-colors"
              >
                <div className="flex items-center gap-2 text-xs font-medium text-[#B91C1C] uppercase tracking-wide mb-3">
                  <BookOpen size={14} />
                  {p.category}
                </div>
                <h2 className="font-heading font-semibold text-lg text-[#0F1340] mb-3 group-hover:text-[#B91C1C] transition-colors">
                  {p.h1}
                </h2>
                <p className="font-body text-sm text-gray-600 mb-4 line-clamp-3">{p.description}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-[#2D3092] group-hover:underline">
                  Читать <ArrowRight size={14} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
