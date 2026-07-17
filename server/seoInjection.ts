import {
  getCityAreaType,
  getCityEntry,
  getServiceLocationSeoMeta,
  isCityPath,
  NOINDEX_PATHS,
  normalizePathname,
  parseServiceLocationPath,
  SERVICE_SEO,
  SERVICE_SLUGS,
} from "../shared/geoRoutes";
import { getBlogArticleSeo, getBlogArticleSeoMeta } from "../shared/blogSeo";
import { getCityTier } from "../shared/geoTiers";
import {
  getPriceCitySeoMeta,
  getServiceAliasCitySeoMeta,
  getServiceObjectCitySeoMeta,
  OBJECT_SEO,
  parsePriceCityPath,
  parseServiceAliasCityPath,
  parseServiceObjectCityPath,
  SERVICE_ALIASES,
  shouldNoIndexForSeoPhase,
} from "../shared/seoMatrix";
import { CANONICAL_REDIRECTS } from "../shared/seoConfig";
import {
  buildFaqJsonLd,
  getServiceStaticFaq,
  resolveServiceSlugFromPath,
  SERVICE_OBJECT_STATIC_FAQ,
} from "../shared/serviceFaq";
import { getStaticPageJsonLd, getStaticSeoMeta } from "./staticSeo";

export { shouldOmitGeoMeta, NOINDEX_PATHS } from "../shared/geoRoutes";
export { getStaticSeoMeta };

export function isNoIndexPath(pathname: string): boolean {
  const clean = normalizePathname(pathname);
  if (NOINDEX_PATHS.has(clean)) return true;
  return shouldNoIndexForSeoPhase(clean);
}

function buildServiceGeoFaq(
  serviceName: string,
  serviceGenitive: string,
  regionPhrase: string,
  cityName: string,
  cityTier: 0 | 1 | 2
) {
  const faq = [
    {
      q: `Сколько стоит монтаж ${serviceGenitive} ${regionPhrase}?`,
      a: "Стоимость зависит от площади, мощности оборудования, трассировки, высоты потолков и требований к автоматике. Точный расчёт готовим после обследования объекта.",
    },
    {
      q: `Выезжает ли инженер Freonn ${regionPhrase}?`,
      a: `Да, инженер Freonn выезжает на объект ${regionPhrase}, собирает исходные данные, оценивает технические ограничения и готовит решение для сметы.`,
    },
    {
      q: `Какие объекты вы берёте для услуги «${serviceName}» ${regionPhrase}?`,
      a: "Работаем с коммерческими, промышленными и социальными объектами от 500 м²: офисами, складами, производствами, ТЦ, школами, клиниками и спортобъектами.",
    },
    {
      q: "Какие документы передаются после монтажа?",
      a: "Передаём исполнительную документацию, акты, паспорта оборудования и документы по пусконаладке. Состав зависит от проекта и требований заказчика.",
    },
  ];

  if (cityTier === 2) {
    faq.unshift({
      q: `Работаете ли вы ${regionPhrase} и в других городах МО?`,
      a: `Да, Freonn выполняет монтаж ${serviceGenitive} ${regionPhrase} и по всей Московской области. Для крупных проектов также работаем в Москве и ключевых городах Подмосковья.`,
    });
  } else if (cityTier === 0 && cityName === "Москва") {
    faq.unshift({
      q: "Работаете ли вы по всей Москве?",
      a: "Да, Freonn выполняет монтаж инженерных систем во всех административных округах Москвы и на объектах в пределах МКАД, ТТК и за МКАД.",
    });
  }

  return faq;
}

