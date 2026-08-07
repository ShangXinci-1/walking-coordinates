"use client";

import type { CSSProperties } from "react";
import { useStaggerReveal } from "./useStaggerReveal";
import "../styles/components/stagger-reveal.css";

interface InterviewPoint {
  title: string;
  text: string;
}

/** legacy 页访谈观点列表：滚动进入视口后逐条浮现 */
export function InterviewPointList({
  points,
}: {
  points: readonly InterviewPoint[];
}) {
  const listRef = useStaggerReveal<HTMLDivElement>();

  return (
    <div className="legacy-voice__list" ref={listRef}>
      {points.map((point, index) => (
        <article
          className="legacy-voice__item"
          key={point.title}
          style={{ "--i": index } as CSSProperties}
        >
          <span className="legacy-voice__number">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <h3>{point.title}</h3>
            <p>{point.text}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
