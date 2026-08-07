// NexumHero：全屏视频英雄区（nexum 风格中文版）
// 视频背景 + 玻璃拟态卡片 + 底部锚定内容；内容为行走的坐标站点语境。
import type { AssetRecord } from "../lib/content/types";
import { withBasePath } from "../lib/site";
import { exhibitionSites } from "../data/exhibition";
import {
  getProjectCounts,
  getRequiredAssetById,
} from "../lib/content/selectors";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260803_192301_9231ed6b-c55c-4a48-909c-4ebe11cf2e11.mp4";

function assetSrc(asset: AssetRecord): string {
  return asset.assetStatus === "ready"
    ? (asset as { finalSrc: string }).finalSrc
    : (asset as { placeholderSrc: string }).placeholderSrc;
}

export default function NexumHero() {
  const { routeCount, siteCount } = getProjectCounts();
  const vrCount = exhibitionSites.filter((site) => site.vrUrl).length;
  const avatarSrc = assetSrc(getRequiredAssetById("community-01"));

  return (
    <section className="nexum-hero" aria-labelledby="nexum-title">
      {/* ── 全屏背景视频（poster 兜底：视频未加载时显示实地照片） ── */}
      <video
        className="nexum-hero__video"
        autoPlay
        loop
        muted
        playsInline
        poster={withBasePath("/media/xiangshan/背影3.0.jpg")}
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

      <div className="nexum-hero__content">
        {/* ── 左：项目声明 + 行动入口 ── */}
        <div className="nexum-hero__left">
          <p className="nexum-hero__kicker">北京科技大学社会实践 · 2026</p>
          <h1 id="nexum-title">用脚步丈量历史，以数字保存记忆</h1>
          <p className="nexum-hero__lead">
            青年实践团队沿三条路线走进十三处革命史迹，
            以影像、访谈、全景与资料整理建立可追溯的数字记录。
          </p>
          <div className="nexum-hero__cta">
            <a className="nexum-hero__cta-btn" href={withBasePath("/journey")}>
              从路线开始 <span aria-hidden="true">→</span>
            </a>
            <a className="nexum-hero__cta-quiet" href="#practice-method">
              查看项目方法
            </a>
          </div>
        </div>

        {/* ── 右：两张玻璃卡片 ── */}
        <div className="nexum-hero__cards">
          <div className="nexum-hero__card nexum-hero__card--stats">
            <div className="nexum-hero__stat-row">
              <div className="nexum-hero__stat-item">
                <span className="nexum-hero__stat">{siteCount}</span>
                <span className="nexum-hero__stat-label">处史迹坐标</span>
              </div>
              <div className="nexum-hero__stat-item">
                <span className="nexum-hero__stat">{routeCount}</span>
                <span className="nexum-hero__stat-label">条主题路线</span>
              </div>
              <div className="nexum-hero__stat-item">
                <span className="nexum-hero__stat">{vrCount}</span>
                <span className="nexum-hero__stat-label">处 VR 全景</span>
              </div>
            </div>
            <p>沿觉醒、烽火、进京三条路线，让历史在数字空间继续发生。</p>
          </div>
          <div className="nexum-hero__card nexum-hero__card--quote">
            <div className="nexum-hero__quote-head">
              <span className="nexum-hero__quote-badge" aria-hidden="true">
                红
              </span>
              <span className="nexum-hero__quote-brand">行走的坐标</span>
            </div>
            <p className="nexum-hero__quote-text">
              “传播内容必须坚守史实绝对真实，严格甄别史料来源——这是红色文化数字化传播的底线共识。”
            </p>
            <div className="nexum-hero__quote-foot">
              <img
                className="nexum-hero__quote-avatar"
                src={withBasePath(avatarSrc)}
                alt=""
                width={36}
                height={36}
              />
              <div className="nexum-hero__quote-meta">
                <strong>调研访谈记录</strong>
                <span>社区宣讲 · 2026-08</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
