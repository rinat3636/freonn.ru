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

const OBJECT_SLUGS = [
  "sklad", "ofis", "tc", "zavod", "restoran", "gostinica", "shkola", "bolnica", "parking", "dc",
];

export const SERVICE_OBJECT_PATHS = new Set(
  SERVICE_SLUGS.flatMap((service) => OBJECT_SLUGS.map((object) => `/${service}-${object}`))
);

export const SERVICE_GEO_PATHS = new Set(
  SERVICE_SLUGS.flatMap((service) => GEO_SLUGS.map((geo) => `/${service}-${geo}`))
);

const BLOG_SLUGS = new Set([
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

const PRICING_SLUGS = new Set([
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

export function isCityPath(pathname: string): boolean {
  const clean = normalizePathname(pathname);
  const segments = clean.split("/").filter(Boolean);
  return segments.length === 1 && KNOWN_CITY_SLUGS.has(segments[0]);
}

export function parseServiceGeoPath(pathname: string): { service: string; geo: GeoSlug } | null {
  const clean = normalizePathname(pathname);
  if (!SERVICE_GEO_PATHS.has(clean)) return null;
  for (const geo of GEO_SLUGS) {
    if (clean.endsWith(`-${geo}`)) {
      return { service: clean.slice(1, clean.length - geo.length - 1), geo };
    }
  }
  return null;
}

export function isValidSpaPath(pathname: string): boolean {
  const clean = normalizePathname(pathname);

  if (VALID_STATIC_PATHS.has(clean)) return true;

  if (clean.startsWith("/blog/")) {
    return BLOG_SLUGS.has(clean.slice("/blog/".length));
  }

  if (clean.startsWith("/ceny/")) {
    return PRICING_SLUGS.has(clean.slice("/ceny/".length));
  }

  const segments = clean.split("/").filter(Boolean);
  if (segments.length !== 1) return false;

  const slug = segments[0];
  if (KNOWN_CITY_SLUGS.has(slug)) return true;
  if (SERVICE_OBJECT_PATHS.has(clean)) return true;
  if (SERVICE_GEO_PATHS.has(clean)) return true;

  return false;
}

export function shouldOmitGeoMeta(pathname: string): boolean {
  if (isCityPath(pathname)) return true;
  const parsed = parseServiceGeoPath(pathname);
  return parsed?.geo === "moskovskaya-oblast";
}

export function getFooterCityLinks(): NavLink[] {
  return FOOTER_CITY_SLUGS.map((slug) => ({
    href: `/${slug}`,
    label: CITY_BY_SLUG[slug].name,
  }));
}

export function getFooterServiceGeoLinks(): NavLink[] {
  return SERVICE_SLUGS.flatMap((serviceSlug) => {
    const service = SERVICE_SEO[serviceSlug];
    return GEO_SLUGS.map((geo) => ({
      href: buildServiceGeoPath(serviceSlug, geo),
      label: `${service.name} ${GEO_REGIONS_SEO[geo].shortLabel}`,
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
  return SERVICE_SLUGS.flatMap((serviceSlug) => {
    const service = SERVICE_SEO[serviceSlug];
    return GEO_SLUGS.map((geo) => ({
      href: buildServiceGeoPath(serviceSlug, geo),
      label: `${service.name} ${GEO_REGIONS_SEO[geo].phrase}`,
    }));
  });
}

export function getCityAreaType(slug: string): "City" | "AdministrativeArea" {
  return slug === "moskovskaya-oblast" ? "AdministrativeArea" : "City";
}
