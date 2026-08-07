"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import { useStaggerReveal } from "./useStaggerReveal";
import "../styles/components/stagger-reveal.css";

interface ComicFrame {
  src: string;
  alt: string;
}

interface ComicFilmProps {
  frames: readonly ComicFrame[];
}

/**
 * ComicFilm：AI 漫画合影「胶片长廊」。
 * - 横向滚动 + 贴齐捕捉，拍立得式白边卡片，序号与拍摄提示
 * - 桌面：鼠标滚轮 / 按住拖拽 / 左右箭头按钮均可滚动；触摸设备走原生滑动
 */
export function ComicFilm({ frames }: ComicFilmProps) {
  const filmRef = useStaggerReveal<HTMLDivElement>();
  const dragging = useRef(false);
  const dragStart = useRef({ x: 0, scroll: 0 });

  /* 鼠标滚轮 → 横向滚动（原生监听以便 preventDefault，页面不跟着滚） */
  useEffect(() => {
    const el = filmRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const scrollByCard = (dir: 1 | -1) => {
    const el = filmRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("figure");
    const step = card ? card.offsetWidth + 28 : 320;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <div className="legacy-comic__film-wrap">
      <div
        ref={filmRef}
        className="legacy-comic__film"
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse") return;
          dragging.current = true;
          const el = e.currentTarget;
          el.classList.add("is-dragging");
          dragStart.current = { x: e.clientX, scroll: el.scrollLeft };
        }}
        onPointerMove={(e) => {
          if (!dragging.current) return;
          const el = e.currentTarget;
          el.scrollLeft =
            dragStart.current.scroll - (e.clientX - dragStart.current.x);
        }}
        onPointerUp={(e) => {
          if (!dragging.current) return;
          dragging.current = false;
          e.currentTarget.classList.remove("is-dragging");
        }}
        onPointerLeave={(e) => {
          if (!dragging.current) return;
          dragging.current = false;
          e.currentTarget.classList.remove("is-dragging");
        }}
      >
        {frames.map((frame, index) => (
          <figure
            key={frame.src}
            className="legacy-comic__shot"
            style={{ "--i": index } as CSSProperties}
          >
            <img src={frame.src} alt={frame.alt} loading="lazy" />
            <figcaption>
              <span className="legacy-comic__shot-no" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>咔嚓 · 同框</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <button
        type="button"
        className="legacy-comic__nav legacy-comic__nav--prev"
        onClick={() => scrollByCard(-1)}
        aria-label="上一格"
      >
        ←
      </button>
      <button
        type="button"
        className="legacy-comic__nav legacy-comic__nav--next"
        onClick={() => scrollByCard(1)}
        aria-label="下一格"
      >
        →
      </button>
    </div>
  );
}
