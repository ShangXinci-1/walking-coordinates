"use client";

import { useState } from "react";
import { SiteHeader, SiteFooter } from "../shared";
import { RouteMap } from "../RouteMap";

const BASE = "/walking-coordinates";

const routeImages = [`${BASE}/images/field-01.svg`, `${BASE}/images/field-03.svg`, `${BASE}/images/field-04.svg`];

const routeData = [
  {
    id: "A", title: "觉醒之路", color: "#ff5555",
    path: "M440,380 Q460,330 430,280 T450,200 T420,140",
    points: [{cx:440,cy:380,name:"北大红楼"},{cx:445,cy:300,name:"《新青年》编辑部"},{cx:435,cy:220,name:"李大钊故居"},{cx:420,cy:140,name:"京报馆旧址"}]
  },
  {
    id: "B", title: "烽火之路", color: "#ff8855",
    path: "M380,440 Q360,370 390,310 T370,230 T400,150",
    points: [{cx:380,cy:440,name:"抗战纪念馆"},{cx:375,cy:350,name:"卢沟桥"},{cx:380,cy:270,name:"百望山纪念园"},{cx:400,cy:150,name:"贝家花园"}]
  },
  {
    id: "C", title: "进京之路", color: "#ee6644",
    path: "M540,420 Q560,360 530,300 T550,220 T520,140",
    points: [{cx:540,cy:420,name:"香山纪念地"},{cx:545,cy:340,name:"双清别墅"},{cx:535,cy:260,name:"清华园车站"}]
  },
];

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
            <img src={routeImages[activeRoute]} alt={routeData[activeRoute].title} />
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
