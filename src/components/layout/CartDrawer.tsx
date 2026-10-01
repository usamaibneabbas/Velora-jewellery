"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useCart } from "@/commerce/cart/useCart";
import { createCheckoutUrl } from "@/commerce/checkout";
import { FREE_SHIPPING_NOTE } from "@/commerce/config";
import { multiply } from "@/commerce/pricing";
import { Button } from "@/components/ui/Button";
import { CloseIcon, MinusIcon, PlusIcon } from "@/components/ui/icons";
import { Price } from "@/components/ui/Price";
import { useOverlay } from "@/lib/useOverlay";
import { Link } from "./PageTransition";

export function CartDrawer() {
  const { lines, open, setOpen, update, remove, subtotal, count } = useCart();
  const router = useRouter();
  const panel = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const close = () => setOpen(false);
  useOverlay(open, close, panel);

  const checkout = async () => {
    setBusy(true);
    const url = await createCheckoutUrl(lines);
    setOpen(false);
    setBusy(false);
    if (url.startsWith("http")) window.location.href = url;
    else router.push(url);
  };

  return (
    <div inert={!open} aria-hidden={!open} className={`fixed inset-0 z-[70] ${open ? "" : "pointer-events-none"}`}>
      <div
        onClick={close}
        aria-hidden
        className={`absolute inset-0 bg-espresso/35 transition-opacity duration-700 ease-[var(--ease-luxe)] ${open ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        className={`absolute inset-y-0 right-0 flex w-full max-w-[480px] flex-col bg-pearl text-espresso shadow-[0_0_80px_rgba(27,22,17,0.12)] transition-transform duration-[900ms] ease-[var(--ease-luxe)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-espresso/10 px-8 py-7">
          <p className="eyebrow">
            Your Bag <span className="opacity-50">({count})</span>
          </p>
          <button type="button" onClick={close} aria-label="Close bag" className="p-2" data-autofocus>
            <CloseIcon />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-8 px-8 text-center">
            <p className="serif-display text-4xl">Your bag is empty.</p>
            <Link href="/shop" onClick={close} className="eyebrow link-line">
              Discover the collection
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-espresso/10 overflow-y-auto px-8" data-lenis-prevent>
              {lines.map((line) => (
                <li key={line.id} className="flex gap-5 py-7">
                  <Link href={`/products/${line.slug}`} onClick={close} className="relative block aspect-[4/5] w-24 shrink-0 overflow-hidden bg-champagne">
                    <Image src={line.image.src} alt={line.image.alt} fill sizes="96px" className="object-cover" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-4">
                      <p className="font-serif text-xl leading-tight">{line.title}</p>
                      <Price money={multiply(line.price, line.quantity)} className="text-sm" />
                    </div>
                    <p className="mt-1 text-xs leading-relaxed opacity-60">{line.material}</p>
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div className="flex items-center border border-espresso/15">
                        <button type="button" className="p-3" onClick={() => update(line.id, line.quantity - 1)} aria-label={`Decrease quantity of ${line.title}`}>
                          <MinusIcon />
                        </button>
                        <span className="w-6 text-center text-sm tabular-nums" aria-live="polite">
                          {line.quantity}
                        </span>
                        <button type="button" className="p-3" onClick={() => update(line.id, line.quantity + 1)} aria-label={`Increase quantity of ${line.title}`}>
                          <PlusIcon />
                        </button>
                      </div>
                      <button type="button" onClick={() => remove(line.id)} className="eyebrow link-line opacity-60 hover:opacity-100">
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-espresso/10 px-8 pb-8 pt-6">
              <div className="flex items-baseline justify-between">
                <p className="eyebrow">Subtotal</p>
                <Price money={subtotal} className="font-serif text-2xl" />
              </div>
              <p className="mt-2 text-xs opacity-60">{FREE_SHIPPING_NOTE} Taxes calculated at checkout.</p>
              <Button onClick={checkout} disabled={busy} className="mt-6 w-full" arrow>
                Checkout
              </Button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
