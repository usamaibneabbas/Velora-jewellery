/**
 * Client cart store.
 *
 * A tiny external store (subscribe / getSnapshot) consumed with
 * useSyncExternalStore. Lines carry a merchandise snapshot, mirroring how a
 * Shopify cart line exposes `merchandise`. When moving to Shopify, replace the
 * mutation functions with Storefront API cart mutations and keep the same shape.
 */
import type { CartLine, Product } from "../types";

export interface CartState {
  lines: CartLine[];
  open: boolean;
}

const STORAGE_KEY = "velora.cart.v1";
const EMPTY: CartState = { lines: [], open: false };

let state: CartState = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
  } catch {
    /* storage unavailable — cart stays in memory */
  }
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const lines = JSON.parse(raw) as CartLine[];
      if (Array.isArray(lines)) state = { ...state, lines };
    }
  } catch {
    /* ignore corrupt storage */
  }
}

function set(next: CartState, save = true) {
  state = next;
  if (save) persist();
  emit();
}

export const cartStore = {
  subscribe(listener: () => void) {
    hydrate();
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: () => state,
  getServerSnapshot: () => EMPTY,

  add(product: Product, quantity = 1) {
    const existing = state.lines.find((l) => l.id === product.id);
    const lines = existing
      ? state.lines.map((l) => (l.id === product.id ? { ...l, quantity: Math.min(l.quantity + quantity, 10) } : l))
      : [
          ...state.lines,
          {
            id: product.id,
            slug: product.slug,
            title: product.title,
            material: product.material,
            price: product.price,
            image: product.featuredImage,
            quantity,
          },
        ];
    set({ lines, open: true });
  },
  update(id: string, quantity: number) {
    const lines =
      quantity <= 0
        ? state.lines.filter((l) => l.id !== id)
        : state.lines.map((l) => (l.id === id ? { ...l, quantity: Math.min(quantity, 10) } : l));
    set({ ...state, lines });
  },
  remove(id: string) {
    set({ ...state, lines: state.lines.filter((l) => l.id !== id) });
  },
  setOpen(open: boolean) {
    set({ ...state, open }, false);
  },
};
