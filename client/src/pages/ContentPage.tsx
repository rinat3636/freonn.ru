import { useRoute } from "wouter";
import PageLayout from "@/components/PageLayout";
import { useSEO } from "@/hooks/useSEO";
import { CONTENT_PAGE_BY_SLUG, type ContentPage } from "@shared/contentPages";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";

const RELATED_LINKS: Record<string, { label: string; href: string }[]> = {
  "Вентиляция": [
    { label: "Монтаж вентиляции", href: "/ventilyaciya" },
    { label: "Цены на вентиляцию", href: "/ceny/ventilyaciya" },
    { label: "Вопросы и ответы", href: "/faq" },
  ],
  "Кондиционирование": [
    { label: "Монтаж кондиционирования", href: "/kondicionirovanie" },
    { label: "Цены на кондиционирование", href: "/ceny/kondicionirovanie" },
    { label: "Блог", href: "/blog" },
  ],
  "Дымоудаление": [
    { label: "Монтаж дымоудаления", href: "/dymoudalenie" },
    { label: "Цены на дымоудаление", href: "/ceny/dymoudalenie" },
    { label: "Контакты", href: "/contacts" },
  ],
  "Отопление": [
    { label: "Монтаж отопления", href: "/otoplenie" },
    { label: "Цены на отопление", href: "/ceny/otoplenie" },
    { label: "Вопросы и ответы", href: "/faq" },
  ],
  "Электроснабжение": [
    { label: "Монтаж электроснабжения", href: "/elektrosnabzhenie" },
    { label: "Цены на электроснабжение", href: "/ceny/elektrosnabzhenie" },
    { label: "Контакты", href: "/contacts" },
  ],
  "Водоснабжение": [
    { label: "Монтаж водоснабжения", href: "/vodosnabzhenie" },
    { label: "Цены на водоснабжение", href: "/ceny/vodosnabzhenie" },
    { label: "Вопросы и ответы", href: "/faq" },
  ],
};

export default function ContentPage() {
  const [, params] = useRoute("/stati/:slug");
  const slug = params?.slug || "";
  const page = CONTENT_PAGE_BY_SLUG[slug];

  useSEO(
    page
      ? {
          title: `${page.title} — Freonn`,
          description: page.description,
          keywords: page.keywords,
          canonical: `/stati/${page.slug}`,
          ogType: "article",
          publishedTime: page.published,
          modifiedTime: page.modified,
          breadcrumbs: [
            { name: "Статьи", url: "/stati" },
            { name: page.h1, url: `/stati/${page.slug}` },
          ],
          jsonLd: {
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Article",
                "@id": `https://freonn.ru/stati/${page.slug}#article`,
                headline: page.h1,
                description: page.description,
                url: `https://freonn.ru/stati/${page.slug}`,
                datePublished: page.published,
                dateModified: page.modified,
                author: { "@type": "Organization", name: page.author },
                publisher: { "@id": "https://freonn.ru/#organization" },
                isPartOf: { "@id": "https://freonn.ru/#website" },
                articleSection: page.category,
              },
              ...(page.faq && page.faq.length > 0
                ? [
                    {
                      "@type": "FAQPage",
                      "@id": `https://freonn.ru/stati/${page.slug}#faq`,
                      mainEntity: page.faq.map((f) => ({
                        "@type": "Question",
                        name: f.q,
                        acceptedAnswer: {
                          "@type": "Answer",
                          text: f.a,
                        },
                      })),
                    },
                  ]
                : []),
            ],
          },
        }
      : {
          title: "Страница не найдена — Freonn",
          description: "Запрашиваемая статья не найдена.",
          noIndex: true,
        }
  );

  if (!page) {
    return (
      <PageLayout title="Страница не найдена" breadcrumb={[{ label: "Статьи", href: "/stati" }, { label: "Не найдено" }]}>
        <section className="container py-20 text-center">
          <p className="text-gray-500 font-body mb-6">Статья не найдена.</p>
          <a href="/" className="text-[#2D3092] hover:underline font-body">Вернуться на главную</a>
        </section>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={page.h1}
      breadcrumb={[{ label: "Статьи", href: "/stati" }, { label: page.category }]}
    >
      <section className="bg-white">
        <div className="container py-14">
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-body mb-8">
            <span className="flex items-center gap-1"><Calendar size={14} /> {page.published.slice(0, 10)}</span>
            <span className="flex items-center gap-1"><Clock size={14} /> {page.readTime}</span>
            <span className="flex items-center gap-1"><User size={14} /> {page.author}</span>
          </div>

          <div
            className="content-page max-w-4xl"
            dangerouslySetInnerHTML={{ __html: page.html }}
          />

          {page.faq && page.faq.length > 0 && (
            <div className="max-w-4xl mt-14 pt-10 border-t border-gray-200">
              <h2 className="font-heading font-bold text-2xl text-[#0F1340] mb-6">Часто задаваемые вопросы</h2>
              <dl className="space-y-6">
                {page.faq.map((f, i) => (
                  <div key={i}>
                    <dt className="font-heading font-semibold text-lg text-[#0F1340] mb-2">{f.q}</dt>
                    <dd className="font-body text-gray-700">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {RELATED_LINKS[page.category] && (
            <div className="max-w-4xl mt-14 pt-10 border-t border-gray-200">
              <h2 className="font-heading font-bold text-2xl text-[#0F1340] mb-4">Полезные ссылки</h2>
              <div className="flex flex-wrap gap-3">
                {RELATED_LINKS[page.category].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="inline-flex items-center gap-1 px-4 py-2 bg-[#0F1340]/5 text-[#0F1340] font-body text-sm rounded hover:bg-[#0F1340]/10 transition-colors"
                  >
                    {link.label} <ArrowRight size={14} />
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="max-w-4xl mt-14 p-6 bg-[#0F1340]/5 rounded-lg">
            <h2 className="font-heading font-bold text-xl text-[#0F1340] mb-3">Нужна консультация?</h2>
            <p className="font-body text-gray-700 mb-4">
              Инженеры Freonn ответят на вопросы, рассчитают систему и подготовят смету. Бесплатный выезд на объект в Москве и МО.
            </p>
            <a
              href="/contacts"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#B91C1C] text-white font-body font-medium rounded hover:bg-[#991b1b] transition-colors"
            >
              Оставить заявку
            </a>
          </div>
        </div>
      </section>

      <style>{`
        .content-page h2 {
          font-family: 'Oswald', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #0F1340;
          margin-top: 2rem;
          margin-bottom: 1rem;
          line-height: 1.25;
        }
        .content-page p {
          font-family: 'Roboto', sans-serif;
          color: #374151;
          margin-bottom: 1rem;
          line-height: 1.7;
        }
        .content-page ul,
        .content-page ol {
          font-family: 'Roboto', sans-serif;
          color: #374151;
          margin-bottom: 1rem;
          padding-left: 1.5rem;
          line-height: 1.7;
        }
        .content-page li {
          margin-bottom: 0.5rem;
        }
        .content-page strong {
          color: #0F1340;
        }
        .content-page table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1.5rem;
          font-family: 'Roboto', sans-serif;
        }
        .content-page th,
        .content-page td {
          border: 1px solid #E5E7EB;
          padding: 0.75rem;
          text-align: left;
          vertical-align: top;
        }
        .content-page th {
          background: #F3F4F6;
          color: #0F1340;
          font-weight: 600;
        }
      `}</style>
    </PageLayout>
  );
}
