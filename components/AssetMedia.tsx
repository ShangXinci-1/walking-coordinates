import type { AssetRecord } from "../lib/content/types";
import { ResponsiveMedia } from "./ResponsiveMedia";
import { StatusBadge } from "./StatusBadge";

interface AssetMediaProps {
  asset: AssetRecord;
  priority?: boolean;
  sizes?: string;
}

export function AssetMedia({ asset, priority, sizes }: AssetMediaProps) {
  const isReady = asset.assetStatus === "ready";

  return (
    <figure className="asset-media">
      <ResponsiveMedia asset={asset} priority={priority} sizes={sizes} />
      <figcaption className="asset-media__caption">
        <StatusBadge
          status={isReady ? asset.publicationStatus : "placeholder"}
        />
        <span>{isReady ? asset.credit : asset.label}</span>
        <small>
          {isReady
            ? `${asset.captureDate} · ${asset.usageScopes.join(" / ")}`
            : asset.shotRequirement}
        </small>
      </figcaption>
    </figure>
  );
}
