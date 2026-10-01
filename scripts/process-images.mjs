/**
 * VELORA asset pipeline.
 *
 * Reads original photography from /assets/originals and writes optimised,
 * art-directed crops into /public/products/<product>/.
 * Also generates neutral placeholders for SKUs that are still awaiting photography.
 *
 * Run: npm run images
 *
 * To add a new product: drop the original into /assets/originals, add an entry
 * to CROPS below, run the script, then reference the output paths in
 * src/commerce/data/products.ts.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const ORIG = path.join(ROOT, "assets/originals");
const OUT = path.join(ROOT, "public");

/** Crops are in source pixels. Each one avoids baked-in campaign typography. */
const CROPS = [
  // Product 01 — Kabul Cuff (source has campaign text on the left; crops exclude it)
  { src: "velora-kabul-cuff-campaign.webp", out: "products/product-01/portrait.webp", rect: { left: 540, top: 340, width: 582, height: 910 } },
  { src: "velora-kabul-cuff-campaign.webp", out: "products/product-01/still.webp", rect: { left: 425, top: 560, width: 697, height: 690 } },
  { src: "velora-kabul-cuff-campaign.webp", out: "products/product-01/detail.webp", rect: { left: 560, top: 345, width: 562, height: 330 } },
  // Product 02 — Bamiyan Cuff
  { src: "velora-bamiyan-cuff-still.webp", out: "products/product-02/portrait.webp", rect: null },
  { src: "velora-bamiyan-cuff-still.webp", out: "products/product-02/still.webp", rect: { left: 120, top: 330, width: 1002, height: 760 } },
  { src: "velora-bamiyan-cuff-still.webp", out: "products/product-02/detail.webp", rect: { left: 180, top: 410, width: 700, height: 400 } },
  // Band tile cut from star-centre to star-centre, so mirrored repeats are seamless (WebGL cuff texture)
  { src: "velora-bamiyan-cuff-still.webp", out: "textures/band-bamiyan.webp", rect: { left: 493, top: 470, width: 230, height: 220 } },
];

const PLACEHOLDERS = [
  { out: "placeholders/velora-product-03.webp", label: "PRODUCT 03", sub: "Lapis cuff — awaiting product-only photography" },
  { out: "placeholders/velora-product-04.webp", label: "PRODUCT 04", sub: "Awaiting photography" },
  { out: "placeholders/velora-packaging.webp", label: "PACKAGING", sub: "Awaiting photography" },
];

async function run() {
  for (const c of CROPS) {
    const dest = path.join(OUT, c.out);
    await mkdir(path.dirname(dest), { recursive: true });
    let img = sharp(path.join(ORIG, c.src));
    if (c.rect) img = img.extract(c.rect);
    await img.webp({ quality: 88, smartSubsample: true }).toFile(dest);
    console.log("✓", c.out);
  }
  for (const p of PLACEHOLDERS) {
    const dest = path.join(OUT, p.out);
    await mkdir(path.dirname(dest), { recursive: true });
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1500" viewBox="0 0 1200 1500">
      <defs>
        <radialGradient id="g" cx="50%" cy="42%" r="70%">
          <stop offset="0" stop-color="#f4eee4"/><stop offset="0.6" stop-color="#e6dccb"/><stop offset="1" stop-color="#cfc2ad"/>
        </radialGradient>
      </defs>
      <rect width="1200" height="1500" fill="url(#g)"/>
      <ellipse cx="600" cy="690" rx="260" ry="92" fill="none" stroke="#a8916b" stroke-width="2" opacity="0.55"/>
      <ellipse cx="600" cy="690" rx="236" ry="78" fill="none" stroke="#a8916b" stroke-width="1" opacity="0.35"/>
      <text x="600" y="1040" text-anchor="middle" font-family="Georgia, serif" font-size="54" letter-spacing="14" fill="#3b2f26">VELORA</text>
      <text x="600" y="1110" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="22" letter-spacing="8" fill="#6f6152">${p.label}</text>
      <text x="600" y="1150" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="18" letter-spacing="2" fill="#8d7f6e">${p.sub}</text>
    </svg>`;
    await sharp(Buffer.from(svg)).webp({ quality: 85 }).toFile(dest);
    console.log("✓", p.out);
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
