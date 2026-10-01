"use client";

import { useRef } from "react";
import { RevealText } from "@/components/motion/RevealText";
import { gsap } from "@/lib/gsap";
import { useScene } from "@/lib/motion";

const LETTERS = "VELORA".split("");
// Each letter drifts at its own speed — a slow, almost imperceptible separation.
const DRIFT = [-14, 8, -6, 12, -10, 6];

/** SCENE 08 — Brand statement. Space, typography, and very little else. */
export function BrandStatement() {
  const ref = useRef<HTMLElement>(null);

  useScene(ref, ({ reduce, mobile }, root) => {
    if (reduce) return;
    const letters = gsap.utils.toArray<HTMLElement>("[data-letter]", root);
    letters.forEach((el, i) => {
      gsap.fromTo(
        el,
        { yPercent: DRIFT[i] * (mobile ? 0.5 : 1) },
        { yPercent: -DRIFT[i] * (mobile ? 0.5 : 1), ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } },
      );
    });
    gsap.fromTo(root.querySelector("[data-word]"), { letterSpacing: mobile ? "0.02em" : "0.0em" }, {
      letterSpacing: mobile ? "0.06em" : "0.12em",
      ease: "none",
      scrollTrigger: { trigger: root, start: "top bottom", end: "center center", scrub: true },
    });
  });

  return (
    <section ref={ref} data-header="light" aria-labelledby="statement-title" className="bg-pearl py-40 text-ink md:py-[28vh]">
      <div className="gutter-x mx-auto max-w-[1680px] text-center">
        <p data-word aria-hidden className="serif-display flex justify-center text-[22vw] leading-none text-espresso md:text-[17vw]">
          {LETTERS.map((l, i) => (
            <span key={i} data-letter className="inline-block will-change-transform">
              {l}
            </span>
          ))}
        </p>
        <h2 id="statement-title" className="sr-only">
          VELORA — not simply jewellery
        </h2>
        <RevealText as="p" className="serif-display mx-auto mt-16 max-w-3xl text-3xl leading-snug md:mt-24 md:text-5xl">
          Not simply jewellery. Objects created to become part of how you are remembered.
        </RevealText>
      </div>
    </section>
  );
}
