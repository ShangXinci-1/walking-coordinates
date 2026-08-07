import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import { createBrotliCompress, createGzip } from "node:zlib";

const port = Number(process.env.WC_PREVIEW_PORT ?? 4173);
const basePath = "/walking-coordinates";
const outputRoot = resolve("out");

const contentTypes = {
  ".avif": "image/avif",
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};
const compressibleExtensions = new Set([".css", ".html", ".js", ".json", ".svg"]);

function resolveRequestPath(requestPath) {
  if (requestPath === "/") return { redirect: `${basePath}/` };
  if (!requestPath.startsWith(basePath)) return null;

  const relativePath = decodeURIComponent(
    requestPath.slice(basePath.length).replace(/^\/+/, ""),
  );
  const candidates =
    relativePath === ""
      ? ["index.html"]
      : [
          relativePath,
          `${relativePath}.html`,
          `${relativePath}/index.html`,
        ];

  for (const candidate of candidates) {
    const absolutePath = resolve(outputRoot, candidate);
    if (
      absolutePath.startsWith(`${outputRoot}${sep}`) &&
      existsSync(absolutePath) &&
      statSync(absolutePath).isFile()
    ) {
      return { absolutePath };
    }
  }

  return null;
}

createServer((request, response) => {
  const requestUrl = new URL(request.url ?? "/", `http://${request.headers.host}`);
  const resolved = resolveRequestPath(requestUrl.pathname);

  if (resolved?.redirect) {
    response.writeHead(302, { Location: resolved.redirect });
    response.end();
    return;
  }

  if (!resolved?.absolutePath) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  const extension = extname(resolved.absolutePath);
  const cacheControl = requestUrl.pathname.includes(
    `${basePath}/_next/static/`,
  )
    ? "public, max-age=31536000, immutable"
    : extension === ".html"
      ? "no-cache"
      : "public, max-age=3600";
  const headers = {
    "Cache-Control": cacheControl,
    "Content-Type":
      contentTypes[extension] ??
      "application/octet-stream",
  };
  const source = createReadStream(resolved.absolutePath);
  const acceptEncoding = request.headers["accept-encoding"] ?? "";

  if (compressibleExtensions.has(extension) && acceptEncoding.includes("br")) {
    response.writeHead(200, {
      ...headers,
      "Content-Encoding": "br",
      Vary: "Accept-Encoding",
    });
    source.pipe(createBrotliCompress()).pipe(response);
    return;
  }

  if (
    compressibleExtensions.has(extension) &&
    acceptEncoding.includes("gzip")
  ) {
    response.writeHead(200, {
      ...headers,
      "Content-Encoding": "gzip",
      Vary: "Accept-Encoding",
    });
    source.pipe(createGzip()).pipe(response);
    return;
  }

  response.writeHead(200, headers);
  source.pipe(response);
}).listen(port, "127.0.0.1", () => {
  console.log(`Static preview: http://127.0.0.1:${port}${basePath}/`);
});
