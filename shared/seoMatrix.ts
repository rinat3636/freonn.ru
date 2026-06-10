/**
 * SEO-матрица freonn.ru — фазы 2–4: 3D-лендинги, алиасы×город, кейсы, словарь, цены×город.
 */
import {
  CITY_BY_SLUG,
  getCityEntry,
  KNOWN_CITY_SLUGS,
  normalizePathname,
  SERVICE_SEO,
  SERVICE_SLUGS,
} from "./geoRoutes";
import { isMatrixCity, MATRIX_CITY_SLUGS } from "./geoTiers";

export const SEO_RELEASE_PHASE = 1;

const MATRIX_CITIES = MATRIX_CITY_SLUGS.map((slug) => CITY_BY_SLUG[slug]);

export const OBJECT_SLUGS = [
  "sklad", "ofis", "tc", "zavod", "restoran", "gostinica", "shkola", "bolnica", "parking", "dc",
] as const;

export type ObjectSlug = (typeof OBJECT_SLUGS)[number];

export const OBJECT_SEO: Record<ObjectSlug, { name: string; namePrep: string; nameGen: string }> = {
  sklad: { name: "склад", namePrep: "на складе", nameGen: "склада" },
  ofis: { name: "офис", namePrep: "в офисе", nameGen: "офиса" },
  tc: { name: "торговый центр", namePrep: "в торговом центре", nameGen: "торгового центра" },
  zavod: { name: "завод", namePrep: "на производстве", nameGen: "производства" },
  restoran: { name: "ресторан", namePrep: "в ресторане", nameGen: "ресторана" },
  gostinica: { name: "гостиница", namePrep: "в гостинице", nameGen: "гостиницы" },
  shkola: { name: "школа", namePrep: "в школе", nameGen: "школы" },
  bolnica: { name: "больница", namePrep: "в медучреждении", nameGen: "медучреждения" },
  parking: { name: "паркинг", namePrep: "в паркинге", nameGen: "паркинга" },
  dc: { name: "серверная", namePrep: "в серверной", nameGen: "серверной" },
};

/** 3D только для 4 ключевых услуг × matrix-города */
export const PRIORITY_3D_SERVICES = ["ventilyaciya", "kondicionirovanie", "dymoudalenie", "otoplenie"] as const;

export const SERVICE_ALIASES = [
  { slug: "ustanovka-ventilyacii", name: "Установка вентиляции", genitive: "вентиляции", serviceSlug: "ventilyaciya" },
  { slug: "ustanovka-kondicionirovaniya", name: "Установка кондиционирования", genitive: "кондиционирования", serviceSlug: "kondicionirovanie" },
  { slug: "ustanovka-dymoudaleniya", name: "Установка дымоудаления", genitive: "дымоудаления", serviceSlug: "dymoudalenie" },
  { slug: "vozdushnoe-otoplenie", name: "Воздушное отопление", genitive: "воздушного отопления", serviceSlug: "otoplenie" },
  { slug: "vodosnabzhenie-i-kanalizaciya", name: "Водоснабжение и канализация", genitive: "водоснабжения и канализации", serviceSlug: "vodosnabzhenie" },
  { slug: "elektrosnabzhenie-i-osveshchenie", name: "Электроснабжение и освещение", genitive: "электроснабжения", serviceSlug: "elektrosnabzhenie" },
  { slug: "proektirovanie-ovik", name: "Проектирование ОВиК", genitive: "проектирования ОВиК", serviceSlug: "ventilyaciya" },
  { slug: "montazh-ovik", name: "Монтаж ОВиК", genitive: "монтажа ОВиК", serviceSlug: "ventilyaciya" },
  { slug: "puskonaladochnye-raboty", name: "Пусконаладочные работы", genitive: "пусконаладочных работ", serviceSlug: "ventilyaciya" },
  { slug: "servisnoe-obsluzhivanie", name: "Сервисное обслуживание", genitive: "сервисного обслуживания", serviceSlug: "ventilyaciya" },
] as const;

export const PRICE_CITY_SERVICES = ["ventilyaciya", "kondicionirovanie", "dymoudalenie", "otoplenie"] as const;

const ALIAS_BY_SLUG = Object.fromEntries(SERVICE_ALIASES.map((a) => [a.slug, a]));
const MATRIX_CITY_SLUGS_BY_LENGTH = [...MATRIX_CITY_SLUGS].sort((a, b) => b.length - a.length);

