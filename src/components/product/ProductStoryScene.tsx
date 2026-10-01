import type { Product } from "@/commerce/types";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { RevealText } from "@/components/motion/RevealText";

/** Full-width storytelling beneath the purchase area. */
export function ProductStoryScene({ product }: { product: Product }) {
  const real = product.images.filter((i) => !i.placeholder);
  const wide = real[2] ?? real[1] ?? real[0];
  const second = real[0];
  if (!wide) return null;

  return (
    <section aria-label={`The story of the ${product.title}`} className="mt-32 md:mt-48">
      <div data-header="dark" className="relative h-[85svh] min-h-[520px] overflow-hidden bg-night text-ivory">
        <div className="absolute inset-0 opacity-80">
          <ParallaxImage image={wide} sizes="100vw" className="h-full w-full" speed={0.12} />
        </div>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-night/80 via-night/10 to-transparent" />
        <div className="gutter-x absolute inset-x-0 bottom-0 mx-auto max-w-[1680px] pb-14 md:pb-20">
          <p className="eyebrow mb-6 text-champagne/80">In detail</p>
          <RevealText as="h2" className="serif-display max-w-4xl text-headline uppercase">
            {product.tagline}
          </RevealText>
        </div>
      </div>
      {second && second !== wide && (
        <div data-header="light" className="gutter-x mx-auto grid max-w-[1680px] items-center gap-14 py-28 md:grid-cols-12 md:py-40">
          <MaskReveal direction="left" className="aspect-[4/5] md:col-span-5">
            <ParallaxImage image={second} sizes="(min-width: 768px) 40vw, 100vw" className="h-full w-full" speed={0.06} />
          </MaskReveal>
          <div className="md:col-span-5 md:col-start-8">
            <RevealText as="p" className="serif-display text-title">
              Composed, chased and finished by hand — so that no two {product.title.split(" ").slice(-1)[0].toLowerCase()}s are ever quite the same.
            </RevealText>
            <ul className="mt-10 space-y-3 text-sm opacity-75">
              {product.details.slice(0, 3).map((d) => (
                <li key={d} className="border-t border-espresso/10 pt-3">{d}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
