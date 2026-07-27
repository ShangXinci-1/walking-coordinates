import { describe, expect, it } from "vitest";
import { routes } from "../data/routes";
import { sites } from "../data/sites";
import { parseAmapGeocodeResponse } from "../lib/content/amap-geocode";
import { getProjectCounts, getSitesForRoute } from "../lib/content/selectors";
import { validateContent } from "../lib/content/validate";

describe("content data", () => {
  it("passes cross-record validation", () => {
    expect(validateContent()).toEqual([]);
  });

  it("contains the design target of three routes and thirteen site slots", () => {
    expect(getProjectCounts()).toEqual({
      routeCount: 3,
      siteCount: 13,
    });
  });

  it("keeps route order aligned with site order", () => {
    for (const route of routes) {
      expect(getSitesForRoute(route.id).map((site) => site.id)).toEqual(
        route.siteIds,
      );
    }

    expect(
      sites.every(
        (site) =>
          site.coordinate.status === "missing" &&
          site.reviewStatus === "draft" &&
          site.publicationStatus === "planned",
      ),
    ).toBe(true);
  });

  it("parses AMap results as candidates instead of verified coordinates", () => {
    expect(
      parseAmapGeocodeResponse(
        {
          status: "1",
          geocodes: [
            {
              formatted_address: "北京市东城区五四大街29号",
              level: "门牌号",
              location: "116.411960,39.923630",
            },
          ],
        },
        "source-amap-geocoder",
        "2026-07-27T00:00:00.000Z",
        "main-entrance",
      ),
    ).toEqual([
      {
        coordinate: {
          status: "candidate",
          lat: 39.92363,
          lng: 116.41196,
          crs: "GCJ-02",
          target: "main-entrance",
          sourceId: "source-amap-geocoder",
          queriedAt: "2026-07-27T00:00:00.000Z",
        },
        formattedAddress: "北京市东城区五四大街29号",
        level: "门牌号",
      },
    ]);
  });

  it("records the project-approved coordinate target for every site", () => {
    expect(
      sites.find((site) => site.id === "xiangshan-revolutionary-site")
        ?.coordinateTarget,
    ).toBe("site-center");

    expect(
      sites
        .filter((site) =>
          [
            "war-sculpture-park",
            "lugou-bridge",
            "wanping-city",
            "black-mountain-memorial",
            "xiangshan-revolutionary-site",
          ].includes(site.id),
        )
        .every((site) => site.coordinateTarget === "site-center"),
    ).toBe(true);
  });
});
