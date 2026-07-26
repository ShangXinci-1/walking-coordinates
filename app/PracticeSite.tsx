"use client";

import { useEffect, useState } from "react";

const routes = [
  { id: "A", title: "觉醒之路", days: "第 2—4 天", summary: "从新文化运动的思想源头出发，追寻青年觉醒与信仰选择。", sites: ["北大红楼", "《新青年》编辑部旧址", "李大钊故居", "京报馆旧址"], coordinate: "39°55′N · 116°24′E" },
  { id: "B", title: "烽火之路", days: "第 5—7 天", summary: "走近抗战遗址与纪念场馆，在现场记录中聆听民族记忆。", sites: ["中国人民抗日战争纪念馆", "卢沟桥", "百望山黑山扈战斗纪念园", "贝家花园"], coordinate: "39°50′N · 116°13′E" },
  { id: "C", title: "进京之路", days: "第 10—11 天", summary: "沿着进京赶考的历史轨迹，理解初心如何化为时代使命。", sites: ["香山革命纪念地", "双清别墅", "清华园车站旧址"], coordinate: "39°59′N · 116°11′E" },
];

const gallery = [
  { src: "/images/field-01.svg", alt: "实践队员在讲解员带领下开展现场寻访", label: "现场寻访" },
  { src: "/images/field-02.svg", alt: "实践队员在工业现场听取专业讲解", label: "深度访谈" },
  { src: "/images/field-03.svg", alt: "实践队员在社区开展红色文化宣讲", label: "社区传播" },
  { src: "/images/field-04.svg", alt: "实践队员在生产现场记录数字化素材", label: "数字采集" },
  { src: "/images/field-05.svg", alt: "北京科技大学学生社会实践团合影", label: "青年同行" },
];

const schedule = [
  ["01", "启动与培训", "团队集结、安全教育与数字化采集技术培训"],
  ["02—04", "觉醒之路", "寻访北大红楼等地，完成深度访谈与数字采集"],
  ["05—07", "烽火之路", "赴抗战地标开展沉浸记录与口述史收集"],
  ["08", "社区工作坊", "将红色记忆转化为可参与的数字传播内容"],
  ["09", "中期整理", "备份、筛选素材，复盘路线并校准创作计划"],
  ["10—11", "进京之路", "围绕「赶考」主题完成精细采集与环境记录"],
  ["12", "影像创作", "整理前期素材，完成主题微电影拍摄"],
  ["13—14", "集中攻坚", "线上展厅、调研报告与成果传播同步成型"],
];

