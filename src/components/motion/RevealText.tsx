"use client";

import { type ReactNode, useRef } from "react";
import { EASE, gsap, SplitText } from "@/lib/gsap";
import { useScene } from "@/lib/motion";

interface RevealTextProps {
  as?: "div" | "p" | "span" | "h1" | "h2" | "h3" | "h4";
  children: ReactNode;
  className?: string;
  /** lines: masked line rise · words: soft word stagger · chars: letter stagger */
  split?: "lines" | "words" | "chars";
  delay?: number;
  stagger?: number;
  duration?: number;
  /** ScrollTrigger start. */
  start?: string;
  id?: string;
}

/**
 * Editorial text reveal. Lines rise from behind a mask; words and letters
 * stagger subtly. Reduced-motion users receive a gentle fade.
 */
export function RevealText({
  as = "div",
  children,
  className,
  split = "lines",
  delay = 0,
  stagger,
  duration = 1.25,
  start = "top 86%",
  id,
}: RevealTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const Tag = as as "div";

  useScene(ref, ({ reduce }, el) => {
    if (reduce) {
      gsap.from(el, { autoAlpha: 0, duration: 0.8, delay, scrollTrigger: { trigger: el, start, once: true } });
      return;
    }
    const st = SplitText.create(el, {
      type: split === "chars" ? "words,chars" : split === "words" ? "words" : "lines",
      mask: split === "lines" ? "lines" : undefined,
      linesClass: "reveal-line",
      autoSplit: true,
      onSplit(self) {
        const targets = split === "chars" ? self.chars : split === "words" ? self.words : self.lines;
        return gsap.from(targets, {
          yPercent: split === "lines" ? 105 : 40,
          autoAlpha: split === "lines" ? 1 : 0,
          duration,
          delay,
          ease: EASE.luxe,
          stagger: stagger ?? (split === "chars" ? 0.025 : split === "words" ? 0.04 : 0.09),
          scrollTrigger: { trigger: el, start, once: true },
        });
      },
    });
    return () => st.revert();
  });

  return (
    <Tag ref={ref} className={className} id={id}>
      {children}
    </Tag>
  );
}
