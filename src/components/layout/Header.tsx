"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/commerce/cart/useCart";
import { BagIcon, SearchIcon } from "@/components/ui/icons";
import { NAV } from "@/lib/site";
import { MobileMenu } from "./MobileMenu";
import { Link } from "./PageTransition";
import { SearchOverlay, type SearchItem } from "./SearchOverlay";

type Theme = "light" | "dark";

/**
 * Floating header. Transparent over the hero, a soft translucent veil once the
 * page scrolls. Text colour follows the section beneath it via [data-header].
 * Retreats while reading downwards, returns on the slightest upward scroll.
 */
export function Header({ searchItems }: { searchItems: SearchItem[] }) {
  const pathname = usePathname();
  const { count, setOpen } = useCart();
  const [theme, setTheme] = useState<Theme>("light");
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 40);
      const delta = y - lastY.current;
      if (Math.abs(delta) > 6) {
        setHidden(delta > 0 && y > 500);
        lastY.current = y;
      }
      const probe = 32;
      let next: Theme = "light";
      for (const el of document.querySelectorAll<HTMLElement>("[data-header]")) {
        const r = el.getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) next = (el.dataset.header as Theme) ?? "light";
      }
      setTheme(next);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // Re-evaluate once the new route has rendered.
    const t = window.setTimeout(update, 120);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearTimeout(t);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  const dark = theme === "dark";
  const veil = scrolled
    ? dark
      ? "bg-espresso/55 backdrop-blur-xl border-ivory/10"
      : "bg-ivory/70 backdrop-blur-xl border-espresso/10"
    : "bg-transparent border-transparent";

  return (
    <>
      <a
        href="#main"
        className="eyebrow fixed left-4 top-4 z-[100] -translate-y-24 bg-espresso px-5 py-3 text-ivory transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[transform,background-color,color,border-color] duration-700 ease-[var(--ease-luxe)] ${veil} ${
          dark ? "text-ivory" : "text-espresso"
        } ${hidden && !menuOpen ? "-translate-y-full" : "translate-y-0"}`}
      >
        <div className="gutter-x mx-auto grid h-[var(--header-h)] max-w-[1680px] grid-cols-[1fr_auto_1fr] items-center">
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex gap-9">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="eyebrow link-line opacity-80 transition-opacity duration-500 hover:opacity-100"
                    aria-current={pathname === item.href ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            className="eyebrow flex items-center gap-3 justify-self-start lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span aria-hidden className="flex w-6 flex-col gap-[6px]">
              <span className={`h-px w-full bg-current transition-transform duration-500 ${menuOpen ? "translate-y-[3.5px] rotate-45" : ""}`} />
              <span className={`h-px w-full bg-current transition-transform duration-500 ${menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
            </span>
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          </button>

          <Link href="/" aria-label="VELORA — home" className="serif-display text-[1.65rem] leading-none tracking-[0.34em] md:text-[1.9rem]">
            VELORA
          </Link>

          <div className="flex items-center justify-end gap-6 md:gap-9">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="eyebrow link-line hidden opacity-80 transition-opacity hover:opacity-100 md:inline"
            >
              Search
            </button>
            <button type="button" onClick={() => setSearchOpen(true)} className="md:hidden" aria-label="Search">
              <SearchIcon />
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="eyebrow group flex items-center gap-2 opacity-80 transition-opacity hover:opacity-100"
              aria-label={`Bag, ${count} ${count === 1 ? "item" : "items"}`}
            >
              <span className="link-line hidden md:inline">Bag</span>
              <BagIcon className="md:hidden" />
              <span className="tabular-nums" aria-hidden>
                ({count})
              </span>
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} items={searchItems} />
    </>
  );
}
