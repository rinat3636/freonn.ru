/*
 * Карта сайта — /karta-sajta (HTML-обзор основных URL + ссылки на XML-sitemap)
 */
import {
  CITIES,
  SERVICE_SLUGS,
  SERVICE_SEO,
  OBJECT_SLUGS,
  CITY_BY_SLUG,
  getKartaSajtaServiceGeoLinks,
} from "@shared/geoRoutes";
import { getKartaSajtaTierCityLinks, MATRIX_CITY_SLUGS } from "@shared/geoTiers";
import {
  OBJECT_SEO,
  PRICE_CITY_SERVICES,
  SERVICE_ALIASES,
  buildPriceCityPath,
  buildServiceAliasCityPath,
} from "@shared/seoMatrix";
import { CONTENT_PAGES } from "@shared/contentPages";
import { CASE_STUDIES } from "@shared/caseStudies";
import { useSEO } from "@/hooks/useSEO";
import PageLayout from "@/components/PageLayout";

const MATRIX_CITIES = MATRIX_CITY_SLUGS.map((slug) => CITY_BY_SLUG[slug]);

// Полная внутренняя перелинковка для ускорения индексации landing-страниц
const EXTRA_SECTIONS = [
  {
    title: "Все статьи /stati",
    links: CONTENT_PAGES.map((p) => ({ href: `/stati/${p.slug}`, label: p.h1 })),
  },
  ...SERVICE_SLUGS.map((service) => ({
    title: `${SERVICE_SEO[service].name} по городам`,
    links: CITIES.map((city) => ({
      href: `/${service}-${city.slug}`,
      label: `${SERVICE_SEO[service].name} ${city.phrase}`,
    })),
  })),
  ...SERVICE_SLUGS.map((service) => ({
    title: `${SERVICE_SEO[service].name} по объектам`,
    links: OBJECT_SLUGS.map((object) => ({
      href: `/${service}-${object}`,
      label: `${SERVICE_SEO[service].name} ${OBJECT_SEO[object].namePrep}`,
    })),
  })),
  ...PRICE_CITY_SERVICES.map((service) => ({
    title: `Цены на ${SERVICE_SEO[service].genitive} по городам`,
    links: MATRIX_CITIES.map((city) => ({
      href: buildPriceCityPath(service, city.slug),
      label: `Цены на ${SERVICE_SEO[service].genitive} ${city.phrase}`,
    })),
  })),
  ...SERVICE_ALIASES.map((alias) => ({
    title: `${alias.name} по городам`,
    links: MATRIX_CITIES.map((city) => ({
      href: buildServiceAliasCityPath(alias.slug, city.slug),
      label: `${alias.name} ${city.phrase}`,
    })),
  })),
];

const BASE_SECTIONS: { title: string; links: { href: string; label: string }[] }[] = [
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
      { href: "/slovar", label: "Словарь терминов ОВиК" },
      { href: "/kalkulyator-inzhenernyh-sistem", label: "Калькулятор инженерных систем" },
    ],
  },
  {
    title: "Кейсы",
    links: CASE_STUDIES.slice(0, 8).map((c) => ({
      href: `/kejs/${c.slug}`,
      label: c.title,
    })),
  },
  {
    title: "Услуги по городам",
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
  const tierCitySections = getKartaSajtaTierCityLinks();

  useSEO({
    title: "Карта сайта — Freonn",
    description:
      "Основные разделы сайта freonn.ru: услуги, цены, блог, контакты, города МО. Полный перечень URL в sitemap-index.xml.",
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
            <a href="/sitemap-index.xml" className="text-[#B91C1C] font-semibold hover:underline">
              sitemap-index.xml
            </a>
            {" "}(включая{" "}
            <a href="/sitemap-moscow-core.xml" className="text-[#B91C1C] font-semibold hover:underline">
              sitemap-moscow-core.xml
            </a>
            ).
          </p>
          <div className="grid md:grid-cols-2 gap-10">
            {BASE_SECTIONS.map((block) => (
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
            {tierCitySections.map((block) => (
              <div key={block.title} className="md:col-span-2">
                <h2 className="font-heading font-bold text-[#0F1340] text-lg mb-4 border-b border-gray-200 pb-2">
                  {block.title}
                </h2>
                <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 font-body text-sm">
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
            {EXTRA_SECTIONS.map((block) => (
              <div key={block.title} className="md:col-span-2">
                <h2 className="font-heading font-bold text-[#0F1340] text-lg mb-4 border-b border-gray-200 pb-2">
                  {block.title}
                </h2>
                <ul className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-2 font-body text-sm">
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
