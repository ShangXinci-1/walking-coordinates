import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { assets } from "../data/assets";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function createPlaceholderSvg(asset: (typeof assets)[number]) {
  if (asset.assetStatus === "ready") {
    throw new Error(`Ready asset cannot generate a placeholder: ${asset.id}`);
  }

  const { width, height } = asset;
  const margin = Math.round(Math.min(width, height) * 0.04);
  const centerX = width / 2;
  const centerY = height / 2;
  const scale = Math.min(width / 800, height / 600);
  const titleSize = Math.max(36, Math.round(56 * scale));
  const labelSize = Math.max(20, Math.round(28 * scale));
  const metaSize = Math.max(13, Math.round(16 * scale));
  const englishSize = Math.max(11, Math.round(15 * scale));
  const ruleWidth = Math.round(Math.min(width * 0.2, 180));
  const ratio = `${width} × ${height}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title description" data-placeholder-artwork="true">
  <title id="title">占位图片：${escapeXml(asset.label)}</title>
  <desc id="description">蓝绿渐变的示意素材占位图，素材编号 ${escapeXml(asset.id)}，用于${escapeXml(asset.displayUse)}。</desc>
  <defs>
    <linearGradient id="placeholder-gradient" x1="${margin}" y1="${margin}" x2="${width - margin}" y2="${height - margin}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#075985"/>
      <stop offset="0.52" stop-color="#087A78"/>
      <stop offset="1" stop-color="#047857"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#placeholder-gradient)"/>
  <g fill="none" stroke="#FFFFFF" stroke-width="1" opacity="0.34" data-placeholder-cross-lines="true">
    <path d="M0 0 ${width} ${height}"/>
    <path d="M${width} 0 0 ${height}"/>
  </g>
  <rect x="${margin}" y="${margin}" width="${width - margin * 2}" height="${height - margin * 2}" fill="none" stroke="#FFFFFF" opacity="0.52"/>
  <g fill="#FFFFFF" font-family="&apos;Microsoft YaHei&apos;, &apos;PingFang SC&apos;, sans-serif">
    <text x="${margin * 2}" y="${margin * 2.7}" font-size="${metaSize}" font-weight="700">${escapeXml(asset.id)}</text>
    <text x="${width - margin * 2}" y="${margin * 2.7}" font-size="${metaSize}" text-anchor="end">${ratio}</text>
    <g text-anchor="middle">
      <text x="${centerX}" y="${centerY - 42 * scale}" font-size="${titleSize}" font-weight="800">占位图片</text>
      <text x="${centerX}" y="${centerY - 4 * scale}" font-size="${englishSize}" font-weight="700" letter-spacing="${Math.max(2, Math.round(3 * scale))}">PLACEHOLDER ASSET</text>
      <line x1="${centerX - ruleWidth / 2}" y1="${centerY + 24 * scale}" x2="${centerX + ruleWidth / 2}" y2="${centerY + 24 * scale}" stroke="#FFFFFF" stroke-width="2"/>
      <text x="${centerX}" y="${centerY + 70 * scale}" font-size="${labelSize}" font-weight="700">${escapeXml(asset.label)}</text>
    </g>
    <text x="${margin * 2}" y="${height - margin * 2}" font-size="${metaSize}">用途：${escapeXml(asset.displayUse)}</text>
    <text x="${width - margin * 2}" y="${height - margin * 2}" font-size="${metaSize}" font-weight="700" text-anchor="end">示意素材</text>
  </g>
</svg>
`;
}

for (const asset of assets) {
  if (asset.assetStatus === "ready") continue;

  const relativePath = asset.placeholderSrc.replace(/^\/+/, "");
  const outputPath = path.resolve("public", relativePath);
  mkdirSync(path.dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, createPlaceholderSvg(asset), "utf8");
  console.log(`Generated ${relativePath}`);
}
