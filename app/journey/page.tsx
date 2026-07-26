"use client";

import { useState } from "react";
import { SiteHeader, SiteFooter } from "../shared";
import { RouteMap } from "../RouteMap";

const BASE = "/walking-coordinates";

const routes = [
  { id: "A", title: "觉醒之路", days: "第 2—4 天", summary: "从新文化运动的思想源头出发，追寻青年觉醒与信仰选择。", coordinate: "39°55′N · 116°24′E",
    sites: ["北大红楼", "《新青年》编辑部旧址", "李大钊故居", "京报馆旧址"] },
  { id: "B", title: "烽火之路", days: "第 5—7 天", summary: "走近抗战遗址与纪念场馆，在现场记录中聆听民族记忆。", coordinate: "39°50′N · 116°13′E",
    sites: ["中国人民抗日战争纪念馆", "卢沟桥", "百望山黑山扈战斗纪念园", "贝家花园"] },
  { id: "C", title: "进京之路", days: "第 10—11 天", summary: "沿着进京赶考的历史轨迹，理解初心如何化为时代使命。", coordinate: "39°59′N · 116°11′E",
    sites: ["香山革命纪念地", "双清别墅", "清华园车站旧址"] },
];

const subTabs = [
  { key: "intro", label: "实践地点介绍", icon: "📝", desc: "历史背景与革命故事" },
  { key: "photos", label: "实践图片", icon: "📷", desc: "实地拍摄高清影像" },
  { key: "vr", label: "实践地VR取景", icon: "🥽", desc: "360°虚拟参观体验" },
];

const routeImages = [`${BASE}/images/field-01.svg`, `${BASE}/images/field-03.svg`, `${BASE}/images/field-04.svg`];
const routeHeroColors = [
  "linear-gradient(135deg, #8B0000 0%, #4a0000 50%, #1a0000 100%)",
  "linear-gradient(135deg, #B22222 0%, #5a0000 50%, #1a0000 100%)",
  "linear-gradient(135deg, #A52A2A 0%, #4a0000 50%, #1a0000 100%)",
];

export default function JourneyPage() {
  const [activeRoute, setActiveRoute] = useState(0);
  const [activeSite, setActiveSite] = useState(0);
  const [activeSubTab, setActiveSubTab] = useState("intro");
  const route = routes[activeRoute];
  const site = route.sites[activeSite];
  const currentTab = subTabs.find(t => t.key === activeSubTab)!;

  return (
    <main>
      <SiteHeader />
      <section className="page-hero" style={{background: routeHeroColors[activeRoute]}}>
        <div className="page-hero-inner">
          <div className="page-hero-text">
            <div className="page-hero-watermark">{route.title}</div>
            <span className="page-hero-badge">ROUTE {route.id} · 寻访路线</span>
            <h1>{route.title}</h1>
            <p className="page-hero-summary">{route.summary}</p>
            <div className="page-hero-meta">
              <span>📍 {route.coordinate}</span>
              <span>📅 {route.days}</span>
              <span>📍 {route.sites.length} 个实践地点</span>
            </div>
          </div>
          <div className="page-hero-visual">
            <RouteMap />
          </div>
        </div>
      </section>

      <section className="route-selector">
        <div className="section-heading"><p>寻访路线</p><h2>三条路线，<br />一条精神脉络</h2></div>
        <div className="route-cards">
          {routes.map((item, index) => (
            <button key={item.id} type="button"
              className={`route-card${activeRoute === index ? " active" : ""}`}
              onClick={() => { setActiveRoute(index); setActiveSite(0); setActiveSubTab("intro"); }}>
              <span className="route-card-id">ROUTE {item.id}</span>
              <strong>{item.title}</strong>
              <small>{item.days}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="sites-section">
        <div className="section-heading"><p>实践地点</p><h2>{route.title} — 实地寻访记录</h2></div>
        <div className="sites-layout">
          <div className="sites-list" role="tablist">
            {route.sites.map((name, i) => (
              <button key={name} type="button" role="tab" aria-selected={activeSite === i}
                onClick={() => { setActiveSite(i); setActiveSubTab("intro"); }}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <strong>{name}</strong>
              </button>
            ))}
          </div>
          <div className="site-detail" role="tabpanel">
            <h3>{site}</h3>
            <div className="site-subtabs" role="tablist">
              {subTabs.map(tab => (
                <button key={tab.key} type="button" role="tab" aria-selected={activeSubTab === tab.key}
                  onClick={() => setActiveSubTab(tab.key)}>
                  <span className="subtab-icon">{tab.icon}</span>
                  <span className="subtab-text">
                    <strong>{tab.label}</strong>
                    <small>{tab.desc}</small>
                  </span>
                </button>
              ))}
            </div>
            <div className="site-subpanel">
              <div className="placeholder-card">
                <div className="placeholder-card-icon">{currentTab.icon}</div>
                <h4>{currentTab.label}</h4>
                <p className="placeholder-card-desc">{site}的内容正在整理中。</p>
                <div className="placeholder-card-status"><span className="status-dot"/><span>团队制作中，敬请期待</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="schedule">
        <div className="section-heading"><p>14 天实践日程</p><h2>从寻访到转化，完整闭环</h2></div>
        <ol>
          {[["01","启动与培训","团队集结、安全教育与数字化采集技术培训"],["02—04","觉醒之路","寻访北大红楼等地，完成深度访谈与数字采集"],["05—07","烽火之路","赴抗战地标开展沉浸记录与口述史收集"],["08","社区工作坊","将红色记忆转化为可参与的数字传播内容"],["09","中期整理","备份、筛选素材，复盘路线并校准创作计划"],["10—11","进京之路","围绕「赶考」主题完成精细采集与环境记录"],["12","影像创作","整理前期素材，完成主题微电影拍摄"],["13—14","集中攻坚","线上展厅、调研报告与成果传播同步成型"]].map(([day, title, desc]) => (
            <li key={day}><span>{day}</span><h3>{title}</h3><p>{desc}</p></li>
          ))}
        </ol>
      </section>
      <SiteFooter />
    </main>
  );
}
