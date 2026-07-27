"use client";

import { useState } from "react";
import { routes } from "../../data/routes";
import { ResponsiveMedia } from "../../components";
import {
  getRequiredAssetById,
  getSitesForRoute,
} from "../../lib/content/selectors";
import { SiteHeader } from "../shared";
import { RouteMap } from "../RouteMap";

const routeColors = {
  A: "#b42318",
  B: "#9a4a00",
  C: "#a83218",
} as const;

const routeStartX = { A: 440, B: 380, C: 540 } as const;

const routeData = routes.map((route) => {
  const points = getSitesForRoute(route.id).map((site, index) => ({
    cx: routeStartX[route.code] + (index % 2 === 0 ? 0 : 18),
    cy: 440 - index * 72,
    name: site.name.value,
  }));

  return {
    id: route.code,
    title: route.title.value,
    color: routeColors[route.code],
    path: points
      .map((point, index) => `${index === 0 ? "M" : "L"}${point.cx},${point.cy}`)
      .join(" "),
    points,
    asset: getRequiredAssetById(route.heroAssetId),
  };
});

const siteDetail = {
  intro: { icon: "📝", label: "实践地点介绍", desc: "历史背景与革命故事" },
  photos: { icon: "📷", label: "实践图片", desc: "实地拍摄高清影像" },
  vr: { icon: "🥽", label: "实践地VR取景", desc: "360°虚拟参观体验" },
};

export default function JourneyPage() {
  const [activeRoute, setActiveRoute] = useState(0);
  const [activeSite, setActiveSite] = useState(0);
  const [activeSubTab, setActiveSubTab] = useState("intro");
  const currentRoute = routeData[activeRoute];
  const currentSite = currentRoute.points[activeSite];
  const activeTab = siteDetail[activeSubTab as keyof typeof siteDetail];

  function handleMapSelect(ri: number, si: number) {
    setActiveRoute(ri);
    setActiveSite(si);
    setActiveSubTab("intro");
  }

  return (
    <main>
      <SiteHeader />

      <section className="map-hero-section">
        <div className="map-hero-split">
          <div className="map-hero-text">
            <span className="map-hero-badge">寻访路线</span>
            <h1>以脚步丈量<br />红色北京</h1>
            <p>三条路线，十一处红色坐标 — 点击地图地点查看详情</p>
          </div>
          <div className="map-hero-img">
            <ResponsiveMedia
              asset={routeData[activeRoute].asset}
              sizes="(min-width: 850px) 45vw, 100vw"
            />
          </div>
        </div>
        <div className="map-hero-body">
          <RouteMap routes={routeData} activeRoute={activeRoute} activeSite={activeSite} onSelectSite={handleMapSelect} />
        </div>
      </section>

      <section className="map-detail-section">
        <div className="map-detail-top">
          <div className="map-detail-route-info">
            <span className="map-detail-route-id" style={{color: currentRoute.color}}>ROUTE {currentRoute.id}</span>
            <h2>{currentRoute.title}</h2>
          </div>
          <div className="map-detail-tabs">
            {Object.entries(siteDetail).map(([key, tab]) => (
              <button key={key} type="button" className={`map-detail-tab${activeSubTab === key ? " active" : ""}`}
                onClick={() => setActiveSubTab(key)}>
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-text">
                  <strong>{tab.label}</strong>
                  <small>{tab.desc}</small>
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="map-detail-site">
          <div className="map-detail-site-name">
            <span className="site-marker" style={{background: currentRoute.color}} />
            <h3>{currentSite.name}</h3>
          </div>
          <div className="map-detail-content">
            <div className="placeholder-card">
              <div className="placeholder-card-icon">{activeTab.icon}</div>
              <h4>{activeTab.label}</h4>
              <p className="placeholder-card-desc">{currentSite.name}的内容正在整理中。</p>
              <div className="placeholder-card-status"><span className="status-dot"/><span>团队制作中，敬请期待</span></div>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer-simple">
        <p>北京科技大学马克思主义学院 · 2026 年社会实践成果展示</p>
      </footer>
    </main>
  );
}
