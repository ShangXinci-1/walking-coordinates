import { assets } from "../../data/assets";
import { outcomes } from "../../data/outcomes";
import { routes } from "../../data/routes";
import { sites } from "../../data/sites";
import { withBasePath } from "../site";
import type { AssetRecord, RouteId } from "./types";

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

export function getGalleryAssets() {
  return assets.filter((asset) =>
    ["action", "route", "hero"].includes(asset.role),
  );
}

export function getOrderedOutcomes() {
  return [...outcomes].sort((left, right) => left.order - right.order);
}

export function getProjectCounts() {
  return {
    routeCount: routes.length,
    siteCount: sites.length,
  };
}
