import {
  getCityAreaType,
  getCityEntry,
  getServiceLocationSeoMeta,
  isCityPath,
  NOINDEX_PATHS,
  normalizePathname,
  parseServiceLocationPath,
  SERVICE_SEO,
} from "../shared/geoRoutes";
import { getCityTier } from "../shared/geoTiers";
import {
  getPriceCitySeoMeta,
  getServiceAliasCitySeoMeta,
  getServiceObjectCitySeoMeta,
  parsePriceCityPath,
  parseServiceAliasCityPath,
  parseServiceObjectCityPath,
  shouldNoIndexForSeoPhase,
} from "../shared/seoMatrix";

export { shouldOmitGeoMeta, NOINDEX_PATHS } from "../shared/geoRoutes";

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
