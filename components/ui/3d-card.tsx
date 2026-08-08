"use client";

import React, { createContext, useContext, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "motion/react";

/**
 * 3D 悬浮卡片（acertinity 3d-card 风格，无 Tailwind 依赖）。
 *
 * - CardContainer：外层透视容器，鼠标移动时 rotateX/rotateY 经物理弹簧跟随
 *   （perspective 900px、±~15deg），离开后自然回弹归零
 * - CardBody：3D 空间主体，保留子元素 preserve-3d 链
 * - CardItem：内容分层，translateZ 让元素在 3D 空间不同深度浮起
 *
 * 视觉样式由调用方 className 负责（本组件只提供 3D 机制）。
 */

const ROTATE_DIVISOR = 10; // 鼠标偏移 / 10 → 边缘约 ±15deg
const SPRING = { stiffness: 150, damping: 20, mass: 0.1 };

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

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, SPRING);
  const springY = useSpring(rotateY, SPRING);
  const transform = useMotionTemplate`rotateY(${springY}deg) rotateX(${springX}deg)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
    // 以卡片中心为原点，+/-(w/10) 约 ±15deg
    const x = (e.clientX - left - width / 2) / ROTATE_DIVISOR;
    const y = (e.clientY - top - height / 2) / ROTATE_DIVISOR;
    rotateX.set(y);
    rotateY.set(x);
  };

  const handleMouseEnter = () => setIsMouseEntered(true);

  const handleMouseLeave = () => {
    setIsMouseEntered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div className={containerClassName} style={{ perspective: "900px" }}>
        <motion.div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={className}
          style={{
            transformStyle: "preserve-3d",
            transform,
          }}
        >
          {children}
        </motion.div>
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
