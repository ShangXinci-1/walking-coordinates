"use client";

// 首页「寻访之后，留下了什么」成果卡片：
// 成果专属图标 + 微电影「剪辑中」金色脉冲标签 + hover 上浮。
// 视觉样式由 home.css 负责（与上方「寻访→传播」翻转卡区分：静态上浮，不再倾斜）。
import type { CSSProperties, ReactNode } from "react";
import type { OutcomeRecord } from "../../lib/content/types";
import { withBasePath } from "../../lib/site";

const OUTCOME_ICONS: Record<string, ReactNode> = {
  "digital-exhibition": (
    <>
      {/* 全景视窗：数字展厅 */}
      <path d="M2 12s3.6-6.2 10-6.2S22 12 22 12s-3.6 6.2-10 6.2S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  "digital-archive": (
    <>
      {/* 卷宗：寻访新闻稿档案 */}
      <path d="M4 7h6l2 3h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7z" />
      <path d="M4 7V5a2 2 0 0 1 2-2h4l2 3" />
    </>
  ),
  "short-film": (
    <>
      {/* 胶片：主题微电影 */}
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M7 4v16M17 4v16M2 8h5M2 16h5M17 8h5M17 16h5" />
    </>
  ),
  "research-report": (
    <>
      {/* 报告：实践调研报告 */}
      <path d="M6 2h8l6 6v14H6z" />
      <path d="M14 2v6h6M9.5 13h6M9.5 17h4" />
    </>
  ),
};

interface OutcomeShowcaseCardProps {
  outcome: OutcomeRecord;
  index: number;
}

export function OutcomeShowcaseCard({
  outcome,
  index,
}: OutcomeShowcaseCardProps) {
  const isFilm = outcome.id === "short-film";

  return (
    <a
      className="home-outcomes__card"
      href={withBasePath("/outcomes")}
    >
      <span className="home-outcomes__card-icon">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {OUTCOME_ICONS[outcome.id] ?? OUTCOME_ICONS["research-report"]}
        </svg>
      </span>

      <span className="home-outcomes__card-no">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="home-outcomes__card-body">
        <h3>
          {outcome.title.value}
          {isFilm && (
            <span className="home-outcomes__card-status">
              <i aria-hidden="true" />
              剪辑中
            </span>
          )}
        </h3>
        <p>{outcome.description[0].text}</p>
      </div>

      <span className="home-outcomes__card-arrow" aria-hidden="true">
        →
      </span>

      <i
        className="home-outcomes__card-glow"
        aria-hidden="true"
        style={{ "--i": index } as CSSProperties}
      />
    </a>
  );
}
