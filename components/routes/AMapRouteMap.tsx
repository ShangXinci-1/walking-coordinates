"use client";

import { useEffect, useRef, useState } from "react";
import { routes } from "../../data/routes";
import { sites } from "../../data/sites";
import type { RouteId, SiteRecord } from "../../lib/content/types";

interface AMapOverlay {
  on?: (eventName: string, handler: () => void) => void;
}

interface AMapInstance {
  add: (overlays: AMapOverlay | AMapOverlay[]) => void;
  destroy: () => void;
  off: (eventName: string, handler: () => void) => void;
  on: (eventName: string, handler: () => void) => void;
  setCenter: (position: [number, number]) => void;
  setFitView: (
    overlays?: AMapOverlay[],
    immediately?: boolean,
    avoid?: [number, number, number, number],
    maxZoom?: number,
  ) => void;
}

interface AMapNamespace {
  Map: new (
    container: HTMLElement,
    options: Record<string, unknown>,
  ) => AMapInstance;
  Marker: new (options: Record<string, unknown>) => AMapOverlay;
  Pixel: new (x: number, y: number) => unknown;
  Polyline: new (options: Record<string, unknown>) => AMapOverlay;
}

declare global {
  interface Window {
    AMap?: AMapNamespace;
    _AMapSecurityConfig?: {
      serviceHost: string;
    };
  }
}

interface AMapRouteMapProps {
  activeRouteId: RouteId;
  activeSiteId: string;
  onSelectSite: (site: SiteRecord) => void;
}

let amapLoader: Promise<AMapNamespace> | null = null;

function loadAMap(key: string, serviceHost: string) {
  if (window.AMap) return Promise.resolve(window.AMap);
  if (amapLoader) return amapLoader;

  window._AMapSecurityConfig = { serviceHost };
  amapLoader = new Promise<AMapNamespace>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-wc-amap="true"]',
    );
    const script = existingScript ?? document.createElement("script");
    const timeoutId = window.setTimeout(
      () => reject(new Error("AMap load timeout")),
      12_000,
    );

    script.addEventListener(
      "load",
      () => {
        window.clearTimeout(timeoutId);
        if (window.AMap) resolve(window.AMap);
        else reject(new Error("AMap namespace missing"));
      },
      { once: true },
    );
    script.addEventListener(
      "error",
      () => {
        window.clearTimeout(timeoutId);
        reject(new Error("AMap script failed"));
      },
      { once: true },
    );

    if (!existingScript) {
      script.src = `https://webapi.amap.com/maps?v=2.0&key=${encodeURIComponent(key)}`;
      script.async = true;
      script.dataset.wcAmap = "true";
      document.head.append(script);
    }
  });

  return amapLoader;
}

function getVerifiedSites() {
  return sites.filter(
    (
      site,
    ): site is SiteRecord & {
      coordinate: Extract<SiteRecord["coordinate"], { status: "verified" }>;
    } => site.coordinate.status === "verified",
  );
}

