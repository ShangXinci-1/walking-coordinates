"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { routes } from "../../data/routes";
import { sites } from "../../data/sites";
import type { RouteId, SiteRecord } from "../../lib/content/types";

interface AMapOverlay {
  on?: (eventName: string, handler: () => void) => void;
}

interface AMapMarker extends AMapOverlay {
  setzIndex: (zIndex: number) => void;
}

interface AMapPolyline extends AMapOverlay {
  setOptions: (options: Record<string, unknown>) => void;
}

interface AMapInstance {
  add: (overlays: AMapOverlay | AMapOverlay[]) => void;
  destroy: () => void;
  getFitZoomAndCenterByOverlays: (
    overlays: AMapOverlay[],
    avoid?: [number, number, number, number],
    maxZoom?: number,
  ) => [number, unknown];
  getZoom: () => number;
  off: (eventName: string, handler: () => void) => void;
  on: (eventName: string, handler: () => void) => void;
  setZoomAndCenter: (
    zoom: number,
    center: unknown,
    immediately?: boolean,
    duration?: number,
  ) => void;
  setZooms: (zooms: [number, number]) => void;
}

interface AMapNamespace {
  Map: new (
    container: HTMLElement,
    options: Record<string, unknown>,
  ) => AMapInstance;
  Marker: new (options: Record<string, unknown>) => AMapMarker;
  Pixel: new (x: number, y: number) => unknown;
  Polyline: new (options: Record<string, unknown>) => AMapPolyline;
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

interface RouteMarker {
  element: HTMLButtonElement;
  marker: AMapMarker;
  siteId: string;
}

interface RouteOverlayGroup {
  overlays: AMapOverlay[];
  markers: RouteMarker[];
  polyline: AMapPolyline | null;
}

let amapLoader: Promise<AMapNamespace> | null = null;
const MAP_CALCULATION_MIN_ZOOM = 2;
const MAP_INITIAL_ZOOM = 10;
const MAX_MAP_ZOOM = 18;
const ROUTE_FIT_MAX_ZOOM = 13;
const ROUTE_FIT_PADDING: [number, number, number, number] = [64, 64, 64, 64];
const ROUTE_CAMERA_DURATION = 480;
const ZOOM_EPSILON = 0.05;

const activeLineOptions = {
  strokeColor: "#d5523f",
  strokeOpacity: 0.96,
  strokeWeight: 5,
  zIndex: 30,
};

const inactiveLineOptions = {
  strokeColor: "#80635d",
  strokeOpacity: 0.18,
  strokeWeight: 2,
  zIndex: 20,
};

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

function formatZoom(zoom: number) {
  return zoom.toFixed(2).replace(/\.?0+$/, "");
}

function updateOverlaySelection(
  overlayGroups: Map<RouteId, RouteOverlayGroup>,
  activeRouteId: RouteId,
  activeSiteId: string,
) {
  for (const [routeId, group] of overlayGroups) {
    const routeIsActive = routeId === activeRouteId;
    group.polyline?.setOptions(
      routeIsActive ? activeLineOptions : inactiveLineOptions,
    );

    for (const { element, marker, siteId } of group.markers) {
      const siteIsActive = siteId === activeSiteId;
      element.dataset.routeActive = String(routeIsActive);
      element.dataset.active = String(siteIsActive);

      if (siteIsActive) {
        element.setAttribute("aria-current", "location");
      } else {
        element.removeAttribute("aria-current");
      }

      marker.setzIndex(siteIsActive ? 120 : routeIsActive ? 100 : 60);
    }
  }
}

export function AMapRouteMap({
  activeRouteId,
  activeSiteId,
  onSelectSite,
}: AMapRouteMapProps) {
  const mapRootRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectSiteRef = useRef(onSelectSite);
  const mapRef = useRef<AMapInstance | null>(null);
  const overlayGroupsRef = useRef(
    new Map<RouteId, RouteOverlayGroup>(),
  );
  const activeRouteIdRef = useRef(activeRouteId);
  const activeSiteIdRef = useRef(activeSiteId);
  const minimumZoomRef = useRef(MAP_CALCULATION_MIN_ZOOM);
  const focusedRouteIdRef = useRef<RouteId | null>(null);
  const cameraTimerRef = useRef<number | null>(null);
  const [mapStatus, setMapStatus] = useState<"blank" | "ready">("blank");
  const [minimumZoomLabel, setMinimumZoomLabel] = useState("auto");

  useEffect(() => {
    selectSiteRef.current = onSelectSite;
  }, [onSelectSite]);

  const focusRoute = useCallback((routeId: RouteId, immediate: boolean) => {
    const map = mapRef.current;
    const group = overlayGroupsRef.current.get(routeId);
    if (!map || !group || group.overlays.length === 0) return;

    if (cameraTimerRef.current !== null) {
      window.clearTimeout(cameraTimerRef.current);
      cameraTimerRef.current = null;
    }

    const [fitZoom, fitCenter] = map.getFitZoomAndCenterByOverlays(
      group.overlays,
      ROUTE_FIT_PADDING,
      ROUTE_FIT_MAX_ZOOM,
    );
    const routeMinimumZoom = Math.min(
      MAX_MAP_ZOOM,
      Math.max(MAP_CALCULATION_MIN_ZOOM, fitZoom),
    );
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const jumpImmediately = immediate || reduceMotion;

    minimumZoomRef.current = routeMinimumZoom;
    setMinimumZoomLabel(formatZoom(routeMinimumZoom));
    map.setZooms([MAP_CALCULATION_MIN_ZOOM, MAX_MAP_ZOOM]);
    map.setZoomAndCenter(
      routeMinimumZoom,
      fitCenter,
      jumpImmediately,
      jumpImmediately ? 0 : ROUTE_CAMERA_DURATION,
    );
    focusedRouteIdRef.current = routeId;

    const lockMinimumZoom = () => {
      map.setZooms([routeMinimumZoom, MAX_MAP_ZOOM]);
      cameraTimerRef.current = null;
    };

    if (jumpImmediately) {
      lockMinimumZoom();
    } else {
      cameraTimerRef.current = window.setTimeout(
        lockMinimumZoom,
        ROUTE_CAMERA_DURATION,
      );
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const mapRoot = mapRootRef.current;
    const key = process.env.NEXT_PUBLIC_AMAP_JS_KEY?.trim();
    const serviceHost =
      process.env.NEXT_PUBLIC_AMAP_SERVICE_HOST?.trim() ||
      "https://ytstet.com/_AMapService";
    let cancelled = false;
    let map: AMapInstance | null = null;
    let completeHandler: (() => void) | null = null;
    let wheelCaptureHandler: ((event: WheelEvent) => void) | null = null;
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
          zoom: MAP_INITIAL_ZOOM,
          zooms: [MAP_CALCULATION_MIN_ZOOM, MAX_MAP_ZOOM],
          viewMode: "2D",
          mapStyle: "amap://styles/grey",
          features: ["bg", "road", "building", "point"],
          resizeEnable: true,
        });
        mapRef.current = map;

        wheelCaptureHandler = (event) => {
          if (
            event.deltaY > 0 &&
            map &&
            map.getZoom() <= minimumZoomRef.current + ZOOM_EPSILON
          ) {
            event.stopPropagation();
          }
        };
        mapRoot?.addEventListener("wheel", wheelCaptureHandler, {
          capture: true,
          passive: true,
        });

        completeHandler = () => {
          normalizeGeneratedAccessibility();
          if (!cancelled) setMapStatus("ready");
        };
        map.on("complete", completeHandler);

        const verifiedSites = getVerifiedSites();
        const overlays: AMapOverlay[] = [];
        const overlayGroups = new Map<RouteId, RouteOverlayGroup>();

        for (const route of routes) {
          const routeSites = route.siteIds
            .map((siteId) =>
              verifiedSites.find((site) => site.id === siteId),
            )
            .filter((site): site is (typeof verifiedSites)[number] =>
              Boolean(site),
            );
          const routeOverlays: AMapOverlay[] = [];
          const routeMarkers: RouteMarker[] = [];
          let polyline: AMapPolyline | null = null;

          if (routeSites.length >= 2) {
            polyline = new AMap.Polyline({
              path: routeSites.map((site) => [
                site.coordinate.lng,
                site.coordinate.lat,
              ]),
              strokeStyle: "solid",
              lineJoin: "round",
              lineCap: "round",
              ...inactiveLineOptions,
            });
            overlays.push(polyline);
            routeOverlays.push(polyline);
          }

          routeSites.forEach((site, index) => {
            const markerButton = document.createElement("button");
            markerButton.type = "button";
            markerButton.className = "journey-map-marker";
            markerButton.dataset.routeActive = "false";
            markerButton.dataset.active = "false";
            markerButton.dataset.routeId = route.id;
            markerButton.style.setProperty("--marker-order", String(index));
            markerButton.setAttribute(
              "aria-label",
              `查看${site.name.value}档案`,
            );
            const markerNumber = document.createElement("span");
            markerNumber.className = "journey-map-marker__number";
            markerNumber.textContent = String(index + 1).padStart(2, "0");
            markerButton.append(markerNumber);
            markerButton.addEventListener("click", () =>
              selectSiteRef.current(site),
            );

            const marker = new AMap.Marker({
              position: [site.coordinate.lng, site.coordinate.lat],
              content: markerButton,
              offset: new AMap.Pixel(-22, -22),
              title: site.name.value,
              zIndex: 60,
            });
            overlays.push(marker);
            routeOverlays.push(marker);
            routeMarkers.push({
              element: markerButton,
              marker,
              siteId: site.id,
            });
          });

          overlayGroups.set(route.id, {
            overlays: routeOverlays,
            markers: routeMarkers,
            polyline,
          });
        }

        if (overlays.length > 0) {
          map.add(overlays);
        }

        overlayGroupsRef.current = overlayGroups;
        updateOverlaySelection(
          overlayGroups,
          activeRouteIdRef.current,
          activeSiteIdRef.current,
        );
        focusRoute(activeRouteIdRef.current, true);
      })
      .catch(() => {
        if (cancelled) return;
        map?.destroy();
        map = null;
        mapRef.current = null;
        overlayGroupsRef.current.clear();
        container.replaceChildren();
      });

