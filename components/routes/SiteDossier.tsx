import { AssetMedia, EvidenceStrip, StatusBadge } from "..";
import type { AssetRecord, RouteRecord, SiteRecord } from "../../lib/content/types";

interface SiteDossierProps {
  route: RouteRecord;
  site: SiteRecord;
  asset: AssetRecord | null;
  previousSite: SiteRecord | null;
  nextSite: SiteRecord | null;
  onImageClick: () => void;
}

const targetLabels = {
  "main-entrance": "主要入口",
  "site-center": "纪念地中心",
} as const;

const reviewLabels = {
  draft: "草稿",
  "needs-review": "待复核",
  reviewed: "已审核",
} as const;

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
  previousSite,
  nextSite,
  onImageClick,
}: SiteDossierProps) {
  const archiveId = `WC-${route.code}-${String(site.order).padStart(2, "0")}`;

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
          { label: "定位目标", value: targetLabels[site.coordinateTarget] },
          {
            label: "路线顺序",
            value: `${route.title.value} · 第 ${site.order} 站`,
          },
          { label: "内部审核", value: reviewLabels[site.reviewStatus] },
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

      {/* ── clickable image ── */}
      <button
        type="button"
        className="site-dossier__media-trigger"
        aria-label={`打开${site.name.value}详细介绍`}
        onClick={onImageClick}
      >
        {asset ? (
          <div className="site-dossier__media">
            <AssetMedia
              asset={asset}
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
    </article>
  );
}
