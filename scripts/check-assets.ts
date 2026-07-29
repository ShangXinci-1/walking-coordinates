import { access, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { assets } from "../data/assets";
import {
  getAssetDerivatives,
  verifyAssetDerivative,
} from "./lib/asset-pipeline";

const issues: string[] = [];
const publicDirectory = path.resolve("public");
const exampleManifestPath = path.join(
  publicDirectory,
  "media",
  "example-assets.json",
);
let exampleAssetIds = new Set<string>();

try {
  const manifest = JSON.parse(
    await readFile(exampleManifestPath, "utf8"),
  ) as { assets?: Array<{ id?: string; visibleMark?: string }> };
  exampleAssetIds = new Set(
    (manifest.assets ?? [])
      .filter((item) => item.visibleMark === "AI 生成示意素材")
      .map((item) => item.id)
      .filter((id): id is string => Boolean(id)),
  );
} catch (error) {
  issues.push(`示例素材清单无法读取：${String(error)}`);
}

for (const asset of assets) {
  if (!asset.alt.trim()) issues.push(`${asset.id}: alt 为空`);
  if (!asset.displayUse.trim()) issues.push(`${asset.id}: displayUse 为空`);
  if (!asset.shotRequirement.trim()) {
    issues.push(`${asset.id}: shotRequirement 为空`);
  }

  if (asset.assetStatus !== "ready") {
    const placeholderPath = path.join(
      publicDirectory,
      asset.placeholderSrc.replace(/^\//, ""),
    );

    try {
      const metadata = await sharp(placeholderPath).metadata();

      if (
        metadata.width !== asset.width ||
        metadata.height !== asset.height
      ) {
        issues.push(
          `${asset.id}: 占位图尺寸 ${metadata.width}×${metadata.height} 与记录 ${asset.width}×${asset.height} 不一致`,
        );
      }

      if (!exampleAssetIds.has(asset.id)) {
        issues.push(`${asset.id}: 示例素材清单缺少可见 AI 示意标识记录`);
      }
    } catch (error) {
      issues.push(`${asset.id}: 无法读取占位图 ${String(error)}`);
    }

    continue;
  }

  const expectedFinalSrc = `/media/${asset.id}.webp`;
  if (asset.finalSrc !== expectedFinalSrc) {
    issues.push(
      `${asset.id}: finalSrc 应为 ${expectedFinalSrc}，实际为 ${asset.finalSrc}`,
    );
  }
  if (!asset.credit.trim()) issues.push(`${asset.id}: credit 为空`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(asset.captureDate)) {
    issues.push(`${asset.id}: captureDate 必须为 YYYY-MM-DD`);
  }
  if (
    asset.rightsStatus !== "cleared" ||
    !asset.rightsRecordRef
  ) {
    issues.push(`${asset.id}: 授权或人物同意状态未满足正式素材门禁`);
  }

  const derivatives = getAssetDerivatives(
    path.join(publicDirectory, "media"),
    asset,
  );
  for (const derivative of derivatives) {
    try {
      await access(derivative.path);
      await verifyAssetDerivative(derivative);
    } catch (error) {
      issues.push(`${asset.id}: ${String(error)}`);
    }
  }
}

if (issues.length > 0) {
  console.error("素材检查失败：");
  for (const issue of issues) console.error(`- ${issue}`);
  process.exitCode = 1;
} else {
  console.log(`素材检查通过：${assets.length} 条固定素材记录。`);
}
