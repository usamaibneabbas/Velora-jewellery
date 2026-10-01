/**
 * Renders studio product photography for pieces without product-only photos.
 *
 *   npm run render            # all shots
 *   npm run render -- detail  # a single shot
 *
 * Serves the repo locally, opens scripts/render/index.html in headless
 * Chromium (Playwright), and writes WebP files to public/products/product-03/.
 */
import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "public/products/product-03");
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript" };

const server = createServer(async (req, res) => {
  try {
    const file = path.join(ROOT, decodeURIComponent(new URL(req.url, "http://x").pathname));
    if (!file.startsWith(ROOT)) throw new Error("forbidden");
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] ?? "application/octet-stream" });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404).end();
  }
}).listen(0);
const port = server.address().port;

const { chromium } = await import("playwright");
const browser = await chromium.launch({
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage();
page.on("pageerror", (e) => console.error("page error:", e.message));
await page.goto(`http://localhost:${port}/scripts/render/index.html`);
await page.waitForFunction(() => window.studioReady, null, { timeout: 60000 });
await mkdir(OUT, { recursive: true });

const only = process.argv[2];
for (const name of ["portrait", "still", "detail"]) {
  if (only && only !== name) continue;
  const t = Date.now();
  const dataUrl = await page.evaluate((n) => window.renderShot(n), name);
  const png = Buffer.from(dataUrl.split(",")[1], "base64");
  const meta = await sharp(png).metadata();
  await sharp(png)
    .resize(Math.round(meta.width / 1.5)) // 1.5× supersampling → clean edges
    .webp({ quality: 88 })
    .toFile(path.join(OUT, `${name}.webp`));
  console.log(`✓ ${name}.webp (${((Date.now() - t) / 1000).toFixed(1)}s)`);
}

await browser.close();
server.close();
