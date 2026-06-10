import { describe, expect, it } from "vitest";
import {
  isCityPath,
  parseServiceGeoPath,
  parseServiceLocationPath,
  SERVICE_LOCATION_PATHS,
} from "../shared/geoRoutes";
import { isValidSpaPath } from "../shared/spaPaths";

describe("isValidSpaPath", () => {
  it("accepts known static pages", () => {
    expect(isValidSpaPath("/")).toBe(true);
    expect(isValidSpaPath("/uslugi")).toBe(true);
    expect(isValidSpaPath("/karta-sajta")).toBe(true);
  });

  it("accepts known city and service pages", () => {
    expect(isValidSpaPath("/moskva")).toBe(true);
    expect(isValidSpaPath("/khimki")).toBe(true);
    expect(isValidSpaPath("/ventilyaciya")).toBe(true);
    expect(isValidSpaPath("/ventilyaciya-moskva")).toBe(true);
    expect(isValidSpaPath("/kondicionirovanie-sklad")).toBe(true);
  });

  it("accepts known blog and pricing articles", () => {
    expect(isValidSpaPath("/blog/montazh-ventilyacii")).toBe(true);
    expect(isValidSpaPath("/ceny/ventilyaciya")).toBe(true);
  });

  it("rejects non-existent pages with 404 semantics", () => {
    expect(isValidSpaPath("/this-page-does-not-exist")).toBe(false);
    expect(isValidSpaPath("/nonexistent-city-slug")).toBe(false);
    expect(isValidSpaPath("/blog/unknown-article")).toBe(false);
    expect(isValidSpaPath("/ceny/unknown-service")).toBe(false);
    expect(isValidSpaPath("/ventilyaciya-unknown-object")).toBe(false);
    expect(isValidSpaPath("/wp-admin")).toBe(false);
  });

  it("normalizes trailing slashes", () => {
    expect(isValidSpaPath("/uslugi/")).toBe(true);
    expect(isValidSpaPath("/unknown/")).toBe(false);
  });

  it("detects city and service-location paths", () => {
    expect(isCityPath("/khimki")).toBe(true);
    expect(isCityPath("/ventilyaciya-moskva")).toBe(false);
    expect(isCityPath("/ventilyaciya-khimki")).toBe(false);
    expect(parseServiceGeoPath("/ventilyaciya-moskva")).toEqual({
      service: "ventilyaciya",
      geo: "moskva",
    });
    expect(parseServiceLocationPath("/ventilyaciya-khimki")).toEqual({
      service: "ventilyaciya",
      location: "khimki",
    });
    expect(parseServiceLocationPath("/peskostrujnaya-obrabotka-naro-fominsk")).toEqual({
      service: "peskostrujnaya-obrabotka",
      location: "naro-fominsk",
    });
    expect(parseServiceLocationPath("/holodosnabzhenie-moskovskaya-oblast")).toEqual({
      service: "holodosnabzhenie",
      location: "moskovskaya-oblast",
    });
    expect(SERVICE_LOCATION_PATHS.has("/ventilyaciya-khimki")).toBe(true);
    expect(isValidSpaPath("/ventilyaciya-khimki")).toBe(true);
  });

  it("accepts matrix paths for tier-1 cities only", () => {
    expect(isValidSpaPath("/ventilyaciya-sklad-khimki")).toBe(true);
    expect(isValidSpaPath("/ustanovka-ventilyacii-odintsovo")).toBe(true);
    expect(isValidSpaPath("/ceny-ventilyaciya-khimki")).toBe(true);
    expect(isValidSpaPath("/ventilyaciya-sklad-fake-city")).toBe(false);
    expect(isValidSpaPath("/ventilyaciya-sklad-aprelevka")).toBe(false);
    expect(isValidSpaPath("/ustanovka-ventilyacii-aprelevka")).toBe(false);
    expect(isValidSpaPath("/ceny-ventilyaciya-aprelevka")).toBe(false);
  });

  it("accepts case study and glossary paths when routes exist", () => {
    expect(isValidSpaPath("/kejs/aero-city-moskva")).toBe(true);
    expect(isValidSpaPath("/slovar/vrf-sistema")).toBe(true);
    expect(isValidSpaPath("/slovar")).toBe(true);
    expect(isValidSpaPath("/kalkulyator-inzhenernyh-sistem")).toBe(true);
  });
});
