import type { Metadata } from "next";
import { COLLECTIONS } from "@/commerce/products";
import { CollectionView } from "@/components/collection/CollectionView";

export const metadata: Metadata = {
  title: "Shop All Jewellery",
  description: "Explore every VELORA object — handmade cuffs and statement jewellery.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return <CollectionView collection={COLLECTIONS[0]} />;
}
