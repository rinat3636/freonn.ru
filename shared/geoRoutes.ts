/**
 * Единый источник гео-маршрутов freonn.ru.
 * Используется сервером (404, SSR SEO) и клиентом (страницы, footer, карта сайта).
 */

export type GeoSlug = "moskva" | "moskovskaya-oblast";

export interface CityEntry {
  slug: string;
  name: string;
  phrase: string;
}

export interface NavLink {
  href: string;
  label: string;
}

export const CITIES: CityEntry[] = [
  { slug: "moskva", name: "Москва", phrase: "в Москве" },
  { slug: "moskovskaya-oblast", name: "Московская область", phrase: "в Московской области" },
  { slug: "dzerzhinskij", name: "Дзержинский", phrase: "в Дзержинском" },
  { slug: "istra", name: "Истра", phrase: "в Истре" },
  { slug: "odintsovo", name: "Одинцово", phrase: "в Одинцово" },
  { slug: "khimki", name: "Химки", phrase: "в Химках" },
  { slug: "mytishchi", name: "Мытищи", phrase: "в Мытищах" },
  { slug: "podolsk", name: "Подольск", phrase: "в Подольске" },
  { slug: "balashikha", name: "Балашиха", phrase: "в Балашихе" },
  { slug: "korolev", name: "Королёв", phrase: "в Королёве" },
  { slug: "lyubertsy", name: "Люберцы", phrase: "в Люберцах" },
  { slug: "serpukhov", name: "Серпухов", phrase: "в Серпухове" },
  { slug: "klin", name: "Клин", phrase: "в Клину" },
  { slug: "solnechnogorsk", name: "Солнечногорск", phrase: "в Солнечногорске" },
  { slug: "volokolamsk", name: "Волоколамск", phrase: "в Волоколамске" },
  { slug: "ruza", name: "Руза", phrase: "в Рузе" },
  { slug: "mozhaisk", name: "Можайск", phrase: "в Можайске" },
  { slug: "naro-fominsk", name: "Наро-Фоминск", phrase: "в Наро-Фоминске" },
  { slug: "chekhov", name: "Чехов", phrase: "в Чехове" },
  { slug: "domodedovo", name: "Домодедово", phrase: "в Домодедово" },
  { slug: "ramenskoe", name: "Раменское", phrase: "в Раменском" },
  { slug: "elektrostal", name: "Электросталь", phrase: "в Электростали" },
  { slug: "noginsk", name: "Ногинск", phrase: "в Ногинске" },
  { slug: "shchelkovo", name: "Щёлково", phrase: "в Щёлково" },
  { slug: "fryazevo", name: "Фрязево", phrase: "в Фрязево" },
  { slug: "pushkino", name: "Пушкино", phrase: "в Пушкино" },
  { slug: "sergiev-posad", name: "Сергиев Посад", phrase: "в Сергиевом Посаде" },
  { slug: "dmitrov", name: "Дмитров", phrase: "в Дмитрове" },
  { slug: "dubna", name: "Дубна", phrase: "в Дубне" },
  { slug: "taldom", name: "Талдом", phrase: "в Талдоме" },
  { slug: "orekhovo-zuevo", name: "Орехово-Зуево", phrase: "в Орехово-Зуево" },
  { slug: "voskresensk", name: "Воскресенск", phrase: "в Воскресенске" },
  { slug: "kolomna", name: "Коломна", phrase: "в Коломне" },
  { slug: "kashira", name: "Кашира", phrase: "в Кашире" },
  { slug: "stupino", name: "Ступино", phrase: "в Ступино" },
  { slug: "protvino", name: "Протвино", phrase: "в Протвино" },
  { slug: "zhukovsky", name: "Жуковский", phrase: "в Жуковском" },
  { slug: "lobnya", name: "Лобня", phrase: "в Лобне" },
  { slug: "dolgoprudny", name: "Долгопрудный", phrase: "в Долгопрудном" },
  { slug: "krasnogorsk", name: "Красногорск", phrase: "в Красногорске" },
  { slug: "krasnoznamensk", name: "Краснознаменск", phrase: "в Краснознаменске" },
  { slug: "zelenograd", name: "Зеленоград", phrase: "в Зеленограде" },
  { slug: "troitsk", name: "Троицк", phrase: "в Троицке" },
  { slug: "shcherbinka", name: "Щербинка", phrase: "в Щербинке" },
  { slug: "vidnoye", name: "Видное", phrase: "в Видном" },
  { slug: "reutov", name: "Реутов", phrase: "в Реутове" },
  { slug: "kotelniki", name: "Котельники", phrase: "в Котельниках" },
  { slug: "lytkarino", name: "Лыткарино", phrase: "в Лыткарино" },
  { slug: "fryazino", name: "Фрязино", phrase: "во Фрязино" },
  { slug: "ivanteevka", name: "Ивантеевка", phrase: "в Ивантеевке" },
  { slug: "krasnoarmeysk", name: "Красноармейск", phrase: "в Красноармейске" },
  { slug: "hotkovo", name: "Хотьково", phrase: "в Хотькове" },
  { slug: "pushchino", name: "Пущино", phrase: "в Пущино" },
  { slug: "chernogolovka", name: "Черноголовка", phrase: "в Черноголовке" },
  { slug: "zvenigorod", name: "Звенигород", phrase: "в Звенигороде" },
  { slug: "kubinka", name: "Кубинка", phrase: "в Кубинке" },
  { slug: "aprelevka", name: "Апрелевка", phrase: "в Апрелевке" },
  { slug: "bronnitsy", name: "Бронницы", phrase: "в Бронницах" },
  { slug: "egorevsk", name: "Егорьевск", phrase: "в Егорьевске" },
  { slug: "ozery", name: "Озёры", phrase: "в Озёрах" },
  { slug: "pavlovsky-posad", name: "Павловский Посад", phrase: "в Павловском Посаде" },
  { slug: "roshal", name: "Рошаль", phrase: "в Рошале" },
  { slug: "shatura", name: "Шатура", phrase: "в Шатуре" },
  { slug: "vereya", name: "Верея", phrase: "в Верее" },
  { slug: "yakhroma", name: "Яхрома", phrase: "в Яхроме" },
  { slug: "staraya-kupavna", name: "Старая Купавна", phrase: "в Старой Купавне" },
  { slug: "elektrogorsk", name: "Электрогорск", phrase: "в Электрогорске" },
  { slug: "likino-dulevo", name: "Ликино-Дулёво", phrase: "в Ликино-Дулёво" },
  { slug: "krasnozavodsk", name: "Краснозаводск", phrase: "в Краснозаводске" },
];

