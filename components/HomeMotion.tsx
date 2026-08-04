"use client";

import type { ReactNode } from "react";
import { useHomeMotion } from "./SiteMotion";

export default function HomeMotion({ children }: { children: ReactNode }) {
  const motionRef = useHomeMotion();
  return (
    <div ref={motionRef as React.Ref<HTMLDivElement>} data-home-motion>
      {children}
    </div>
  );
}
