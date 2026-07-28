"use client";

import { useEffect, useRef, useState } from "react";
import { routes } from "../../data/routes";
import {
  getAssetById,
  getSitesForRoute,
  getSourcesForSite,
} from "../../lib/content/selectors";
import {
  createJourneySearch,
  resolveJourneySelection,
} from "../../lib/content/journey-state";
import type { RouteRecord, SiteRecord } from "../../lib/content/types";
import { AMapRouteMap } from "./AMapRouteMap";
import { RouteIndex } from "./RouteIndex";
import { SiteDossier } from "./SiteDossier";
import { SiteList } from "./SiteList";

export function JourneyExplorer() {
  const [selection, setSelection] = useState(() =>
    resolveJourneySelection(null, null),
  );
  const routeSites = getSitesForRoute(selection.route.id);
  const siteIndex = routeSites.findIndex((site) => site.id === selection.site.id);
  const previousSite = siteIndex > 0 ? routeSites[siteIndex - 1] : null;
  const nextSite =
    siteIndex < routeSites.length - 1 ? routeSites[siteIndex + 1] : null;
  const asset = selection.site.assetIds[0]
    ? (getAssetById(selection.site.assetIds[0]) ?? null)
    : null;
  const [copyResult, setCopyResult] = useState<{
    siteId: string;
    state: "copied" | "failed";
  } | null>(null);
  const copyState =
    copyResult?.siteId === selection.site.id ? copyResult.state : "idle";
  const [mapOpen, setMapOpen] = useState(false);
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
    const updateMapVisibility = () => setMapOpen(media.matches);
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

  async function copyCurrentLink() {
    const url = new URL(window.location.href);
    url.search = selection.canonicalSearch;

    try {
      await navigator.clipboard.writeText(url.toString());
      setCopyResult({ siteId: selection.site.id, state: "copied" });
    } catch {
      setCopyResult({ siteId: selection.site.id, state: "failed" });
    }
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
          sources={getSourcesForSite(selection.site)}
          previousSite={previousSite}
          nextSite={nextSite}
          copyState={copyState}
          onSelectSite={selectSite}
          onCopyLink={copyCurrentLink}
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
            onClick={() => setMapOpen((open) => !open)}
          >
            {mapOpen ? "收起在线地图" : "展开在线地图"}
            <span aria-hidden="true">{mapOpen ? "−" : "+"}</span>
          </button>
          <div id="journey-map-content" hidden={!mapOpen}>
            {mapOpen ? (
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
      </div>

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </>
  );
}
