export const SITE_BASE_PATH = "/walking-coordinates";

export function withBasePath(path: string) {
  if (!path.startsWith("/")) {
    throw new Error(`Expected an absolute site path, received: ${path}`);
  }

  return `${SITE_BASE_PATH}${path}`;
}