export function AMapRouteMap({
  activeRouteId,
  activeSiteId,
  onSelectSite,
}: AMapRouteMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectSiteRef = useRef(onSelectSite);
  const mapKey = `${activeRouteId}:${activeSiteId}`;
  const [readyMapKey, setReadyMapKey] = useState<string | null>(null);
  const mapStatus = readyMapKey === mapKey ? "ready" : "blank";

  useEffect(() => {
    selectSiteRef.current = onSelectSite;
  }, [onSelectSite]);

  useEffect(() => {
    const container = containerRef.current;
    const key = process.env.NEXT_PUBLIC_AMAP_JS_KEY?.trim();
    const serviceHost =
      process.env.NEXT_PUBLIC_AMAP_SERVICE_HOST?.trim() ||
      "https://ytstet.com/_AMapService";
    let cancelled = false;
    let map: AMapInstance | null = null;
    let completeHandler: (() => void) | null = null;
    let accessibilityObserver: MutationObserver | null = null;

    container?.replaceChildren();
    if (!container || !key || !serviceHost) return;

    const normalizeGeneratedAccessibility = () => {
      container.querySelectorAll("iframe").forEach((frame) => {
        if (!frame.title) frame.title = "高德地图渲染辅助层";
        frame.tabIndex = -1;
      });
      container.querySelectorAll("img:not([alt])").forEach((image) => {
        image.setAttribute("alt", "");
      });
    };
    accessibilityObserver = new MutationObserver(
      normalizeGeneratedAccessibility,
    );
    accessibilityObserver.observe(container, {
      childList: true,
      subtree: true,
    });

    void loadAMap(key, serviceHost)
      .then((AMap) => {
        if (cancelled) return;

        map = new AMap.Map(container, {
          center: [116.4074, 39.9042],
          zoom: 10,
          viewMode: "2D",
          mapStyle: "amap://styles/grey",
          features: ["bg", "road", "building", "point"],
        });

        completeHandler = () => {
          normalizeGeneratedAccessibility();
          if (!cancelled) setReadyMapKey(mapKey);
        };
        map.on("complete", completeHandler);

        const verifiedSites = getVerifiedSites();
        const overlays: AMapOverlay[] = [];

        for (const route of routes) {
          const routeSites = route.siteIds
            .map((siteId) =>
              verifiedSites.find((site) => site.id === siteId),
            )
            .filter((site): site is (typeof verifiedSites)[number] =>
              Boolean(site),
            );
          const activeRoute = route.id === activeRouteId;

          if (routeSites.length >= 2) {
            const polyline = new AMap.Polyline({
              path: routeSites.map((site) => [
                site.coordinate.lng,
                site.coordinate.lat,
              ]),
              strokeColor: activeRoute ? "#d5523f" : "#80635d",
              strokeOpacity: activeRoute ? 0.94 : 0.4,
              strokeWeight: activeRoute ? 5 : 3,
              strokeStyle: "solid",
              lineJoin: "round",
              lineCap: "round",
              zIndex: activeRoute ? 30 : 20,
            });
            overlays.push(polyline);
          }

          routeSites.forEach((site, index) => {
            const markerButton = document.createElement("button");
            markerButton.type = "button";
            markerButton.className = "journey-map-marker";
            markerButton.dataset.active = String(site.id === activeSiteId);
            markerButton.setAttribute(
              "aria-label",
              `查看${site.name.value}档案`,
            );
            markerButton.textContent = String(index + 1).padStart(2, "0");
            markerButton.addEventListener("click", () =>
              selectSiteRef.current(site),
            );

            const marker = new AMap.Marker({
              position: [site.coordinate.lng, site.coordinate.lat],
              content: markerButton,
              offset: new AMap.Pixel(-22, -22),
              title: site.name.value,
              zIndex: site.id === activeSiteId ? 120 : activeRoute ? 100 : 80,
            });
            overlays.push(marker);
          });
        }

        if (overlays.length > 0) {
          map.add(overlays);
          map.setFitView(overlays, false, [56, 56, 56, 56], 13);
        }

        const activeSite = verifiedSites.find(
          (site) => site.id === activeSiteId,
        );
        if (activeSite) {
          map.setCenter([
            activeSite.coordinate.lng,
            activeSite.coordinate.lat,
          ]);
        }
      })
      .catch(() => {
        if (cancelled) return;
        map?.destroy();
        map = null;
        container.replaceChildren();
      });

    return () => {
      cancelled = true;
      accessibilityObserver?.disconnect();
      if (map && completeHandler) map.off("complete", completeHandler);
      map?.destroy();
      container.replaceChildren();
    };
  }, [activeRouteId, activeSiteId, mapKey]);

  return (
    <div
      className="amap-route-map"
      data-map-status={mapStatus}
      data-testid="amap-route-map"
      role="region"
      aria-label="北京革命史迹在线地图"
    >
      <div className="amap-route-map__canvas" ref={containerRef} />
    </div>
  );
}
