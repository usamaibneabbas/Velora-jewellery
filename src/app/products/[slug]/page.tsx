import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, getProducts, getRelatedProducts } from "@/commerce/products";
import { formatMoney } from "@/commerce/pricing";
import { JsonLd } from "@/components/JsonLd";
import { ProductGrid } from "@/components/home/ProductGrid";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductStoryScene } from "@/components/product/ProductStoryScene";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  const description = `${product.tagline} ${product.material}. ${formatMoney(product.price)}.`;
  const image = product.featuredImage;
  return {
    title: product.title,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: { title: `${product.title} — VELORA`, description, images: [{ url: image.src, width: image.width, height: image.height, alt: image.alt }] },
    twitter: { card: "summary_large_image", title: `${product.title} — VELORA`, description, images: [image.src] },
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const related = await getRelatedProducts(product, 4);

  return (
    <>
      <JsonLd data={productJsonLd(product)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
          { name: product.title, path: `/products/${product.slug}` },
        ])}
      />
      <section data-header="light" className="bg-ivory pt-[var(--header-h)] text-ink">
        <div className="mx-auto grid max-w-[1680px] gap-10 md:grid-cols-12 md:gap-0 md:pl-[var(--gutter)]">
          <div className="md:col-span-7 md:pt-[4vh]">
            <ProductGallery images={product.images} title={product.title} />
          </div>
          <div className="gutter-x pb-10 md:col-span-5 md:px-[clamp(2rem,5vw,6rem)] md:pt-[8vh]">
            <ProductInfo product={product} />
          </div>
        </div>
        <ProductStoryScene product={product} />
      </section>
      {related.length > 0 && (
        <div className="bg-pearl pt-24">
          <ProductGrid products={related} title="You may also like" />
        </div>
      )}
    </>
  );
}
