import { CURRENCY_LOCALE, STORE_CURRENCY } from "./config";
import type { CurrencyCode, Money } from "./types";

const formatters = new Map<CurrencyCode, Intl.NumberFormat>();

export function formatMoney(money: Money): string {
  let f = formatters.get(money.currencyCode);
  if (!f) {
    f = new Intl.NumberFormat(CURRENCY_LOCALE[money.currencyCode], {
      style: "currency",
      currency: money.currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    formatters.set(money.currencyCode, f);
  }
  return f.format(money.amount);
}

/** Picks the price for the active store currency from a price table. */
export function priceFor(table: Partial<Record<CurrencyCode, number>>, currency: CurrencyCode = STORE_CURRENCY): Money {
  const amount = table[currency] ?? table.USD ?? 0;
  return { amount, currencyCode: currency };
}

export function multiply(money: Money, qty: number): Money {
  return { ...money, amount: Math.round(money.amount * qty * 100) / 100 };
}

export function sum(items: Money[], currency: CurrencyCode = STORE_CURRENCY): Money {
  return { amount: Math.round(items.reduce((t, m) => t + m.amount, 0) * 100) / 100, currencyCode: currency };
}
