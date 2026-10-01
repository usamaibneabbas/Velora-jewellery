"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Small, quiet custom cursor — desktop fine pointers only.
 * Expands over interactive elements; shows "VIEW" over [data-cursor="view"].
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const el = dot.current;
    if (!mq.matches || !el) return;
    document.documentElement.classList.add("has-custom-cursor");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const xTo = gsap.quickTo(el, "x", { duration: reduce ? 0 : 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: reduce ? 0 : 0.35, ease: "power3.out" });
    let state = "";

    const setState = (next: string) => {
      if (next === state) return;
      state = next;
      gsap.to(el, {
        width: next === "view" ? 84 : next === "link" ? 38 : 8,
        height: next === "view" ? 84 : next === "link" ? 38 : 8,
        backgroundColor: next === "view" ? "rgba(27,22,17,0.82)" : next === "link" ? "rgba(255,255,255,0)" : "rgba(27,22,17,1)",
        borderColor: next === "link" ? "rgba(168,137,92,0.9)" : "rgba(168,137,92,0)",
        duration: 0.5,
        ease: "expo.out",
      });
      gsap.to(label.current, { autoAlpha: next === "view" ? 1 : 0, duration: 0.3 });
    };

    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      const t = e.target as HTMLElement | null;
      if (t?.closest("[data-cursor='view']")) setState("view");
      else if (t?.closest("a, button, [role='button'], input, label, select, textarea")) setState("link");
      else setState("default");
    };
    const leave = () => gsap.to(el, { autoAlpha: 0, duration: 0.3 });
    const enter = () => gsap.to(el, { autoAlpha: 1, duration: 0.3 });

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    document.addEventListener("pointerenter", enter);
    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      document.removeEventListener("pointerenter", enter);
    };
  }, []);

  // Reset to the default state when the route changes.
  useEffect(() => {
    if (dot.current) gsap.to(dot.current, { width: 8, height: 8, backgroundColor: "rgba(27,22,17,1)", duration: 0.3 });
  }, [pathname]);

  return (
    <div
      ref={dot}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[200] hidden h-2 w-2 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-espresso mix-blend-normal [@media(hover:hover)_and_(pointer:fine)]:flex"
      style={{ borderColor: "rgba(168,137,92,0)" }}
    >
      <span ref={label} className="eyebrow text-[9px] text-ivory opacity-0">
        View
      </span>
    </div>
  );
}
