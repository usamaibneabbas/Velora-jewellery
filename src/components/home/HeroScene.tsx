"use client";

import Image from "next/image";
import { useRef } from "react";
import type { Product } from "@/commerce/types";
import { onIntro } from "@/components/layout/Loader";
import { ButtonLink } from "@/components/ui/Button";
import { EASE, gsap } from "@/lib/gsap";
import { useScene } from "@/lib/motion";

const WORD = "VELORA".split("");

/**
 * SCENE 01 — Hero.
 * Darkness, then the wordmark, then the jewellery emerging into light.
 * On scroll the piece advances toward the viewer while the type recedes upward.
 */
export function HeroScene({ product }: { product: Product }) {
  const ref = useRef<HTMLElement>(null);
  const played = useRef(false);
  const image = product.images[0];

  useScene(ref, ({ desktop, tablet, mobile, reduce }, root) => {
    const q = gsap.utils.selector(root);
    const intro = q("[data-intro]");

    if (reduce) return onIntro(() => gsap.to(intro, { autoAlpha: 1, duration: 0.9, stagger: 0.05 }));

    // ---- Load sequence --------------------------------------------------
    gsap.set(intro, { autoAlpha: 1 });
    gsap.set(q("[data-hero-glow]"), { autoAlpha: 0, scale: 0.85 });
    gsap.set(q("[data-hero-letter]"), { yPercent: 110 });
    gsap.set(q("[data-hero-frame]"), { clipPath: "inset(100% 0% 0% 0%)", y: 60 });
    gsap.set(q("[data-hero-img]"), { scale: 1.28, filter: "brightness(0.15)" });
    gsap.set(q("[data-hero-sweep]"), { autoAlpha: 0 });
    gsap.set(q("[data-hero-copy]"), { y: 24, autoAlpha: 0 });
    gsap.set(q("[data-hero-cue]"), { autoAlpha: 0, y: 12 });

    const tl = gsap.timeline({ paused: true, defaults: { ease: EASE.luxe } });
    tl.to(q("[data-hero-glow]"), { autoAlpha: 1, scale: 1, duration: 2.6 }, 0)
      .to(q("[data-hero-letter]"), { yPercent: 0, duration: 1.8, stagger: 0.07 }, 0.15)
      .to(q("[data-hero-frame]"), { clipPath: "inset(0% 0% 0% 0%)", duration: 1.9, ease: "expo.inOut" }, 0.7)
      .to(q("[data-hero-frame]"), { y: 0, duration: 2.4 }, 0.7)
      .to(q("[data-hero-img]"), { scale: 1.06, filter: "brightness(1)", duration: 2.8 }, 0.75)
      .to(q("[data-hero-sweep]"), { autoAlpha: 1, duration: 1 }, 1.9)
      .to(q("[data-hero-copy]"), { y: 0, autoAlpha: 1, duration: 1.4, stagger: 0.12 }, 1.7)
      .to(q("[data-hero-cue]"), { y: 0, autoAlpha: 1, duration: 1.2 }, 2.4);
    // Play once per visit; if the media context changes later, jump to the end state.
    const off = onIntro(() => {
      if (played.current) tl.progress(1);
      else tl.play();
      played.current = true;
    });

    // ---- Scroll behaviour (separate per device class) --------------------
    const scrub = { trigger: root, start: "top top", end: "bottom top", scrub: true };
    if (desktop || tablet) {
      gsap
        .timeline({ scrollTrigger: scrub, defaults: { ease: "none" } })
        .to(q("[data-hero-frame-wrap]"), { scale: desktop ? 1.32 : 1.2, yPercent: 6, rotate: -1.5 }, 0)
        .to(q("[data-hero-word]"), { yPercent: -55, autoAlpha: 0.15 }, 0)
        .to(q("[data-hero-glow]"), { yPercent: 18 }, 0)
        .to(q("[data-hero-copy]"), { y: -140, autoAlpha: 0 }, 0)
        .to(q("[data-hero-label]"), { y: -90 }, 0);
    }
    if (mobile) {
      gsap
        .timeline({ scrollTrigger: scrub, defaults: { ease: "none" } })
        .to(q("[data-hero-frame-wrap]"), { scale: 1.12 }, 0)
        .to(q("[data-hero-word]"), { yPercent: -30, autoAlpha: 0.2 }, 0);
    }
    // The cue retires as soon as the visitor starts scrolling.
    gsap.to(q("[data-hero-cue]"), {
      autoAlpha: 0,
      immediateRender: false,
      scrollTrigger: { trigger: root, start: "top+=20 top", end: "top+=140 top", scrub: true },
    });

    return () => {
      off();
      tl.kill();
    };
  });

  return (
    <section ref={ref} data-header="dark" aria-label="VELORA" className="relative h-[100svh] min-h-[620px] overflow-hidden bg-night text-ivory">
      {/* Background — warm pool of light */}
      <div
        data-hero-glow
        data-intro
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 55% at 50% 52%, rgba(201,178,140,0.28) 0%, rgba(120,96,66,0.12) 38%, rgba(18,15,12,0) 70%)",
        }}
      />

      {/* Wordmark — behind the jewellery */}
      <div data-hero-word className="pointer-events-none absolute inset-x-0 top-[13%] flex justify-center md:top-1/2 md:-translate-y-1/2">
        <h1 className="serif-display flex overflow-hidden text-[24vw] leading-[0.82] tracking-[0.04em] text-champagne md:text-[21vw]" aria-label="VELORA">
          {WORD.map((l, i) => (
            <span key={i} data-hero-letter data-intro aria-hidden className="inline-block">
              {l}
            </span>
          ))}
        </h1>
      </div>

      {/* Jewellery */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div data-hero-frame-wrap className="relative -mt-[2vh] w-[54vw] will-change-transform md:mt-0 md:w-[26vw] md:max-w-[400px]">
          <div data-hero-frame data-intro className="relative aspect-[582/910] overflow-hidden bg-espresso shadow-[0_60px_120px_-30px_rgba(0,0,0,0.65)]">
            <Image
              data-hero-img
              data-critical
              src={image.src}
              alt={image.alt}
              fill
              preload
              sizes="(min-width: 768px) 26vw, 54vw"
              className="object-cover will-change-transform"
              style={{ objectPosition: image.focal }}
            />
            <div data-hero-sweep className="light-sweep" aria-hidden />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-night/40 via-transparent to-transparent" />
          </div>
          <p data-hero-label data-intro className="eyebrow absolute -right-4 top-6 hidden translate-x-full text-ivory/60 md:block">
            N° 01 — {product.title}
          </p>
        </div>
      </div>

      {/* Supporting copy */}
      <div className="gutter-x absolute inset-x-0 bottom-0 mx-auto flex max-w-[1680px] flex-col items-start justify-between gap-6 pb-10 md:flex-row md:items-end md:pb-12">
        <div>
          <p data-hero-copy data-intro className="serif-display text-3xl italic text-champagne md:text-4xl">
            Jewellery, refined.
          </p>
          <p data-hero-copy data-intro className="eyebrow mt-3 hidden text-ivory/60 md:block">
            Objects of Quiet Distinction
          </p>
        </div>
        <div data-hero-copy data-intro>
          <ButtonLink href="/shop" tone="light" variant="outline">
            Discover the collection
          </ButtonLink>
        </div>
      </div>

      {/* Scroll cue */}
      <div data-hero-cue data-intro aria-hidden className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex">
        <span className="eyebrow text-[10px] text-ivory/60">Scroll to discover</span>
        <span className="relative block h-10 w-px overflow-hidden bg-ivory/15">
          <span className="scroll-line absolute inset-0 bg-ivory/80" />
        </span>
      </div>
    </section>
  );
}
