"use client";

// 照片漫游：用实地拍摄照片提供接近全景的浏览体验。
// 横向拖拽切换画面，单击放大查看细节，放大后可拖拽平移、滚轮缩放。
import { useCallback, useEffect, useRef, useState } from "react";
import { useDrag, useWheel } from "@use-gesture/react";
import { withBasePath } from "../../lib/site";

export interface PhotoWalkImage {
  src: string;
  alt: string;
}

interface PhotoWalkProps {
  siteName: string;
  images: PhotoWalkImage[];
  onClose: () => void;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export function PhotoWalk({ siteName, images, onClose }: PhotoWalkProps) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragX, setDragX] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const count = images.length;

  const goTo = useCallback(
    (nextIndex: number) => {
      setIndex(clamp(nextIndex, 0, count - 1));
      setZoom(1);
      setPan({ x: 0, y: 0 });
    },
    [count],
  );
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  /* ── 键盘：Esc 关闭；未放大时 ←/→ 切换 ── */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (zoom === 1) {
        if (event.key === "ArrowRight") next();
        if (event.key === "ArrowLeft") prev();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, zoom, next, prev]);

  /* ── 拖拽：未放大 → 左右切换；放大 → 平移细节 ── */
  const bindDrag = useDrag(
    ({ down, movement: [mx], velocity: [vx], direction: [dx], last }) => {
      if (zoom > 1) {
        const stage = stageRef.current;
        const maxX = stage
          ? ((zoom - 1) * stage.offsetWidth) / 2
          : 0;
        const maxY = stage
          ? ((zoom - 1) * stage.offsetHeight) / 2
          : 0;
        setPan((current) => ({
          x: clamp(current.x + mx - (down ? 0 : current.x), -maxX, maxX),
          y: clamp(current.y, -maxY, maxY),
        }));
        return;
      }

      setDragX(down ? mx : 0);
      if (last) {
        const stage = stageRef.current;
        const threshold = stage ? stage.offsetWidth * 0.26 : 160;
        if (Math.abs(mx) > threshold && Math.abs(vx) > 0.15) {
          if (dx > 0) prev();
          else next();
        }
        setDragX(0);
      }
    },
  );

  /* ── 滚轮：放大/缩小（1x—3x） ── */
  const bindWheel = useWheel(({ delta: [dy] }) => {
    setZoom((z) => clamp(z - dy * 0.0012, 1, 3));
  });

  /* ── 单击：切换放大状态 ── */
  function handleTap() {
    setZoom((z) => {
      const toZoom = z > 1 ? 1 : 2.4;
      if (toZoom === 1) setPan({ x: 0, y: 0 });
      return toZoom;
    });
  }

  const src = images[index] ? withBasePath(images[index].src) : "";

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
          <p>基于实地拍摄照片浏览现场，横向拖动切换画面。</p>
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

      <div
        className="photo-walk__stage"
        ref={stageRef}
        {...bindDrag()}
        {...bindWheel()}
        onClick={handleTap}
      >
        {images.map((image, i) => (
          <img
            key={image.src + i}
            className="photo-walk__photo"
            data-active={i === index}
            src={withBasePath(image.src)}
            alt={image.alt}
            draggable={false}
            style={{
              transform:
                i === index
                  ? `translate3d(${dragX + pan.x}px, ${pan.y}px, 0) scale(${zoom})`
                  : undefined,
            }}
          />
        ))}

        <div className="photo-walk__hint" aria-hidden="true">
          {zoom > 1
            ? "拖动平移 · 滚轮缩放 · 单击还原"
            : "← 拖动切换 → · 单击放大"}
        </div>

        <div className="photo-walk__counter">
          {String(index + 1).padStart(2, "0")}
          <span> / {String(count).padStart(2, "0")}</span>
        </div>
      </div>

      <footer className="photo-walk__footer">
        <button
          type="button"
          className="photo-walk__prev"
          disabled={index === 0}
          onClick={prev}
          aria-label="上一张"
        >
          ←
        </button>
        <div className="photo-walk__thumbs" role="tablist" aria-label="画面导航">
          {images.map((image, i) => (
            <button
              type="button"
              key={image.src + i}
              className="photo-walk__thumb"
              data-active={i === index}
              role="tab"
              aria-selected={i === index}
              aria-label={`第 ${i + 1} 张`}
              onClick={() => goTo(i)}
            >
              <img src={withBasePath(image.src)} alt="" draggable={false} />
            </button>
          ))}
        </div>
        <button
          type="button"
          className="photo-walk__next"
          disabled={index === count - 1}
          onClick={next}
          aria-label="下一张"
        >
          →
        </button>
      </footer>
    </div>
  );
}
