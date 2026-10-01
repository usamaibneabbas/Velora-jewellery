"use client";

import { useRef } from "react";
import { NAV } from "@/lib/site";
import { useOverlay } from "@/lib/useOverlay";
import { Link } from "./PageTransition";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useOverlay(open, onClose, ref);

  return (
    <div
      id="mobile-menu"
      ref={ref}
      inert={!open}
      aria-hidden={!open}
      className={`fixed inset-0 z-40 flex flex-col justify-between bg-espresso px-[var(--gutter)] pb-10 pt-[calc(var(--header-h)+3rem)] text-ivory transition-[clip-path] duration-700 ease-[var(--ease-luxe)] lg:hidden ${
        open ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_0_100%_0)]"
      }`}
    >
      <nav aria-label="Mobile">
        <ul className="space-y-3">
          {NAV.map((item, i) => (
            <li
              key={item.href}
              className={`transition-[transform,opacity] duration-700 ease-[var(--ease-luxe)] ${open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
              style={{ transitionDelay: open ? `${150 + i * 70}ms` : "0ms" }}
            >
              <Link href={item.href} onClick={onClose} className="serif-display block text-5xl uppercase">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <p className="eyebrow opacity-60">Objects of Quiet Distinction</p>
    </div>
  );
}
