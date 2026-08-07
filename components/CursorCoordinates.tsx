"use client";

import { useEffect, useRef } from "react";

/**
 * CursorCoordinates：光标坐标准星 + 柔光跟随（全站装饰层）。
 * - 金色十字准星紧贴鼠标，右侧实时读出模拟经纬度（呼应 GCJ-02 坐标语言）
 * - 背后一层柔和金色光晕做平滑插值跟随（lerp），mix-blend screen
 * - 仅响应鼠标（pointerType === "mouse"），触屏无效果
 * - prefers-reduced-motion 时整层隐藏
 */
export default function CursorCoordinates() {
  const glowRef = useRef<HTMLDivElement>(null);
  const reticleRef = useRef<HTMLDivElement>(null);
  const coordRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const glow = glowRef.current;
    const reticle = reticleRef.current;
    const coord = coordRef.current;
    if (!glow || !reticle || !coord) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const soft = { x: target.x, y: target.y };
    let visible = false;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      target.x = event.clientX;
      target.y = event.clientY;
      if (!visible) {
        visible = true;
        soft.x = target.x;
        soft.y = target.y;
        glow.classList.add("is-visible");
        reticle.classList.add("is-visible");
      }
    };

    const onLeave = () => {
      visible = false;
      glow.classList.remove("is-visible");
      reticle.classList.remove("is-visible");
    };

    let raf = 0;
    const tick = () => {
      soft.x += (target.x - soft.x) * 0.1;
      soft.y += (target.y - soft.y) * 0.1;
      glow.style.transform = `translate3d(${soft.x}px, ${soft.y}px, 0) translate(-50%, -50%)`;
      reticle.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
      coord.textContent = formatCoordinate(target.x, target.y);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="cursor-coordinates" aria-hidden="true">
      <div ref={glowRef} className="cursor-coordinates__glow" />
      <div ref={reticleRef} className="cursor-coordinates__reticle">
        <i className="cursor-coordinates__cross" />
        <span ref={coordRef} className="cursor-coordinates__coord" />
      </div>
    </div>
  );
}

/** 视口像素 → 北京城区附近的模拟经纬度（纯装饰，不精确） */
function formatCoordinate(x: number, y: number) {
  const lon = 116.4074 + (x / window.innerWidth - 0.5) * 0.12;
  const lat = 39.9042 - (y / window.innerHeight - 0.5) * 0.09;
  return `${lat.toFixed(5)}° N  ${lon.toFixed(5)}° E`;
}
