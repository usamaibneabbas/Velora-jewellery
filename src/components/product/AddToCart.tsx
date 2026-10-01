"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useCart } from "@/commerce/cart/useCart";
import type { Product } from "@/commerce/types";
import { Button } from "@/components/ui/Button";
import { MinusIcon, PlusIcon } from "@/components/ui/icons";
import { Price } from "@/components/ui/Price";

/** Quantity + ADD TO BAG. On phones a slim bar keeps the action in reach once the main button scrolls away. */
export function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const main = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  useEffect(() => {
    const el = main.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!added) return;
    const t = window.setTimeout(() => setAdded(false), 2200);
    return () => window.clearTimeout(t);
  }, [added]);

  const onAdd = () => {
    add(product, qty);
    setAdded(true);
  };
  const label = !product.availableForSale ? "Sold out" : added ? "Added to bag" : "Add to bag";

  return (
    <>
      <div ref={main} className="flex gap-3">
        <div className="flex h-14 items-center border border-espresso/20" role="group" aria-label="Quantity">
          <button type="button" className="h-full px-4" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
            <MinusIcon />
          </button>
          <span className="w-6 text-center text-sm tabular-nums" aria-live="polite">
            {qty}
          </span>
          <button type="button" className="h-full px-4" onClick={() => setQty((q) => Math.min(10, q + 1))} aria-label="Increase quantity">
            <PlusIcon />
          </button>
        </div>
        <Button onClick={onAdd} disabled={!product.availableForSale} className="flex-1" arrow={!added}>
          {label}
        </Button>
      </div>

      {mounted && createPortal(
      <div
        aria-hidden={!showBar}
        inert={!showBar}
        className={`fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-espresso/10 bg-pearl/95 px-5 py-3 backdrop-blur-lg transition-transform duration-700 ease-[var(--ease-luxe)] md:hidden ${
          showBar ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div>
          <p className="font-serif text-lg leading-none">{product.title}</p>
          <Price money={product.price} className="text-xs opacity-70" />
        </div>
        <Button onClick={onAdd} disabled={!product.availableForSale} className="!h-12 !px-6">
          {label}
        </Button>
      </div>,
      document.body,
      )}
    </>
  );
}
