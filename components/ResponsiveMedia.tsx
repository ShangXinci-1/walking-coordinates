import Image from "next/image";
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
  return (
    <Image
      src={getAssetSrc(asset)}
      alt={asset.alt}
      width={asset.width}
      height={asset.height}
      className={className}
      priority={priority}
      sizes={sizes}
      unoptimized
    />
  );
}
