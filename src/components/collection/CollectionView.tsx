import { COLLECTIONS, getCollectionProducts, getProducts } from "@/commerce/products";
import type { Collection } from "@/commerce/types";
import { Link } from "@/components/layout/PageTransition";
import { ProductGrid } from "@/components/home/ProductGrid";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { CollectionFilter } from "./CollectionFilter";
import { CollectionHero } from "./CollectionHero";

export async function CollectionView({ collection }: { collection: Collection }) {
  const [products, all] = await Promise.all([getCollectionProducts(collection.slug), getProducts()]);
  const counts = await Promise.all(COLLECTIONS.map(async (c) => ({ slug: c.slug, title: c.title, count: (await getCollectionProducts(c.slug)).length })));
  const heroProduct = all.find((p) => p.slug === "etoile-cuff") ?? all[0];
  const path = collection.slug === "all" ? "/shop" : `/collections/${collection.slug}`;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: collection.title, path }])} />
      <CollectionHero
        eyebrow={collection.slug === "all" ? "Shop VELORA" : "Collection"}
        title={collection.slug === "all" ? "Collection" : collection.title}
        description={collection.description}
        image={heroProduct.images[1] ?? heroProduct.featuredImage}
      />
      <div className="bg-pearl text-ink" data-header="light">
        <CollectionFilter active={collection.slug} items={counts} />
        {products.length > 0 ? (
          <ProductGrid products={products} showHeader={false} />
        ) : (
          <div className="gutter-x mx-auto flex max-w-[1680px] flex-col items-start gap-8 pb-40 pt-10">
            <p className="serif-display text-5xl md:text-7xl">Arriving soon.</p>
            <p className="max-w-sm text-sm opacity-70">New {collection.title.toLowerCase()} are being made by hand. Join Private Access to see them first.</p>
            <Link href="/shop" className="eyebrow link-line">Explore all jewellery</Link>
          </div>
        )}
      </div>
    </>
  );
}
