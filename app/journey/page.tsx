"use client";

import { useState } from "react";
import { SiteHeader, SiteFooter } from "../shared";

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
  { key: "intro", label: "实践地点介绍", icon: "📝" },
  { key: "photos", label: "实践图片", icon: "📷" },
  { key: "vr", label: "实践地VR取景", icon: "🥽" },
];

const routeImages = [`${BASE}/images/field-01.svg`, `${BASE}/images/field-03.svg`, `${BASE}/images/field-04.svg`];

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
      <section className="hero" style={{minHeight:"auto",height:"auto",padding:"60px clamp(24px,4vw,64px)"}}>
        <div className="hero-copy" style={{width:"100%"}}>
          <p className="hero-kicker">寻访路线</p>
          <h1>三条路线<br />一条精神脉络</h1>
        </div>
      </section>

      <section className="journey">
        <div className="route-explorer">
          <div className="route-tabs" role="tablist">
            {routes.map((item, index) => (
              <button key={item.id} type="button" role="tab" aria-selected={activeRoute === index}
                onClick={() => { setActiveRoute(index); setActiveSite(0); setActiveSubTab("intro"); }}>
                <span>ROUTE {item.id}</span><strong>{item.title}</strong><small>{item.days}</small>
              </button>
            ))}
          </div>
          <div className="route-panel" role="tabpanel">
            <div>
              <span className="coordinate">{route.coordinate}</span>
              <h3>{route.title}</h3>
              <p>{route.summary}</p>
            </div>
            <figure>
              <img src={routeImages[activeRoute]} alt={`${route.title}实践纪实`} />
              <figcaption>ROUTE {route.id} · {route.days}</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="sites-section">
        <div className="section-heading"><p>实践地点</p><h2>{route.title} — 实地寻访记录</h2></div>
        <div className="sites-layout">
          <div className="sites-list" role="tablist">
            {route.sites.map((name, i) => (
              <button key={name} type="button" role="tab" aria-selected={activeSite === i}
                onClick={() => { setActiveSite(i); setActiveSubTab("intro"); }}>
                <span>{String(i + 1).padStart(2, "0")}</span><strong>{name}</strong>
              </button>
            ))}
          </div>
          <div className="site-detail" role="tabpanel">
            <h3>{site}</h3>
            <div className="site-subtabs" role="tablist">
              {subTabs.map(tab => (
                <button key={tab.key} type="button" role="tab" aria-selected={activeSubTab === tab.key}
                  onClick={() => setActiveSubTab(tab.key)}>{tab.label}</button>
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
        <div className="section-heading"><p>14 天实践日程</p><h2>从寻访到转化，<br />完整闭环</h2></div>
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
