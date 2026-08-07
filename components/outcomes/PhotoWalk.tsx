"use client";

// 照片漫游：以 3D 球体（DomeGallery）组织实地照片，
// 拖动旋转浏览球面画面，点击任意画面查看大图。
import { useEffect } from "react";
import DomeGallery from "../DomeGallery";

export interface PhotoWalkImage {
  src: string;
  alt: string;
}

interface PhotoWalkProps {
  siteName: string;
  images: PhotoWalkImage[];
  onClose: () => void;
}

export function PhotoWalk({ siteName, images, onClose }: PhotoWalkProps) {
  const count = images.length;

  /* ── 键盘：Esc 关闭 ── */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="photo-walk"
      role="dialog"
      aria-modal="true"
      aria-label={`${siteName}照片漫游`}
    >
      <header className="photo-walk__header">
        <div>
          <span className="photo-walk__eyebrow">PHOTO WALK · 照片漫游</span>
          <h3>{siteName}</h3>
          <p>
            实地照片以球面形式展开，拖动旋转浏览，点击任意画面查看大图。
          </p>
        </div>
        <button
          type="button"
          className="photo-walk__close"
          aria-label="关闭照片漫游"
          onClick={onClose}
        >
          <span aria-hidden="true">✕</span>
          关闭
        </button>
      </header>

      <div className="photo-walk__dome">
        <DomeGallery
          images={images}
          fit={0.45}
          fitBasis="min"
          minRadius={300}
          padFactor={0.2}
          overlayBlurColor="#120f17"
          segments={count}
          openedImageWidth="min(68vw, 540px)"
          openedImageHeight="min(68vw, 540px)"
          imageBorderRadius="14px"
          openedImageBorderRadius="18px"
          grayscale={false}
        />
      </div>

      <p className="photo-walk__hint" aria-hidden="true">
        拖动旋转球面 · 点击画面查看大图 · Esc 关闭
      </p>
    </div>
  );
}
