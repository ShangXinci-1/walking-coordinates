// NumberTicker：进入视口时数字从 0 滚动到目标值（gsap expo.out）
// 用于统计数字展示（hero 卡片、成果状态总览等）。
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * @param {Object} props
 * @param {number} props.value 目标数值
 * @param {number} [props.duration] 滚动时长（秒），默认 1.6
 * @param {string} [props.className] 附加类名
 */
export default function NumberTicker({
  value,
  duration = 1.6,
  className = "",
}) {
  const rootRef = useRef(null);
  const displayRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const display = displayRef.current;
    if (!root || !display) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      display.textContent = String(value);
      return;
    }

    const target = { v: 0 };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        gsap.to(target, {
          v: value,
          duration,
          ease: "expo.out",
          onUpdate: () => {
            display.textContent = String(Math.round(target.v));
          },
        });
      },
      { threshold: 0.1 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span
      ref={rootRef}
      className={`number-ticker${className ? ` ${className}` : ""}`}
    >
      <span ref={displayRef}>0</span>
    </span>
  );
}