export const CITY_BY_SLUG = Object.fromEntries(CITIES.map((city) => [city.slug, city])) as Record<
  string,
  CityEntry
>;

export const KNOWN_CITY_SLUGS = new Set(CITIES.map((city) => city.slug));

export const SERVICE_SLUGS = [
  "ventilyaciya",
  "kondicionirovanie",
  "dymoudalenie",
  "otoplenie",
  "holodosnabzhenie",
  "vodosnabzhenie",
  "peskostrujnaya-obrabotka",
  "elektrosnabzhenie",
] as const;

export const GEO_SLUGS: GeoSlug[] = ["moskva", "moskovskaya-oblast"];

export const GEO_REGIONS_SEO: Record<
  GeoSlug,
  { name: string; phrase: string; areaType: "City" | "AdministrativeArea"; shortLabel: string }
> = {
  moskva: { name: "Москва", phrase: "в Москве", areaType: "City", shortLabel: "в Москве" },
  "moskovskaya-oblast": {
    name: "Московская область",
    phrase: "в Московской области",
    areaType: "AdministrativeArea",
    shortLabel: "в МО",
  },
};

export const SERVICE_SEO = {
  ventilyaciya: { name: "Вентиляция", genitive: "вентиляции" },
  kondicionirovanie: { name: "Кондиционирование", genitive: "кондиционирования" },
  dymoudalenie: { name: "Дымоудаление", genitive: "дымоудаления" },
  otoplenie: { name: "Отопление", genitive: "отопления" },
  holodosnabzhenie: { name: "Холодоснабжение", genitive: "холодоснабжения" },
  vodosnabzhenie: { name: "Водоснабжение", genitive: "водоснабжения" },
  elektrosnabzhenie: { name: "Электроснабжение", genitive: "электроснабжения" },
  "peskostrujnaya-obrabotka": { name: "Пескоструйная обработка", genitive: "пескоструйной обработки" },
} as const;

