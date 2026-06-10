/**
 * Гео-уровни SEO freonn.ru — Москва-first: tier-0/1 получают matrix-лендинги, tier-2 только hub + service×city.
 */
import { CITY_BY_SLUG, KNOWN_CITY_SLUGS } from "./geoRoutes";

export const TIER0_SLUGS = ["moskva", "moskovskaya-oblast"] as const;

/** Ключевые города МО (~23) — из footer-приоритета, без tier-0 */
export const TIER1_CITY_SLUGS = [
  "dzerzhinskij", "khimki", "krasnogorsk", "odintsovo", "mytishchi", "balashikha", "podolsk",
  "lyubertsy", "domodedovo", "ramenskoe", "korolev", "zhukovsky", "elektrostal", "sergiev-posad",
  "zelenograd", "dolgoprudny", "noginsk", "istra", "klin", "kolomna", "dmitrov", "shchelkovo", "serpukhov",
] as const;

/** Города с 3D, алиасами и ценами×город (tier-0 + tier-1) */
export const MATRIX_CITY_SLUGS = [...TIER0_SLUGS, ...TIER1_CITY_SLUGS] as const;

export type Tier0Slug = (typeof TIER0_SLUGS)[number];
export type Tier1CitySlug = (typeof TIER1_CITY_SLUGS)[number];
export type MatrixCitySlug = (typeof MATRIX_CITY_SLUGS)[number];

const TIER0_SET = new Set<string>(TIER0_SLUGS);
const TIER1_SET = new Set<string>(TIER1_CITY_SLUGS);
const MATRIX_SET = new Set<string>(MATRIX_CITY_SLUGS);

export function getCityTier(slug: string): 0 | 1 | 2 {
  if (TIER0_SET.has(slug)) return 0;
  if (TIER1_SET.has(slug)) return 1;
  if (KNOWN_CITY_SLUGS.has(slug)) return 2;
  return 2;
}

export function isMatrixCity(slug: string): boolean {
  return MATRIX_SET.has(slug);
}

export function isTier0Or1(slug: string): boolean {
  return getCityTier(slug) <= 1;
}

/** Tier-1 города для блоков перелинковки на главной (без Москвы) */
export const HOME_FEATURED_TIER1 = [
  "khimki", "krasnogorsk", "odintsovo", "mytishchi", "balashikha", "podolsk",
] as const;

export function getTier1CityLinks(): { slug: string; name: string; phrase: string }[] {
  return TIER1_CITY_SLUGS.map((slug) => ({
    slug,
    name: CITY_BY_SLUG[slug].name,
    phrase: CITY_BY_SLUG[slug].phrase,
  }));
}

export function getTier2CitySlugs(): string[] {
  return Object.keys(CITY_BY_SLUG).filter((slug) => getCityTier(slug) === 2);
}

export function getTier1NearbyLinks(currentSlug: string, limit = 5): { href: string; label: string }[] {
  const slugs = TIER1_CITY_SLUGS.filter((s) => s !== currentSlug);
  const idx = TIER1_CITY_SLUGS.indexOf(currentSlug as Tier1CitySlug);
  const start = idx >= 0 ? Math.max(0, idx - 2) : 0;
  return slugs.slice(start, start + limit).map((slug) => ({
    href: `/${slug}`,
    label: CITY_BY_SLUG[slug].name,
  }));
}

export function getMoscowCoreServiceLinks(): { href: string; label: string }[] {
  const services = [
    { slug: "ventilyaciya", name: "Вентиляция" },
    { slug: "kondicionirovanie", name: "Кондиционирование" },
    { slug: "dymoudalenie", name: "Дымоудаление" },
    { slug: "otoplenie", name: "Отопление" },
    { slug: "holodosnabzhenie", name: "Холодоснабжение" },
    { slug: "vodosnabzhenie", name: "Водоснабжение" },
    { slug: "elektrosnabzhenie", name: "Электроснабжение" },
    { slug: "peskostrujnaya-obrabotka", name: "Пескоструйная обработка" },
  ] as const;
  return services.map((s) => ({
    href: `/${s.slug}-moskva`,
    label: `${s.name} в Москве`,
  }));
}

export function getKartaSajtaTierCityLinks(): { title: string; links: { href: string; label: string }[] }[] {
  return [
    {
      title: "Москва и область",
      links: TIER0_SLUGS.map((slug) => ({
        href: `/${slug}`,
        label: CITY_BY_SLUG[slug].name,
      })),
    },
    {
      title: "Ключевые города МО",
      links: TIER1_CITY_SLUGS.map((slug) => ({
        href: `/${slug}`,
        label: CITY_BY_SLUG[slug].name,
      })),
    },
    {
      title: "Другие города МО",
      links: getTier2CitySlugs().map((slug) => ({
        href: `/${slug}`,
        label: CITY_BY_SLUG[slug].name,
      })),
    },
  ];
}
