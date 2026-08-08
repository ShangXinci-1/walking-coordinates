"use client";

import { useState } from "react";
import { AssetMedia } from "../../components";
import { ExhibitionBrowser } from "../../components/outcomes/ExhibitionBrowser";
import { NewsArchive } from "../../components/outcomes/NewsArchive";
import { OutcomeGallery } from "../../components/outcomes/OutcomeGallery";
import { OutcomeRecordView } from "../../components/outcomes/OutcomeRecord";
import NumberTicker from "../../components/NumberTicker";
import ShinyText from "../../components/ShinyText";
import { RevealOnScroll } from "../../components/RevealOnScroll";
import { useStaggerReveal } from "../../components/useStaggerReveal";
import "../../styles/components/stagger-reveal.css";
import { exhibitionSites } from "../../data/exhibition";
import {
  getGalleryAssets,
  getOrderedOutcomes,
  getProjectCounts,
  getRequiredAssetById,
} from "../../lib/content/selectors";
import { withBasePath } from "../../lib/site";
import { SiteFooter, SiteHeader } from "../shared";

export default function OutcomesPage() {
  const outcomes = getOrderedOutcomes();
  const galleryAssets = getGalleryAssets();
  // 主视觉：北大红楼建筑外观——数字成果的实体起点
  const heroAsset = getRequiredAssetById("beida-honglou-01");
  const { routeCount, siteCount } = getProjectCounts();
  const recordsRef = useStaggerReveal<HTMLDivElement>();
  const [exhibitionOpen, setExhibitionOpen] = useState(false);
  const [newsOpen, setNewsOpen] = useState(false);
  const exhibitionVrUrl =
    exhibitionSites.find((site) => site.vrUrl)?.vrUrl ?? null;

  return (
    <main className="outcomes-page">
      <SiteHeader />

      <section className="outcomes-hero" aria-labelledby="outcomes-title">
        <div className="outcomes-hero__topline" aria-hidden="true">
          <span>39°54′N · 116°23′E</span>
          <i />
          <span>BEIJING · 2026</span>
        </div>

        <div className="outcomes-hero__copy">
          <p>
            <ShinyText text="成果公开，以真实交付为准" />
          </p>
          <h1 id="outcomes-title">
            <span className="outcomes-hero__h1-line">让每一项成果，</span>
            <span className="outcomes-hero__h1-line">
              都带着清楚的状态被看见。
            </span>
          </h1>
          <p className="outcomes-hero__lead">
            数字展厅、档案、影片与报告分别记录完成度、更新时间和交付条件。
            没有真实访问地址的成果不会生成虚假入口。
          </p>
          <a href="#outcome-ledger">
            查看成果档案 <span aria-hidden="true">↓</span>
          </a>
        </div>

        <div className="outcomes-hero__media">
          <AssetMedia
            asset={heroAsset}
            priority
            sizes="(min-width: 980px) 48vw, 100vw"
          />
        </div>

        <dl className="outcomes-hero__summary" aria-label="成果状态总览">
          <div>
            <dt>成果记录</dt>
            <dd>
              <NumberTicker value={outcomes.length} /> 项
            </dd>
          </div>
          <div>
            <dt>史迹坐标</dt>
            <dd>
              <NumberTicker value={siteCount} /> 处
            </dd>
          </div>
          <div>
            <dt>实践路线</dt>
            <dd>
              <NumberTicker value={routeCount} /> 条
            </dd>
          </div>
          <div className="outcomes-hero__summary-film">
            <dt>主题微电影</dt>
            <dd>
              <span className="outcomes-hero__film-pill">剪辑中</span>
            </dd>
          </div>
        </dl>
      </section>

      <section
        className="outcome-ledger"
        id="outcome-ledger"
        aria-labelledby="outcome-ledger-title"
      >
        <header className="outcome-ledger__heading">
          <p>每一站都有档案可循</p>
          <div>
            <h2 id="outcome-ledger-title">从坐标到档案，每一站都可以核验。</h2>
            <p>
              数字展厅与新闻稿档案已可浏览，调研报告持续更新，主题微电影正在剪辑。
              每一项成果的状态、来源与访问动作，都来自同一条成果记录。
            </p>
          </div>
        </header>

        <div className="outcome-ledger__records" ref={recordsRef}>
          {outcomes.map((outcome, index) => (
            <OutcomeRecordView
              outcome={outcome}
              key={outcome.id}
              style={{ "--i": index } as React.CSSProperties}
              onOpenExhibition={() => setExhibitionOpen(true)}
              onOpenNewsArchive={() => setNewsOpen(true)}
              vrUrl={
                outcome.id === "digital-exhibition" ? exhibitionVrUrl : null
              }
            />
          ))}
        </div>
      </section>

      <OutcomeGallery assets={galleryAssets} />

      <section className="outcomes-closing" aria-labelledby="outcomes-next-title">
        <RevealOnScroll blur>
          <div className="outcomes-closing__body">
            <p className="outcomes-closing__coords" aria-hidden="true">
              39°54′N · 116°23′E
            </p>
            <p className="outcomes-closing__kicker">
              BEIJING · 2026 · 三条路线 · 十三处史迹
            </p>
            <h2 id="outcomes-next-title">实践已经抵达，记忆正在被看见。</h2>
            <p className="outcomes-closing__lead">
              数字展厅与新闻稿档案已可浏览，调研报告持续更新。
              主题微电影正在剪辑——完成后，它会第一个出现在这里。
            </p>
            <div className="outcomes-closing__film">
              <span className="outcomes-closing__film-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M7 4v16M17 4v16M2 8h5M2 16h5M17 8h5M17 16h5" />
                </svg>
              </span>
              <div className="outcomes-closing__film-track" aria-hidden="true">
                <i className="outcomes-closing__film-fill" />
              </div>
              <span className="outcomes-closing__film-label">
                主题微电影 · 剪辑中
              </span>
            </div>
          </div>
          <div className="outcomes-closing__actions">
            <a href={withBasePath("/journey")}>
              浏览完整路线 <span aria-hidden="true">→</span>
            </a>
            <a href={withBasePath("/legacy")}>
              查看后续行动 <span aria-hidden="true">→</span>
            </a>
          </div>
        </RevealOnScroll>
      </section>

      <SiteFooter />

      {exhibitionOpen && (
        <ExhibitionBrowser onClose={() => setExhibitionOpen(false)} />
      )}

      {newsOpen && <NewsArchive onClose={() => setNewsOpen(false)} />}
    </main>
  );
}