export function buildServiceObjectCityPath(serviceSlug: string, objectSlug: string, citySlug: string): string {
  return `/${serviceSlug}-${objectSlug}-${citySlug}`;
}

export function buildServiceAliasCityPath(aliasSlug: string, citySlug: string): string {
  return `/${aliasSlug}-${citySlug}`;
}

export function buildPriceCityPath(serviceSlug: string, citySlug: string): string {
  return `/ceny-${serviceSlug}-${citySlug}`;
}

function isPriority3d(service: string, object: string, city: string): boolean {
  return (
    PRIORITY_3D_SERVICES.includes(service as (typeof PRIORITY_3D_SERVICES)[number]) &&
    isMatrixCity(city) &&
    OBJECT_SLUGS.includes(object as ObjectSlug)
  );
}

export function getPathSeoPhase(pathname: string): number {
  const clean = normalizePathname(pathname);
  if (clean.startsWith("/kejs/")) return 2;
  if (clean.startsWith("/slovar")) return 4;
  if (clean === "/kalkulyator-inzhenernyh-sistem") return 4;
  if (parsePriceCityPath(clean)) return 3;
  if (parseServiceAliasCityPath(clean)) return 2;
  const soc = parseServiceObjectCityPath(clean);
  if (soc) return isPriority3d(soc.service, soc.object, soc.city) ? 2 : 3;
  return 1;
}

export function shouldNoIndexForSeoPhase(pathname: string): boolean {
  return getPathSeoPhase(pathname) > SEO_RELEASE_PHASE;
}

export const SERVICE_OBJECT_CITY_PATHS = new Set(
  PRIORITY_3D_SERVICES.flatMap((service) =>
    OBJECT_SLUGS.flatMap((object) =>
      MATRIX_CITIES.map((city) => buildServiceObjectCityPath(service, object, city.slug))
    )
  )
);

export const SERVICE_ALIAS_CITY_PATHS = new Set(
  SERVICE_ALIASES.flatMap((alias) =>
    MATRIX_CITIES.map((city) => buildServiceAliasCityPath(alias.slug, city.slug))
  )
);

export const PRICE_CITY_PATHS = new Set(
  PRICE_CITY_SERVICES.flatMap((service) =>
    MATRIX_CITIES.map((city) => buildPriceCityPath(service, city.slug))
  )
);

export interface ServiceObjectCityRoute {
  path: string;
  serviceSlug: string;
  objectSlug: ObjectSlug;
  citySlug: string;
}

export const SERVICE_OBJECT_CITY_ROUTES: ServiceObjectCityRoute[] = PRIORITY_3D_SERVICES.flatMap((serviceSlug) =>
  OBJECT_SLUGS.flatMap((objectSlug) =>
    MATRIX_CITIES.map((city) => ({
      path: buildServiceObjectCityPath(serviceSlug, objectSlug, city.slug),
      serviceSlug,
      objectSlug,
      citySlug: city.slug,
    }))
  )
);

export interface ServiceAliasCityRoute {
  path: string;
  aliasSlug: string;
  citySlug: string;
}

export const SERVICE_ALIAS_CITY_ROUTES: ServiceAliasCityRoute[] = SERVICE_ALIASES.flatMap((alias) =>
  MATRIX_CITIES.map((city) => ({
    path: buildServiceAliasCityPath(alias.slug, city.slug),
    aliasSlug: alias.slug,
    citySlug: city.slug,
  }))
);

export function parseServiceObjectCityPath(
  pathname: string
): { service: string; object: ObjectSlug; city: string } | null {
  const clean = normalizePathname(pathname);
  if (!SERVICE_OBJECT_CITY_PATHS.has(clean)) return null;
  for (const city of MATRIX_CITY_SLUGS_BY_LENGTH) {
    for (const object of OBJECT_SLUGS) {
      const suffix = `-${object}-${city}`;
      if (!clean.endsWith(suffix)) continue;
      const service = clean.slice(1, clean.length - suffix.length);
      if (service in SERVICE_SEO) {
        return { service, object, city };
      }
    }
  }
  return null;
}

export function parseServiceAliasCityPath(pathname: string): { alias: string; city: string } | null {
  const clean = normalizePathname(pathname);
  if (!SERVICE_ALIAS_CITY_PATHS.has(clean)) return null;
  for (const city of MATRIX_CITY_SLUGS_BY_LENGTH) {
    if (!clean.endsWith(`-${city}`)) continue;
    const alias = clean.slice(1, clean.length - city.length - 1);
    if (alias in ALIAS_BY_SLUG) {
      return { alias, city };
    }
  }
  return null;
}

