"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * 首页滚动叙事动画（参考 ui-ux-pro-max Scroll-Triggered Storytelling）
 * 绑定到容器 ref 后自动处理：
 * - [data-count]   数字滚动计数
 * - [data-wipe]    clip-path 标题揭示（从左到右）
 * - [data-parallax] 视差图层（背景慢、前景快）
 */
export function useHomeMotion() {
  const scopeRef = useRef(null);

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      // 无障碍：直接显示最终状态
      scope.querySelectorAll("[data-wipe]").forEach((el) => {
        el.style.clipPath = "none";
      });
      scope.querySelectorAll("[data-count]").forEach((el) => {
        el.textContent = el.dataset.count || el.textContent;
      });
      return;
    }

    // 1. 数字滚动计数
    scope.querySelectorAll("[data-count]").forEach((el) => {
      const target = Number(el.dataset.count || "0");
      const obj = { v: 0 };
      gsap.to(obj, {
        v: target,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
        onUpdate: () => {
          el.textContent = String(Math.round(obj.v));
        },
      });
    });

    // 2. clip-path 标题揭示（路线区原创时刻）
    scope.querySelectorAll("[data-wipe]").forEach((el) => {
      gsap.fromTo(
        el,
        { clipPath: "inset(0% 100% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        }
      );
    });

    // 3. 视差图层（背景最慢，前景最快）
    scope.querySelectorAll("[data-parallax]").forEach((el) => {
      const speed = Number(el.dataset.parallax || "8");
      gsap.to(el, {
        yPercent: speed,
        ease: "none",
        scrollTrigger: {
          trigger: el.parentElement || el,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return scopeRef;
}
