"use client";

import Image from "next/image";
import { useState } from "react";
import type { AssetRecord } from "../lib/content/types";
import { getAssetSrc } from "../lib/content/selectors";

interface ResponsiveMediaProps {
  asset: AssetRecord;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export function ResponsiveMedia({
  asset,
  className,
  priority = false,
  sizes = "100vw",
}: ResponsiveMediaProps) {
  const src = getAssetSrc(asset);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const failed = failedSrc === src;

  if (failed) {
    return (
      <span
        className={`responsive-media-fallback${className ? ` ${className}` : ""}`}
        style={{ aspectRatio: `${asset.width} / ${asset.height}` }}
        role="img"
        aria-label={`${asset.alt}（素材暂不可用）`}
      >
        <strong>素材暂不可用</strong>
        <small>{asset.id}</small>
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={asset.alt}
      width={asset.width}
      height={asset.height}
      className={className}
      priority={priority}
      sizes={sizes}
      unoptimized
      onError={() => setFailedSrc(src)}
    />
  );
}
