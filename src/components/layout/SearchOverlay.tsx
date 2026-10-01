"use client";

import Image from "next/image";
import { useDeferredValue, useRef, useState } from "react";
import { CloseIcon } from "@/components/ui/icons";
import { useOverlay } from "@/lib/useOverlay";
import { Link } from "./PageTransition";

export interface SearchItem {
  slug: string;
  title: string;
  material: string;
  price: string;
  image: { src: string; alt: string };
}

export function SearchOverlay({ open, onClose, items }: { open: boolean; onClose: () => void; items: SearchItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const q = useDeferredValue(query.trim().toLowerCase());
  useOverlay(open, onClose, ref);

  const results = q ? items.filter((i) => `${i.title} ${i.material}`.toLowerCase().includes(q)) : items;

  return (
    <div
      inert={!open}
      aria-hidden={!open}
      className={`fixed inset-0 z-[60] transition-opacity duration-500 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
    >
      <div className="absolute inset-0 bg-espresso/40" onClick={onClose} aria-hidden />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Search VELORA"
        className={`relative bg-ivory text-espresso transition-transform duration-700 ease-[var(--ease-luxe)] ${open ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="gutter-x mx-auto max-w-[1680px] pb-12 pt-8">
          <div className="flex items-center justify-between">
            <p className="eyebrow opacity-60">Search</p>
            <button type="button" onClick={onClose} aria-label="Close search" className="p-2">
              <CloseIcon />
            </button>
          </div>
          <label className="mt-8 block">
            <span className="sr-only">Search jewellery</span>
            <input
              data-autofocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="serif-display w-full border-b border-espresso/20 bg-transparent pb-4 text-4xl outline-none placeholder:text-espresso/30 focus:border-espresso md:text-6xl"
            />
          </label>
          <ul className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4" aria-live="polite">
            {results.map((r) => (
              <li key={r.slug}>
                <Link href={`/products/${r.slug}`} onClick={onClose} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-champagne">
                    <Image src={r.image.src} alt={r.image.alt} fill sizes="(min-width:768px) 22vw, 45vw" className="object-cover transition-transform duration-1000 ease-[var(--ease-luxe)] group-hover:scale-[1.03]" />
                  </div>
                  <p className="mt-4 font-serif text-xl">{r.title}</p>
                  <p className="eyebrow mt-1 opacity-60">{r.price}</p>
                </Link>
              </li>
            ))}
            {results.length === 0 && <li className="col-span-full opacity-60">No pieces match “{query}”.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
