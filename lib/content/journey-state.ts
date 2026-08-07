import { routes } from "../../data/routes";
import { sites } from "../../data/sites";
import type { RouteRecord, SiteRecord } from "./types";

export interface JourneySelection {
  route: RouteRecord;
  site: SiteRecord;
  canonicalSearch: string;
  isCanonical: boolean;
}

function getRouteByParam(value: string | null) {
  return routes.find((route) => route.slug === value || route.id === value);
}

function getSiteByParam(value: string | null) {
  return sites.find((site) => site.slug === value || site.id === value);
}

export function createJourneySearch(route: RouteRecord, site: SiteRecord) {
  return new URLSearchParams({
    route: route.slug,
    site: site.slug,
  }).toString();
}

export function resolveJourneySelection(
  routeParam: string | null,
  siteParam: string | null,
): JourneySelection {
  const requestedRoute = getRouteByParam(routeParam);
  const requestedSite = getSiteByParam(siteParam);
  const route =
    requestedSite && requestedSite.routeId !== requestedRoute?.id
      ? routes.find((candidate) => candidate.id === requestedSite.routeId)!
      : requestedRoute ?? routes[0];
  const routeSites = route.siteIds.map(
    (siteId) => sites.find((candidate) => candidate.id === siteId)!,
  );
  const site =
    requestedSite?.routeId === route.id ? requestedSite : routeSites[0];
  const canonicalSearch = createJourneySearch(route, site);
  const currentSearch = new URLSearchParams();

  if (routeParam) currentSearch.set("route", routeParam);
  if (siteParam) currentSearch.set("site", siteParam);

  return {
    route,
    site,
    canonicalSearch,
    isCanonical: currentSearch.toString() === canonicalSearch,
  };
}
