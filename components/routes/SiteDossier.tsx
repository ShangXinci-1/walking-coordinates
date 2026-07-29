import { AssetMedia, EvidenceStrip, StatusBadge } from "..";
import type {
  AssetRecord,
  RouteRecord,
  SiteRecord,
  SourceRecord,
} from "../../lib/content/types";

interface SiteDossierProps {
  route: RouteRecord;
  site: SiteRecord;
  asset: AssetRecord | null;
  sources: readonly SourceRecord[];
  previousSite: SiteRecord | null;
  nextSite: SiteRecord | null;
  copyState: "idle" | "copied" | "failed";
  onSelectSite: (site: SiteRecord) => void;
  onCopyLink: () => void;
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

function ArchiveSection({
  title,
  blocks,
  emptyText,
}: {
  title: string;
  blocks: SiteRecord["historySummary"];
  emptyText: string;
}) {
  return (
    <section className="dossier-section">
      <h3>{title}</h3>
      {blocks.length > 0 ? (
        blocks.map((block) => <p key={block.id}>{block.text}</p>)
      ) : (
        <p className="dossier-section__empty">{emptyText}</p>
      )}
    </section>
  );
}

export function SiteDossier({
  route,
  site,
  asset,
  sources,
  previousSite,
  nextSite,
  copyState,
  onSelectSite,
  onCopyLink,
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

      {asset ? (
        <div className="site-dossier__media">
          <AssetMedia asset={asset} sizes="(min-width: 1180px) 28vw, 100vw" />
        </div>
      ) : (
        <div className="site-dossier__media-empty">
          <span>素材记录</span>
          <strong>当前地点尚无素材条目</strong>
          <small>正式图片到位后在此保留来源、授权与用途信息。</small>
        </div>
      )}

      <ArchiveSection
        title="历史摘要"
        blocks={site.historySummary}
        emptyText="历史摘要待来源核验后整理。"
      />
      <ArchiveSection
        title="实践记录"
        blocks={site.practiceSummary}
        emptyText="团队实践记录待现场材料归档后补录。"
      />

      <section className="dossier-section dossier-sources">
        <h3>资料来源</h3>
        <ol>
          {sources.map((source) => (
            <li key={source.id}>
              {source.url ? (
                <a href={source.url} target="_blank" rel="noreferrer">
                  <strong>{source.title}</strong>
                  <span>
                    {source.publisher} · {source.level} 级来源
                  </span>
                </a>
              ) : (
                <div>
                  <strong>{source.title}</strong>
                  <span>
                    {source.publisher} · {source.level} 级来源
                  </span>
                </div>
              )}
            </li>
          ))}
        </ol>
      </section>

      <div className="site-dossier__share">
        <button type="button" onClick={onCopyLink}>
          {copyState === "copied"
            ? "链接已复制"
            : copyState === "failed"
              ? "重新复制链接"
              : "复制当前档案链接"}
        </button>
        <span className="sr-only" aria-live="polite">
          {copyState === "copied"
            ? `${site.name.value}档案链接已复制`
            : copyState === "failed"
              ? "链接复制失败，请重试"
              : ""}
        </span>
      </div>

      <nav className="site-dossier__pager" aria-label="相邻地点">
        <button
          type="button"
          disabled={!previousSite}
          onClick={() => previousSite && onSelectSite(previousSite)}
        >
          <span aria-hidden="true">←</span>
          <small>上一地点</small>
          <strong>{previousSite?.name.value ?? "已到起点"}</strong>
        </button>
        <button
          type="button"
          disabled={!nextSite}
          onClick={() => nextSite && onSelectSite(nextSite)}
        >
          <small>下一地点</small>
          <strong>{nextSite?.name.value ?? "已到终点"}</strong>
          <span aria-hidden="true">→</span>
        </button>
      </nav>
    </article>
  );
}
