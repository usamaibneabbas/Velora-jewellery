import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COLLECTIONS, getCollection } from "@/commerce/products";
import { CollectionView } from "@/components/collection/CollectionView";

export const dynamicParams = false;

export function generateStaticParams() {
  return COLLECTIONS.filter((c) => c.slug !== "all").map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollection(slug);
  if (!collection) return {};
  return {
    title: collection.title,
    description: `${collection.title} by VELORA. ${collection.description}`,
    alternates: { canonical: `/collections/${collection.slug}` },
  };
}

export default async function CollectionPage({ params }: PageProps<"/collections/[slug]">) {
  const { slug } = await params;
  const collection = await getCollection(slug);
  if (!collection || collection.slug === "all") notFound();
  return <CollectionView collection={collection} />;
}
