"use client";

// 首页「寻访之后，留下了什么」成果卡片：
// 鼠标 3D 倾斜（物理弹簧跟随，reduced-motion 下禁用）+ 成果专属图标
// + 微电影「剪辑中」金色脉冲标签。视觉样式由 home.css 负责。
import { useRef, type CSSProperties, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import type { OutcomeRecord } from "../../lib/content/types";
import { withBasePath } from "../../lib/site";

const SPRING = { stiffness: 180, damping: 18, mass: 0.14 };
const ROTATE_DIVISOR = 10; // 鼠标偏移 / 10 → 边缘约 ±15deg

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
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, SPRING);
  const springY = useSpring(rotateY, SPRING);
  const transform = useMotionTemplate`rotateY(${springY}deg) rotateX(${springX}deg)`;

  function handleMove(event: React.MouseEvent<HTMLAnchorElement>) {
    if (reduce || !ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    rotateX.set(((event.clientY - top - height / 2) / ROTATE_DIVISOR) * -1);
    rotateY.set((event.clientX - left - width / 2) / ROTATE_DIVISOR);
  }

  function handleLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  const isFilm = outcome.id === "short-film";

  return (
    <motion.a
      ref={ref}
      className="home-outcomes__card"
      href={withBasePath("/outcomes")}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transform, transformStyle: "preserve-3d" }}
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
    </motion.a>
  );
}
