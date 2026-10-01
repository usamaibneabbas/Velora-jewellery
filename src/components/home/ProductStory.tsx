"use client";

import Image from "next/image";
import { useRef } from "react";
import type { Product } from "@/commerce/types";
import { gsap } from "@/lib/gsap";
import { useScene } from "@/lib/motion";

const STAGES = ["Front", "Turn", "Detail", "Story"];

/**
 * SCENE 02 — Scroll transformation.
 * A pinned stage: the piece holds the centre while scroll turns it, draws the
 * eye into a macro view, then steps aside to let the words in. The background
 * moves from night to ivory, carrying the visitor out of the hero.
 *
 * Static layout (reduced motion / no JS) is the final state: image left, text right.
 */
export function ProductStory({ product }: { product: Product }) {
  const ref = useRef<HTMLElement>(null);
  const front = product.images[1] ?? product.images[0];
  const detail = product.images[2] ?? product.images[0];

  useScene(ref, ({ desktop, tablet, mobile, reduce }, root) => {
    if (reduce) return;
    const q = gsap.utils.selector(root);
    const frame = q("[data-story-frame]")[0];
    const isWide = desktop || tablet;

    // Offset that places the frame in the centre of the viewport.
    const centerX = () => {
      const r = frame.getBoundingClientRect();
      return window.innerWidth / 2 - (r.left - (gsap.getProperty(frame, "x") as number) + r.width / 2);
    };
    // Measured relative to the section, which sits at the top of the viewport while pinned.
    const centerY = () => {
      const r = frame.getBoundingClientRect();
      const top = r.top - root.getBoundingClientRect().top - (gsap.getProperty(frame, "y") as number);
      return window.innerHeight / 2 - (top + r.height / 2);
    };

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: mobile ? "+=170%" : "+=320%",
        pin: true,
        scrub: mobile ? 0.6 : 1,
        invalidateOnRefresh: true,
        onUpdate(self) {
          // The header follows the background from dark to light.
          root.dataset.header = self.progress > 0.55 ? "light" : "dark";
          const stage = Math.min(STAGES.length - 1, Math.floor(self.progress * STAGES.length));
          q("[data-stage]").forEach((el, i) => el.classList.toggle("opacity-100", i === stage));
        },
      },
    });

    tl.set(root, { backgroundColor: "#120f0c", color: "#f4efe6" }, 0)
      .fromTo(frame, { x: isWide ? centerX : 0, y: isWide ? 0 : centerY, scale: isWide ? 0.92 : 0.95 }, { scale: 1, duration: 1 }, 0)
      // 25–50% — the piece turns
      .to(frame, { rotateY: isWide ? -16 : -10, rotateZ: -2, duration: 1 }, 1)
      .fromTo(q("[data-story-light]"), { xPercent: -60, autoAlpha: 0 }, { xPercent: 40, autoAlpha: 1, duration: 1 }, 1)
      .to(root, { backgroundColor: "#3a3027", duration: 1 }, 1)
      // 50–75% — macro approaches
      .to(frame, { rotateY: 0, rotateZ: 0, scale: isWide ? 1.2 : 1.12, duration: 1 }, 2)
      .to(q("[data-story-front]"), { scale: 1.7, autoAlpha: 0, duration: 1 }, 2)
      .fromTo(q("[data-story-detail]"), { scale: 1.45, autoAlpha: 0 }, { scale: 1.05, autoAlpha: 1, duration: 1 }, 2)
      .to(q("[data-story-light]"), { autoAlpha: 0, duration: 0.6 }, 2.2)
      .to(root, { backgroundColor: "#f4efe6", color: "#2a221b", duration: 1 }, 2)
      // 75–100% — piece steps aside, words arrive
      .to(frame, { x: 0, y: 0, scale: 1, duration: 1 }, 3)
      .from(q("[data-story-line]"), { yPercent: 110, duration: 0.6, stagger: 0.18 }, 3.2)
      .from(q("[data-story-copy]"), { autoAlpha: 0, y: 20, duration: 0.5, stagger: 0.1 }, 3.4)
      .to({}, { duration: 0.35 });

    if (isWide) {
      // Pointer adds a whisper of parallax to the frame while pinned.
      const rx = gsap.quickTo(q("[data-story-tilt]")[0], "rotateX", { duration: 1.2, ease: "power3.out" });
      const ry = gsap.quickTo(q("[data-story-tilt]")[0], "rotateY", { duration: 1.2, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        rx(((e.clientY / window.innerHeight) - 0.5) * -4);
        ry(((e.clientX / window.innerWidth) - 0.5) * 6);
      };
      root.addEventListener("pointermove", move);
      return () => root.removeEventListener("pointermove", move);
    }
  });

  return (
    <section
      ref={ref}
      data-header="dark"
      aria-labelledby="story-title"
      className="relative overflow-hidden bg-ivory text-ink [perspective:1400px]"
    >
      <div className="gutter-x mx-auto grid min-h-[100svh] max-w-[1680px] grid-rows-[auto_auto] content-center items-center gap-10 py-24 md:grid-cols-2 md:grid-rows-1 md:gap-16 md:py-0">
        {/* Frame */}
        <div className="flex justify-center">
          <div data-story-frame className="relative w-[72vw] [transform-style:preserve-3d] will-change-transform md:w-[34vw] md:max-w-[520px]">
            <div data-story-tilt className="relative aspect-square overflow-hidden bg-champagne shadow-[0_50px_100px_-40px_rgba(18,15,12,0.55)]">
              <Image
                data-story-front
                src={front.src}
                alt={front.alt}
                fill
                sizes="(min-width: 768px) 34vw, 72vw"
                className="object-cover will-change-transform"
                style={{ objectPosition: front.focal }}
              />
              <Image
                data-story-detail
                src={detail.src}
                alt={detail.alt}
                fill
                sizes="(min-width: 768px) 46vw, 90vw"
                className="object-cover opacity-0 will-change-transform"
                style={{ objectPosition: detail.focal }}
              />
              <div
                data-story-light
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 mix-blend-soft-light"
                style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,250,240,0.9) 50%, transparent 70%)" }}
              />
            </div>
          </div>
        </div>

        {/* Words */}
        <div className="relative z-10 max-w-xl md:pl-6">
          <p data-story-copy className="eyebrow mb-8 opacity-60">{product.title}</p>
          <h2 id="story-title" className="serif-display text-headline uppercase">
            <span className="-mb-[0.12em] block overflow-hidden pb-[0.12em] pr-[0.1em]"><span data-story-line className="block">Made to be</span></span>
            <span className="-mb-[0.12em] block overflow-hidden pb-[0.12em] pr-[0.1em]"><span data-story-line className="block">noticed.</span></span>
            <span className="-mb-[0.12em] block overflow-hidden pb-[0.12em] pr-[0.1em]"><span data-story-line className="block italic text-gold">Never made</span></span>
            <span className="-mb-[0.12em] block overflow-hidden pb-[0.12em] pr-[0.1em]"><span data-story-line className="block italic text-gold">to shout.</span></span>
          </h2>
          <p data-story-copy className="mt-8 max-w-sm text-base leading-relaxed opacity-75">
            Every VELORA object is shaped by hand, so that its detail rewards a second look rather than demanding the first.
          </p>
        </div>
      </div>

      {/* Stage index */}
      <ol aria-hidden className="gutter-x absolute bottom-8 left-0 hidden gap-6 md:flex">
        {STAGES.map((s, i) => (
          <li key={s} data-stage className={`eyebrow text-[10px] opacity-30 transition-opacity duration-500 ${i === 0 ? "opacity-100" : ""}`}>
            0{i + 1} — {s}
          </li>
        ))}
      </ol>
    </section>
  );
}