import { OBJECT_SLUGS } from "./objectSlugs";

export const SERVICE_OBJECT_PATHS = new Set(
  SERVICE_SLUGS.flatMap((service) => OBJECT_SLUGS.map((object) => `/${service}-${object}`))
);

/** Все landing-страницы «услуга × город/регион»: /ventilyaciya-khimki, /otoplenie-moskva и т.д. */
export const SERVICE_LOCATION_PATHS = new Set(
  SERVICE_SLUGS.flatMap((service) => CITIES.map((city) => `/${service}-${city.slug}`))
);

/** @deprecated Используйте SERVICE_LOCATION_PATHS */
export const SERVICE_GEO_PATHS = SERVICE_LOCATION_PATHS;

export interface ServiceLocationRoute {
  path: string;
  serviceSlug: string;
  locationSlug: string;
}

export const SERVICE_LOCATION_ROUTES: ServiceLocationRoute[] = SERVICE_SLUGS.flatMap((serviceSlug) =>
  CITIES.map((city) => ({
    path: `/${serviceSlug}-${city.slug}`,
    serviceSlug,
    locationSlug: city.slug,
  }))
);

/** Slug-ы локаций для парсинга URL (длинные первыми — naro-fominsk, moskovskaya-oblast) */
const LOCATION_SLUGS_BY_LENGTH = [...CITIES.map((c) => c.slug)].sort((a, b) => b.length - a.length);

export const BLOG_SLUGS = new Set([
  "montazh-teplovyh-punktov", "avtomatizaciya-sistem", "tekhnicheskij-audit",
  "montazh-ventilyacii", "kkb-dlya-pritochnoj-ustanovki", "ventilyaciya-v-shkole",
  "kondicionirovanie-kinoteatra", "ventilyaciya-medicinskih-uchrezhdenij",
  "kondicionirovanie-servernoj-komnaty", "vozdushnoe-otoplenie-ceha",
  "ventilyaciya-avtostoyanka", "dispetcherizaciya-sistem",
  "kratnost-i-raschet-vozduhoobmena", "ventilyacionnoe-oborudovanie", "rekuperator",
  "kondicionirovanie-vozduha", "filtry-dlya-vytyazhek", "kanalnye-ventilyatory",
  "ventilyaciya-pod-klyuch", "proektirovanie-ventilyacii", "obsluzhivanie-ventilyacii",
  "vrf-sistemy", "chillery-i-fankojly", "dymoudalenie-pod-klyuch", "teplovye-nasosy",
  "energoeffektivnost-ventilyacii", "montazh-kondicionirovaniya", "ventilyaciya-sklada",
  "kondicionirovanie-pod-klyuch", "ventilyaciya-promyshlennyh-predpriyatij",
  "avtomatika-ventilyacii",
]);

export const PRICING_SLUGS = new Set([
  "ventilyaciya", "kondicionirovanie", "dymoudalenie", "peskostruj", "kompleks",
]);

