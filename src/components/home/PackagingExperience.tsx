"use client";

import Image from "next/image";
import { useRef } from "react";
import type { ProductImage } from "@/commerce/types";
import { gsap } from "@/lib/gsap";
import { useScene } from "@/lib/motion";

/**
 * SCENE 10 — The VELORA experience.
 * A jewellery box built from layers: scroll lifts and tilts the lid away,
 * light falls into the box, and the piece is revealed on its silk bed.
 * (Swap in packaging photography later by replacing the lid/box faces.)
 */
export function PackagingExperience({ image }: { image: ProductImage }) {
  const ref = useRef<HTMLElement>(null);

  useScene(ref, ({ reduce, mobile }, root) => {
    const q = gsap.utils.selector(root);
    if (reduce) {
      gsap.set(q("[data-lid]"), { yPercent: -112, autoAlpha: 0.0 });
      return;
    }
    gsap
      .timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root, start: "top top", end: mobile ? "+=110%" : "+=180%", pin: true, scrub: mobile ? 0.5 : 1 },
      })
      .fromTo(q("[data-box]"), { scale: 0.86, y: 40 }, { scale: 1, y: 0, duration: 1 }, 0)
      .to(q("[data-lid]"), { rotateX: 58, yPercent: -18, duration: 1, ease: "power1.in" }, 0.6)
      .to(q("[data-lid]"), { yPercent: -125, autoAlpha: 0, duration: 1.1, ease: "power2.inOut" }, 1.4)
      .fromTo(q("[data-inner-light]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 1.2)
      .fromTo(q("[data-piece]"), { scale: 1.18, filter: "brightness(0.35)" }, { scale: 1, filter: "brightness(1)", duration: 1.4 }, 1.3)
      .from(q("[data-pack-copy]"), { autoAlpha: 0, y: 30, duration: 0.7, stagger: 0.15 }, 2.2)
      .to({}, { duration: 0.3 });
  });

  return (
    <section ref={ref} data-header="light" aria-labelledby="pack-title" className="relative overflow-hidden bg-champagne text-ink">
      <div className="gutter-x mx-auto grid min-h-[100svh] max-w-[1680px] items-center gap-12 py-24 md:grid-cols-12 md:py-0">
        <div className="order-2 md:order-1 md:col-span-4">
          <p data-pack-copy className="eyebrow mb-6 opacity-60">Packaging</p>
          <h2 id="pack-title" data-pack-copy className="serif-display text-title uppercase md:text-[clamp(2.5rem,4.6vw,5rem)]">
            The VELORA experience
          </h2>
          <p data-pack-copy className="mt-8 max-w-xs text-sm leading-relaxed opacity-75">
            Created to feel exceptional before it is even opened. Every piece arrives in a rigid keepsake box, wrapped and ready to be given.
          </p>
        </div>

        {/* The box */}
        <div className="order-1 flex justify-center md:order-2 md:col-span-7 md:col-start-6 [perspective:1600px]">
          <div data-box className="relative aspect-[5/4] w-[86vw] md:w-[44vw] md:max-w-[640px]">
            {/* Base / tray */}
            <div className="absolute inset-0 bg-espresso p-[6%] shadow-[0_70px_120px_-50px_rgba(27,22,17,0.7)]">
              <div className="relative h-full w-full overflow-hidden bg-[#efe6d6] shadow-[inset_0_12px_30px_rgba(27,22,17,0.45)]">
                <Image data-piece src={image.src} alt={image.alt} fill sizes="(min-width: 768px) 40vw, 80vw" className="object-cover" style={{ objectPosition: image.focal }} />
                <div
                  data-inner-light
                  aria-hidden
                  className="absolute inset-0 mix-blend-soft-light"
                  style={{ background: "radial-gradient(60% 70% at 50% 30%, rgba(255,248,232,0.85), transparent 70%)" }}
                />
                <div aria-hidden className="absolute inset-0 shadow-[inset_0_0_60px_rgba(27,22,17,0.55)]" />
              </div>
            </div>
            {/* Lid */}
            <div
              data-lid
              className="absolute -inset-[2%] flex origin-top flex-col items-center justify-center bg-espresso text-champagne shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] [transform-style:preserve-3d] will-change-transform"
            >
              <div aria-hidden className="absolute inset-[5%] border border-gold/40" />
              <span className="serif-display text-4xl tracking-[0.42em] md:text-6xl">VELORA</span>
              <span className="eyebrow mt-4 text-[9px] text-gold-soft/80">Objects of Quiet Distinction</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
