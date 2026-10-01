import type { CurrencyCode } from "./types";

/**
 * Store-wide commerce settings.
 * The launch price is $49. Set NEXT_PUBLIC_STORE_CURRENCY=EUR to switch the
 * storefront to euro pricing for the European launch.
 */
export const STORE_CURRENCY: CurrencyCode =
  process.env.NEXT_PUBLIC_STORE_CURRENCY === "EUR" ? "EUR" : "USD";

export const CURRENCY_LOCALE: Record<CurrencyCode, string> = {
  USD: "en-US",
  EUR: "en-IE",
};

export const FREE_SHIPPING_NOTE = "Complimentary insured delivery across Europe.";
