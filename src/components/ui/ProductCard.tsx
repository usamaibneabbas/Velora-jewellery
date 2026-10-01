"use client";

import Image from "next/image";
import { useCart } from "@/commerce/cart/useCart";
import type { Product } from "@/commerce/types";
import { Link } from "@/components/layout/PageTransition";
import { Price } from "./Price";

/**
 * Shop grid card — image, name, price, quick add, view.
 * No borders: the photograph is the card. Secondary image fades in on hover.
 */
export function ProductCard({ product, sizes, priority }: { product: Product; sizes: string; priority?: boolean }) {
  const { add } = useCart();
  const { featuredImage: img, hoverImage: hover } = product;

  return (
    <article className="group relative">
      <Link href={`/products/${product.slug}`} data-cursor="view" className="block" aria-label={`${product.title}, ${product.tagline}`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-champagne">
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes={sizes}
            preload={priority}
            className="object-cover transition-transform duration-[1400ms] ease-[var(--ease-luxe)] group-hover:scale-[1.035]"
            style={{ objectPosition: img.focal }}
          />
          {hover && (
            <Image
              src={hover.src}
              alt=""
              fill
              sizes={sizes}
              className="object-cover opacity-0 transition-[opacity,transform] duration-[1100ms] ease-[var(--ease-luxe)] group-hover:scale-[1.035] group-hover:opacity-100"
              style={{ objectPosition: hover.focal }}
            />
          )}
          {product.isNew && <span className="eyebrow absolute left-4 top-4 text-[10px] text-espresso/70 mix-blend-multiply">New</span>}
          {img.placeholder && <span className="eyebrow absolute inset-x-4 bottom-4 text-center text-[9px] text-espresso/50">Photography coming soon</span>}
        </div>
      </Link>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl leading-tight md:text-2xl">
            <Link href={`/products/${product.slug}`} className="link-line">
              {product.title}
            </Link>
          </h3>
          <p className="mt-1 text-xs leading-relaxed opacity-60">{product.tagline}</p>
        </div>
        <Price money={product.price} className="pt-1 text-sm" />
      </div>
      <div className="mt-4 flex items-center gap-6">
        <button
          type="button"
          onClick={() => add(product)}
          disabled={!product.availableForSale}
          className="eyebrow link-line text-[10px] disabled:opacity-40"
          aria-label={`Quick add ${product.title} to bag`}
        >
          Quick add
        </button>
        <Link href={`/products/${product.slug}`} className="eyebrow link-line text-[10px] opacity-60 hover:opacity-100">
          View product
        </Link>
      </div>
    </article>
  );
}
