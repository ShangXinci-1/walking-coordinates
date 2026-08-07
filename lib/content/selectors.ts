import { assets } from "../../data/assets";
import {
  legacyImpacts,
  legacyQuote,
  legacyTimeline,
} from "../../data/legacy";
import { outcomes } from "../../data/outcomes";
import { routes } from "../../data/routes";
import { sites } from "../../data/sites";
import { sources } from "../../data/sources";
import { withBasePath } from "../site";
import type {
  AssetRecord,
  RouteId,
  SiteRecord,
  SourceRecord,
} from "./types";

export function getRouteById(routeId: RouteId) {
  return routes.find((route) => route.id === routeId);
}

export function getSiteById(siteId: string) {
  return sites.find((site) => site.id === siteId);
}

export function getSitesForRoute(routeId: RouteId) {
  return sites
    .filter((site) => site.routeId === routeId)
    .sort((left, right) => left.order - right.order);
}

export function getVerifiedSitesForRoute(routeId: RouteId) {
  return getSitesForRoute(routeId).filter(
    (site) => site.coordinate.status === "verified",
  );
}

export function getSourcesForSite(site: SiteRecord): SourceRecord[] {
  const sourceIds = new Set([
    ...site.name.sourceIds,
    ...(site.officialAddress?.sourceIds ?? []),
    ...site.historySummary.flatMap((block) => block.sourceIds),
    ...site.practiceSummary.flatMap((block) => block.sourceIds),
    ...(site.coordinate.status === "missing"
      ? []
      : [site.coordinate.sourceId]),
  ]);

  return sources.filter((source) => sourceIds.has(source.id));
}

export function getAssetById(assetId: string) {
  return assets.find((asset) => asset.id === assetId);
}

export function getRequiredAssetById(assetId: string) {
  const asset = getAssetById(assetId);
  if (!asset) throw new Error(`Missing asset: ${assetId}`);
  return asset;
}

export function getAssetSrc(asset: AssetRecord) {
  return withBasePath(
    asset.assetStatus === "ready" ? asset.finalSrc : asset.placeholderSrc,
  );
}

function appendWidthSuffix(src: string, width: number) {
  return src.replace(/(\.[a-z0-9]+)$/i, `-${width}$1`);
}

export function getAssetRenderSources(asset: AssetRecord) {
  const fallbackSrc = getAssetSrc(asset);

  if (asset.assetStatus !== "ready") {
    return {
      fallbackSrc,
      avifSrcSet: null,
      webpSrcSet: null,
    };
  }

  const webpSrc = asset.finalSrc;
  const avifSrc = webpSrc.replace(/\.webp$/i, ".avif");
  const responsiveWidth = Math.min(480, asset.width);
  const withResponsiveVariant = responsiveWidth < asset.width;
  const buildSrcSet = (src: string) => {
    const entries = withResponsiveVariant
      ? [
          `${withBasePath(appendWidthSuffix(src, responsiveWidth))} ${responsiveWidth}w`,
          `${withBasePath(src)} ${asset.width}w`,
        ]
      : [`${withBasePath(src)} ${asset.width}w`];

    return entries.join(", ");
  };

  return {
    fallbackSrc,
    avifSrcSet: buildSrcSet(avifSrc),
    webpSrcSet: buildSrcSet(webpSrc),
  };
}

export function getGalleryAssets() {
  const galleryAssetIds = [
    "field-01",
    "field-05",
    "field-04",
    "field-02",
    "field-03",
  ];

  return galleryAssetIds.map((assetId) => getRequiredAssetById(assetId));
}

export function getOrderedOutcomes() {
  return [...outcomes].sort((left, right) => left.order - right.order);
}

export function getLegacyQuote() {
  return legacyQuote;
}

export function getOrderedLegacyImpacts() {
  return [...legacyImpacts].sort((left, right) => left.order - right.order);
}

export function getOrderedLegacyTimeline() {
  return [...legacyTimeline].sort((left, right) => left.order - right.order);
}

export function getProjectCounts() {
  return {
    routeCount: routes.length,
    siteCount: sites.length,
  };
}
