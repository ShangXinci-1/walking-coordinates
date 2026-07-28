import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { assets } from "../data/assets";
import {
  legacyImpacts,
  legacyQuote,
  legacyTimeline,
} from "../data/legacy";
import { outcomes } from "../data/outcomes";
import { routes } from "../data/routes";
import { sites } from "../data/sites";
import { parseAmapGeocodeResponse } from "../lib/content/amap-geocode";
import {
  getAssetRenderSources,
  getProjectCounts,
  getSitesForRoute,
  getVerifiedSitesForRoute,
} from "../lib/content/selectors";
import type { AssetRecord } from "../lib/content/types";
import {
  createJourneySearch,
  resolveJourneySelection,
} from "../lib/content/journey-state";
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

  it("normalizes route and site query parameters without inventing records", () => {
    const defaultSelection = resolveJourneySelection(null, null);
    expect(defaultSelection.route.id).toBe("awakening");
    expect(defaultSelection.site.id).toBe("beida-honglou");
    expect(defaultSelection.isCanonical).toBe(false);

    const siteLedSelection = resolveJourneySelection(
      "awakening",
      "lugou-bridge",
    );
    expect(siteLedSelection.route.id).toBe("war");
    expect(siteLedSelection.site.id).toBe("lugou-bridge");
    expect(siteLedSelection.canonicalSearch).toBe(
      createJourneySearch(siteLedSelection.route, siteLedSelection.site),
    );

    const invalidSelection = resolveJourneySelection("unknown", "unknown");
    expect(invalidSelection.route.id).toBe("awakening");
    expect(invalidSelection.site.id).toBe("beida-honglou");
  });

  it("exposes only verified GCJ-02 coordinates to the map layer", () => {
    expect(routes.flatMap((route) => getVerifiedSitesForRoute(route.id))).toEqual(
      [],
    );
  });

  it("keeps every placeholder asset unmistakable and self-describing", () => {
    const placeholderAssets = assets.filter(
      (asset) => asset.assetStatus !== "ready",
    );

    for (const asset of placeholderAssets) {
      const sourcePath = path.join(
        process.cwd(),
        "public",
        asset.placeholderSrc.replace(/^\//, ""),
      );
      const source = readFileSync(sourcePath, "utf8");

      expect(source).toContain('data-placeholder-artwork="true"');
      expect(source).toContain('data-placeholder-cross-lines="true"');
      expect(source).toContain("<linearGradient");
      expect(source).toContain(">占位图片<");
      expect(source).toContain(asset.id);
      expect(source).toContain(asset.label);
    }
  });

  it("keeps a fixed asset ID while switching between placeholder and ready sources", () => {
    const placeholder = assets[5];
    const ready: AssetRecord = {
      ...placeholder,
      assetStatus: "ready",
      reviewStatus: "reviewed",
      publicationStatus: "ready",
      rightsStatus: "cleared",
      consentStatus: "not-required",
      rightsRecordRef: "rights:outcome-01",
      finalSrc: "/media/outcome-01.webp",
      credit: "北京科技大学社会实践团队",
      captureDate: "2026-07-28",
    };

    expect(placeholder.id).toBe("outcome-01");
    expect(ready.id).toBe(placeholder.id);
    expect(getAssetRenderSources(placeholder)).toEqual({
      fallbackSrc: "/walking-coordinates/images/outcome-01.svg",
      avifSrcSet: null,
      webpSrcSet: null,
    });
    expect(getAssetRenderSources(ready)).toEqual({
      fallbackSrc: "/walking-coordinates/media/outcome-01.webp",
      avifSrcSet:
        "/walking-coordinates/media/outcome-01-480.avif 480w, /walking-coordinates/media/outcome-01.avif 960w",
      webpSrcSet:
        "/walking-coordinates/media/outcome-01-480.webp 480w, /walking-coordinates/media/outcome-01.webp 960w",
    });
  });

  it("keeps pending outcomes without invented access actions", () => {
    expect(outcomes).toHaveLength(4);
    expect(
      outcomes.every(
        (outcome) =>
          outcome.completionStatus !== "complete" &&
          outcome.publicationStatus === "planned" &&
          outcome.access === null &&
          outcome.publishedAt === null &&
          Boolean(outcome.assetId),
      ),
    ).toBe(true);
  });

  it("keeps legacy claims behind explicit evidence gates", () => {
    expect(legacyQuote.status).toBe("missing");
    expect(legacyImpacts).toHaveLength(4);
    expect(
      legacyImpacts.every(
        (impact) =>
          impact.evidenceStatus === "missing" &&
          impact.evidenceRef === null &&
          impact.publicationStatus === "planned",
      ),
    ).toBe(true);
    expect(
      legacyTimeline.every(
        (entry) =>
          entry.evidenceStatus === "planned" &&
          entry.publicationStatus === "planned",
      ),
    ).toBe(true);
  });
});
