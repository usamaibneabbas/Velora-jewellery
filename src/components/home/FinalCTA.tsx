"use client";

import Image from "next/image";
import { useRef } from "react";
import type { ProductImage } from "@/commerce/types";
import { RevealText } from "@/components/motion/RevealText";
import { ButtonLink } from "@/components/ui/Button";
import { gsap } from "@/lib/gsap";
import { useScene } from "@/lib/motion";

/** SCENE 12 — Find your VELORA. The image settles as the story comes to rest. */
export function FinalCTA({ image }: { image: ProductImage }) {
  const ref = useRef<HTMLElement>(null);

  useScene(ref, ({ reduce, mobile }, root) => {
    if (reduce) return;
    gsap.fromTo(
      root.querySelector("[data-final-img]"),
      { scale: mobile ? 1.12 : 1.25, yPercent: -6 },
      { scale: 1, yPercent: 4, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom bottom", scrub: true } },
    );
  });

  return (
    <section ref={ref} data-header="dark" aria-labelledby="final-title" className="relative h-[100svh] min-h-[600px] overflow-hidden bg-night text-ivory">
      <div className="absolute inset-0">
        <Image data-final-img src={image.src} alt={image.alt} fill sizes="100vw" className="object-cover will-change-transform" style={{ objectPosition: image.focal }} />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-night/70 via-night/35 to-night/80" />
        <div className="light-sweep opacity-60" aria-hidden />
      </div>
      <div className="gutter-x relative flex h-full flex-col items-center justify-center text-center">
        <p className="eyebrow mb-8 text-champagne/80">The collection awaits</p>
        <RevealText as="h2" id="final-title" split="chars" className="serif-display text-display uppercase">
          Find your VELORA
        </RevealText>
        <div className="mt-14">
          <ButtonLink href="/shop" tone="light" variant="solid">
            Explore the collection
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
