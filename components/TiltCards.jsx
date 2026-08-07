"use client";

import { useEffect, useRef } from "react";

/**
 * 为 [data-tilt] 卡片添加 3D 鼠标跟随倾斜效果。
 * 卡片在鼠标移动时轻微 rotateX/rotateY，离开时回正。
 */
export default function TiltCards() {
  const scopeRef = useRef(null);

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;

    const cards = scope.querySelectorAll("[data-tilt]");
    let raf = 0;

    const onMove = (e) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.transform = `perspective(900px) rotateY(${
          nx * 7
        }deg) rotateX(${-ny * 7}deg) translateY(-4px)`;
      });
    };

    const onLeave = (e) => {
      const card = e.currentTarget;
      cancelAnimationFrame(raf);
      card.style.transform = "";
    };

    cards.forEach((card) => {
      card.addEventListener("pointermove", onMove, { passive: true });
      card.addEventListener("pointerleave", onLeave, { passive: true });
    });

    return () => {
      cancelAnimationFrame(raf);
      cards.forEach((card) => {
        card.removeEventListener("pointermove", onMove);
        card.removeEventListener("pointerleave", onLeave);
      });
    };
  }, []);

  return <div ref={scopeRef} data-tilt-scope aria-hidden="true" />;
}
