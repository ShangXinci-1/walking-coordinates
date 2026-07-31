"use client";

import { useState } from "react";
import { AssetMedia, StatusBadge } from "../../components";
import { ExhibitionBrowser } from "../../components/outcomes/ExhibitionBrowser";
import { NewsArchive } from "../../components/outcomes/NewsArchive";
import { OutcomeGallery } from "../../components/outcomes/OutcomeGallery";
import { OutcomeRecordView } from "../../components/outcomes/OutcomeRecord";
import { exhibitionSites } from "../../data/exhibition";
import {
  getGalleryAssets,
  getOrderedOutcomes,
  getRequiredAssetById,
} from "../../lib/content/selectors";
import { withBasePath } from "../../lib/site";
import { SiteFooter, SiteHeader } from "../shared";

export default function OutcomesPage() {
  const outcomes = getOrderedOutcomes();
  const galleryAssets = getGalleryAssets();
  const heroAsset = getRequiredAssetById(
    outcomes[0].assetId ?? "outcome-01",
  );
  const readyCount = outcomes.filter(
    (outcome) => outcome.publicationStatus === "ready",
  ).length;
  const inProgressCount = outcomes.filter(
    (outcome) => outcome.completionStatus === "in-progress",
  ).length;
  const [exhibitionOpen, setExhibitionOpen] = useState(false);
  const [newsOpen, setNewsOpen] = useState(false);
  const exhibitionVrUrl =
    exhibitionSites.find((site) => site.id === "beida-honglou")?.vrUrl ??
    null;

  return (
    <main className="outcomes-page">
      <SiteHeader />

      <section className="outcomes-hero" aria-labelledby="outcomes-title">
        <div className="outcomes-hero__copy">
          <p>成果公开，以真实交付为准</p>
          <h1 id="outcomes-title">让每一项成果，都带着清楚的状态被看见。</h1>
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
            <dd>{outcomes.length} 项</dd>
          </div>
          <div>
            <dt>已开放</dt>
            <dd>{readyCount} 项</dd>
          </div>
          <div>
            <dt>制作中</dt>
            <dd>{inProgressCount} 项</dd>
          </div>
          <div>
            <dt>当前发布判断</dt>
            <dd>{readyCount === 0 ? "尚无公开入口" : "按状态开放"}</dd>
          </div>
        </dl>
      </section>

      <section
        className="outcome-ledger"
        id="outcome-ledger"
        aria-labelledby="outcome-ledger-title"
      >
        <header className="outcome-ledger__heading">
          <p>每项成果独立过门禁</p>
          <div>
            <h2 id="outcome-ledger-title">成果档案不是愿景清单，而是交付记录。</h2>
            <p>
              状态、负责人、更新时间、交付条件与访问动作来自同一条成果记录。
              只有完成审核且具备真实地址的成果才显示访问按钮。
            </p>
          </div>
        </header>

        <div className="outcome-ledger__records">
          {outcomes.map((outcome) => (
            <OutcomeRecordView
              outcome={outcome}
              key={outcome.id}
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
        <div>
          <StatusBadge status="planned" />
          <h2 id="outcomes-next-title">成果尚在形成，路线与地点档案已经可以继续核验。</h2>
        </div>
        <div className="outcomes-closing__actions">
          <a href={withBasePath("/journey")}>
            浏览完整路线 <span aria-hidden="true">→</span>
          </a>
          <a href={withBasePath("/legacy")}>
            查看后续行动 <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <SiteFooter />

      {exhibitionOpen && (
        <ExhibitionBrowser onClose={() => setExhibitionOpen(false)} />
      )}

      {newsOpen && <NewsArchive onClose={() => setNewsOpen(false)} />}
    </main>
  );
}
