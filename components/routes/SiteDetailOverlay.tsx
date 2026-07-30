"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ResponsiveMedia } from "../ResponsiveMedia";
import { StatusBadge } from "../StatusBadge";
import { getAssetById } from "../../lib/content/selectors";
import type { SiteRecord } from "../../lib/content/types";

interface SiteDetailOverlayProps {
  site: SiteRecord;
  onClose: () => void;
}

/** Simple left-chevron SVG kept as a component to avoid raw character issues */
function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M12.5 4L7 10l5.5 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M7.5 4L13 10l-5.5 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SiteDetailOverlay({ site, onClose }: SiteDetailOverlayProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const galleryAssets = site.galleryAssetIds
    .map((id) => getAssetById(id))
    .filter(Boolean);
  const currentAsset = galleryAssets[imageIndex] ?? null;
  const hasMultipleImages = galleryAssets.length > 1;

  /* ── keyboard ── */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (!hasMultipleImages) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setImageIndex((prev) =>
          prev <= 0 ? galleryAssets.length - 1 : prev - 1,
        );
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setImageIndex((prev) =>
          prev >= galleryAssets.length - 1 ? 0 : prev + 1,
        );
      }
    },
    [onClose, hasMultipleImages, galleryAssets.length],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  /* ── focus trap ── */
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const target = overlay.querySelector<HTMLButtonElement>(
      '[data-overlay-close]',
    );
    target?.focus();
  }, []);

  /* ── scroll lock ── */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const archiveId = `WC-${site.routeId === "awakening" ? "A" : site.routeId === "war" ? "B" : "C"}-${String(site.order).padStart(2, "0")}`;

  return (
    <div
      className="site-overlay-backdrop"
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${site.name.value} 详细介绍`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="site-overlay">
        {/* ── header (sticky top) ── */}
        <header className="site-overlay__header">
          <div>
            <span className="site-overlay__eyebrow">
              坐标档案 · {archiveId}
            </span>
            <h2 className="site-overlay__title">{site.name.value}</h2>
          </div>
          <StatusBadge status={site.publicationStatus} />
        </header>

        {/* ── scrollable area: carousel + text together ── */}
        <div className="site-overlay__scroll-area" ref={scrollAreaRef}>
          {/* ── image carousel ── */}
          <div
            className="site-overlay__carousel"
            role="group"
            aria-label="地点影像集"
          >
            <div className="site-overlay__carousel-stage">
              {currentAsset ? (
                <div className="site-overlay__carousel-image" key={imageIndex}>
                  <ResponsiveMedia
                    asset={currentAsset}
                    sizes="(min-width: 900px) 54vw, 96vw"
                  />
                </div>
              ) : (
                <div className="site-overlay__carousel-empty">
                  <span>暂无可展示的影像素材</span>
                </div>
              )}
            </div>

            {hasMultipleImages && (
              <>
                <button
                  type="button"
                  className="site-overlay__carousel-btn site-overlay__carousel-btn--prev"
                  aria-label="上一张图片"
                  onClick={() =>
                    setImageIndex((prev) =>
                      prev <= 0 ? galleryAssets.length - 1 : prev - 1,
                    )
                  }
                >
                  <ChevronLeft />
                </button>
                <button
                  type="button"
                  className="site-overlay__carousel-btn site-overlay__carousel-btn--next"
                  aria-label="下一张图片"
                  onClick={() =>
                    setImageIndex((prev) =>
                      prev >= galleryAssets.length - 1 ? 0 : prev + 1,
                    )
                  }
                >
                  <ChevronRight />
                </button>

                <div className="site-overlay__carousel-dots" role="tablist" aria-label="图片选择">
                  {galleryAssets.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      role="tab"
                      className="site-overlay__carousel-dot"
                      aria-selected={index === imageIndex}
                      aria-label={`第 ${index + 1} 张图片`}
                      onClick={() => setImageIndex(index)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ── body text ── */}
          <div className="site-overlay__body">
            {site.detailContent.map((block) => (
              <p key={block.id} className="site-overlay__text">
                {block.text}
              </p>
            ))}
          </div>
        </div>

        {/* ── close (sticky bottom) ── */}
        <button
          type="button"
          className="site-overlay__close"
          data-overlay-close
          aria-label="关闭详细介绍"
          onClick={onClose}
        >
          <span aria-hidden="true">✕</span>
          关闭
        </button>
      </div>
    </div>
  );
}
