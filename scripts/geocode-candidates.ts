import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { loadEnvFile } from "node:process";
import { sites } from "../data/sites";
import { AMAP_GEOCODER_SOURCE_ID } from "../data/sources";
import { parseAmapGeocodeResponse } from "../lib/content/amap-geocode";

try {
  loadEnvFile(resolve(".env.local"));
} catch (error) {
  if (
    !(error instanceof Error) ||
    !("code" in error) ||
    error.code !== "ENOENT"
  ) {
    throw error;
  }
}

const apiKey = process.env.WC_AMAP_WEB_KEY?.trim();

if (!apiKey) {
  throw new Error("缺少 WC_AMAP_WEB_KEY；请通过本地环境变量提供高德 Web 服务 Key。");
}

const queriedAt = new Date().toISOString();
const records = [];

for (const site of sites) {
  if (!site.officialAddress) continue;

  const endpoint = new URL("https://restapi.amap.com/v3/geocode/geo");
  endpoint.searchParams.set("key", apiKey);
  endpoint.searchParams.set("address", site.officialAddress.value);
  endpoint.searchParams.set("city", "北京");

  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`地点 ${site.id} 地理编码请求失败：HTTP ${response.status}`);
  }

  const payload = await response.json();
  records.push({
    siteId: site.id,
    requestedAddress: site.officialAddress.value,
    candidates: parseAmapGeocodeResponse(
      payload,
      AMAP_GEOCODER_SOURCE_ID,
      queriedAt,
    ),
  });
}

const outputPath = resolve("data/generated/geocode-candidates.json");
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(
  outputPath,
  `${JSON.stringify(
    {
      generatedAt: queriedAt,
      crs: "GCJ-02",
      reviewRequired: true,
      records,
    },
    null,
    2,
  )}\n`,
  "utf8",
);

console.log(`已生成 ${records.length} 条待人工核验记录：${outputPath}`);
