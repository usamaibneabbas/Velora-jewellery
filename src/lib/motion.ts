"use client";

import { type RefObject, useSyncExternalStore } from "react";
import { gsap, MEDIA, type MediaConditions, useGSAP } from "./gsap";

/** Subscribes to a CSS media query. Returns `fallback` during SSR. */
export function useMediaQuery(query: string, fallback = false): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => fallback,
  );
}

export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");
export const useFinePointer = () => useMediaQuery("(hover: hover) and (pointer: fine)");
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");

/**
 * The building block for every animated scene.
 *
 * Wraps useGSAP (automatic context cleanup) + gsap.matchMedia so each scene
 * declares separate desktop / tablet / mobile / reduced-motion behaviour.
 * All timelines and ScrollTriggers created inside `build` are reverted on
 * unmount or when the media conditions change — no leaks.
 */
export function useScene(
  scope: RefObject<HTMLElement | null>,
  build: (media: MediaConditions, root: HTMLElement) => void | (() => void),
  dependencies: unknown[] = [],
) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add(MEDIA, (ctx) => build(ctx.conditions as MediaConditions, root), root);
      return () => mm.revert();
    },
    { scope, dependencies },
  );
}
