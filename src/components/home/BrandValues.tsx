"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useScene } from "@/lib/motion";

const VALUES = [
  { title: "Considered design", text: "Nothing is added that does not earn its place." },
  { title: "Refined detail", text: "The smallest edge is finished with the same care as the whole." },
  { title: "Timeless expression", text: "Pieces made to outlast seasons, and to be passed on." },
];

/** SCENE 11 — Values. Typography carries it: each statement brightens into focus as it passes. */
export function BrandValues() {
  const ref = useRef<HTMLElement>(null);

  useScene(ref, ({ reduce }, root) => {
    if (reduce) return;
    gsap.utils.toArray<HTMLElement>("[data-value]", root).forEach((el) => {
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: "top 85%", end: "top 40%", scrub: true } })
        .fromTo(el.querySelector("[data-value-title]"), { opacity: 0.12, x: -24 }, { opacity: 1, x: 0, ease: "none" }, 0)
        .fromTo(el.querySelector("[data-value-rule]"), { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0)
        .fromTo(el.querySelector("[data-value-text]"), { opacity: 0 }, { opacity: 0.7, ease: "none" }, 0.4);
    });
  });

  return (
    <section ref={ref} data-header="light" aria-label="Our values" className="bg-ivory py-32 text-ink md:py-48">
      <ul className="gutter-x mx-auto max-w-[1680px]">
        {VALUES.map((v, i) => (
          <li key={v.title} data-value className="relative grid gap-4 py-12 md:grid-cols-12 md:items-end md:py-16">
            <span data-value-rule aria-hidden className="absolute inset-x-0 top-0 h-px origin-left bg-espresso/15" />
            <span className="eyebrow text-[10px] opacity-50 md:col-span-1">0{i + 1}</span>
            <h3 data-value-title className="serif-display text-[12vw] uppercase leading-[0.9] md:col-span-8 md:text-[6.4vw]">
              {v.title}
            </h3>
            <p data-value-text className="max-w-xs text-sm leading-relaxed opacity-70 md:col-span-3 md:justify-self-end">
              {v.text}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
