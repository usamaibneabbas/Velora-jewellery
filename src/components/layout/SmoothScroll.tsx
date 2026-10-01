"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { scroll } from "@/lib/scroll";

/**
 * Lenis smooth scrolling, driven by the GSAP ticker so ScrollTrigger and
 * scroll position are always in sync. The lerp is kept high enough that the
 * page responds immediately — premium, never floaty. Native scrolling is kept
 * on touch devices and for users who prefer reduced motion.
 */
export function SmoothScroll() {
  // Recalculate every trigger once fonts and images have settled the layout.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    if (document.readyState !== "complete") window.addEventListener("load", refresh, { once: true });
    return () => window.removeEventListener("load", refresh);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, smoothWheel: true, syncTouch: false });
    scroll.set(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      scroll.set(null);
    };
  }, []);

  return null;
}
