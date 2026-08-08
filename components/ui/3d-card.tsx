"use client";

import React, { createContext, useContext, useRef, useState } from "react";

/**
 * 3D 悬浮卡片（acertinity 3d-card 风格，无 Tailwind 依赖）。
 *
 * - CardContainer：外层透视容器，鼠标移动时 rotateX/rotateY 跟随（±~20deg）
 * - CardBody：3D 空间主体，保留子元素 preserve-3d 链
 * - CardItem：内容分层，translateZ 让元素在 3D 空间不同深度浮起
 *
 * 视觉样式由调用方 className 负责（本组件只提供 3D 机制）。
 */

type MouseEnterContextValue = [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
];

const MouseEnterContext = createContext<MouseEnterContextValue | undefined>(
  undefined,
);

interface CardContainerProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export function CardContainer({
  children,
  className,
  containerClassName,
}: CardContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
    // 以卡片中心为原点，+/-(w/25) 约 ±20deg
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  };

  const handleMouseEnter = () => setIsMouseEntered(true);

  const handleMouseLeave = () => {
    setIsMouseEntered(false);
    if (containerRef.current) {
      containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
    }
  };

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div className={containerClassName} style={{ perspective: "1200px" }}>
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={className}
          style={{
            transformStyle: "preserve-3d",
            transition: "transform 200ms ease-linear",
          }}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
}

interface CardBodyProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: unknown;
}

export function CardBody({ children, className, style, ...rest }: CardBodyProps) {
  return (
    <div
      className={className}
      style={{ transformStyle: "preserve-3d", ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}

interface CardItemProps {
  as?: React.ElementType;
  children?: React.ReactNode;
  className?: string;
  translateX?: number | string;
  translateY?: number | string;
  translateZ?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
  style?: React.CSSProperties;
  [key: string]: unknown;
}

export function CardItem({
  as: Component = "div",
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  style,
  ...rest
}: CardItemProps) {
  return (
    <Component
      className={className}
      style={{
        transform: `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Component>
  );
}
