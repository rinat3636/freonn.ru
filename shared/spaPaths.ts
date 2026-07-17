/**
 * Валидация SPA-путей для сервера (404). Зависит от geoRoutes и seoMatrix — без циклического импорта.
 */
import { CASE_STUDY_BY_SLUG } from "./caseStudies";
import { CONTENT_PAGE_BY_SLUG } from "./contentPages";
import { GLOSSARY_BY_SLUG } from "./glossaryTerms";
import {
  BLOG_SLUGS,
  KNOWN_CITY_SLUGS,
  normalizePathname,
  PRICING_SLUGS,
  SERVICE_LOCATION_PATHS,
  SERVICE_OBJECT_PATHS,
  VALID_STATIC_PATHS,
} from "./geoRoutes";
import {
  PRICE_CITY_PATHS,
  SERVICE_ALIAS_CITY_PATHS,
  SERVICE_OBJECT_CITY_PATHS,
} from "./seoMatrix";

export function isValidSpaPath(pathname: string): boolean {
  const clean = normalizePathname(pathname);

  if (VALID_STATIC_PATHS.has(clean)) return true;

  if (clean.startsWith("/blog/")) {
    return BLOG_SLUGS.has(clean.slice("/blog/".length));
  }

  if (clean.startsWith("/ceny/")) {
    return PRICING_SLUGS.has(clean.slice("/ceny/".length));
  }

  if (clean.startsWith("/kejs/")) {
    return CASE_STUDY_BY_SLUG[clean.slice("/kejs/".length)] !== undefined;
  }

  if (clean.startsWith("/slovar/")) {
    return GLOSSARY_BY_SLUG[clean.slice("/slovar/".length)] !== undefined;
  }

  if (clean.startsWith("/stati/")) {
    return CONTENT_PAGE_BY_SLUG[clean.slice("/stati/".length)] !== undefined;
  }
  if (clean === "/stati") return true;

  const segments = clean.split("/").filter(Boolean);
  if (segments.length !== 1) return false;

  const slug = segments[0];
  if (KNOWN_CITY_SLUGS.has(slug)) return true;
  if (SERVICE_OBJECT_PATHS.has(clean)) return true;
  if (SERVICE_LOCATION_PATHS.has(clean)) return true;
  if (SERVICE_OBJECT_CITY_PATHS.has(clean)) return true;
  if (SERVICE_ALIAS_CITY_PATHS.has(clean)) return true;
  if (PRICE_CITY_PATHS.has(clean)) return true;

  return false;
}
