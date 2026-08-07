"use client";

import { useLayoutEffect, useRef } from "react";

/**
 * useStaggerReveal：容器滚动进入视口后挂 .is-visible 类，
 * 子项按 --i 变量依次浮现（配合 .stagger-reveal CSS 规则）。
 * 零 DOM 结构变化，不影响 grid/flex 布局。
 */
export function useStaggerReveal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add("stagger-reveal");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-visible");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("is-visible");
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
