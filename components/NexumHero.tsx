// NexumHero：全屏视频英雄区（nexum 风格中文版）
// 动态照片层（Ken Burns）打底，视频加载成功后淡入覆盖；叠加坐标、三路线等站点元素。
"use client";

import { useState } from "react";
import type { AssetRecord } from "../lib/content/types";
import { withBasePath } from "../lib/site";
import { exhibitionSites } from "../data/exhibition";
import {
  getProjectCounts,
  getRequiredAssetById,
} from "../lib/content/selectors";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260803_192301_9231ed6b-c55c-4a48-909c-4ebe11cf2e11.mp4";

const ROUTE_NAMES = ["觉醒之路", "烽火之路", "进京之路"];

function assetSrc(asset: AssetRecord): string {
  return asset.assetStatus === "ready"
    ? (asset as { finalSrc: string }).finalSrc
    : (asset as { placeholderSrc: string }).placeholderSrc;
}

export default function NexumHero() {
  const { routeCount, siteCount } = getProjectCounts();
  const vrCount = exhibitionSites.filter((site) => site.vrUrl).length;
  const avatarSrc = assetSrc(getRequiredAssetById("community-01"));
  const [videoReady, setVideoReady] = useState(false);
  const stillSrc = withBasePath("/media/xiangshan/背影3.0.jpg");

  return (
    <section className="nexum-hero" aria-labelledby="nexum-title">
      {/* ── 动态照片层：视频未就绪时的动画底（缓慢缩放，不静止） ── */}
      <div className="nexum-hero__still" aria-hidden="true">
        <img src={stillSrc} alt="" />
      </div>

      {/* ── 视频层：就绪后淡入覆盖照片层 ── */}
      <video
        className={`nexum-hero__video${videoReady ? " is-ready" : ""}`}
        autoPlay
        loop
        muted
        playsInline
        onCanPlay={() => setVideoReady(true)}
        onPlaying={() => setVideoReady(true)}
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

      {/* ── 柔和遮罩：底部压暗，保证中文文字与玻璃卡片可读 ── */}
      <div className="nexum-hero__shade" aria-hidden="true" />

      {/* ── 坐标 topline：左上角 ── */}
      <div className="nexum-hero__topline" aria-hidden="true">
        <span>39°54′N · 116°23′E</span>
        <i />
        <span>BEIJING · 2026</span>
      </div>

      {/* ── 三路线坐标装饰：左侧中部 ── */}
      <div className="nexum-hero__routes" aria-hidden="true">
        {ROUTE_NAMES.map((name, i) => (
          <div className="nexum-hero__route" key={name}>
            <span className="nexum-hero__route-no">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="nexum-hero__route-name">{name}</span>
          </div>
        ))}
      </div>

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
