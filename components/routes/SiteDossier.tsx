"use client";

import { useEffect, useState } from "react";
import { AssetMedia, EvidenceStrip, StatusBadge } from "..";
import type { AssetRecord, RouteRecord, SiteRecord } from "../../lib/content/types";

interface SiteDossierProps {
  route: RouteRecord;
  site: SiteRecord;
  asset: AssetRecord | null;
  galleryAssets?: AssetRecord[];
  previousSite: SiteRecord | null;
  nextSite: SiteRecord | null;
  onImageClick: () => void;
}

/** 各地点的寻访目标（符合"革命史迹数字化寻访"实践主题） */
const visitGoals: Record<string, string> = {
  "beida-honglou": "记录新文化运动核心展陈，采集五四运动策源地史料",
  "new-youth-editorial-office": "走访编辑部空间布局，采集《新青年》刊物传播资料",
  "li-dazhao-residence": "记录故居书房与生活空间，梳理马克思主义传播线索",
  "jingbao-hall": "考察报馆建筑与编辑空间，采集《京报》新闻史料",
  "beijing-lu-xun-museum": "记录鲁迅故居与展陈，采集新文化运动人物史料",
  "war-sculpture-park": "逐组记录抗战雕塑作品，采集纪念设施全景影像",
  "lugou-bridge": "记录桥体石狮保存状况，采集七七事变遗存细节影像",
  "wanping-city": "记录城墙弹痕与历史建筑，采集抗战实物见证影像",
  "war-museum": "查阅抗战档案与展陈文物，采集口述史料",
  "black-mountain-memorial": "记录纪念碑与浮雕墙，采集山地战斗遗址环境影像",
  "xiangshan-revolutionary-site": "拍摄双清别墅与旧址群，记录“进京赶考”历史现场",
  "cpc-history-exhibition": "记录党史展陈重点文物，核对北京革命史迹史料",
  "qinghuayuan-station": "记录站房建筑与站名牌，采集“进京赶考”登陆点史料",
};

/** 各地点的实践记录方式 */
const recordMethods: Record<string, string> = {
  "beida-honglou": "影像采集 · 展陈记录",
  "new-youth-editorial-office": "影像采集 · 资料整理",
  "li-dazhao-residence": "影像采集 · 环境记录",
  "jingbao-hall": "影像采集 · 口述访谈",
  "beijing-lu-xun-museum": "影像采集 · 展陈记录",
  "war-sculpture-park": "影像采集 · 全景记录",
  "lugou-bridge": "影像采集 · 细节记录",
  "wanping-city": "影像采集 · 环境记录",
  "war-museum": "影像采集 · 访谈记录",
  "black-mountain-memorial": "影像采集 · 环境记录",
  "xiangshan-revolutionary-site": "影像采集 · 环境记录",
  "cpc-history-exhibition": "影像采集 · 资料整理",
  "qinghuayuan-station": "影像采集 · 环境记录",
};

function getCoordinateLabel(site: SiteRecord) {
  if (site.coordinate.status === "verified") {
    return `${site.coordinate.lat.toFixed(6)}°N, ${site.coordinate.lng.toFixed(6)}°E`;
  }
  if (site.coordinate.status === "candidate") return "候选坐标待人工核验";
  return "待人工核验";
}

export function SiteDossier({
  route,
  site,
  asset,
  galleryAssets,
  previousSite,
  nextSite,
  onImageClick,
}: SiteDossierProps) {
  const archiveId = `WC-${route.code}-${String(site.order).padStart(2, "0")}`;
  const [galleryIndex, setGalleryIndex] = useState(0);
  const hasGallery = galleryAssets && galleryAssets.length > 1;
  const displayAsset = hasGallery ? galleryAssets[galleryIndex] : asset;

  /* 切换地点时重置为第一张图片 */
  useEffect(() => {
    setGalleryIndex(0);
  }, [site.id]);

  return (
    <article
      className="site-dossier"
      id="site-dossier"
      key={site.id}
      tabIndex={0}
      aria-label={`${site.name.value}坐标档案内容`}
    >
      <header className="site-dossier__header">
        <div>
          <span className="site-dossier__eyebrow">坐标档案 · {archiveId}</span>
          <h2 id="site-dossier-title" tabIndex={-1}>
            {site.name.value}
          </h2>
        </div>
        <StatusBadge status={site.publicationStatus} />
      </header>

      <EvidenceStrip
        label={`${site.name.value}档案字段`}
        fields={[
          { label: "坐标", value: getCoordinateLabel(site) },
          {
            label: "寻访目标",
            value: visitGoals[site.id] ?? "现场寻访与数字化采集",
          },
          {
            label: "路线顺序",
            value: `${route.title.value} · 第 ${site.order} 站`,
          },
          {
            label: "记录方式",
            value: recordMethods[site.id] ?? "影像采集",
          },
        ]}
      />

      <dl className="site-dossier__facts">
        <div>
          <dt>正式地址</dt>
          <dd>{site.officialAddress?.value ?? "待核定"}</dd>
        </div>
        <div>
          <dt>坐标系</dt>
          <dd>
            {site.coordinate.status === "missing"
              ? "GCJ-02 · 待录入"
              : site.coordinate.crs}
          </dd>
        </div>
      </dl>

      {/* ── clickable image / carousel ── */}
      <div className="site-dossier__media-wrapper">
        <button
          type="button"
          className="site-dossier__media-trigger"
          aria-label={`打开${site.name.value}详细介绍`}
          onClick={onImageClick}
        >
          {displayAsset ? (
            <div className="site-dossier__media">
              <AssetMedia
                asset={displayAsset}
                sizes="(min-width: 1180px) 28vw, 100vw"
              />
            </div>
          ) : (
            <div className="site-dossier__media-empty">
              <span>素材记录</span>
              <strong>当前地点尚无素材条目</strong>
              <small>正式图片到位后在此保留来源、授权与用途信息。</small>
            </div>
          )}
          <span className="site-dossier__media-hint" aria-hidden="true">
            查看详细介绍 →
          </span>
        </button>

        {hasGallery && (
          <div className="site-dossier__carousel-controls">
            <button
              type="button"
              className="site-dossier__carousel-btn"
              aria-label="上一张"
              onClick={(e) => {
                e.stopPropagation();
                setGalleryIndex((prev) =>
                  prev <= 0 ? galleryAssets.length - 1 : prev - 1
                );
              }}
            >
              ‹
            </button>
            <span className="site-dossier__carousel-counter">
              {galleryIndex + 1}/{galleryAssets.length}
            </span>
            <button
              type="button"
              className="site-dossier__carousel-btn"
              aria-label="下一张"
              onClick={(e) => {
                e.stopPropagation();
                setGalleryIndex((prev) =>
                  prev >= galleryAssets.length - 1 ? 0 : prev + 1
                );
              }}
            >
              ›
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
