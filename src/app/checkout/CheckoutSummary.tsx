"use client";

import Image from "next/image";
import { useCart } from "@/commerce/cart/useCart";
import { multiply } from "@/commerce/pricing";
import { Link } from "@/components/layout/PageTransition";
import { Price } from "@/components/ui/Price";

export function CheckoutSummary() {
  const { lines, subtotal } = useCart();

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-start gap-6">
        <p className="serif-display text-4xl">Your bag is empty.</p>
        <Link href="/shop" className="eyebrow link-line">Discover the collection</Link>
      </div>
    );
  }

  return (
    <div>
      <ul className="divide-y divide-espresso/10 border-y border-espresso/10">
        {lines.map((l) => (
          <li key={l.id} className="flex items-center gap-5 py-5">
            <div className="relative aspect-[4/5] w-16 shrink-0 overflow-hidden bg-champagne">
              <Image src={l.image.src} alt={l.image.alt} fill sizes="64px" className="object-cover" />
            </div>
            <p className="flex-1 font-serif text-xl">
              {l.title} <span className="text-sm opacity-60">× {l.quantity}</span>
            </p>
            <Price money={multiply(l.price, l.quantity)} />
          </li>
        ))}
      </ul>
      <div className="mt-6 flex items-baseline justify-between">
        <p className="eyebrow">Subtotal</p>
        <Price money={subtotal} className="font-serif text-3xl" />
      </div>
      <p className="mt-10 border-l border-gold pl-5 text-sm leading-relaxed opacity-75">
        Secure checkout opens once VELORA&apos;s Shopify store is connected. Your bag is saved on this device.
      </p>
    </div>
  );
}
