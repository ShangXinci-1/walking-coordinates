"use client";

import type { CSSProperties } from "react";
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
 * - 子项按 --i 步进浮现（复用 stagger-reveal 机制）
 */
export function ComicFilm({ frames }: ComicFilmProps) {
  const filmRef = useStaggerReveal<HTMLDivElement>();

  return (
    <div className="legacy-comic__film" ref={filmRef}>
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
  );
}
