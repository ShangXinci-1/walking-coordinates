"use client";

import { useEffect, useState } from "react";
import { SiteHeader, SiteFooter } from "../shared";

const BASE = "/walking-coordinates";

const gallery = [
  { src: `${BASE}/images/field-01.svg`, alt: "现场寻访", label: "现场寻访" },
  { src: `${BASE}/images/field-02.svg`, alt: "深度访谈", label: "深度访谈" },
  { src: `${BASE}/images/field-03.svg`, alt: "社区传播", label: "社区传播" },
  { src: `${BASE}/images/field-04.svg`, alt: "数字采集", label: "数字采集" },
  { src: `${BASE}/images/field-05.svg`, alt: "青年同行", label: "青年同行" },
];

export default function OutcomesPage() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  useEffect(() => {
    if (lightbox === null) return;
    const close = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [lightbox]);

  return (
    <main>
      <SiteHeader />
      <section className="page-hero" style={{background:"linear-gradient(135deg, #8B0000 0%, #4a0000 50%, #1a0000 100%)"}}>
        <div className="page-hero-inner">
          <div className="page-hero-text" style={{maxWidth:"100%"}}>
            <div className="page-hero-watermark">DIGITAL</div>
            <span className="page-hero-badge">DIGITAL OUTCOMES</span>
            <h1>让成果被看见<br />让记忆可抵达</h1>
            <p className="page-hero-summary">以寻访路线为叙事骨架，整合高清影像、全景记录与口述史，让红色记忆可感可触。</p>
            <div className="page-hero-meta">
              <span>🏛️ 数字线上展厅</span>
              <span>🎬 主题微电影</span>
              <span>📄 实践调研报告</span>
            </div>
          </div>
          <div className="page-hero-visual"><img src={`${BASE}/images/field-04.svg`} alt="数字化成果" /></div>
        </div>
      </section>

      <section className="outcomes" id="outcomes">
        <div className="outcome-feature">
          <div><span>CORE OUTPUT / 01</span><h3>北京红色史迹<br />数字线上展厅</h3><p>以寻访路线为叙事骨架，整合高清影像、全景记录、口述史与青年解说，让观众从一个坐标进入一段历史。</p><a href="#gallery">进入展厅预览 <span>→</span></a></div>
          <div className="map-visual"><span className="map-label label-one">觉醒之路</span><span className="map-label label-two">烽火之路</span><span className="map-label label-three">进京之路</span><i className="map-path path-one" /><i className="map-path path-two" /><i className="map-path path-three" /><b className="map-node node-one" /><b className="map-node node-two" /><b className="map-node node-three" /></div>
        </div>
        <div className="outcome-list">
          <article><span>02</span><h3>数字档案</h3><p>核心史迹高清影像、环境记录与口述材料的结构化归档。</p></article>
          <article><span>03</span><h3>主题微电影</h3><p>以青年镜头串联寻访现场，让历史叙事形成可传播的影像作品。</p></article>
          <article><span>04</span><h3>实践调研报告</h3><p>梳理典型红色故事与数字化保护路径，沉淀可复用的方法经验。</p></article>
        </div>
      </section>

      <section className="gallery-section" id="gallery">
        <div className="gallery-intro"><p>FIELD RECORDS</p><h2>现场，是最有力量的课堂。</h2><p>点击影像，查看实践现场记录。</p></div>
        <div className="gallery-grid">
          {gallery.map((image, index) => (
            <button key={image.src} type="button" onClick={() => setLightbox(index)}>
              <img src={image.src} alt={image.alt} /><span>{String(index + 1).padStart(2, "0")} / {image.label}</span>
            </button>
          ))}
        </div>
      </section>
      <SiteFooter />

      {lightbox !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setLightbox(null)}>
          <button type="button" onClick={() => setLightbox(null)}>关闭 ×</button>
          <figure onClick={(e) => e.stopPropagation()}><img src={gallery[lightbox].src} alt={gallery[lightbox].alt} /><figcaption>{String(lightbox + 1).padStart(2, "0")} / {gallery[lightbox].label}</figcaption></figure>
        </div>
      )}
    </main>
  );
}
