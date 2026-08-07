import path from "node:path";
import { assets } from "../data/assets";
import { convertAsset } from "./lib/asset-pipeline";

function readArgument(name: string) {
  const index = process.argv.indexOf(name);
  return index === -1 ? null : process.argv[index + 1] ?? null;
}

const assetId = readArgument("--id");
const sourcePath = readArgument("--source");

if (!assetId || !sourcePath) {
  throw new Error(
    '用法：npm run assets:convert -- --id "field-01" --source "C:\\素材\\照片.jpg"',
  );
}

const asset = assets.find((candidate) => candidate.id === assetId);
if (!asset) {
  throw new Error(`素材清单中不存在 ID：${assetId}`);
}

const outputDirectory = path.resolve("public", "media");
const derivatives = await convertAsset({
  sourcePath: path.resolve(sourcePath),
  outputDirectory,
  target: {
    id: asset.id,
    width: asset.width,
    height: asset.height,
  },
});

console.log(`已生成 ${derivatives.length} 个交付文件：`);
for (const derivative of derivatives) {
  console.log(
    `- ${path.relative(process.cwd(), derivative.path)} (${derivative.width}×${derivative.height}, ${derivative.format})`,
  );
}

console.log("\n人工审核与授权材料确认后，在 data/assets.ts 对应记录中更新：");
console.log(`assetStatus: "ready"`);
console.log(`finalSrc: "/media/${asset.id}.webp"`);
console.log('reviewStatus: "reviewed"');
console.log('publicationStatus: "ready" 或 "partial"');
console.log('rightsStatus: "cleared"');
console.log('consentStatus: "not-required" 或 "obtained"');
console.log("credit、captureDate、usageScopes、rightsRecordRef");
