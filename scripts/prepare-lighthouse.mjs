import { rmSync } from "node:fs";
import { resolve, sep } from "node:path";

const workspaceRoot = resolve(".");
const reportDirectory = resolve("lighthouse-results");

if (!reportDirectory.startsWith(`${workspaceRoot}${sep}`)) {
  throw new Error("Lighthouse 报告目录必须位于项目工作区内。");
}

rmSync(reportDirectory, { force: true, recursive: true });
