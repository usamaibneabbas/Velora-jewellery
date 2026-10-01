"use client";

import { useRef } from "react";
import { FREE_SHIPPING_NOTE } from "@/commerce/config";
import type { Product } from "@/commerce/types";
import { Link } from "@/components/layout/PageTransition";
import { Price } from "@/components/ui/Price";
import { gsap } from "@/lib/gsap";
import { useScene } from "@/lib/motion";
import { Accordion } from "./Accordion";
import { AddToCart } from "./AddToCart";

/** Sticky product information. Content arrives in a quiet, progressive sequence. */
export function ProductInfo({ product }: { product: Product }) {
  const ref = useRef<HTMLDivElement>(null);

  useScene(ref, ({ reduce }, root) => {
    gsap.from(root.querySelectorAll("[data-info]"), {
      autoAlpha: 0,
      y: reduce ? 0 : 22,
      duration: reduce ? 0.6 : 1.2,
      stagger: 0.08,
      ease: "expo.out",
      delay: 0.35,
      clearProps: "transform",
    });
  });

  return (
    <div ref={ref} className="md:sticky md:top-[calc(var(--header-h)+4vh)]">
      <nav data-info aria-label="Breadcrumb" className="eyebrow mb-10 text-[10px] opacity-60">
        <ol className="flex gap-3">
          <li>
            <Link href="/shop" className="link-line">Shop</Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href={`/collections/${product.category}`} className="link-line capitalize">{product.category}</Link>
          </li>
        </ol>
      </nav>
      {product.isNew && <p data-info className="eyebrow mb-4 text-gold">New</p>}
      <h1 data-info className="serif-display text-headline">{product.title}</h1>
      <Price data-info money={product.price} className="mt-5 block font-serif text-2xl" />
      <p data-info className="mt-8 max-w-md text-[15px] leading-relaxed opacity-80">{product.description}</p>
      <dl data-info className="mt-8 border-t border-espresso/10 pt-6 text-sm">
        <dt className="eyebrow text-[10px] opacity-60">Material</dt>
        <dd className="mt-2 leading-relaxed">{product.material}</dd>
      </dl>
      <div data-info className="mt-10">
        <AddToCart product={product} />
        <p className="mt-4 text-xs opacity-60">{FREE_SHIPPING_NOTE} Dispatched within 2 working days.</p>
      </div>
      <div data-info className="mt-12">
        <Accordion
          items={[
            {
              title: "Details",
              content: (
                <ul className="list-inside list-[square] space-y-1 marker:text-gold">
                  {product.details.map((d) => <li key={d}>{d}</li>)}
                </ul>
              ),
            },
            {
              title: "Delivery",
              content: (
                <p>
                  Complimentary tracked and insured delivery across Europe in 3–6 working days, presented in the VELORA keepsake box.
                  Returns are accepted within 30 days in original condition. <Link href="/client-care/shipping" className="underline underline-offset-4">Shipping &amp; returns</Link>
                </p>
              ),
            },
            {
              title: "Care",
              content: (
                <ul className="space-y-2">
                  {product.care.map((c) => <li key={c}>{c}</li>)}
                </ul>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