    return () => {
      cancelled = true;
      accessibilityObserver?.disconnect();
      if (mapRoot && wheelCaptureHandler) {
        mapRoot.removeEventListener("wheel", wheelCaptureHandler, {
          capture: true,
        });
      }
      if (map && completeHandler) map.off("complete", completeHandler);
      if (cameraTimerRef.current !== null) {
        window.clearTimeout(cameraTimerRef.current);
        cameraTimerRef.current = null;
      }
      map?.destroy();
      mapRef.current = null;
      overlayGroupsRef.current.clear();
      container.replaceChildren();
    };
  }, [focusRoute]);

  useEffect(() => {
    activeRouteIdRef.current = activeRouteId;
    activeSiteIdRef.current = activeSiteId;

    const map = mapRef.current;
    if (!map) return;

    updateOverlaySelection(
      overlayGroupsRef.current,
      activeRouteId,
      activeSiteId,
    );

    if (focusedRouteIdRef.current !== activeRouteId) {
      focusRoute(activeRouteId, false);
    }
  }, [activeRouteId, activeSiteId, focusRoute]);

  return (
    <div
      className="amap-route-map"
      ref={mapRootRef}
      data-map-status={mapStatus}
      data-map-min-zoom={minimumZoomLabel}
      data-testid="amap-route-map"
      role="region"
      aria-label="北京革命史迹在线地图"
    >
      <div className="amap-route-map__canvas" ref={containerRef} />
    </div>
  );
}
