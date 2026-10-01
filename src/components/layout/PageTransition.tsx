"use client";

import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  type AnchorHTMLAttributes,
  createContext,
  type MouseEvent,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { scroll } from "@/lib/scroll";

type Navigate = (href: string) => void;
const TransitionContext = createContext<Navigate | null>(null);

/**
 * Page transitions: the current page softens, a VELORA curtain rises,
 * the next route renders behind it, and the curtain lifts away (~0.9s total).
 */
export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const curtain = useRef<HTMLDivElement>(null);
  const pending = useRef(false);
  const first = useRef(true);

  const navigate = useCallback<Navigate>(
    (href) => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce || pending.current || !curtain.current) {
        router.push(href);
        return;
      }
      pending.current = true;
      const main = document.getElementById("main");
      gsap
        .timeline({ onComplete: () => router.push(href) })
        .to(main, { autoAlpha: 0.4, scale: 0.985, duration: 0.45, ease: "power2.in" }, 0)
        .set(curtain.current, { visibility: "visible" }, 0)
        .fromTo(curtain.current, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.5, ease: "expo.inOut" }, 0)
        .fromTo(curtain.current.querySelector("[data-curtain-mark]"), { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.45 }, 0.15);
    },
    [router],
  );

  // Route committed → reset scroll, then lift the curtain.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const main = document.getElementById("main");
    scroll.toTop();
    if (!pending.current) return;
    pending.current = false;
    gsap.set(main, { autoAlpha: 1, scale: 1, clearProps: "transform,opacity,visibility" });
    gsap
      .timeline({ onComplete: () => { gsap.set(curtain.current, { visibility: "hidden" }); ScrollTrigger.refresh(); } })
      .to(curtain.current, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.6, ease: "expo.inOut", delay: 0.05 })
      .to(curtain.current?.querySelector("[data-curtain-mark]") ?? null, { yPercent: -40, autoAlpha: 0, duration: 0.4 }, 0);
  }, [pathname]);

  return (
    <TransitionContext.Provider value={navigate}>
      {children}
      <div
        ref={curtain}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center bg-espresso text-ivory"
        style={{ visibility: "hidden", clipPath: "inset(100% 0% 0% 0%)" }}
      >
        <span data-curtain-mark className="serif-display text-5xl tracking-[0.3em] md:text-7xl">
          VELORA
        </span>
      </div>
    </TransitionContext.Provider>
  );
}

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string; children: ReactNode; prefetch?: boolean };

/** Drop-in replacement for next/link that plays the VELORA page transition. */
export function Link({ href, onClick, children, prefetch, ...rest }: LinkProps) {
  const navigate = useContext(TransitionContext);
  const pathname = usePathname();

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || !navigate) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0 || rest.target === "_blank") return;
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return;
    if (url.pathname === pathname) {
      // Same page: smooth scroll to hash or top rather than reloading.
      e.preventDefault();
      scroll.to(url.hash ? url.hash : 0);
      return;
    }
    e.preventDefault();
    navigate(url.pathname + url.search + url.hash);
  };

  return (
    <NextLink href={href} onClick={handle} prefetch={prefetch} {...rest}>
      {children}
    </NextLink>
  );
}
