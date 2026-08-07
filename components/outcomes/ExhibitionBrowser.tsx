"use client";

import { useEffect, useRef, useState } from "react";
import {
  exhibitionSites,
  routeLabels,
} from "../../data/exhibition";
import { sites } from "../../data/sites";
import { getRequiredAssetById } from "../../lib/content/selectors";
import { withBasePath } from "../../lib/site";
import type { RouteId } from "../../lib/content/types";
import { PhotoWalk, type PhotoWalkImage } from "./PhotoWalk";

interface ExhibitionBrowserProps {
  onClose: () => void;
}

const routeOrder: RouteId[] = ["awakening", "war", "capital"];

/** 该地点的实地照片列表（来自地点档案图库） */
function sitePhotos(siteId: string): PhotoWalkImage[] {
  const site = sites.find((s) => s.id === siteId);
  if (!site) return [];
  return site.galleryAssetIds.map((assetId) => {
    const asset = getRequiredAssetById(assetId);
    const src =
      asset.assetStatus === "ready"
        ? (asset as { finalSrc: string }).finalSrc
        : (asset as { placeholderSrc: string }).placeholderSrc;
    return { src, alt: asset.alt };
  });
}

export function ExhibitionBrowser({ onClose }: ExhibitionBrowserProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [activeSiteId, setActiveSiteId] = useState<string>(
    exhibitionSites[0].id,
  );
  const [walkSite, setWalkSite] = useState<{
    name: string;
    images: PhotoWalkImage[];
  } | null>(null);
  const activeSite =
    exhibitionSites.find((site) => site.id === activeSiteId) ??
    exhibitionSites[0];
  const availableSites = exhibitionSites.filter((site) => site.vrUrl);
  const activePhotos = sitePhotos(activeSite.id);

  /* ── keyboard: Esc 关闭 ── */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  /* ── focus trap + scroll lock ── */
  useEffect(() => {
    const overlay = overlayRef.current;
    overlay?.querySelector<HTMLButtonElement>("[data-exhibition-close]")?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  function enterVr() {
    if (!activeSite.vrUrl) return;
    window.open(activeSite.vrUrl, "_blank", "noopener,noreferrer");
  }

  const grouped = routeOrder
    .map((routeId) => ({
      routeId,
      sites: exhibitionSites.filter((site) => site.routeId === routeId),
    }))
    .filter((group) => group.sites.length > 0);

  return (
    <div
      className="exhibition-browser"
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="数字线上展厅"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <header className="exhibition-browser__header">
        <div>
          <span className="exhibition-browser__eyebrow">VR · EXHIBITION</span>
          <h2>北京红色史迹数字线上展厅</h2>
          <p>
            选择地点分支，进入对应史迹的 VR 全景现场。
          </p>
        </div>
        <button
          type="button"
          className="exhibition-browser__close"
          data-exhibition-close
          aria-label="关闭线上展厅"
          onClick={onClose}
        >
          <span aria-hidden="true">✕</span>
          关闭
        </button>
      </header>

      <div className="exhibition-browser__layout">
        {/* ── 主视觉：VR 实景封面 / 照片漫游 ── */}
        <section className="exhibition-browser__stage" aria-label="展厅主视觉">
          {activeSite.coverSrc ? (
            <img
              key={activeSite.id}
              className="exhibition-browser__cover"
              src={withBasePath(activeSite.coverSrc)}
              alt={activeSite.coverAlt}
            />
          ) : activePhotos.length > 0 ? (
            <img
              key={activeSite.id}
              className="exhibition-browser__cover"
              src={withBasePath(activePhotos[0].src)}
              alt={activePhotos[0].alt}
            />
          ) : (
            <div className="exhibition-browser__empty">
              <span>此地点素材</span>
              <strong>正在整理中</strong>
              <small>正式实景图片与 VR 全景到位后在此开放。</small>
            </div>
          )}

          <div className="exhibition-browser__stage-info">
            <div className="exhibition-browser__stage-label">
              <span>{routeLabels[activeSite.routeId]}</span>
              <strong>{activeSite.name}</strong>
            </div>
            {activeSite.vrUrl ? (
              <button
                type="button"
                className="exhibition-browser__enter"
                onClick={enterVr}
              >
                进入 VR 全景现场
                <span aria-hidden="true">↗</span>
              </button>
            ) : activePhotos.length > 0 ? (
              <button
                type="button"
                className="exhibition-browser__enter"
                onClick={() =>
                  setWalkSite({ name: activeSite.name, images: activePhotos })
                }
              >
                照片漫游（{activePhotos.length} 张）
                <span aria-hidden="true">→</span>
              </button>
            ) : (
              <button type="button" className="exhibition-browser__enter" disabled>
                VR 制作中
              </button>
            )}
          </div>
        </section>

        {/* ── 地点分支 ── */}
        <aside className="exhibition-browser__sites" aria-label="展厅地点分支">
          <p className="exhibition-browser__sites-title">
            选择地点分支
            <small>共 {exhibitionSites.length} 处</small>
          </p>
          {grouped.map((group) => (
            <div className="exhibition-browser__group" key={group.routeId}>
              <h3>{routeLabels[group.routeId]}</h3>
              <ol>
                {group.sites.map((site) => {
                  const active = site.id === activeSiteId;
                  const available = Boolean(site.vrUrl);
                  const hasPhotos = sitePhotos(site.id).length > 0;
                  const status = available
                    ? "VR 已开放"
                    : hasPhotos
                      ? "照片漫游"
                      : "制作中";
                  return (
                    <li key={site.id}>
                      <button
                        type="button"
                        className="exhibition-browser__site"
                        data-active={active}
                        data-available={available}
                        data-walk={!available && hasPhotos}
                        onClick={() => setActiveSiteId(site.id)}
                        aria-current={active ? "true" : undefined}
                      >
                        <span className="exhibition-browser__site-no">
                          {String(site.order).padStart(2, "0")}
                        </span>
                        <span className="exhibition-browser__site-name">
                          {site.name}
                        </span>
                        <span className="exhibition-browser__site-status">
                          {status}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </aside>
      </div>

      <footer className="exhibition-browser__footer">
        <span>
          VR 全景 {availableSites.length} 处 · 照片漫游{" "}
          {exhibitionSites.length - availableSites.length} 处
        </span>
        <button
          type="button"
          className="exhibition-browser__external"
          disabled={!activeSite.vrUrl}
          onClick={enterVr}
        >
          在 720 云中打开当前场景 <span aria-hidden="true">↗</span>
        </button>
      </footer>

      {walkSite && (
        <PhotoWalk
          siteName={walkSite.name}
          images={walkSite.images}
          onClose={() => setWalkSite(null)}
        />
      )}
    </div>
  );
}
