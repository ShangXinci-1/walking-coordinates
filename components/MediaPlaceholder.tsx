import type { AssetRecord } from "../lib/content/types";
import { ResponsiveMedia } from "./ResponsiveMedia";
import { StatusBadge } from "./StatusBadge";

type PlaceholderAsset = Extract<
  AssetRecord,
  { assetStatus: "placeholder" | "planned" }
>;

interface MediaPlaceholderProps {
  asset: PlaceholderAsset;
  priority?: boolean;
  sizes?: string;
}

export function MediaPlaceholder({
  asset,
  priority,
  sizes,
}: MediaPlaceholderProps) {
  return (
    <figure className="media-placeholder">
      <ResponsiveMedia
        asset={asset}
        priority={priority}
        sizes={sizes}
      />
      <figcaption className="media-placeholder__caption">
        <StatusBadge status="placeholder" />
        <span>{asset.label}</span>
        <small>{asset.shotRequirement}</small>
      </figcaption>
    </figure>
  );
}
