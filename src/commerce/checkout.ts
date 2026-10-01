import type { CartLine } from "./types";

/**
 * Checkout hand-off.
 * With Shopify connected this should create a cart via the Storefront API and
 * return its `checkoutUrl`. Until then, buyers land on the internal checkout page.
 */
export async function createCheckoutUrl(lines: CartLine[]): Promise<string> {
  void lines;
  return "/checkout";
}