export function buildPageJsonLd(pathname: string): object[] | null {
  const clean = normalizePathname(pathname);
  const url = `https://freonn.ru${clean}`;

  if (isCityPath(pathname)) {
    const slug = clean.slice(1);
    const city = getCityEntry(slug);
    if (!city) return null;
    return [{
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Монтаж инженерных систем в ${city.name}`,
      description: `Проектирование и монтаж вентиляции, кондиционирования, дымоудаления и отопления ${city.phrase}.`,
      url,
      provider: { "@id": "https://freonn.ru/#organization" },
      areaServed: { "@type": getCityAreaType(slug), name: city.name },
      serviceType: "Монтаж инженерных систем",
    }];
  }

  const serviceLocation = parseServiceLocationPath(pathname);
  if (serviceLocation) {
    const service = SERVICE_SEO[serviceLocation.service as keyof typeof SERVICE_SEO];
    const city = getCityEntry(serviceLocation.location);
    if (!service || !city) return null;
    const title = `${service.name} ${city.phrase}`;
    const description = `Монтаж ${service.genitive} ${city.phrase} для коммерческих и промышленных объектов.`;
    const cityTier = getCityTier(serviceLocation.location);
    const faq = buildServiceGeoFaq(service.name, service.genitive, city.phrase, city.name, cityTier);
    return [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: title,
        description,
        url,
        provider: { "@id": "https://freonn.ru/#organization" },
        areaServed: { "@type": getCityAreaType(serviceLocation.location), name: city.name },
        serviceType: service.name,
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ];
  }

  const socParsed = parseServiceObjectCityPath(pathname);
  const socMeta = getServiceObjectCitySeoMeta(pathname);
  if (socMeta && socParsed) {
    const city = getCityEntry(socParsed.city);
    return [{
      "@context": "https://schema.org",
      "@type": "Service",
      name: socMeta.title.replace(" — Freonn", ""),
      description: socMeta.description,
      url,
      provider: { "@id": "https://freonn.ru/#organization" },
      areaServed: city
        ? { "@type": getCityAreaType(socParsed.city), name: city.name }
        : undefined,
    }];
  }

  const aliasParsed = parseServiceAliasCityPath(pathname);
  const aliasMeta = getServiceAliasCitySeoMeta(pathname);
  if (aliasMeta && aliasParsed) {
    const city = getCityEntry(aliasParsed.city);
    return [{
      "@context": "https://schema.org",
      "@type": "Service",
      name: aliasMeta.title.replace(" — Freonn", ""),
      description: aliasMeta.description,
      url,
      provider: { "@id": "https://freonn.ru/#organization" },
      areaServed: city ? { "@type": getCityAreaType(aliasParsed.city), name: city.name } : undefined,
    }];
  }

  const priceParsed = parsePriceCityPath(pathname);
  const priceMeta = getPriceCitySeoMeta(pathname);
  if (priceMeta && priceParsed) {
    const city = getCityEntry(priceParsed.city);
    return [{
      "@context": "https://schema.org",
      "@type": "Service",
      name: priceMeta.title.replace(" — Freonn", ""),
      description: priceMeta.description,
      url,
      provider: { "@id": "https://freonn.ru/#organization" },
      areaServed: city ? { "@type": getCityAreaType(priceParsed.city), name: city.name } : undefined,
    }];
  }

  if (clean === "/") {
    return [{
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Freonn — монтаж инженерных систем в Москве и МО",
      url,
      isPartOf: { "@id": "https://freonn.ru/#website" },
    }];
  }

  if (clean === "/contacts") {
    return [{
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "Контакты Freonn",
      url,
      mainEntity: {
        "@type": "LocalBusiness",
        name: "Freonn",
        telephone: "+78001012009",
        email: "freonn@internet.ru",
        url: "https://freonn.ru",
        address: {
          "@type": "PostalAddress",
          streetAddress: "ул. Ленина, д. 2Б",
          addressLocality: "Дзержинский",
          addressRegion: "Московская область",
          postalCode: "143500",
          addressCountry: "RU",
        },
      },
    }];
  }

  if (clean.startsWith("/blog/")) {
    const slug = clean.slice("/blog/".length);
    const article = getBlogArticleSeo(slug);
    if (!article) return null;
    return [{
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.description,
      url,
      datePublished: article.published,
      dateModified: article.published,
      author: { "@type": "Organization", name: "Freonn", url: "https://freonn.ru" },
      publisher: {
        "@type": "Organization",
        name: "Freonn",
        logo: {
          "@type": "ImageObject",
          url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663524928365/d5oRPUYjSRzESZKpUgG9pW/freonn-logo_62401a1b.png",
        },
      },
      articleSection: article.category,
      inLanguage: "ru-RU",
    }];
  }

  const pathSlug = clean.slice(1);
  const resolvedService = resolveServiceSlugFromPath(pathSlug);
  const service = SERVICE_SEO[resolvedService as keyof typeof SERVICE_SEO];
  if (service && SERVICE_SLUGS.includes(resolvedService as (typeof SERVICE_SLUGS)[number])) {
    const alias = SERVICE_ALIASES.find((a) => a.slug === pathSlug);
    const serviceName = alias?.name ?? service.name;
    const faq = getServiceStaticFaq(resolvedService);
    return [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: serviceName,
        description: `Проектирование и монтаж ${service.genitive} для коммерческих и промышленных объектов в Москве и Московской области.`,
        url,
        provider: { "@id": "https://freonn.ru/#organization" },
        areaServed: [
          { "@type": "City", name: "Москва" },
          { "@type": "AdministrativeArea", name: "Московская область" },
        ],
        serviceType: serviceName,
      },
      buildFaqJsonLd(faq),
    ];
  }

  for (const serviceSlug of SERVICE_SLUGS) {
    for (const [objectSlug, objectData] of Object.entries(OBJECT_SEO)) {
      if (clean === `/${serviceSlug}-${objectSlug}`) {
        const serviceData = SERVICE_SEO[serviceSlug];
        return [
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: `${serviceData.name} ${objectData.namePrep}`,
            description: `Проектирование и монтаж ${serviceData.genitive} ${objectData.namePrep} в Москве и Московской области.`,
            url,
            provider: { "@id": "https://freonn.ru/#organization" },
            areaServed: [
              { "@type": "City", name: "Москва" },
              { "@type": "AdministrativeArea", name: "Московская область" },
            ],
            serviceType: serviceData.name,
          },
          buildFaqJsonLd(SERVICE_OBJECT_STATIC_FAQ),
        ];
      }
    }
  }

  const staticLd = getStaticPageJsonLd(pathname);
  if (staticLd) return staticLd;

  return null;
}

const GEO_META_TAGS = [
  "geo.region",
  "geo.placename",
  "geo.position",
  "ICBM",
  "yandex-region",
];

export function stripGeoMetaTags(html: string): string {
  let next = html;
  for (const name of GEO_META_TAGS) {
    next = next.replace(new RegExp(`<meta name="${name}" content="[^"]*" \\/>\\s*`, "g"), "");
  }
  return next;
}

export function injectPageJsonLd(html: string, schemas: object[]): string {
  const script = `<script type="application/ld+json" data-seo-id="page-jsonld">${JSON.stringify(schemas.length === 1 ? schemas[0] : schemas)}</script>`;
  return html.replace("</head>", `    ${script}\n  </head>`);
}

/** Для генерации server-side title/description городов */
export function getCitySeoMeta(slug: string) {
  const city = getCityEntry(slug);
  if (!city) return null;

  if (slug === "moskva") {
    return {
      title: "Монтаж инженерных систем в Москве — Freonn",
      description:
        "Проектирование и монтаж вентиляции, кондиционирования, дымоудаления и отопления в Москве. Бизнес-центры, ТЦ, склады, производства. Выезд инженера, гарантия 1 год.",
      keywords:
        "монтаж вентиляции Москва, кондиционирование Москва, инженерные системы Москва, дымоудаление Москва, Freonn",
    };
  }

  if (slug === "moskovskaya-oblast") {
    return {
      title: "Монтаж инженерных систем в Московской области — Freonn",
      description:
        "Проектирование и монтаж инженерных систем по всей Московской области: вентиляция, кондиционирование, дымоудаление, отопление. 1280+ объектов, выезд инженера.",
      keywords:
        "монтаж вентиляции Московская область, кондиционирование МО, инженерные системы Подмосковье, Freonn",
    };
  }

  return {
    title: `Монтаж инженерных систем ${city.phrase} — Freonn`,
    description: `Проектирование и монтаж вентиляции, кондиционирования, дымоудаления, отопления и электроснабжения ${city.phrase}. Выезд инженера и расчёт.`,
    keywords: `монтаж вентиляции ${city.name}, кондиционирование ${city.name}, инженерные системы ${city.name}`,
  };
}

export function getServiceGeoSeoMeta(pathname: string) {
  return (
    getServiceLocationSeoMeta(pathname) ||
    getServiceObjectCitySeoMeta(pathname) ||
    getServiceAliasCitySeoMeta(pathname) ||
    getPriceCitySeoMeta(pathname)
  );
}

export function getBlogSeoMeta(pathname: string) {
  const clean = normalizePathname(pathname);
  if (!clean.startsWith("/blog/")) return null;
  return getBlogArticleSeoMeta(clean.slice("/blog/".length));
}

export function getServicePageSeoMeta(pathname: string) {
  const clean = normalizePathname(pathname);
  const pathSlug = clean.slice(1);
  const alias = SERVICE_ALIASES.find((a) => a.slug === pathSlug);
  if (alias) {
    return {
      title: `${alias.name} в Москве и МО — Freonn`,
      description: `Проектирование и монтаж ${alias.genitive} для коммерческих и промышленных объектов в Москве и Московской области. Выезд инженера, смета, гарантия.`,
      keywords: `монтаж ${alias.genitive} Москва, ${alias.name.toLowerCase()} Московская область, Freonn`,
    };
  }

  const resolved = resolveServiceSlugFromPath(pathSlug);
  const service = SERVICE_SEO[resolved as keyof typeof SERVICE_SEO];
  if (!service || !SERVICE_SLUGS.includes(resolved as (typeof SERVICE_SLUGS)[number])) {
    return null;
  }

  return {
    title: `Монтаж ${service.genitive} в Москве и МО — Freonn`,
    description: `Проектирование и монтаж ${service.genitive} для коммерческих и промышленных объектов в Москве и Московской области. Выезд инженера, смета, гарантия.`,
    keywords: `монтаж ${service.genitive} Москва, ${service.name.toLowerCase()} Московская область, Freonn`,
  };
}

export function resolveCanonicalPath(pathname: string): string {
  const clean = normalizePathname(pathname);
  const redirected = CANONICAL_REDIRECTS[clean];
  if (redirected) return redirected;

  const pathSlug = clean.slice(1);
  const resolved = resolveServiceSlugFromPath(pathSlug);
  if (resolved !== pathSlug && SERVICE_SEO[resolved as keyof typeof SERVICE_SEO]) {
    return `/${resolved}`;
  }

  return clean;
}
