"use client";

import { useEffect, useState } from "react";
import { ResponsiveMedia, StatusBadge } from "../../components";
import {
  getGalleryAssets,
  getOrderedOutcomes,
  getRequiredAssetById,
} from "../../lib/content/selectors";
import { SiteHeader, SiteFooter } from "../shared";

const gallery = getGalleryAssets().map((asset) => ({
  id: asset.id,
  asset,
  label: `${asset.label} · 示意素材`,
}));
const outcomes = getOrderedOutcomes();
const featuredOutcome = outcomes[0];
const outcomeHero = getRequiredAssetById("placeholder-field-04");

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
          <div className="page-hero-visual"><ResponsiveMedia asset={outcomeHero} priority sizes="(min-width: 1050px) 40vw, 100vw" /></div>
        </div>
      </section>

      <section className="outcomes" id="outcomes">
        <div className="outcome-feature">
          <div><StatusBadge status={featuredOutcome.publicationStatus} /><h3>{featuredOutcome.title.value}</h3><p>{featuredOutcome.description[0].text}</p></div>
          <div className="map-visual"><span className="map-label label-one">觉醒之路</span><span className="map-label label-two">烽火之路</span><span className="map-label label-three">进京之路</span><i className="map-path path-one" /><i className="map-path path-two" /><i className="map-path path-three" /><b className="map-node node-one" /><b className="map-node node-two" /><b className="map-node node-three" /></div>
        </div>
        <div className="outcome-list">
          {outcomes.slice(1).map((outcome) => (
            <article key={outcome.id}><span>{String(outcome.order).padStart(2, "0")}</span><h3>{outcome.title.value}</h3><p>{outcome.description[0].text}</p><StatusBadge status={outcome.publicationStatus} /></article>
          ))}
        </div>
      </section>

      <section className="gallery-section" id="gallery">
        <div className="gallery-intro"><p>FIELD RECORDS</p><h2>现场，是最有力量的课堂。</h2><p>点击影像，查看实践现场记录。</p></div>
        <div className="gallery-grid">
          {gallery.map((image, index) => (
            <button key={image.id} type="button" onClick={() => setLightbox(index)}>
              <ResponsiveMedia asset={image.asset} sizes="(min-width: 700px) 33vw, 100vw" /><span>{String(index + 1).padStart(2, "0")} / {image.label}</span>
            </button>
          ))}
        </div>
      </section>
      <SiteFooter />

      {lightbox !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setLightbox(null)}>
          <button type="button" onClick={() => setLightbox(null)}>关闭 ×</button>
          <figure onClick={(e) => e.stopPropagation()}><ResponsiveMedia asset={gallery[lightbox].asset} sizes="92vw" /><figcaption>{String(lightbox + 1).padStart(2, "0")} / {gallery[lightbox].label}</figcaption></figure>
        </div>
      )}
    </main>
  );
}
