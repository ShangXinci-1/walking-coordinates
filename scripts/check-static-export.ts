import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";

const exportDirectory = path.resolve("out");
const basePath = "/walking-coordinates";
const issues = new Set<string>();

async function collectFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory() ? collectFiles(entryPath) : [entryPath];
    }),
  );

  return nested.flat();
}

function isExternalReference(reference: string) {
  return /^(?:[a-z]+:|\/\/)/i.test(reference);
}

function normalizeReference(reference: string) {
  const decoded = decodeURIComponent(reference.replaceAll("&amp;", "&"));
  const hashIndex = decoded.indexOf("#");
  const queryIndex = decoded.indexOf("?");
  const endCandidates = [hashIndex, queryIndex].filter((index) => index >= 0);
  const end = endCandidates.length > 0 ? Math.min(...endCandidates) : decoded.length;
  const pathname = decoded.slice(0, end);
  const fragment = hashIndex >= 0 ? decoded.slice(hashIndex + 1) : null;

  return { pathname, fragment };
}

function getExportCandidates(referencePath: string, fromFile: string) {
  const withoutBasePath = referencePath.startsWith(basePath)
    ? referencePath.slice(basePath.length)
    : referencePath;
  const normalized = withoutBasePath === "" ? "/" : withoutBasePath;
  const relativePath = normalized.startsWith("/")
    ? normalized.slice(1)
    : path.relative(exportDirectory, path.resolve(path.dirname(fromFile), normalized));

  if (relativePath === "" || relativePath === ".") {
    return [path.join(exportDirectory, "index.html")];
  }

  const absolute = path.join(exportDirectory, relativePath);
  if (path.extname(relativePath)) return [absolute];

  return [
    `${absolute}.html`,
    path.join(absolute, "index.html"),
    absolute,
  ];
}

async function firstExistingPath(candidates: string[]) {
  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Continue through the deterministic export candidates.
    }
  }
  return null;
}

async function validateReference(reference: string, fromFile: string) {
  if (
    !reference ||
    reference === "#" ||
    isExternalReference(reference) ||
    reference.startsWith("data:")
  ) {
    return;
  }

  const { pathname, fragment } = normalizeReference(reference);
  const targetFile =
    pathname === ""
      ? fromFile
      : await firstExistingPath(getExportCandidates(pathname, fromFile));

  if (!targetFile) {
    issues.add(
      `${path.relative(exportDirectory, fromFile)} -> ${reference}（目标不存在）`,
    );
    return;
  }

  if (fragment && targetFile.endsWith(".html")) {
    const targetHtml = await readFile(targetFile, "utf8");
    const escapedFragment = fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (!new RegExp(`\\bid=["']${escapedFragment}["']`).test(targetHtml)) {
      issues.add(
        `${path.relative(exportDirectory, fromFile)} -> ${reference}（锚点不存在）`,
      );
    }
  }
}

const files = await collectFiles(exportDirectory);
const htmlFiles = files.filter((file) => file.endsWith(".html"));
const cssFiles = files.filter((file) => file.endsWith(".css"));

for (const htmlFile of htmlFiles) {
  const html = await readFile(htmlFile, "utf8");
  const attributePattern = /\b(href|src|srcset)=["']([^"']+)["']/g;

  for (const match of html.matchAll(attributePattern)) {
    const [, attribute, value] = match;
    const references =
      attribute === "srcset"
        ? value.split(",").map((candidate) => candidate.trim().split(/\s+/)[0])
        : [value];

    for (const reference of references) {
      await validateReference(reference, htmlFile);
    }
  }
}

for (const cssFile of cssFiles) {
  const css = await readFile(cssFile, "utf8");
  for (const match of css.matchAll(/url\((?:["']?)([^"')]+)(?:["']?)\)/g)) {
    await validateReference(match[1].trim(), cssFile);
  }
}

if (issues.size > 0) {
  console.error("静态导出完整性检查失败：");
  for (const issue of issues) console.error(`- ${issue}`);
  process.exitCode = 1;
} else {
  console.log(
    `静态导出完整性检查通过：${htmlFiles.length} 个 HTML，${cssFiles.length} 个 CSS。`,
  );
}
