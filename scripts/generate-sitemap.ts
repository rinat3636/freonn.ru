/**
 * generate-sitemap.ts — tier-aware sitemap index (Moscow-first SEO)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { CASE_STUDIES } from "../shared/caseStudies";
import { GLOSSARY_TERMS } from "../shared/glossaryTerms";
import { getCityTier, TIER0_SLUGS } from "../shared/geoTiers";
import {
  CITIES,
  getBlogSlugs,
  getPricingSlugs,
  NOINDEX_PATHS,
  parseServiceLocationPath,
  SERVICE_LOCATION_PATHS,
  SERVICE_OBJECT_PATHS,
  VALID_STATIC_PATHS,
} from "../shared/geoRoutes";
import { CANONICAL_REDIRECTS } from "../shared/seoConfig";
import {
  getPathSeoPhase,
  PRICE_CITY_PATHS,
  SEO_RELEASE_PHASE,
  SERVICE_ALIAS_CITY_PATHS,
  SERVICE_OBJECT_CITY_PATHS,
} from "../shared/seoMatrix";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "../client/public");
const SITE_URL = "https://freonn.ru";
const TODAY = new Date().toISOString().slice(0, 10);

const REDIRECT_SOURCES = new Set(Object.keys(CANONICAL_REDIRECTS));

type UrlEntry = { loc: string; priority: string; changefreq: string; lastmod: string };

function entry(urlPath: string, priority: string, changefreq: string): UrlEntry {
  return {
    loc: `${SITE_URL}${urlPath === "/" ? "/" : urlPath}`,
    priority,
    changefreq,
    lastmod: TODAY,
  };
}

function renderUrlset(entries: UrlEntry[]): string {
  const body = entries
    .map(
      (e) => `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

function renderIndex(files: string[]): string {
  const body = files
    .map(
      (f) => `  <sitemap>
    <loc>${SITE_URL}/${f}</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>
`;
}

function includeInSitemap(urlPath: string): boolean {
  if (NOINDEX_PATHS.has(urlPath) || urlPath === "/404" || REDIRECT_SOURCES.has(urlPath)) return false;
  return getPathSeoPhase(urlPath) <= SEO_RELEASE_PHASE;
}

function cityPriority(slug: string): string {
  const tier = getCityTier(slug);
  if (tier === 0) return slug === "moskva" ? "0.95" : "0.92";
  if (tier === 1) return "0.85";
  return "0.55";
}

function serviceGeoPriority(urlPath: string): string {
  const parsed = parseServiceLocationPath(urlPath);
  if (!parsed) return "0.75";
  const tier = getCityTier(parsed.location);
  if (tier === 0) return "0.95";
  if (tier === 1) return "0.85";
  return "0.55";
}

function cityChangefreq(slug: string): string {
  return getCityTier(slug) <= 1 ? "weekly" : "monthly";
}

const staticUrls: UrlEntry[] = [];
for (const p of VALID_STATIC_PATHS) {
  if (!includeInSitemap(p)) continue;
  staticUrls.push(
    entry(
      p,
      p === "/" ? "1.0" : ["/contacts", "/o-kompanii", "/uslugi", "/ceny"].includes(p) ? "0.9" : "0.7",
      p === "/" ? "daily" : "monthly"
    )
  );
}
// /slovar and /kalkulyator-inzhenernyh-sistem are already in VALID_STATIC_PATHS;
// add individual glossary term pages here.
if (includeInSitemap("/slovar")) {
  for (const t of GLOSSARY_TERMS) {
    const p = `/slovar/${t.slug}`;
    if (includeInSitemap(p)) staticUrls.push(entry(p, "0.6", "monthly"));
  }
}
for (const c of CASE_STUDIES) {
  const p = `/kejs/${c.slug}`;
  if (includeInSitemap(p)) staticUrls.push(entry(p, "0.75", "monthly"));
}

const cityUrls = CITIES.filter((c) => includeInSitemap(`/${c.slug}`)).map((c) =>
  entry(`/${c.slug}`, cityPriority(c.slug), cityChangefreq(c.slug))
);

const serviceGeoUrls = [...SERVICE_LOCATION_PATHS]
  .filter(includeInSitemap)
  .map((p) => entry(p, serviceGeoPriority(p), getCityTier(parseServiceLocationPath(p)!.location) <= 1 ? "weekly" : "monthly"));

const serviceObjectUrls = [...SERVICE_OBJECT_PATHS]
  .filter(includeInSitemap)
  .map((p) => entry(p, "0.8", "monthly"));

const matrix3dUrls = [...SERVICE_OBJECT_CITY_PATHS]
  .filter(includeInSitemap)
  .map((p) => entry(p, "0.75", "weekly"));

const aliasUrls = [...SERVICE_ALIAS_CITY_PATHS]
  .filter(includeInSitemap)
  .map((p) => entry(p, "0.72", "weekly"));

const priceCityUrls = [...PRICE_CITY_PATHS]
  .filter(includeInSitemap)
  .map((p) => entry(p, "0.7", "monthly"));

const blogUrls = getBlogSlugs()
  .filter((s) => includeInSitemap(`/blog/${s}`))
  .map((s) => entry(`/blog/${s}`, "0.65", "monthly"));

const pricingUrls = getPricingSlugs()
  .filter((s) => includeInSitemap(`/ceny/${s}`))
  .map((s) => entry(`/ceny/${s}`, "0.7", "monthly"));

const moscowCoreUrls: UrlEntry[] = [
  entry("/", "1.0", "daily"),
  entry("/moskva", "0.95", "weekly"),
  entry("/moskovskaya-oblast", "0.92", "weekly"),
  ...[...SERVICE_LOCATION_PATHS]
    .filter((p) => {
      const parsed = parseServiceLocationPath(p);
      return parsed && TIER0_SLUGS.includes(parsed.location as (typeof TIER0_SLUGS)[number]);
    })
    .map((p) => entry(p, "0.95", "weekly")),
  ...[...SERVICE_OBJECT_PATHS].slice(0, 16).map((p) => entry(p, "0.85", "monthly")),
];

const groups: { file: string; urls: UrlEntry[] }[] = [
  { file: "sitemap-moscow-core.xml", urls: moscowCoreUrls },
  { file: "sitemap-static.xml", urls: staticUrls },
  { file: "sitemap-cities.xml", urls: cityUrls },
  { file: "sitemap-services-geo.xml", urls: serviceGeoUrls },
  { file: "sitemap-services-object.xml", urls: serviceObjectUrls },
  { file: "sitemap-matrix-3d.xml", urls: matrix3dUrls },
  { file: "sitemap-aliases.xml", urls: aliasUrls },
  { file: "sitemap-prices.xml", urls: [...priceCityUrls, ...pricingUrls] },
  { file: "sitemap-blog.xml", urls: blogUrls },
];

// Deduplicate URLs across sitemaps; first group wins (highest priority first)
const seenLocs = new Set<string>();
const uniqueGroups = groups.map((g) => ({
  file: g.file,
  urls: g.urls.filter((u) => {
    if (seenLocs.has(u.loc)) return false;
    seenLocs.add(u.loc);
    return true;
  }),
}));

let total = 0;
const indexFiles: string[] = [];
for (const g of uniqueGroups) {
  const outPath = path.join(OUT_DIR, g.file);
  if (g.urls.length === 0) {
    if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
    continue;
  }
  fs.writeFileSync(outPath, renderUrlset(g.urls), "utf8");
  indexFiles.push(g.file);
  total += g.urls.length;
  console.log(`  ${g.file}: ${g.urls.length} URL`);
}

for (const f of fs.readdirSync(OUT_DIR)) {
  if (f.startsWith("sitemap") && f.endsWith(".xml") && !indexFiles.includes(f) && f !== "sitemap-index.xml") {
    fs.unlinkSync(path.join(OUT_DIR, f));
    console.log(`  removed orphan ${f}`);
  }
}

const indexXml = renderIndex(indexFiles);
fs.writeFileSync(path.join(OUT_DIR, "sitemap-index.xml"), indexXml, "utf8");
console.log(`\n✓ Total: ${total} URL (SEO phase ${SEO_RELEASE_PHASE}, index only — no monolithic urlset)`);
