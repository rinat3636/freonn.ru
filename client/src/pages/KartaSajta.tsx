/*
 * Карта сайта — /karta-sajta (HTML-обзор основных URL + ссылка на sitemap.xml)
 */
import { getKartaSajtaCityLinks, getKartaSajtaServiceGeoLinks } from "@shared/geoRoutes";
import { useSEO } from "@/hooks/useSEO";
import PageLayout from "@/components/PageLayout";

const SECTIONS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Компания и контакты",
    links: [
      { href: "/", label: "Главная" },
      { href: "/o-kompanii", label: "О компании" },
      { href: "/contacts", label: "Контакты" },
      { href: "/rekvizity", label: "Реквизиты" },
      { href: "/sertifikaty", label: "Лицензии и сертификаты" },
      { href: "/garantii", label: "Гарантии" },
      { href: "/partnery", label: "Партнёры" },
      { href: "/vakansii", label: "Вакансии" },
      { href: "/politika-konfidencialnosti", label: "Политика конфиденциальности" },
    ],
  },
  {
    title: "Услуги и цены",
    links: [
      { href: "/uslugi", label: "Все услуги" },
      { href: "/ceny", label: "Цены" },
      { href: "/ventilyaciya", label: "Вентиляция" },
      { href: "/kondicionirovanie", label: "Кондиционирование" },
      { href: "/dymoudalenie", label: "Дымоудаление" },
      { href: "/otoplenie", label: "Отопление" },
      { href: "/holodosnabzhenie", label: "Холодоснабжение" },
      { href: "/vodosnabzhenie", label: "Водоснабжение" },
      { href: "/elektrosnabzhenie", label: "Электроснабжение" },
      { href: "/peskostrujnaya-obrabotka", label: "Пескоструйная обработка" },
    ],
  },
  {
    title: "Контент",
    links: [
      { href: "/blog", label: "Блог" },
      { href: "/faq", label: "Вопросы и ответы" },
      { href: "/obekty", label: "Объекты" },
      { href: "/novosti", label: "Новости" },
      { href: "/akcii", label: "Акции" },
    ],
  },
  {
    title: "Москва и Московская область",
    links: getKartaSajtaCityLinks(),
  },
  {
    title: "Услуги в Москве и МО",
    links: getKartaSajtaServiceGeoLinks(),
  },
  {
    title: "Популярные объекты",
    links: [
      { href: "/ventilyaciya-sklad", label: "Вентиляция складов" },
      { href: "/ventilyaciya-ofis", label: "Вентиляция офисов" },
      { href: "/ventilyaciya-zavod", label: "Вентиляция производств" },
      { href: "/kondicionirovanie-ofis", label: "Кондиционирование офисов" },
      { href: "/kondicionirovanie-dc", label: "Кондиционирование серверных" },
      { href: "/dymoudalenie-tc", label: "Дымоудаление торговых центров" },
      { href: "/dymoudalenie-parking", label: "Дымоудаление паркингов" },
      { href: "/otoplenie-sklad", label: "Отопление складов" },
      { href: "/elektrosnabzhenie-sklad", label: "Электроснабжение складов" },
      { href: "/holodosnabzhenie-zavod", label: "Холодоснабжение производств" },
    ],
  },
];

export default function KartaSajtaPage() {
  useSEO({
    title: "Карта сайта — Freonn",
    description:
      "Основные разделы сайта freonn.ru: услуги, цены, блог, контакты, Москва и Московская область. Полный перечень URL в файле sitemap.xml.",
    canonical: "/karta-sajta",
    breadcrumbs: [{ name: "Карта сайта", url: "/karta-sajta" }],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": "https://freonn.ru/karta-sajta#webpage",
      name: "Карта сайта — Freonn",
      description: "Навигация по основным разделам сайта freonn.ru и гео-страницам Москвы и Московской области.",
      url: "https://freonn.ru/karta-sajta",
      isPartOf: { "@id": "https://freonn.ru/#website" },
      publisher: { "@id": "https://freonn.ru/#organization" },
    },
  });

  return (
    <PageLayout title="Карта сайта" breadcrumb={[{ label: "Карта сайта" }]}>
      <section className="py-16 bg-white">
        <div className="container max-w-4xl">
          <p className="text-gray-600 font-body mb-10">
            Ниже — основные страницы для быстрой навигации. Полный список URL для поисковых систем:{" "}
            <a href="/sitemap.xml" className="text-[#B91C1C] font-semibold hover:underline">
              sitemap.xml
            </a>
            .
          </p>
          <div className="grid md:grid-cols-2 gap-10">
            {SECTIONS.map((block) => (
              <div key={block.title}>
                <h2 className="font-heading font-bold text-[#0F1340] text-lg mb-4 border-b border-gray-200 pb-2">
                  {block.title}
                </h2>
                <ul className="space-y-2 font-body text-sm">
                  {block.links.map((l) => (
                    <li key={l.href}>
                      <a href={l.href} className="text-[#2D3092] hover:text-[#B91C1C] transition-colors">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
