/**
 * VELORA catalogue — local data source.
 *
 * ┌──────────────────────────────────────────────────────────────────┐
 * │ HOW TO REPLACE / ADD PRODUCT PHOTOGRAPHY                          │
 * │ 1. Put files in /public/products/product-XX/                      │
 * │    (or put originals in /assets/originals and run `npm run images`)│
 * │ 2. Update the `images` entries below (src, width, height, alt).   │
 * │ 3. The first image is the featured image; the second is used for │
 * │    hover swaps on cards.                                          │
 * └──────────────────────────────────────────────────────────────────┘
 *
 * This file is the ONLY place catalogue content lives. Components read
 * normalised products through src/commerce/products.ts, so this module can
 * later be swapped for the Shopify Storefront API without touching the UI.
 */
import type { CategorySlug, CurrencyCode, ProductImage } from "../types";

export interface RawProduct {
  id: string;
  sku: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  prices: Partial<Record<CurrencyCode, number>>;
  category: CategorySlug;
  material: string;
  details: string[];
  care: string[];
  images: ProductImage[];
  isNew: boolean;
  featured: boolean;
  /** Draft products are excluded from the storefront. */
  published: boolean;
  availableForSale: boolean;
}

const CARE_METAL = [
  "Store in the VELORA pouch, away from humidity and other pieces.",
  "Put on after perfume, lotion and hair products.",
  "Wipe gently with a soft dry cloth after wearing. Avoid water and chemical cleaners.",
];

export const RAW_PRODUCTS: RawProduct[] = [
  {
    id: "velora-product-01",
    sku: "VEL-CF-001",
    title: "Ailes Cuff",
    slug: "ailes-cuff",
    tagline: "Winged motifs around an oval of turquoise.",
    description:
      "An open cuff carried by hand-chased winged motifs and a single oval turquoise-style stone, framed in antiqued silver tones and flecked with coral-red accents. Inspired by vintage Afghan metalwork, made to be worn every day and noticed quietly.",
    prices: { USD: 49, EUR: 49 },
    category: "bracelets",
    material: "Antiqued silver-tone metal, turquoise-style stones, coral-red accents",
    details: [
      "Handmade, vintage-inspired tribal design",
      "Oval turquoise-style centre stone with turquoise-style end stones",
      "Adjustable open cuff — fits most wrists",
      "Hand-oxidised recesses for depth and contrast",
      "Each piece is unique; slight variations are part of its character",
    ],
    care: CARE_METAL,
    images: [
      {
        src: "/products/product-01/portrait.webp",
        alt: "Two Ailes cuffs with oval turquoise-style stones and winged silver-tone motifs resting on ivory silk",
        width: 582,
        height: 910,
        focal: "50% 40%",
      },
      {
        src: "/products/product-01/still.webp",
        alt: "Ailes cuff in profile showing the winged motifs, coral-red accents and turquoise-style end stone",
        width: 697,
        height: 690,
        focal: "45% 45%",
      },
      {
        src: "/products/product-01/detail.webp",
        alt: "Close detail of the Ailes cuff's oval turquoise-style stone and chased winged motifs",
        width: 562,
        height: 330,
        focal: "50% 50%",
      },
    ],
    isNew: true,
    featured: true,
    published: true,
    availableForSale: true,
  },
  {
    id: "velora-product-02",
    sku: "VEL-CF-002",
    title: "Étoile Cuff",
    slug: "etoile-cuff",
    tagline: "Starred diamonds, turquoise and coral in rhythm.",
    description:
      "A wide statement cuff composed like a piece of architecture: beaded borders, chased star motifs set in diamond frames, and a cadence of turquoise-style cabochons and coral-red beads across an oxidised ground.",
    prices: { USD: 49, EUR: 49 },
    category: "bracelets",
    material: "Antiqued silver-tone metal, turquoise-style cabochons, coral-red beads",
    details: [
      "Handmade, vintage-inspired tribal design",
      "Round turquoise-style cabochons with beaded settings",
      "Chased star motifs framed in diamond shapes",
      "Adjustable open cuff — fits most wrists",
      "Each piece is unique; slight variations are part of its character",
    ],
    care: CARE_METAL,
    images: [
      {
        src: "/products/product-02/portrait.webp",
        alt: "Two Étoile cuffs with round turquoise-style stones and star motifs resting on a stone slab",
        width: 1122,
        height: 1402,
        focal: "50% 48%",
      },
      {
        src: "/products/product-02/still.webp",
        alt: "Étoile cuff seen from the front, its beaded borders and diamond-framed star motifs in focus",
        width: 1002,
        height: 760,
        focal: "50% 35%",
      },
      {
        src: "/products/product-02/detail.webp",
        alt: "Macro detail of the Étoile cuff's turquoise-style cabochons, coral-red beads and chased stars",
        width: 700,
        height: 400,
        focal: "50% 50%",
      },
    ],
    isNew: true,
    featured: true,
    published: true,
    availableForSale: true,
  },
  {
    id: "velora-product-03",
    sku: "VEL-CF-003",
    title: "Nuit Cuff",
    slug: "nuit-cuff",
    tagline: "Lapis blue, turquoise and a quiet geometry.",
    description:
      "A deep-blue counterpart to the collection: lapis-style cabochons set between turquoise-style beads, coral-red accents and engraved diamond motifs, bordered with fine beaded lines.",
    prices: { USD: 49, EUR: 49 },
    category: "bracelets",
    material: "Antiqued silver-tone metal, lapis-style cabochons, turquoise-style beads",
    details: [
      "Handmade, vintage-inspired tribal design",
      "Round lapis-style cabochons with beaded borders",
      "Adjustable open cuff — fits most wrists",
      "Each piece is unique; slight variations are part of its character",
    ],
    care: CARE_METAL,
    // Studio renders (scripts/render) — the only photograph supplied for this SKU
    // was worn on a model, which the brand rules exclude. Re-run `npm run render`
    // after design tweaks, or replace with product photography when available.
    images: [
      {
        src: "/products/product-03/portrait.webp",
        alt: "Nuit cuff with lapis-style cabochons and turquoise-style bead clusters on a travertine plinth",
        width: 1600,
        height: 2000,
        focal: "50% 55%",
      },
      {
        src: "/products/product-03/still.webp",
        alt: "Nuit cuff seen from the front: lapis-style cabochons, chased star diamonds and beaded borders",
        width: 2000,
        height: 1520,
        focal: "50% 50%",
      },
      {
        src: "/products/product-03/detail.webp",
        alt: "Close detail of a Nuit cuff lapis-style cabochon framed by turquoise-style beads with coral-red centres",
        width: 2000,
        height: 1150,
        focal: "45% 50%",
      },
    ],
    isNew: true,
    featured: false,
    published: true,
    availableForSale: true,
  },
  {
    id: "velora-product-04",
    sku: "VEL-XX-004",
    title: "Product 04",
    slug: "product-04",
    tagline: "Reserved for the next VELORA piece.",
    description: "Reserved slot. Add details and photography, then set `published: true`.",
    prices: { USD: 49, EUR: 49 },
    category: "bracelets",
    material: "—",
    details: [],
    care: CARE_METAL,
    images: [
      {
        src: "/placeholders/velora-product-04.webp",
        alt: "Product photography coming soon",
        width: 1200,
        height: 1500,
        placeholder: true,
      },
    ],
    isNew: false,
    featured: false,
    published: false,
    availableForSale: false,
  },
];