export const VALID_STATIC_PATHS = new Set([
  "/",
  "/contacts", "/o-kompanii", "/blog", "/faq", "/uslugi", "/obekty", "/ceny",
  "/ventilyaciya", "/kondicionirovanie", "/dymoudalenie", "/otoplenie",
  "/holodosnabzhenie", "/vodosnabzhenie", "/peskostrujnaya-obrabotka", "/elektrosnabzhenie",
  "/ustanovka-ventilyacii", "/ustanovka-kondicionirovaniya", "/ustanovka-dymoudaleniya",
  "/vozdushnoe-otoplenie", "/vodosnabzhenie-i-kanalizaciya", "/elektrosnabzhenie-i-osveshchenie",
  "/proektirovanie-ovik", "/montazh-ovik", "/puskonaladochnye-raboty", "/servisnoe-obsluzhivanie",
  "/ceny-na-montazh-ventilyacii", "/ceny-na-montazh-kondicionirovaniya",
  "/ceny-na-montazh-dymoudaleniya", "/ceny-na-montazh-inzhenernyh-sistem", "/ceny-na-peskostruj",
  "/promyshlennye-obekty", "/kommercheskie-obekty", "/premium-obekty",
  "/licenzii-i-sertifikaty", "/sertifikaty", "/rekvizity", "/garantii", "/garantiya",
  "/akcii", "/novosti", "/vakansii", "/dokumenty", "/partnery", "/partneram",
  "/oplata-i-dostavka", "/sotrudniki", "/video-kejsy", "/poleznye-materialy",
  "/spasibo", "/404",
  "/auth/login", "/auth/app-callback",
  "/politika-konfidencialnosti", "/karta-sajta",
  "/slovar", "/kalkulyator-inzhenernyh-sistem",
]);

export const NOINDEX_PATHS = new Set([
  "/spasibo",
  "/auth/login",
  "/auth/app-callback",
  "/oplata-i-dostavka",
  "/sotrudniki",
  "/video-kejsy",
  "/poleznye-materialy",
]);

/** Порядок городов в footer */
const FOOTER_CITY_SLUGS = [
  "moskva", "moskovskaya-oblast", "dzerzhinskij", "khimki", "krasnogorsk", "odintsovo",
  "mytishchi", "balashikha", "podolsk", "lyubertsy", "domodedovo", "ramenskoe", "korolev",
  "zhukovsky", "elektrostal", "sergiev-posad", "zelenograd", "dolgoprudny", "noginsk", "istra",
  "klin", "kolomna", "dmitrov", "shchelkovo", "serpukhov",
] as const;

/** Порядок городов в HTML-карте сайта */
const KARTA_CITY_SLUGS = [
  "moskva", "moskovskaya-oblast", "dzerzhinskij", "khimki", "krasnogorsk", "odintsovo",
  "mytishchi", "balashikha", "podolsk", "lyubertsy", "domodedovo", "zelenograd", "korolev",
  "zhukovsky", "elektrostal", "sergiev-posad", "noginsk", "istra", "klin", "kolomna", "dmitrov",
  "shchelkovo", "serpukhov", "ramenskoe", "dolgoprudny", "troitsk",
] as const;

export function normalizePathname(pathname: string): string {
  return pathname.replace(/\/+$/, "") || "/";
}

export function isKnownCitySlug(slug: string): boolean {
  return KNOWN_CITY_SLUGS.has(slug);
}

export function getCityEntry(slug: string): CityEntry | undefined {
  return CITY_BY_SLUG[slug];
}

export function buildServiceGeoPath(serviceSlug: string, geo: GeoSlug): string {
  return `/${serviceSlug}-${geo}`;
}

export function buildServiceLocationPath(serviceSlug: string, locationSlug: string): string {
  return `/${serviceSlug}-${locationSlug}`;
}

export function isCityPath(pathname: string): boolean {
  const clean = normalizePathname(pathname);
  const segments = clean.split("/").filter(Boolean);
  return segments.length === 1 && KNOWN_CITY_SLUGS.has(segments[0]);
}

export function parseServiceLocationPath(
  pathname: string
): { service: string; location: string } | null {
  const clean = normalizePathname(pathname);
  if (!SERVICE_LOCATION_PATHS.has(clean)) return null;
  for (const location of LOCATION_SLUGS_BY_LENGTH) {
    if (clean.endsWith(`-${location}`)) {
      const service = clean.slice(1, clean.length - location.length - 1);
      if (service in SERVICE_SEO) {
        return { service, location };
      }
    }
  }
  return null;
}

