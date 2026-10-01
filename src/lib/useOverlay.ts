"use client";

import { type RefObject, useEffect, useRef } from "react";
import { scroll } from "./scroll";

/**
 * Shared overlay behaviour: Escape to close, scroll lock, focus moved into the
 * panel on open, a simple focus trap, and focus restored on close.
 */
export function useOverlay(open: boolean, onClose: () => void, panel: RefObject<HTMLElement | null>) {
  const close = useRef(onClose);
  useEffect(() => {
    close.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    scroll.lock();
    const focusables = () =>
      Array.from(
        panel.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])') ?? [],
      );
    const t = window.setTimeout(() => (panel.current?.querySelector<HTMLElement>("[data-autofocus]") ?? focusables()[0])?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close.current();
      if (e.key !== "Tab") return;
      const list = focusables();
      if (!list.length) return;
      const firstEl = list[0];
      const lastEl = list[list.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      scroll.unlock();
      previous?.focus?.();
    };
  }, [open, panel]);
}
