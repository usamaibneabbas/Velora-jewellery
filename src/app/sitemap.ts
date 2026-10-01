export const dynamic = "force-static";

import type { MetadataRoute } from "next";
import { COLLECTIONS, getProducts } from "@/commerce/products";
import { CLIENT_CARE, LEGAL } from "@/lib/pages";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/shop"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/our-world"), changeFrequency: "monthly", priority: 0.6 },
    ...COLLECTIONS.filter((c) => c.slug !== "all").map((c) => ({ url: absoluteUrl(`/collections/${c.slug}`), priority: 0.7 })),
    ...products.map((p) => ({
      url: absoluteUrl(`/products/${p.slug}`),
      priority: 0.8,
      images: p.images.filter((i) => !i.placeholder).map((i) => absoluteUrl(i.src)),
    })),
    ...Object.keys(CLIENT_CARE).map((s) => ({ url: absoluteUrl(`/client-care/${s}`), priority: 0.3 })),
    ...Object.keys(LEGAL).map((s) => ({ url: absoluteUrl(`/legal/${s}`), priority: 0.2 })),
  ];
}
