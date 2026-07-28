import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";

const forbiddenFiles = [
  "app/PracticeSite.tsx",
  "app/RouteMap.tsx",
  "app/custom.css",
  "components/MediaPlaceholder.tsx",
  "components/routes/index.ts",
  "lib/content/index.ts",
  "public/file.svg",
  "public/globe.svg",
  "public/window.svg",
  "postcss.config.mjs",
];

const issues: string[] = [];

for (const relativePath of forbiddenFiles) {
  try {
    await access(path.resolve(relativePath));
    issues.push(`遗留文件仍存在：${relativePath}`);
  } catch {
    // Expected: the legacy target does not exist.
  }
}

async function collectCssFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return collectCssFiles(entryPath);
      return entry.name.endsWith(".css") ? [entryPath] : [];
    }),
  );
  return nested.flat();
}

async function collectSourceFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return collectSourceFiles(entryPath);
      return /\.(?:ts|tsx)$/.test(entry.name) ? [entryPath] : [];
    }),
  );
  return nested.flat();
}

const cssFiles = [
  ...(await collectCssFiles(path.resolve("app"))),
  ...(await collectCssFiles(path.resolve("styles"))),
];
const sourceFiles = [
  ...(await collectSourceFiles(path.resolve("app"))),
  ...(await collectSourceFiles(path.resolve("components"))),
];
const sourceText = (
  await Promise.all(sourceFiles.map((file) => readFile(file, "utf8")))
).join("\n");

for (const cssFile of cssFiles) {
  const source = await readFile(cssFile, "utf8");
  if (source.includes("!important")) {
    issues.push(
      `补丁式 !important 仍存在：${path.relative(process.cwd(), cssFile)}`,
    );
  }

  const classNames = new Set(
    [...source.matchAll(/\.([A-Za-z][A-Za-z0-9_-]*)/g)].map(
      (match) => match[1],
    ),
  );
  for (const className of classNames) {
    if (!sourceText.includes(className)) {
      issues.push(
        `无引用 CSS 类：${path.relative(process.cwd(), cssFile)} -> .${className}`,
      );
    }
  }
}

const assetManifest = await readFile(path.resolve("data", "assets.ts"), "utf8");
if (/\bid:\s*["']placeholder-/.test(assetManifest)) {
  issues.push("素材 ID 仍与 placeholder 状态耦合");
}

if (issues.length > 0) {
  console.error("仓库清理门禁失败：");
  for (const issue of issues) console.error(`- ${issue}`);
  process.exitCode = 1;
} else {
  console.log(
    `仓库清理门禁通过：${forbiddenFiles.length} 个遗留目标不存在，${cssFiles.length} 个样式文件无 !important 或无引用类。`,
  );
}
