"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export const INTRO_EVENT = "velora:intro";

/** Resolves when the intro may begin (loader finished or skipped). */
export function onIntro(cb: () => void): () => void {
  const w = window as Window & { __veloraIntro?: boolean };
  if (w.__veloraIntro) {
    cb();
    return () => {};
  }
  window.addEventListener(INTRO_EVENT, cb, { once: true });
  return () => window.removeEventListener(INTRO_EVENT, cb);
}

function release() {
  (window as Window & { __veloraIntro?: boolean }).__veloraIntro = true;
  window.dispatchEvent(new Event(INTRO_EVENT));
}

/**
 * First-visit loader. The counter reflects genuine progress (fonts and the
 * above-the-fold images) — it never adds artificial delay. Returning visitors
 * within a session skip it entirely (handled by an inline head script).
 */
export function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const line = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || document.documentElement.classList.contains("velora-seen")) {
      release();
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shown = { v: 0 };
    let target = 0;
    let finished = false;

    const tasks: Promise<unknown>[] = [document.fonts?.ready ?? Promise.resolve()];
    document.querySelectorAll<HTMLImageElement>("img[data-critical]").forEach((img) => {
      tasks.push(img.complete ? Promise.resolve() : new Promise((r) => { img.addEventListener("load", r, { once: true }); img.addEventListener("error", r, { once: true }); }));
    });
    let done = 0;
    const render = () => {
      if (counter.current) counter.current.textContent = String(Math.round(shown.v)).padStart(3, "0");
      if (line.current) line.current.style.transform = `scaleX(${shown.v / 100})`;
    };
    const advance = () => {
      target = Math.max(target, (done / tasks.length) * 100);
      gsap.to(shown, { v: target, duration: reduce ? 0.1 : 0.6, ease: "power2.out", onUpdate: render, overwrite: true, onComplete: target >= 100 ? finish : undefined });
    };
    const finish = () => {
      if (finished) return;
      finished = true;
      try {
        sessionStorage.setItem("velora.seen", "1");
      } catch {}
      gsap
        .timeline({ onComplete: () => { el.style.display = "none"; } })
        .to(el.querySelector("[data-loader-inner]"), { yPercent: -30, autoAlpha: 0, duration: reduce ? 0.2 : 0.7, ease: "power3.in" })
        .add(release, reduce ? 0.1 : 0.45)
        .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: reduce ? 0.3 : 1.1, ease: "expo.inOut" }, reduce ? 0.1 : 0.35);
    };
    tasks.forEach((t) => t.then(() => { done += 1; advance(); }));
    const safety = window.setTimeout(() => { done = tasks.length; advance(); }, 4500);
    return () => window.clearTimeout(safety);
  }, []);

  return (
    <div
      ref={root}
      className="velora-loader fixed inset-0 z-[150] flex items-center justify-center bg-espresso text-ivory"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      aria-hidden
    >
      <div data-loader-inner className="flex w-[min(320px,70vw)] flex-col items-center">
        <span className="serif-display text-5xl tracking-[0.34em] md:text-6xl">VELORA</span>
        <span className="mt-10 block h-px w-full bg-ivory/15">
          <span ref={line} className="block h-px origin-left scale-x-0 bg-gold-soft" />
        </span>
        <span ref={counter} className="eyebrow mt-4 self-end tabular-nums opacity-70">
          000
        </span>
      </div>
    </div>
  );
}
