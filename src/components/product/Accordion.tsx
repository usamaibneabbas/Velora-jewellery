"use client";

import { type ReactNode, useId, useState } from "react";
import { MinusIcon, PlusIcon } from "@/components/ui/icons";

export function Accordion({ items }: { items: { title: string; content: ReactNode }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();

  return (
    <div className="border-t border-espresso/15">
      {items.map((item, i) => {
        const expanded = open === i;
        return (
          <div key={item.title} className="border-b border-espresso/15">
            <h3>
              <button
                type="button"
                id={`${id}-h-${i}`}
                aria-expanded={expanded}
                aria-controls={`${id}-p-${i}`}
                onClick={() => setOpen(expanded ? null : i)}
                className="eyebrow flex w-full items-center justify-between py-5 text-left"
              >
                {item.title}
                {expanded ? <MinusIcon /> : <PlusIcon />}
              </button>
            </h3>
            <div
              id={`${id}-p-${i}`}
              role="region"
              aria-labelledby={`${id}-h-${i}`}
              className={`grid transition-[grid-template-rows] duration-700 ease-[var(--ease-luxe)] ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden" inert={!expanded}>
                <div className="pb-6 text-sm leading-relaxed opacity-75">{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
