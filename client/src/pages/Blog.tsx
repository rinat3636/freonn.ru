/*
 * FREONN BLOG PAGE — /blog
 */
import { useState, useEffect } from "react";
import { useSEO } from "@/hooks/useSEO";
import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface BlogIndexItem {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  img: string;
  href: string;
  excerpt: string;
  published: string;
}

const categoryColors: Record<string, string> = {
  "Вентиляция": "bg-[#2D3092]/10 text-[#2D3092]",
  "Кондиционирование": "bg-[#B91C1C]/10 text-[#B91C1C]",
  "Дымоудаление": "bg-red-100 text-red-700",
  "Отопление": "bg-orange-100 text-orange-700",
  "Холодоснабжение": "bg-cyan-100 text-cyan-700",
  "Водоснабжение": "bg-blue-100 text-blue-700",
  "Электроснабжение": "bg-amber-100 text-amber-700",
  "Пескоструй": "bg-gray-200 text-gray-700",
  "Автоматизация": "bg-purple-100 text-purple-700",
  "Обслуживание": "bg-green-100 text-green-700",
};

export default function BlogPage() {
  useSEO({
    title: "Блог — статьи об инженерных системах",
    description: "Полезные статьи о вентиляции, кондиционировании, дымоудалении и отоплении. Советы по выбору оборудования, нормы проектирования, разбор реальных объектов.",
    keywords: "блог вентиляция, статьи кондиционирование, инженерные системы статьи, нормы вентиляции, проектирование вентиляции",
    canonical: "/blog",
    breadcrumbs: [{ name: "Блог", url: "/blog" }],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Блог Freonn — статьи об инженерных системах",
      description: "Полезные статьи о вентиляции, кондиционировании, дымоудалении и отоплении.",
      url: "https://freonn.ru/blog",
      publisher: {
        "@type": "Organization",
        name: "Freonn",
        url: "https://freonn.ru",
      },
    },
  });

  const [articles, setArticles] = useState<BlogIndexItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 12;

  useEffect(() => {
    fetch("/assets/blog/articles-index.json")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: BlogIndexItem[]) => {
        setArticles(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalPages = Math.max(1, Math.ceil(articles.length / perPage));
  const currentArticles = articles.slice((page - 1) * perPage, page * perPage);

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <PageLayout
      title="Блог — статьи об инженерных системах"
      breadcrumb={[{ label: "Блог" }]}
    >
      <section className="py-16 bg-white">
        <div className="container">
          {loading ? (
            <p className="text-center text-gray-500 font-body py-20">Загружаем статьи...</p>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentArticles.map((article, i) => (
                  <motion.a
                    key={article.href}
                    href={article.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="group block bg-white border border-gray-100 hover:border-[#2D3092]/30 hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden"
                  >
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={article.img}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-body font-medium ${categoryColors[article.category] || "bg-gray-100 text-gray-600"}`}>
                          {article.category}
                        </span>
                        <span className="text-xs text-gray-400 font-body">{article.readTime}</span>
                      </div>
                      <h2 className="font-heading font-semibold text-[#0F1340] text-sm leading-snug mb-2 group-hover:text-[#2D3092] transition-colors line-clamp-2">
                        {article.title}
                      </h2>
                      <p className="text-gray-500 text-xs font-body leading-relaxed line-clamp-2 mb-3">
                        {article.excerpt}
                      </p>
                      <span className="inline-flex items-center gap-1 text-[#B91C1C] text-xs font-heading font-semibold uppercase tracking-wide group-hover:gap-2 transition-all">
                        Читать <ArrowRight size={12} />
                      </span>
                    </div>
                  </motion.a>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    type="button"
                    onClick={() => goToPage(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-heading text-[#0F1340] hover:border-[#2D3092] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowLeft size={16} />
                  </button>

                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => goToPage(p)}
                      className={`px-3 py-2 rounded-lg text-sm font-heading transition-colors ${
                        p === page
                          ? "bg-[#2D3092] text-white"
                          : "border border-gray-200 text-[#0F1340] hover:border-[#2D3092]"
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => goToPage(page + 1)}
                    disabled={page === totalPages}
                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-heading text-[#0F1340] hover:border-[#2D3092] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
