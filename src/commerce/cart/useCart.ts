"use client";

import { useSyncExternalStore } from "react";
import { multiply, sum } from "../pricing";
import { cartStore } from "./store";

export function useCart() {
  const state = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, cartStore.getServerSnapshot);
  const count = state.lines.reduce((n, l) => n + l.quantity, 0);
  const subtotal = sum(state.lines.map((l) => multiply(l.price, l.quantity)));
  return {
    ...state,
    count,
    subtotal,
    add: cartStore.add,
    update: cartStore.update,
    remove: cartStore.remove,
    setOpen: cartStore.setOpen,
  };
}
