import type { NextConfig } from "next";

/**
 * Two build targets:
 * - default: full Next.js server build (Vercel, Node hosting, later Shopify).
 * - static export for GitHub Pages: set PAGES_BASE_PATH=/Velora-jewellery
 *   (see scripts/export-pages.sh). Images are served as-is via a tiny loader.
 */
const basePath = process.env.PAGES_BASE_PATH ?? "";
const isPages = basePath !== "";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  ...(isPages ? { env: { NEXT_PUBLIC_BASE_PATH: basePath } } : {}),
  ...(isPages
    ? {
        output: "export",
        basePath,
        images: { loader: "custom", loaderFile: "./src/lib/image-loader.ts" },
      }
    : {
        images: {
          formats: ["image/avif", "image/webp"],
          qualities: [75, 85],
          deviceSizes: [640, 828, 1080, 1280, 1600, 1920, 2560],
          minimumCacheTTL: 60 * 60 * 24 * 30,
        },
      }),
};

export default nextConfig;
