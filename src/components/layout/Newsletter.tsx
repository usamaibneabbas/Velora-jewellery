"use client";

import { type FormEvent, useState } from "react";
import { ArrowRight } from "@/components/ui/icons";

/** Private Access sign-up. Wire `subscribe` to Shopify Customers or your ESP. */
export function Newsletter() {
  const [state, setState] = useState<"idle" | "done" | "error">("idle");

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email")?.toString() ?? "";
    setState(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "done" : "error");
  };

  if (state === "done") {
    return <p className="font-serif text-2xl" role="status">Thank you. You are on the list.</p>;
  }

  return (
    <form onSubmit={submit} noValidate className="w-full">
      <label className="flex items-center border-b border-ivory/25 pb-3 transition-colors focus-within:border-ivory">
        <span className="sr-only">Email address</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Email address"
          aria-invalid={state === "error"}
          aria-describedby={state === "error" ? "newsletter-error" : undefined}
          className="flex-1 bg-transparent py-2 text-base outline-none placeholder:text-ivory/40"
        />
        <button type="submit" aria-label="Subscribe" className="group p-2">
          <ArrowRight className="transition-transform duration-500 group-hover:translate-x-1" />
        </button>
      </label>
      {state === "error" && (
        <p id="newsletter-error" className="mt-3 text-xs text-gold-soft">
          Please enter a valid email address.
        </p>
      )}
    </form>
  );
}
