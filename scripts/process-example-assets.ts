import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { assets } from "../data/assets";

function getArgument(name: string) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function createExampleOverlay(
  width: number,
  height: number,
  id: string,
  label: string,
  displayUse: string,
) {
  const unit = Math.max(1, Math.min(width, height) / 600);
  const borderWidth = Math.max(4, Math.round(5 * unit));
  const tagHeight = Math.round(52 * unit);
  const tagWidth = Math.round(306 * unit);
  const primarySize = Math.round(18 * unit);
  const metaSize = Math.round(15 * unit);
  const padding = Math.round(18 * unit);
  const footerHeight = Math.round(68 * unit);

  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <linearGradient id="edge" x1="0" y1="0" x2="${width}" y2="${height}">
      <stop offset="0" stop-color="#0EA5E9"/>
      <stop offset="0.52" stop-color="#14B8A6"/>
      <stop offset="1" stop-color="#10B981"/>
    </linearGradient>
    <linearGradient id="footer" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#001C22" stop-opacity="0"/>
      <stop offset="1" stop-color="#001C22" stop-opacity="0.92"/>
    </linearGradient>
  </defs>
  <rect x="${borderWidth / 2}" y="${borderWidth / 2}" width="${width - borderWidth}" height="${height - borderWidth}" fill="none" stroke="url(#edge)" stroke-width="${borderWidth}"/>
  <rect x="${borderWidth}" y="${borderWidth}" width="${tagWidth}" height="${tagHeight}" fill="#064E4E" fill-opacity="0.94"/>
  <rect x="${borderWidth}" y="${borderWidth}" width="${Math.round(8 * unit)}" height="${tagHeight}" fill="#22D3EE"/>
  <text x="${borderWidth + padding}" y="${borderWidth + Math.round(tagHeight * 0.66)}" fill="#FFFFFF" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="${primarySize}" font-weight="700">AI 生成示意素材 · ${escapeXml(id.toUpperCase())}</text>
  <rect x="${borderWidth}" y="${height - footerHeight - borderWidth}" width="${width - borderWidth * 2}" height="${footerHeight}" fill="url(#footer)"/>
  <text x="${borderWidth + padding}" y="${height - borderWidth - Math.round(28 * unit)}" fill="#FFFFFF" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="${primarySize}" font-weight="700">${escapeXml(label)}</text>
  <text x="${width - borderWidth - padding}" y="${height - borderWidth - Math.round(28 * unit)}" fill="#D5FAF3" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="${metaSize}" text-anchor="end">${escapeXml(displayUse)} · ${width}×${height}</text>
</svg>`);
}

const sourceDirectoryArgument = getArgument("--source-dir");
if (!sourceDirectoryArgument) {
  throw new Error(
    '缺少 --source-dir，例如：npx tsx scripts/process-example-assets.ts --source-dir "C:\\素材\\示例源图"',
  );
}

const sourceDirectory = path.resolve(sourceDirectoryArgument);
const outputDirectory = path.resolve("public", "media");
await mkdir(outputDirectory, { recursive: true });

const manifest = {
  version: 1,
  sourceKind: "openai-imagegen",
  assets: [] as Array<{
    id: string;
    label: string;
    displayUse: string;
    width: number;
    height: number;
    file: string;
    visibleMark: "AI 生成示意素材";
  }>,
};

for (const asset of assets) {
  if (asset.assetStatus === "ready") continue;

  const sourcePath = path.join(sourceDirectory, `${asset.id}.png`);
  const source = await readFile(sourcePath);
  const outputPath = path.join(outputDirectory, `${asset.id}.webp`);
  const overlay = createExampleOverlay(
    asset.width,
    asset.height,
    asset.id,
    asset.label,
    asset.displayUse,
  );

  await sharp(source)
    .resize(asset.width, asset.height, {
      fit: "cover",
      position: sharp.strategy.attention,
    })
    .composite([{ input: overlay, top: 0, left: 0 }])
    .webp({ quality: 88, effort: 6 })
    .toFile(outputPath);

  manifest.assets.push({
    id: asset.id,
    label: asset.label,
    displayUse: asset.displayUse,
    width: asset.width,
    height: asset.height,
    file: `/media/${asset.id}.webp`,
    visibleMark: "AI 生成示意素材",
  });
  console.log(`Generated media/${asset.id}.webp`);
}

await writeFile(
  path.join(outputDirectory, "example-assets.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf8",
);
