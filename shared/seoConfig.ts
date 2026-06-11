/**
 * SEO inventory freonn.ru — единый справочник слоёв URL, фаз и tier-правил.
 * Обновлять при изменении geoRoutes / seoMatrix / generate-sitemap.
 */
import { CITIES, SERVICE_SLUGS } from "./geoRoutes";
import { MATRIX_CITY_SLUGS, TIER0_SLUGS, TIER1_CITY_SLUGS, getTier2CitySlugs } from "./geoTiers";
import {
  OBJECT_SLUGS,
  PRIORITY_3D_SERVICES,
  SEO_RELEASE_PHASE,
  SERVICE_ALIAS_CITY_PATHS,
  SERVICE_OBJECT_CITY_PATHS,
  PRICE_CITY_PATHS,
} from "./seoMatrix";

export { SEO_RELEASE_PHASE };

/** 301: alias URL → canonical URL */
export const CANONICAL_REDIRECTS: Record<string, string> = {
  "/garantiya": "/garantii",
  "/licenzii-i-sertifikaty": "/sertifikaty",
  "/partneram": "/partnery",
};

export const SEO_PHASE_LABELS: Record<number, string> = {
  1: "City hubs + service×city + service×object + static + blog + /ceny/*",
  2: "3D matrix (tier-0/1) + alias×city + /kejs/*",
  3: "Price×city (tier-0/1 matrix cities)",
  4: "Glossary /slovar + calculator",
};

export const SEO_URL_COUNTS = {
  cities: CITIES.length,
  serviceLocation: SERVICE_SLUGS.length * CITIES.length,
  serviceObject: SERVICE_SLUGS.length * OBJECT_SLUGS.length,
  matrix3d: PRIORITY_3D_SERVICES.length * OBJECT_SLUGS.length * MATRIX_CITY_SLUGS.length,
  aliasCity: 10 * MATRIX_CITY_SLUGS.length,
  priceCity: 4 * MATRIX_CITY_SLUGS.length,
  tier0: TIER0_SLUGS.length,
  tier1: TIER1_CITY_SLUGS.length,
  tier2: getTier2CitySlugs().length,
  matrixCities: MATRIX_CITY_SLUGS.length,
  paths3d: SERVICE_OBJECT_CITY_PATHS.size,
  pathsAlias: SERVICE_ALIAS_CITY_PATHS.size,
  pathsPrice: PRICE_CITY_PATHS.size,
} as const;

export const SEO_TIER_RULES = {
  tier0: "Money pages: moskva, moskovskaya-oblast — max links, sitemap 0.92–0.95",
  tier1: "23 key MO cities — matrix (3D, alias, price) + full service×city",
  tier2: "44 cities — hub + service×city only; sitemap priority 0.55, monthly",
  matrix: "3D/alias/price only for MATRIX_CITY_SLUGS (tier-0 + tier-1)",
} as const;
