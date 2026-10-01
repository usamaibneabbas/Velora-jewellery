"use client";

import type Lenis from "lenis";

/** Module-level handle on the Lenis instance so any component can lock or reset scroll. */
let instance: Lenis | null = null;

export const scroll = {
  set(l: Lenis | null) {
    instance = l;
  },
  get: () => instance,
  lock() {
    instance?.stop();
    document.documentElement.style.overflow = "hidden";
  },
  unlock() {
    instance?.start();
    document.documentElement.style.overflow = "";
  },
  toTop() {
    if (instance) instance.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
  },
  to(target: string | number | HTMLElement) {
    if (instance) instance.scrollTo(target, { duration: 1.4 });
    else if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
    else (typeof target === "string" ? document.querySelector(target) : target)?.scrollIntoView({ behavior: "smooth" });
  },
};
