import type { Metadata } from "next";
import { CheckoutSummary } from "./CheckoutSummary";

export const metadata: Metadata = { title: "Checkout", robots: { index: false, follow: false } };

export default function CheckoutPage() {
  return (
    <section data-header="light" className="bg-ivory pb-40 pt-[calc(var(--header-h)+12vh)] text-ink">
      <div className="gutter-x mx-auto grid max-w-[1680px] gap-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="eyebrow mb-6 opacity-50">Checkout</p>
          <h1 className="serif-display text-headline uppercase">Your order</h1>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <CheckoutSummary />
        </div>
      </div>
    </section>
  );
}
