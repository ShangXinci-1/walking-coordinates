"use client";

import type { ReactNode } from "react";
import { useStaggerReveal } from "./useStaggerReveal";
import "../styles/components/stagger-reveal.css";

/**
 * 通用滚动浮现容器：把 className 交给内部 div 并挂上 stagger，
 * 子项按 --i 变量依次浮现。可在 server 组件页面中直接使用
 * （如 <StaggerContainer className="...">…</StaggerContainer>）。
 */
export function StaggerContainer({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useStaggerReveal<HTMLDivElement>();

  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  );
}
