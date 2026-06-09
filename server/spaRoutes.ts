/**
 * Re-export маршрутов из shared — единый источник для сервера и клиента.
 */
export {
  isCityPath,
  isKnownCitySlug,
  isValidSpaPath,
  normalizePathname,
  parseServiceGeoPath,
  shouldOmitGeoMeta,
  NOINDEX_PATHS,
} from "../shared/geoRoutes";
