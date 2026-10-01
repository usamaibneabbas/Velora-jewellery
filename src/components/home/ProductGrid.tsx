import type { Product } from "@/commerce/types";
import { Link } from "@/components/layout/PageTransition";
import { RevealText } from "@/components/motion/RevealText";
import { ArrowRight } from "@/components/ui/icons";
import { ProductCard } from "@/components/ui/ProductCard";

/**
 * SCENE 09 / shop grid. 4 columns desktop, 2 tablet, 1–2 mobile.
 * When the row is incomplete, the remaining cell becomes a quiet editorial link.
 */
export function ProductGrid({ products, title = "Shop VELORA", showHeader = true }: { products: Product[]; title?: string; showHeader?: boolean }) {
  const span = 4 - (products.length % 4);
  const fill = span !== 4;

  return (
    <section data-header="light" aria-labelledby={showHeader ? "grid-title" : undefined} aria-label={showHeader ? undefined : "Products"} className="bg-pearl pb-32 pt-10 text-ink md:pb-44">
      <div className="gutter-x mx-auto max-w-[1680px]">
        {showHeader && (
          <div className="mb-16 flex items-end justify-between gap-6 md:mb-24">
            <RevealText as="h2" id="grid-title" className="serif-display text-headline uppercase">
              {title}
            </RevealText>
            <Link href="/shop" className="eyebrow group hidden items-center gap-4 md:inline-flex">
              <span className="link-line">View all</span>
              <ArrowRight className="transition-transform duration-700 group-hover:translate-x-1" />
            </Link>
          </div>
        )}
        <div className="grid grid-cols-1 gap-x-[clamp(1rem,2vw,2rem)] gap-y-16 min-[420px]:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={!showHeader && i < 2} sizes="(min-width: 1024px) 24vw, (min-width: 420px) 48vw, 100vw" />
          ))}
          {fill && (
            <Link
              href="/our-world"
              className={`group hidden flex-col justify-between bg-champagne p-8 lg:flex ${span === 1 ? "aspect-[4/5]" : ""}`}
              style={{ gridColumn: `span ${span}` }}
            >
              <span className="eyebrow opacity-60">The VELORA world</span>
              <span className="serif-display text-4xl leading-tight">
                More objects are being made by hand.
                <span className="mt-6 flex items-center gap-4 text-base italic">
                  <span className="link-line">Discover the atelier</span>
                  <ArrowRight className="transition-transform duration-700 group-hover:translate-x-1" />
                </span>
              </span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
