"use client";

import Image from "next/image";
import { useRef } from "react";
import type { ProductImage } from "@/commerce/types";
import { RevealText } from "@/components/motion/RevealText";
import { gsap } from "@/lib/gsap";
import { useScene } from "@/lib/motion";

const PILLARS = [
  { label: "Form", text: "An open cuff, balanced to sit lightly and adjust to the wrist." },
  { label: "Texture", text: "Beaded rims, chased motifs and oxidised grounds give the surface depth." },
  { label: "Light", text: "Stones are set to catch light at the wrist's natural angle." },
  { label: "Detail", text: "Each piece is finished by hand. No two are ever quite the same." },
];

/**
 * SCENE 06 — Crafted with intention.
 * Three depth layers move at different speeds (background texture 0.4x,
 * images 0.8x, text 1x, foreground ornament 1.1x). Pillars arrive in stages.
 */
export function CraftSection({ images }: { images: [ProductImage, ProductImage, ProductImage] }) {
  const ref = useRef<HTMLElement>(null);

  useScene(ref, ({ reduce, mobile }, root) => {
    if (reduce) return;
    const q = gsap.utils.selector(root);
    // Depth system: data-depth = scroll speed relative to the page (1 = locked to page).
    q("[data-depth]").forEach((el) => {
      const depth = parseFloat(el.dataset.depth ?? "1");
      const travel = (1 - depth) * (mobile ? 160 : 360);
      gsap.fromTo(el, { y: -travel / 2 }, { y: travel / 2, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } });
    });
    q("[data-pillar]").forEach((el) => {
      gsap.from(el.children, {
        y: 40,
        autoAlpha: 0,
        duration: 1.3,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });
      gsap.from(el.querySelector("[data-rule]"), { scaleX: 0, transformOrigin: "left", duration: 1.6, ease: "expo.inOut", scrollTrigger: { trigger: el, start: "top 82%", once: true } });
    });
  });

  return (
    <section ref={ref} data-header="light" aria-labelledby="craft-title" className="grain relative overflow-hidden bg-ivory py-32 text-ink md:py-48">
      {/* Background texture layer (0.4x) */}
      <div
        data-depth="0.4"
        aria-hidden
        className="pointer-events-none absolute -right-[12vw] top-[10%] h-[70%] w-[60vw] opacity-[0.09] mix-blend-multiply [mask-image:radial-gradient(closest-side,black_35%,transparent)]"
      >
        <Image src={images[2].src} alt="" fill sizes="55vw" className="object-cover grayscale" />
      </div>

      <div className="gutter-x relative z-[2] mx-auto grid max-w-[1680px] gap-20 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-[18vh]">
            <p className="eyebrow mb-8 opacity-60">Craftsmanship</p>
            <RevealText as="h2" id="craft-title" className="serif-display text-headline uppercase">
              Crafted with intention
            </RevealText>
            <RevealText as="p" split="words" className="mt-8 max-w-sm text-sm leading-relaxed opacity-70">
              VELORA pieces carry the vocabulary of vintage Afghan metalwork — composed for today, finished by hand.
            </RevealText>
            {/* Images (0.8x) */}
            <div className="relative mt-16 hidden h-[46vh] md:block">
              <div data-depth="0.8" className="absolute left-0 top-0 aspect-[562/330] w-[78%] overflow-hidden shadow-[0_40px_80px_-40px_rgba(27,22,17,0.5)]">
                <Image src={images[0].src} alt={images[0].alt} fill sizes="30vw" className="object-cover" />
              </div>
              <div data-depth="1.1" className="absolute bottom-0 right-0 aspect-[7/4] w-[62%] overflow-hidden shadow-[0_40px_80px_-30px_rgba(27,22,17,0.55)]">
                <Image src={images[1].src} alt={images[1].alt} fill sizes="26vw" className="object-cover" />
              </div>
            </div>
          </div>
        </div>

        <ol className="md:col-span-6 md:col-start-7">
          {PILLARS.map((p, i) => (
            <li key={p.label} data-pillar className="relative pb-20 pt-10 md:pb-[18vh] md:last:pb-10">
              <span data-rule aria-hidden className="absolute left-0 right-0 top-0 block h-px bg-espresso/15" />
              <p className="eyebrow text-[10px] opacity-50">0{i + 1}</p>
              <h3 className="serif-display mt-4 text-6xl uppercase md:text-8xl">{p.label}</h3>
              <p className="mt-5 max-w-sm text-sm leading-relaxed opacity-70">{p.text}</p>
            </li>
          ))}
          <li className="relative aspect-[7/4] overflow-hidden md:hidden">
            <Image src={images[1].src} alt={images[1].alt} fill sizes="90vw" className="object-cover" />
          </li>
        </ol>
      </div>
    </section>
  );
}
