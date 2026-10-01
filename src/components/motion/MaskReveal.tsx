"use client";

import { type ReactNode, useRef } from "react";
import { EASE, gsap } from "@/lib/gsap";
import { useScene } from "@/lib/motion";

type Direction = "up" | "down" | "left" | "right" | "center";

const FROM: Record<Direction, string> = {
  up: "inset(100% 0% 0% 0%)",
  down: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
  center: "inset(18% 22% 18% 22%)",
};

interface MaskRevealProps {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  duration?: number;
  start?: string;
  /** Starting scale of the inner content — creates a lens-settling feel. */
  scale?: number;
}

/**
 * Clip-path image reveal with an inner scale settle.
 * Wrap images; the element with [data-mask-inner] receives the scale.
 */
export function MaskReveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
  duration = 1.6,
  start = "top 82%",
  scale = 1.14,
}: MaskRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useScene(ref, ({ reduce, mobile }, el) => {
    const inner = el.querySelector<HTMLElement>("[data-mask-inner]");
    if (reduce) {
      gsap.from(el, { autoAlpha: 0, duration: 0.8, scrollTrigger: { trigger: el, start, once: true } });
      return;
    }
    const tl = gsap.timeline({ delay, scrollTrigger: { trigger: el, start, once: true } });
    tl.fromTo(
      el,
      { clipPath: FROM[direction] },
      { clipPath: "inset(0% 0% 0% 0%)", duration: mobile ? duration * 0.8 : duration, ease: "expo.inOut" },
    );
    if (inner) tl.from(inner, { scale, duration: duration * 1.25, ease: EASE.luxe }, 0);
  });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div data-mask-inner className="h-full w-full will-change-transform">
        {children}
      </div>
    </div>
  );
}
