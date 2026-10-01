import type { Metadata } from "next";
import { getProduct, getProducts } from "@/commerce/products";
import type { ProductImage } from "@/commerce/types";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { RevealText } from "@/components/motion/RevealText";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Our World",
  description: "The VELORA philosophy — design, materials, craft and the experience of receiving a VELORA object.",
  alternates: { canonical: "/our-world" },
};

function Chapter({
  id,
  index,
  title,
  text,
  image,
  reverse,
}: {
  id: string;
  index: string;
  title: string;
  text: string;
  image: ProductImage;
  reverse?: boolean;
}) {
  return (
    <section id={id} data-header="light" aria-labelledby={`${id}-title`} className="gutter-x mx-auto grid max-w-[1680px] items-center gap-12 py-24 md:grid-cols-12 md:py-40">
      <MaskReveal direction={reverse ? "right" : "left"} className={`aspect-[4/5] md:col-span-6 ${reverse ? "md:order-2 md:col-start-7" : ""}`}>
        <ParallaxImage image={image} sizes="(min-width: 768px) 50vw, 100vw" className="h-full w-full" speed={0.1} />
      </MaskReveal>
      <div className={`md:col-span-5 ${reverse ? "md:order-1 md:col-start-1" : "md:col-start-8"}`}>
        <p className="eyebrow mb-6 opacity-50">{index}</p>
        <RevealText as="h2" id={`${id}-title`} className="serif-display text-[clamp(2.25rem,4.2vw,4.5rem)] uppercase leading-[0.95]">
          {title}
        </RevealText>
        <RevealText as="p" split="words" className="mt-8 max-w-sm text-[15px] leading-relaxed opacity-75">
          {text}
        </RevealText>
      </div>
    </section>
  );
}

export default async function OurWorldPage() {
  const all = await getProducts();
  const ailes = (await getProduct("ailes-cuff")) ?? all[0];
  const etoile = (await getProduct("etoile-cuff")) ?? all[0];

  return (
    <div className="bg-ivory text-ink">
      <section data-header="dark" className="relative flex h-[100svh] min-h-[600px] items-end overflow-hidden bg-night pb-16 text-ivory">
        <div className="absolute inset-0 opacity-70">
          <ParallaxImage image={etoile.images[0]} sizes="100vw" className="h-full w-full" speed={0.15} priority />
        </div>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-night/40" />
        <div className="gutter-x relative mx-auto w-full max-w-[1680px]">
          <p className="eyebrow mb-6 text-champagne/80">VELORA</p>
          <RevealText as="h1" split="chars" className="serif-display text-display uppercase">
            Our World
          </RevealText>
        </div>
      </section>

      <section data-header="light" aria-labelledby="philosophy-title" className="gutter-x mx-auto max-w-[1680px] py-32 md:py-56">
        <p className="eyebrow mb-10 opacity-50">Philosophy</p>
        <h2 id="philosophy-title" className="sr-only">Philosophy</h2>
        <RevealText as="p" className="serif-display max-w-5xl text-[clamp(2rem,4.6vw,4.75rem)] leading-[1.05]">
          We believe the most memorable objects are the quiet ones. Pieces that do not compete with the person wearing them — they complete the picture.
        </RevealText>
      </section>

      <Chapter
        id="design"
        index="01 — Design"
        title="Composed, not decorated"
        text="Every VELORA design begins with proportion. Motifs from vintage Afghan metalwork — winged forms, chased stars, beaded borders — are arranged with restraint, so each element has room to be seen."
        image={ailes.images[0]}
      />
      <Chapter
        id="materials"
        index="02 — Materials"
        title="Stone, metal, light"
        text="Turquoise-style and lapis-style cabochons, coral-red accents and antiqued silver-tone metal. The recesses are darkened by hand so that every raised line catches the light."
        image={etoile.images[2] ?? etoile.images[0]}
        reverse
      />
      <Chapter
        id="craft"
        index="03 — Craft"
        title="Finished by hand"
        text="Our pieces are made by hand in small numbers. The slight variations you will find from one piece to the next are not flaws — they are the signature of the hand that made it."
        image={etoile.images[1] ?? etoile.images[0]}
      />

      <section id="packaging" data-header="dark" aria-labelledby="packaging-title" className="bg-espresso py-32 text-ivory md:py-48">
        <div className="gutter-x mx-auto grid max-w-[1680px] items-center gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="eyebrow mb-6 text-champagne/70">04 — Packaging</p>
            <RevealText as="h2" id="packaging-title" className="serif-display text-headline uppercase">
              Before it is opened
            </RevealText>
            <RevealText as="p" split="words" className="mt-8 max-w-sm text-[15px] leading-relaxed text-ivory/75">
              Each piece arrives in a rigid VELORA keepsake box with a soft pouch and care card — ready to be kept, or given.
            </RevealText>
          </div>
          <MaskReveal direction="center" className="md:col-span-6 md:col-start-7">
            <div className="relative flex aspect-[5/4] flex-col items-center justify-center bg-night text-champagne shadow-[0_60px_120px_-50px_rgba(0,0,0,0.8)]">
              <div aria-hidden className="absolute inset-[5%] border border-gold/40" />
              <span className="serif-display text-5xl tracking-[0.42em] md:text-7xl">VELORA</span>
              <span className="eyebrow mt-4 text-[9px] text-gold-soft/80">Objects of Quiet Distinction</span>
            </div>
          </MaskReveal>
        </div>
      </section>

      <section data-header="light" className="gutter-x mx-auto flex max-w-[1680px] flex-col items-center py-32 text-center md:py-48">
        <RevealText as="h2" className="serif-display text-headline uppercase">
          Find your VELORA
        </RevealText>
        <div className="mt-12">
          <ButtonLink href="/shop">Explore the collection</ButtonLink>
        </div>
      </section>
    </div>
  );
}
