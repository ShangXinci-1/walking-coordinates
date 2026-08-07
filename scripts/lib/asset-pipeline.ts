import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export const RESPONSIVE_ASSET_WIDTH = 480;
export const MAX_FULL_ASSET_BYTES = 1_500_000;
export const MAX_RESPONSIVE_ASSET_BYTES = 600_000;
export const ASPECT_RATIO_TOLERANCE = 0.03;

export interface AssetConversionTarget {
  id: string;
  width: number;
  height: number;
}

export interface AssetDerivative {
  format: "avif" | "webp";
  path: string;
  width: number;
  height: number;
  maxBytes: number;
}

export interface ConvertAssetOptions {
  sourcePath: string;
  outputDirectory: string;
  target: AssetConversionTarget;
}

function assertSafeAssetId(id: string) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
    throw new Error(`素材 ID 只能包含小写字母、数字和连字符：${id}`);
  }
}

export function getAssetDerivatives(
  outputDirectory: string,
  target: AssetConversionTarget,
): AssetDerivative[] {
  assertSafeAssetId(target.id);

  const full: AssetDerivative[] = [
    {
      format: "avif",
      path: path.join(outputDirectory, `${target.id}.avif`),
      width: target.width,
      height: target.height,
      maxBytes: MAX_FULL_ASSET_BYTES,
    },
    {
      format: "webp",
      path: path.join(outputDirectory, `${target.id}.webp`),
      width: target.width,
      height: target.height,
      maxBytes: MAX_FULL_ASSET_BYTES,
    },
  ];

  if (target.width <= RESPONSIVE_ASSET_WIDTH) return full;

  const responsiveHeight = Math.round(
    (RESPONSIVE_ASSET_WIDTH / target.width) * target.height,
  );

  return [
    ...full,
    {
      format: "avif",
      path: path.join(
        outputDirectory,
        `${target.id}-${RESPONSIVE_ASSET_WIDTH}.avif`,
      ),
      width: RESPONSIVE_ASSET_WIDTH,
      height: responsiveHeight,
      maxBytes: MAX_RESPONSIVE_ASSET_BYTES,
    },
    {
      format: "webp",
      path: path.join(
        outputDirectory,
        `${target.id}-${RESPONSIVE_ASSET_WIDTH}.webp`,
      ),
      width: RESPONSIVE_ASSET_WIDTH,
      height: responsiveHeight,
      maxBytes: MAX_RESPONSIVE_ASSET_BYTES,
    },
  ];
}

export async function verifyAssetDerivative(derivative: AssetDerivative) {
  const [metadata, file] = await Promise.all([
    sharp(derivative.path).metadata(),
    stat(derivative.path),
  ]);

  const formatMatches =
    metadata.format === derivative.format ||
    (derivative.format === "avif" && metadata.format === "heif");

  if (!formatMatches) {
    throw new Error(
      `${derivative.path} 格式为 ${metadata.format ?? "unknown"}，应为 ${derivative.format}`,
    );
  }

  if (
    metadata.width !== derivative.width ||
    metadata.height !== derivative.height
  ) {
    throw new Error(
      `${derivative.path} 尺寸为 ${metadata.width}×${metadata.height}，应为 ${derivative.width}×${derivative.height}`,
    );
  }

  if (file.size > derivative.maxBytes) {
    throw new Error(
      `${derivative.path} 大小为 ${file.size} 字节，超过 ${derivative.maxBytes} 字节`,
    );
  }
}

export async function convertAsset({
  sourcePath,
  outputDirectory,
  target,
}: ConvertAssetOptions) {
  assertSafeAssetId(target.id);

  const metadata = await sharp(sourcePath).metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error(`无法读取源文件尺寸：${sourcePath}`);
  }

  if (metadata.width < target.width || metadata.height < target.height) {
    throw new Error(
      `源文件尺寸 ${metadata.width}×${metadata.height} 小于目标尺寸 ${target.width}×${target.height}`,
    );
  }

  const sourceRatio = metadata.width / metadata.height;
  const targetRatio = target.width / target.height;
  const ratioDifference = Math.abs(sourceRatio / targetRatio - 1);
  if (ratioDifference > ASPECT_RATIO_TOLERANCE) {
    throw new Error(
      `源文件宽高比 ${sourceRatio.toFixed(4)} 与目标宽高比 ${targetRatio.toFixed(4)} 偏差超过 ${(ASPECT_RATIO_TOLERANCE * 100).toFixed(0)}%`,
    );
  }

  await mkdir(outputDirectory, { recursive: true });
  const derivatives = getAssetDerivatives(outputDirectory, target);

  await Promise.all(
    derivatives.map(async (derivative) => {
      const pipeline = sharp(sourcePath)
        .rotate()
        .resize(derivative.width, derivative.height, {
          fit: "cover",
          position: "centre",
        });

      if (derivative.format === "avif") {
        await pipeline
          .avif({ quality: 68, effort: 5 })
          .toFile(derivative.path);
      } else {
        await pipeline.webp({ quality: 82, effort: 5 }).toFile(derivative.path);
      }
    }),
  );

  await Promise.all(derivatives.map(verifyAssetDerivative));
  return derivatives;
}
