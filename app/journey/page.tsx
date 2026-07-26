"use client";

import { useState } from "react";
import { SiteHeader, SiteFooter } from "../shared";
import { RouteMap } from "../RouteMap";

const BASE = "/walking-coordinates";

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
      <section className="page-hero" style={{background:"linear-gradient(135deg, #1a0000 0%, #0d0000 50%, #0a0a0a 100%)"}}>
        <div className="page-hero-inner">
          <div className="page-hero-text">
            <div className="page-hero-watermark">ROUTES</div>
            <span className="page-hero-badge">寻访路线 · 交互地图</span>
            <h1>以脚步丈量<br />红色北京</h1>
            <p className="page-hero-summary">三条路线，十一条红色坐标。点击地图上的地点，查看详细介绍、实践影像与VR全景。</p>
          </div>
          <div className="page-hero-visual" style={{flex:1.5}}>
            <RouteMap routes={routeData} activeRoute={activeRoute} activeSite={activeSite} onSelectSite={handleMapSelect} />
          </div>
        </div>
      </section>

      <section className="site-detail-section">
        <div className="section-heading">
          <p>{currentRoute.title}</p>
          <h2>{currentSite.name}</h2>
        </div>
        <div className="site-subtabs" role="tablist">
          {Object.entries(siteDetail).map(([key, tab]) => (
            <button key={key} type="button" role="tab" aria-selected={activeSubTab === key}
              onClick={() => setActiveSubTab(key)}>
              <span className="subtab-icon">{tab.icon}</span>
              <span className="subtab-text"><strong>{tab.label}</strong><small>{tab.desc}</small></span>
            </button>
          ))}
        </div>
        <div className="site-subpanel">
          <div className="placeholder-card">
            <div className="placeholder-card-icon">{activeTab.icon}</div>
            <h4>{activeTab.label}</h4>
            <p className="placeholder-card-desc">{currentSite.name}的内容正在整理中。</p>
            <div className="placeholder-card-status"><span className="status-dot"/><span>团队制作中，敬请期待</span></div>
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
