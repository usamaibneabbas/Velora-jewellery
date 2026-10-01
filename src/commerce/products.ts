/**
 * Product access layer — the only module UI code should import catalogue data from.
 *
 * All functions are async so the local data source can be replaced by the
 * Shopify Storefront API (or any headless backend) with no component changes.
 */
import { RAW_PRODUCTS, type RawProduct } from "./data/products";
import { priceFor } from "./pricing";
import type { CategorySlug, Collection, Product } from "./types";

function normalize(raw: RawProduct): Product {
  const [featuredImage, hoverImage] = raw.images;
  return {
    id: raw.id,
    sku: raw.sku,
    title: raw.title,
    slug: raw.slug,
    tagline: raw.tagline,
    description: raw.description,
    price: priceFor(raw.prices),
    category: raw.category,
    material: raw.material,
    details: raw.details,
    care: raw.care,
    images: raw.images,
    featuredImage,
    hoverImage,
    isNew: raw.isNew,
    featured: raw.featured,
    availableForSale: raw.availableForSale,
  };
}

const catalogue = (): Product[] => RAW_PRODUCTS.filter((p) => p.published).map(normalize);

export async function getProducts(): Promise<Product[]> {
  return catalogue();
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return catalogue().find((p) => p.slug === slug);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return catalogue().filter((p) => p.featured);
}

export async function getNewProducts(): Promise<Product[]> {
  return catalogue().filter((p) => p.isNew);
}

export async function getRelatedProducts(product: Product, limit = 3): Promise<Product[]> {
  return catalogue()
    .filter((p) => p.id !== product.id)
    .sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category))
    .slice(0, limit);
}

/* ------------------------------------------------------------------ */
/* Collections                                                         */
/* ------------------------------------------------------------------ */

export const COLLECTIONS: Collection[] = [
  { slug: "all", title: "All Jewellery", description: "Every VELORA object, in one place." },
  { slug: "new-arrivals", title: "New Arrivals", description: "The latest objects to join the collection." },
  { slug: "bracelets", title: "Bracelets", description: "Open cuffs and sculpted bands, handmade." },
  { slug: "necklaces", title: "Necklaces", description: "Arriving soon." },
  { slug: "rings", title: "Rings", description: "Arriving soon." },
  { slug: "earrings", title: "Earrings", description: "Arriving soon." },
];

const CATEGORY_SLUGS: CategorySlug[] = ["bracelets", "necklaces", "rings", "earrings"];

export async function getCollection(slug: string): Promise<Collection | undefined> {
  return COLLECTIONS.find((c) => c.slug === slug);
}

export async function getCollectionProducts(slug: string): Promise<Product[]> {
  const all = catalogue();
  if (slug === "all") return all;
  if (slug === "new-arrivals") return all.filter((p) => p.isNew);
  if ((CATEGORY_SLUGS as string[]).includes(slug)) return all.filter((p) => p.category === slug);
  return [];
}
