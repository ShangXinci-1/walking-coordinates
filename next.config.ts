import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: "/walking-coordinates",
  trailingSlash: true,
};

export default nextConfig;