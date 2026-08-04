"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface RevealOnScrollProps {
  children: ReactNode;
  /** 延迟（ms），用于错开多个元素的显现 */
  delay?: number;
  className?: string;
  /** 触发阈值（0-1），越大越晚触发 */
  threshold?: number;
  /** 是否使用模糊浮现效果 */
  blur?: boolean;
  /** 视差位移量（px），元素滚动时会轻微移动，营造层次感 */
  parallax?: number;
}

/**
 * 滚动进入视口时触发的文字浮现效果。
 * 元素从下方渐现上移并消除模糊，类似阿里云首页的叙事滚动。
 */
export function RevealOnScroll({
  children,
  delay = 0,
  className,
  threshold = 0.12,
  blur = false,
  parallax = 0,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (blur) el.classList.add("is-blur");
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
      { threshold, rootMargin: "0px 0px -60px 0px" },
    );
    observer.observe(el);

    // 视差：元素进入后，随滚动轻微位移
    let raf = 0;
    if (parallax > 0) {
      const onScroll = () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const rect = el.getBoundingClientRect();
          const progress = Math.min(
            1,
            Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)),
          );
          el.style.transform = `translateY(${(0.5 - progress) * parallax}px)`;
        });
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => {
        window.removeEventListener("scroll", onScroll);
        cancelAnimationFrame(raf);
      };
    }

    return () => observer.disconnect();
  }, [threshold, blur, parallax]);

  return (
    <div
      ref={ref}
      className={`reveal-on-scroll${className ? ` ${className}` : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
