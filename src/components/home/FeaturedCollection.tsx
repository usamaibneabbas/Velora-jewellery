"use client";

import { Link } from "@/components/layout/PageTransition";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { RevealText } from "@/components/motion/RevealText";
import { ArrowRight } from "@/components/ui/icons";
import { Price } from "@/components/ui/Price";
import type { Product } from "@/commerce/types";

/**
 * SCENE 03 — The Collection.
 * Editorial photographs, not cards. Layout alternates large-left/small-right,
 * then small-left/large-right, to build visual rhythm as products are added.
 */
export function FeaturedCollection({ products }: { products: Product[] }) {
  return (
    <section data-header="light" aria-labelledby="collection-title" className="bg-ivory pb-32 pt-32 text-ink md:pb-48 md:pt-48">
      <div className="gutter-x mx-auto max-w-[1680px]">
        <div className="mb-20 flex flex-col justify-between gap-8 md:mb-32 md:flex-row md:items-end">
          <RevealText as="h2" id="collection-title" className="serif-display text-display uppercase">
            The Collection
          </RevealText>
          <RevealText as="p" split="words" className="max-w-xs text-sm leading-relaxed opacity-70 md:text-right">
            Handmade cuffs with vintage soul — each one composed, chased and finished to be worn for years.
          </RevealText>
        </div>

        <div className="grid grid-cols-12 gap-x-[var(--gutter)] gap-y-24 md:gap-y-40">
          {products.map((p, i) => {
            const large = i % 4 === 0 || i % 4 === 3;
            const leftSide = i % 2 === 0;
            const img = i % 2 === 0 ? p.images[0] : p.images[1] ?? p.images[0];
            const layout = large
              ? `col-span-12 md:col-span-7 ${leftSide ? "md:col-start-1" : "md:col-start-6"}`
              : `col-span-10 md:col-span-4 ${leftSide ? "md:col-start-2" : "col-start-3 md:col-start-9 md:mt-[28vh]"}`;
            return (
              <article key={p.id} className={`group ${layout}`}>
                <Link href={`/products/${p.slug}`} data-cursor="view" className="block" aria-label={`View ${p.title}`}>
                  <MaskReveal direction={leftSide ? "up" : "down"} className={large ? "aspect-[4/5]" : "aspect-[3/4]"}>
                    <div className="relative h-full w-full transition-transform duration-[1600ms] ease-[var(--ease-luxe)] group-hover:-translate-y-1 group-hover:scale-[1.03]">
                      <ParallaxImage image={img} className="h-full w-full" sizes={large ? "(min-width: 768px) 58vw, 100vw" : "(min-width: 768px) 33vw, 84vw"} speed={0.08} />
                      <div
                        aria-hidden
                        className="absolute inset-0 bg-gradient-to-t from-espresso/45 via-espresso/0 to-transparent opacity-60 transition-opacity duration-1000 group-hover:opacity-100"
                      />
                      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-ivory md:p-8">
                        <div className="translate-y-0 transition-transform duration-1000 ease-[var(--ease-luxe)] md:translate-y-3 md:group-hover:translate-y-0">
                          <p className="eyebrow text-[10px] opacity-70">N° 0{i + 1}</p>
                          <h3 className="serif-display mt-2 text-3xl md:text-4xl">{p.title}</h3>
                          <Price money={p.price} className="mt-2 block text-sm opacity-90 transition-opacity duration-700 md:opacity-0 md:group-hover:opacity-90" />
                        </div>
                        <ArrowRight className="mb-2 -translate-x-2 opacity-0 transition-all duration-700 ease-[var(--ease-luxe)] group-hover:translate-x-0 group-hover:opacity-100" />
                      </div>
                    </div>
                  </MaskReveal>
                </Link>
                <p className="mt-5 max-w-sm text-sm leading-relaxed opacity-70">{p.tagline}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
