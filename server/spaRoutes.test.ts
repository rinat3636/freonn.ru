import { describe, expect, it } from "vitest";
import { isCityPath, isValidSpaPath, parseServiceGeoPath } from "../shared/geoRoutes";

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

  it("detects city and service-geo paths", () => {
    expect(isCityPath("/khimki")).toBe(true);
    expect(isCityPath("/ventilyaciya-moskva")).toBe(false);
    expect(parseServiceGeoPath("/ventilyaciya-moskva")).toEqual({
      service: "ventilyaciya",
      geo: "moskva",
    });
    expect(parseServiceGeoPath("/holodosnabzhenie-moskovskaya-oblast")).toEqual({
      service: "holodosnabzhenie",
      geo: "moskovskaya-oblast",
    });
  });
});
