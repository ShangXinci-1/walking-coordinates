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
      const [metadata, source] = await Promise.all([
        sharp(placeholderPath).metadata(),
        readFile(placeholderPath, "utf8"),
      ]);

      if (
        metadata.width !== asset.width ||
        metadata.height !== asset.height
      ) {
        issues.push(
          `${asset.id}: 占位图尺寸 ${metadata.width}×${metadata.height} 与记录 ${asset.width}×${asset.height} 不一致`,
        );
      }

      if (
        !source.includes('data-placeholder-artwork="true"') ||
        !source.includes("占位图片")
      ) {
        issues.push(`${asset.id}: 占位图缺少明确的示意标识`);
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