export function parsePriceCityPath(pathname: string): { service: string; city: string } | null {
  const clean = normalizePathname(pathname);
  if (!PRICE_CITY_PATHS.has(clean)) return null;
  if (!clean.startsWith("/ceny-")) return null;
  const rest = clean.slice("/ceny-".length);
  for (const city of MATRIX_CITY_SLUGS_BY_LENGTH) {
    if (!rest.endsWith(`-${city}`)) continue;
    const service = rest.slice(0, rest.length - city.length - 1);
    if (PRICE_CITY_SERVICES.includes(service as (typeof PRICE_CITY_SERVICES)[number])) {
      return { service, city };
    }
  }
  return null;
}

export function getServiceObjectCitySeoMeta(pathname: string) {
  const parsed = parseServiceObjectCityPath(pathname);
  if (!parsed) return null;
  const service = SERVICE_SEO[parsed.service as keyof typeof SERVICE_SEO];
  const object = OBJECT_SEO[parsed.object];
  const city = getCityEntry(parsed.city);
  if (!service || !object || !city) return null;
  return {
    title: `${service.name} ${object.nameGen} ${city.phrase} — Freonn`,
    description: `Монтаж ${service.genitive} ${object.namePrep} ${city.phrase}. Проектирование, монтаж, пусконаладка для объектов от 500 м².`,
    keywords: `${service.name.toLowerCase()} ${object.name} ${city.name}, монтаж ${service.genitive} ${city.name}`,
  };
}

export function getServiceAliasCitySeoMeta(pathname: string) {
  const parsed = parseServiceAliasCityPath(pathname);
  if (!parsed) return null;
  const alias = ALIAS_BY_SLUG[parsed.alias];
  const city = getCityEntry(parsed.city);
  if (!alias || !city) return null;
  return {
    title: `${alias.name} ${city.phrase} — Freonn`,
    description: `${alias.name} ${city.phrase} для коммерческих и промышленных объектов. Выезд инженера, смета, гарантия.`,
    keywords: `${alias.name.toLowerCase()} ${city.name}, ${alias.genitive} ${city.name}`,
  };
}

export function getPriceCitySeoMeta(pathname: string) {
  const parsed = parsePriceCityPath(pathname);
  if (!parsed) return null;
  const service = SERVICE_SEO[parsed.service as keyof typeof SERVICE_SEO];
  const city = getCityEntry(parsed.city);
  if (!service || !city) return null;
  return {
    title: `Цены на монтаж ${service.genitive} ${city.phrase} — Freonn`,
    description: `Стоимость монтажа ${service.genitive} ${city.phrase}. Ориентиры по цене, бесплатный расчёт после обследования объекта.`,
    keywords: `цена ${service.genitive} ${city.name}, стоимость монтажа ${city.name}`,
  };
}

export function getCityServiceLinks(citySlug: string) {
  return SERVICE_SLUGS.map((serviceSlug) => {
    const service = SERVICE_SEO[serviceSlug];
    const city = CITY_BY_SLUG[citySlug];
    return {
      href: `/${serviceSlug}-${citySlug}`,
      label: `${service.name} ${city?.phrase ?? ""}`.trim(),
    };
  });
}

const FEATURED_3D_OBJECTS: ObjectSlug[] = ["sklad", "ofis", "tc", "zavod"];

/** 3D-ссылки для tier-0/1 city hub */
export function getCity3dLinks(citySlug: string, limit = 6) {
  if (!isMatrixCity(citySlug)) return [];
  const city = CITY_BY_SLUG[citySlug];
  if (!city) return [];
  return PRIORITY_3D_SERVICES.flatMap((serviceSlug) => {
    const service = SERVICE_SEO[serviceSlug];
    return FEATURED_3D_OBJECTS.map((objectSlug) => ({
      href: buildServiceObjectCityPath(serviceSlug, objectSlug, citySlug),
      label: `${service.name} ${OBJECT_SEO[objectSlug].nameGen} ${city.phrase}`,
    }));
  }).slice(0, limit);
}

export function isMatrixLandingPath(pathname: string): boolean {
  const clean = normalizePathname(pathname);
  return (
    parseServiceObjectCityPath(clean) !== null ||
    parseServiceAliasCityPath(clean) !== null ||
    parsePriceCityPath(clean) !== null
  );
}

export function isResolvableCitySlug(slug: string): boolean {
  return KNOWN_CITY_SLUGS.has(slug);
}
