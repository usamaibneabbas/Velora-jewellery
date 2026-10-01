import type { ProductImage } from "@/commerce/types";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { RevealText } from "@/components/motion/RevealText";

export function CollectionHero({ title, eyebrow, description, image }: { title: string; eyebrow: string; description: string; image: ProductImage }) {
  return (
    <section data-header="light" className="bg-pearl pt-[calc(var(--header-h)+10vh)] text-ink">
      <div className="gutter-x mx-auto max-w-[1680px]">
        <p className="eyebrow mb-6 opacity-60">{eyebrow}</p>
        <RevealText as="h1" split="chars" className="serif-display text-display uppercase">
          {title}
        </RevealText>
        <div className="mt-10 grid gap-10 md:grid-cols-12">
          <RevealText as="p" split="words" className="max-w-sm text-sm leading-relaxed opacity-70 md:col-span-3">
            {description}
          </RevealText>
          <MaskReveal direction="up" className="aspect-[16/10] md:col-span-9 md:aspect-[21/9]">
            <ParallaxImage image={image} sizes="(min-width: 768px) 75vw, 100vw" className="h-full w-full" speed={0.12} priority />
          </MaskReveal>
        </div>
      </div>
    </section>
  );
}
