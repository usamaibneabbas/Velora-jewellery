"use client";

/**
 * Single registration point for GSAP plugins.
 * Import gsap / ScrollTrigger / SplitText from here — never from "gsap" directly —
 * so plugins are always registered exactly once.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  gsap.defaults({ ease: "power3.out", duration: 1.1 });
  // Scenes share choreography between WebGL and 2D fallbacks; absent layers are expected.
  gsap.config({ nullTargetWarn: false });
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger, SplitText, useGSAP };

/** Shared motion vocabulary — slow, deliberate, never springy. */
export const EASE = {
  luxe: "expo.out",
  soft: "power3.out",
  silk: "power2.inOut",
  none: "none",
} as const;

/**
 * Media conditions for gsap.matchMedia(). Each scene defines its own
 * behaviour per device class instead of shrinking the desktop animation.
 */
export const MEDIA = {
  desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  tablet: "(min-width: 768px) and (max-width: 1023px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
} as const;

export type MediaConditions = { [K in keyof typeof MEDIA]: boolean };