export function PracticeSite() {
  const [activeRoute, setActiveRoute] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const route = routes[activeRoute];

  useEffect(() => {
    if (lightbox === null) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setLightbox(null); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [lightbox]);

  return (
    <main>
      <section className="hero" id="top" aria-labelledby="hero-title">
        <header className="site-header">
          <a className="identity" href="#top" aria-label="返回首页">
            <span className="identity-mark" aria-hidden="true">北科</span>
            <span><strong>北京科技大学</strong><small>社会实践成果展 · 2026</small></span>
          </a>
          <nav aria-label="主导航"><a href="#journey">寻访路线</a><a href="#outcomes">数字成果</a><a href="#legacy">精神传承</a></nav>
        </header>

        <div className="hero-copy">
          <p className="hero-kicker">传承红色基因</p>
          <h1 id="hero-title">革命史迹<br />数字化寻访</h1>
          <p className="hero-lead">我们把行走变成坐标，把史迹转译为可抵达、可阅读、可传承的数字记忆。</p>
          <div className="hero-stats" aria-label="实践概况"><span><b>14</b>天系统实践</span><i aria-hidden="true">/</i><span><b>3</b>条北京路线</span></div>
          <a className="primary-link" href="#outcomes">查看核心成果 <span aria-hidden="true">↘</span></a>
        </div>

        <div className="hero-photos" aria-label="实践纪实影像">
          <figure className="hero-photo hero-photo-main"><img src="/images/field-05.svg" alt="北京科技大学学生社会实践团合影" /><figcaption>FIELD RECORD / 01</figcaption></figure>
          <figure className="hero-photo hero-photo-side"><img src="/images/field-03.svg" alt="实践队员走进社区开展红色文化传播" /><figcaption>FIELD RECORD / 02</figcaption></figure>
          <blockquote>以脚步丈量历史，<br /><em>以技术保存记忆</em></blockquote>
        </div>

        <div className="route-lines" aria-hidden="true"><span className="line line-a" /><span className="line line-b" /><span className="line line-c" /><i className="point point-a" /><i className="point point-b" /><i className="point point-c" /></div>

        <div className="hero-footer">
          <a href="#outcomes"><span aria-hidden="true">→</span><small>核心成果入口</small><strong>北京红色史迹数字线上展厅</strong></a>
          <span><small>ARCHIVE</small><strong>数字档案</strong></span><span><small>FILM</small><strong>主题微电影</strong></span><span><small>REPORT</small><strong>实践调研报告</strong></span>
        </div>
      </section>

      <section className="manifesto" aria-labelledby="manifesto-title">
        <p>这不是一次旁观式参访。</p>
        <h2 id="manifesto-title">从现场出发，<br />让历史在数字空间继续发生。</h2>
        <div><p>项目聚焦北京核心红色史迹，以"实地深度寻访 + 数字化技术采集 + 青年化叙事转化"为方法，建立从寻访、解码到传播的完整实践链。</p><p>团队通过影像记录、全景采集、口述访谈与资料整理，让红色记忆由静态陈列变成可感、可触、可流传的青年表达。</p></div>
      </section>

      <section className="journey" id="journey" aria-labelledby="journey-title">
        <div className="section-heading"><p>北京行动坐标</p><h2 id="journey-title">三条路线，<br />一条精神脉络</h2></div>
        <div className="route-explorer">
          <div className="route-tabs" role="tablist" aria-label="寻访路线">
            {routes.map((item, index) => <button key={item.id} type="button" role="tab" aria-selected={activeRoute === index} aria-controls="route-panel" onClick={() => setActiveRoute(index)}><span>ROUTE {item.id}</span><strong>{item.title}</strong><small>{item.days}</small></button>)}
          </div>
          <div className="route-panel" id="route-panel" role="tabpanel">
            <div><span className="coordinate">{route.coordinate}</span><h3>{route.title}</h3><p>{route.summary}</p><ul>{route.sites.map((site) => <li key={site}>{site}</li>)}</ul></div>
            <figure><img key={route.id} src={["/images/field-01.svg", "/images/field-03.svg", "/images/field-04.svg"][activeRoute]} alt={`${route.title}实践纪实`} /><figcaption>ROUTE {route.id} · {route.days}</figcaption></figure>
          </div>
        </div>
      </section>

      <section className="outcomes" id="outcomes" aria-labelledby="outcomes-title">
        <div className="section-heading light"><p>数字化成果</p><h2 id="outcomes-title">让成果被看见，<br />让记忆可抵达</h2></div>
        <div className="outcome-feature">
          <div><span>CORE OUTPUT / 01</span><h3>北京红色史迹<br />数字线上展厅</h3><p>以寻访路线为叙事骨架，整合高清影像、全景记录、口述史与青年解说，让观众从一个坐标进入一段历史。</p><a href="#gallery">进入展厅预览 <span aria-hidden="true">→</span></a></div>
          <div className="map-visual" aria-label="三条北京红色史迹数字路线示意"><span className="map-label label-one">觉醒之路</span><span className="map-label label-two">烽火之路</span><span className="map-label label-three">进京之路</span><i className="map-path path-one" /><i className="map-path path-two" /><i className="map-path path-three" /><b className="map-node node-one" /><b className="map-node node-two" /><b className="map-node node-three" /></div>
        </div>
        <div className="outcome-list"><article><span>02</span><h3>数字档案</h3><p>核心史迹高清影像、环境记录与口述材料的结构化归档。</p></article><article><span>03</span><h3>主题微电影</h3><p>以青年镜头串联寻访现场，让历史叙事形成可传播的影像作品。</p></article><article><span>04</span><h3>实践调研报告</h3><p>梳理典型红色故事与数字化保护路径，沉淀可复用的方法经验。</p></article></div>
      </section>

      <section className="gallery-section" id="gallery" aria-labelledby="gallery-title">
        <div className="gallery-intro"><p>FIELD RECORDS</p><h2 id="gallery-title">现场，是最有力量的课堂。</h2><p>点击影像，查看实践现场记录。</p></div>
        <div className="gallery-grid">{gallery.map((image, index) => <button key={image.src} type="button" onClick={() => setLightbox(index)} aria-label={`放大查看：${image.label}`}><img src={image.src} alt={image.alt} /><span>{String(index + 1).padStart(2, "0")} / {image.label}</span></button>)}</div>
      </section>

      <section className="schedule" aria-labelledby="schedule-title">
        <div className="section-heading"><p>14 天实践日程</p><h2 id="schedule-title">从寻访到转化，<br />完整闭环</h2></div>
        <ol>{schedule.map(([day, title, description]) => <li key={day}><span>{day}</span><h3>{title}</h3><p>{description}</p></li>)}</ol>
      </section>

      <section className="legacy" id="legacy" aria-labelledby="legacy-title">
        <div className="legacy-photo"><img src="/images/field-03.svg" alt="实践队员在社区开展红色文化交流活动" /></div>
        <div><p>精神传承</p><h2 id="legacy-title">我们不是历史的访客，<br />而是故事的转译者。</h2><p>当青年走进革命旧址、聆听真实讲述，再用熟悉的媒介重新表达，红色精神便不再停留在书页上，而成为可以被理解、被分享、被继续践行的行动力量。</p><blockquote>让沉睡于京华大地的红色记忆重新醒来，永远鲜活。</blockquote></div>
      </section>

      <footer><a className="identity" href="#top"><span className="identity-mark" aria-hidden="true">北科</span><span><strong>传承红色基因</strong><small>革命史迹数字化寻访</small></span></a><p>北京科技大学马克思主义学院 · 2026 年社会实践成果展示</p><a href="#top">回到顶部 ↑</a></footer>

      {lightbox !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label="实践影像预览" onClick={() => setLightbox(null)}><button type="button" onClick={() => setLightbox(null)} aria-label="关闭影像预览">关闭 ×</button><figure onClick={(event) => event.stopPropagation()}><img src={gallery[lightbox].src} alt={gallery[lightbox].alt} /><figcaption>{String(lightbox + 1).padStart(2, "0")} / {gallery[lightbox].label}</figcaption></figure></div>}
    </main>
  );
}