/** @deprecated Используйте parseServiceLocationPath */
export function parseServiceGeoPath(pathname: string): { service: string; geo: GeoSlug } | null {
  const parsed = parseServiceLocationPath(pathname);
  if (!parsed || !GEO_SLUGS.includes(parsed.location as GeoSlug)) return null;
  return { service: parsed.service, geo: parsed.location as GeoSlug };
}

export function shouldOmitGeoMeta(pathname: string): boolean {
  if (isCityPath(pathname)) return true;
  return parseServiceLocationPath(pathname) !== null;
}

export function getServiceLocationSeoMeta(pathname: string) {
  const parsed = parseServiceLocationPath(pathname);
  if (!parsed) return null;
  const service = SERVICE_SEO[parsed.service as keyof typeof SERVICE_SEO];
  const city = getCityEntry(parsed.location);
  if (!service || !city) return null;
  return {
    title: `Монтаж ${service.genitive} ${city.phrase} — Freonn`,
    description: `${service.name} ${city.phrase} для коммерческих и промышленных объектов. Проектирование, монтаж, пусконаладка и гарантия.`,
    keywords: `монтаж ${service.genitive} ${city.name}, ${service.name.toLowerCase()} ${city.name}, Freonn`,
  };
}

export function getNearbyCityLinks(currentSlug: string, limit = 5): NavLink[] {
  const slugs = FOOTER_CITY_SLUGS.filter((s) => s !== currentSlug && s !== "moskovskaya-oblast");
  const idx = FOOTER_CITY_SLUGS.indexOf(currentSlug as (typeof FOOTER_CITY_SLUGS)[number]);
  const start = idx >= 0 ? Math.max(0, idx - 2) : 0;
  return slugs.slice(start, start + limit).map((slug) => ({
    href: `/${slug}`,
    label: CITY_BY_SLUG[slug].name,
  }));
}

export function getFooterCityLinks(): NavLink[] {
  return FOOTER_CITY_SLUGS.map((slug) => ({
    href: `/${slug}`,
    label: CITY_BY_SLUG[slug].name,
  }));
}

export function getFooterServiceGeoLinks(): NavLink[] {
  const priorityServices = ["ventilyaciya", "kondicionirovanie", "dymoudalenie", "otoplenie"] as const;
  const priorityCities = ["moskva", "khimki", "krasnogorsk", "odintsovo"] as const;
  return priorityServices.flatMap((serviceSlug) => {
    const service = SERVICE_SEO[serviceSlug];
    return priorityCities.map((citySlug) => ({
      href: buildServiceLocationPath(serviceSlug, citySlug),
      label: `${service.name} ${CITY_BY_SLUG[citySlug].phrase}`,
    }));
  });
}

export function getKartaSajtaCityLinks(): NavLink[] {
  return KARTA_CITY_SLUGS.map((slug) => ({
    href: `/${slug}`,
    label: CITY_BY_SLUG[slug].name,
  }));
}

export function getKartaSajtaServiceGeoLinks(): NavLink[] {
  const featured = [
    { service: "ventilyaciya" as const, cities: ["moskva", "khimki", "krasnogorsk", "odintsovo"] as const },
    { service: "kondicionirovanie" as const, cities: ["moskva", "podolsk", "balashikha", "domodedovo"] as const },
    { service: "dymoudalenie" as const, cities: ["moskva", "mytishchi", "lyubertsy", "korolev"] as const },
  ];
  return featured.flatMap(({ service, cities }) => {
    const svc = SERVICE_SEO[service];
    return cities.map((citySlug) => ({
      href: buildServiceLocationPath(service, citySlug),
      label: `${svc.name} ${CITY_BY_SLUG[citySlug].phrase}`,
    }));
  });
}

/** Экспорт для генерации sitemap.xml */
export function getBlogSlugs(): string[] {
  return Array.from(BLOG_SLUGS);
}

export function getPricingSlugs(): string[] {
  return Array.from(PRICING_SLUGS);
}

export function getCityAreaType(slug: string): "City" | "AdministrativeArea" {
  return slug === "moskovskaya-oblast" ? "AdministrativeArea" : "City";
}

export { OBJECT_SLUGS } from "./objectSlugs";
export type { ObjectSlug } from "./objectSlugs";
