/**
 * Re-export маршрутов из shared — единый источник для сервера и клиента.
 */
export { isValidSpaPath } from "../shared/spaPaths";
export {
  isCityPath,
  isKnownCitySlug,
  normalizePathname,
  parseServiceGeoPath,
  shouldOmitGeoMeta,
  NOINDEX_PATHS,
} from "../shared/geoRoutes";
