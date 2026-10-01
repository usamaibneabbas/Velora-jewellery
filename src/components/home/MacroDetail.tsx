"use client";

import Image from "next/image";
import { useRef } from "react";
import type { ProductImage } from "@/commerce/types";
import { gsap } from "@/lib/gsap";
import { useScene } from "@/lib/motion";

/**
 * SCENE 05 — The art is in the detail.
 * Begins as an extreme close-up; scroll pulls the lens back to reveal the piece
 * while the statement assembles across the image.
 */
export function MacroDetail({ image }: { image: ProductImage }) {
  const ref = useRef<HTMLElement>(null);

  useScene(ref, ({ mobile, reduce }, root) => {
    if (reduce) return;
    const q = gsap.utils.selector(root);
    gsap
      .timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root, start: "top top", end: mobile ? "+=110%" : "+=170%", pin: true, scrub: mobile ? 0.5 : 1 },
      })
      .fromTo(q("[data-macro-img]"), { scale: mobile ? 1.7 : 2.4 }, { scale: 1, duration: 3 }, 0)
      .fromTo(q("[data-macro-veil]"), { autoAlpha: 0.35 }, { autoAlpha: 1, duration: 3 }, 0)
      .from(q("[data-macro-line]"), { yPercent: 110, duration: 0.7, stagger: 0.55, ease: "power2.out" }, 0.4)
      .from(q("[data-macro-copy]"), { autoAlpha: 0, y: 24, duration: 0.6 }, 2.2);
  });

  return (
    <section ref={ref} data-header="dark" aria-labelledby="detail-title" className="relative h-[100svh] min-h-[560px] overflow-hidden bg-night text-ivory">
      <div className="absolute inset-0">
        <Image
          data-macro-img
          src={image.src}
          alt={image.alt}
          fill
          sizes="100vw"
          className="object-cover will-change-transform"
          style={{ objectPosition: "50% 45%", transformOrigin: "53% 46%" }}
        />
        <div data-macro-veil aria-hidden className="absolute inset-0 bg-gradient-to-r from-night/90 via-night/55 to-night/10" />
      </div>
      <div className="gutter-x relative mx-auto flex h-full max-w-[1680px] flex-col justify-center">
        <h2 id="detail-title" className="serif-display text-[17vw] uppercase leading-[0.86] md:text-[9.5vw]">
          <span className="-mb-[0.1em] block overflow-hidden pb-[0.1em]"><span data-macro-line className="block">The art</span></span>
          <span className="-mb-[0.1em] block overflow-hidden pb-[0.1em] md:pl-[14vw]"><span data-macro-line className="block italic text-champagne">is in</span></span>
          <span className="-mb-[0.1em] block overflow-hidden pb-[0.1em] md:pl-[4vw]"><span data-macro-line className="block">the detail.</span></span>
        </h2>
        <p data-macro-copy className="mt-10 max-w-sm text-[15px] leading-relaxed text-ivory/85 md:ml-[4vw] md:mt-14">
          Beaded borders raised grain by grain. Star motifs chased into the metal by hand. Recesses darkened so every edge catches the light.
        </p>
      </div>
    </section>
  );
}
