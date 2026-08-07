// SplashCursor：金色粒子拖尾（手写定制版，适配站点金色主题）
// 鼠标移动时在轨迹上泛起金色微光粒子，缓慢下沉消散；
// canvas 固定全屏、pointer-events none，不干扰任何交互。
"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

export default function SplashCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const MAX_PARTICLES = 110;
    const particles: Particle[] = [];
    let raf = 0;
    let running = true;
    let lastX = -1;
    let lastY = -1;
    let lastTime = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };
    resize();
    window.addEventListener("resize", resize);

    const spawn = (x: number, y: number, vx: number, vy: number) => {
      if (particles.length >= MAX_PARTICLES) particles.shift();
      particles.push({
        x,
        y,
        vx: vx * 0.9 + (Math.random() - 0.5) * 2.6,
        vy: vy * 0.9 + (Math.random() - 0.5) * 2.6 - 0.7,
        life: 0,
        maxLife: 42 + Math.random() * 32,
        size: 1.1 + Math.random() * 2.6,
        hue: 38 + Math.random() * 16,
      });
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const now = performance.now();
      const dt = Math.min(Math.max(now - lastTime, 4), 40) / 16.7;
      lastTime = now;
      if (lastX < 0) {
        lastX = event.clientX;
        lastY = event.clientY;
        return;
      }
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      const dist = Math.hypot(dx, dy);
      const steps = Math.min(Math.max(Math.floor(dist / 14), 1), 5);
      for (let i = 1; i <= steps; i += 1) {
        spawn(
          lastX + (dx * i) / steps,
          lastY + (dy * i) / steps,
          dx / dt,
          dy / dt,
        );
      }
      lastX = event.clientX;
      lastY = event.clientY;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const tick = () => {
      if (!running) return;
      raf = requestAnimationFrame(tick);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.shadowBlur = 0;
      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i];
        p.life += 1;
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.985;
        p.vy = p.vy * 0.985 + 0.035; // 轻微下沉
        const t = p.life / p.maxLife;
        const alpha = (1 - t) * (1 - t) * 0.5;
        const size = p.size * (1 - t * 0.55);
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 92%, 62%, ${alpha})`;
        ctx.shadowColor = `hsla(${p.hue}, 92%, 58%, ${alpha * 0.9})`;
        ctx.shadowBlur = 9;
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    };
    tick();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="splash-cursor"
      aria-hidden="true"
    />
  );
}
