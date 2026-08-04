import type * as React from "react";

export interface MaskedHeadingProps {
  text?: string;
  tag?: string;
  mediaType?: "image" | "video";
  src?: string;
  poster?: string;
  fillScale?: number;
  parallax?: number;
  drift?: number;
  brightness?: number;
  saturation?: number;
  grayscale?: boolean;
  reveal?: "rise" | "wipe" | "fade" | "none";
  trigger?: "view" | "mount" | "hover";
  duration?: number;
  stagger?: number;
  align?: "left" | "center" | "right";
  weight?: number;
  tracking?: number;
  lineHeight?: number;
  textScale?: number;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  [key: string]: unknown;
}

declare const MaskedHeading: React.FC<MaskedHeadingProps>;
export default MaskedHeading;
