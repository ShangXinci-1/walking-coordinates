"use client";

import { useEffect, useRef, useState } from "react";
import { routes } from "../../data/routes";
import {
  getAssetById,
  getSitesForRoute,
} from "../../lib/content/selectors";
import {
  createJourneySearch,
  resolveJourneySelection,
} from "../../lib/content/journey-state";
import type { RouteRecord, SiteRecord } from "../../lib/content/types";
import { AMapRouteMap } from "./AMapRouteMap";
import { RouteIndex } from "./RouteIndex";
import { SiteDetailOverlay } from "./SiteDetailOverlay";
import { SiteDossier } from "./SiteDossier";
import { SiteList } from "./SiteList";

export function JourneyExplorer() {
  const [selection, setSelection] = useState(() =>
    resolveJourneySelection(null, null),
  );
  const orderedSites = routes.flatMap((route) => getSitesForRoute(route.id));
  const routeSites = getSitesForRoute(selection.route.id);
  const siteIndex = routeSites.findIndex((site) => site.id === selection.site.id);
  const orderedSiteIndex = orderedSites.findIndex(
    (site) => site.id === selection.site.id,
  );
  const previousSite =
    orderedSiteIndex > 0 ? orderedSites[orderedSiteIndex - 1] : null;
  const nextSite =
    orderedSiteIndex < orderedSites.length - 1
      ? orderedSites[orderedSiteIndex + 1]
      : null;
  const nextRoute = nextSite
    ? routes.find((route) => route.id === nextSite.routeId) ?? null
    : null;
  const previousRoute = previousSite
    ? routes.find((route) => route.id === previousSite.routeId) ?? null
    : null;
  const nextStepLabel =
    nextSite && nextSite.routeId !== selection.route.id
      ? `下一路线 · ${nextRoute?.title.value ?? ""}`
      : "下一地点";
  const previousStepLabel =
    previousSite && previousSite.routeId !== selection.route.id
      ? `上一条路线 · ${previousRoute?.title.value ?? ""}`
      : "上一地点";
  const asset = selection.site.assetIds[0]
    ? (getAssetById(selection.site.assetIds[0]) ?? null)
    : null;
  const [mapOpen, setMapOpen] = useState(false);
  const [mapMounted, setMapMounted] = useState(false);
  const [overlaySiteId, setOverlaySiteId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const pendingMobileDossierFocus = useRef<string | null>(null);

  useEffect(() => {
    const syncSelectionFromUrl = () => {
      const search = new URLSearchParams(window.location.search);
      const nextSelection = resolveJourneySelection(
        search.get("route"),
        search.get("site"),
      );
      setSelection(nextSelection);

      if (!nextSelection.isCanonical) {
        window.history.replaceState(
          null,
          "",
          `?${nextSelection.canonicalSearch}`,
        );
      }
    };

    syncSelectionFromUrl();
    window.addEventListener("popstate", syncSelectionFromUrl);
    return () => window.removeEventListener("popstate", syncSelectionFromUrl);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 48rem)");
    const updateMapVisibility = () => {
      setMapOpen(media.matches);
      if (media.matches) setMapMounted(true);
    };
    updateMapVisibility();
    media.addEventListener("change", updateMapVisibility);
    return () => media.removeEventListener("change", updateMapVisibility);
  }, []);

  useEffect(() => {
    if (pendingMobileDossierFocus.current !== selection.site.id) return;
    const frame = requestAnimationFrame(() => {
      const title = document.getElementById("site-dossier-title");
      title?.scrollIntoView({ behavior: "smooth", block: "start" });
      title?.focus({ preventScroll: true });
      pendingMobileDossierFocus.current = null;
    });
    return () => cancelAnimationFrame(frame);
  }, [selection.site.id]);

  useEffect(() => {
    if (!window.matchMedia("(min-width: 80rem)").matches) return;
    const dossier = document.getElementById("site-dossier");
    dossier?.scrollTo({ top: 0, behavior: "auto" });
  }, [selection.site.id]);

  function navigate(route: RouteRecord, site: SiteRecord) {
    window.history.pushState(null, "", `?${createJourneySearch(route, site)}`);
    setSelection(resolveJourneySelection(route.id, site.id));
  }

  function selectRoute(route: RouteRecord) {
    const firstSite = getSitesForRoute(route.id)[0];
    navigate(route, firstSite);
    setAnnouncement(`已切换到${route.title.value}`);
  }

  function selectSite(site: SiteRecord, scrollOnMobile = true) {
    const route =
      routes.find((candidate) => candidate.id === site.routeId) ??
      selection.route;
    navigate(route, site);
    setAnnouncement(`已打开${site.name.value}档案`);

    if (
      scrollOnMobile &&
      window.matchMedia("(max-width: 47.99rem)").matches
    ) {
      pendingMobileDossierFocus.current = site.id;
    }
  }

  function toggleMap() {
    setMapOpen((open) => {
      const nextOpen = !open;
      if (nextOpen) setMapMounted(true);
      return nextOpen;
    });
  }

  return (
    <>
      <section className="journey-intro" aria-labelledby="journey-title">
        <div className="journey-intro__index" aria-hidden="true">
          ARCHIVE / 03
        </div>
        <div>
          <p className="journey-intro__eyebrow">路线与地点档案</p>
          <h1 id="journey-title">
            以脚步丈量北京，
            <br />
            打开十三处地点档案
          </h1>
          <p className="journey-intro__lead">
            三条主题路线连接十三处革命史迹。地图只呈现经过人工核验的
            GCJ-02 坐标，档案内容与素材状态按真实进度公开。
          </p>
        </div>
        <dl className="journey-intro__summary" aria-label="路线档案概览">
          <div>
            <dt>路线</dt>
            <dd>03</dd>
          </div>
          <div>
            <dt>地点</dt>
            <dd>13</dd>
          </div>
          <div>
            <dt>已核验坐标</dt>
            <dd>
              {routeSites.filter(
                (site) => site.coordinate.status === "verified",
              ).length}
              /{routeSites.length}
            </dd>
          </div>
        </dl>
      </section>

      <div className="journey-archive">
        <RouteIndex
          routes={routes}
          activeRouteId={selection.route.id}
          onSelect={selectRoute}
        />
        <SiteList
          sites={routeSites}
          activeSiteId={selection.site.id}
          onSelect={selectSite}
        />
        <SiteDossier
          route={selection.route}
          site={selection.site}
          asset={asset}
          previousSite={previousSite}
          nextSite={nextSite}
          onImageClick={() => setOverlaySiteId(selection.site.id)}
        />
        <section className="journey-map-panel" aria-labelledby="map-panel-title">
          <header className="journey-map-panel__header">
            <div>
              <span>空间索引</span>
              <h2 id="map-panel-title">真实在线地图</h2>
            </div>
            <p>
              连接线表示寻访顺序，
              <br />
              不代表导航或实际轨迹。
            </p>
          </header>
          <button
            className="journey-map-panel__toggle"
            type="button"
            aria-expanded={mapOpen}
            aria-controls="journey-map-content"
            onClick={toggleMap}
          >
            {mapOpen ? "收起在线地图" : "展开在线地图"}
            <span aria-hidden="true">{mapOpen ? "−" : "+"}</span>
          </button>
          <div id="journey-map-content" hidden={!mapOpen}>
            {mapMounted ? (
              <AMapRouteMap
                activeRouteId={selection.route.id}
                activeSiteId={selection.site.id}
                onSelectSite={(site) => selectSite(site, false)}
              />
            ) : null}
          </div>
          <footer className="journey-map-panel__footer">
            <span>
              当前路线 · {selection.route.code} / {selection.route.title.value}
            </span>
            <span>坐标标准 · GCJ-02</span>
          </footer>
        </section>
        <nav className="journey-sequence" aria-label="线性浏览地点">
          <div className="journey-sequence__progress">
            <span>
              路线 {selection.route.code} · {selection.route.title.value}
            </span>
            <strong>
              第 {String(siteIndex + 1).padStart(2, "0")} 站 /{" "}
              {String(routeSites.length).padStart(2, "0")}
            </strong>
            <small>
              全程 {String(orderedSiteIndex + 1).padStart(2, "0")} /{" "}
              {String(orderedSites.length).padStart(2, "0")}
            </small>
          </div>
          <div className="journey-sequence__current" aria-live="polite">
            <span>当前坐标档案</span>
            <strong>{selection.site.name.value}</strong>
          </div>
          <div className="journey-sequence__actions">
            <button
              type="button"
              disabled={!previousSite}
              onClick={() => previousSite && selectSite(previousSite, false)}
            >
              <span aria-hidden="true">←</span>
              <small>{previousStepLabel}</small>
              <strong>{previousSite?.name.value ?? "已到起点"}</strong>
            </button>
            <button
              className="journey-sequence__next"
              type="button"
              disabled={!nextSite}
              onClick={() => nextSite && selectSite(nextSite, false)}
            >
              <small>{nextSite ? nextStepLabel : "浏览完成"}</small>
              <strong>{nextSite?.name.value ?? "已到终点"}</strong>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </nav>
      </div>

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

      {overlaySiteId && (
        <SiteDetailOverlay
          site={selection.site}
          onClose={() => setOverlaySiteId(null)}
        />
      )}
    </>
  );
}
