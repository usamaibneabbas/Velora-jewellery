import type { ReactNode } from "react";

export function Container({ as = "div", className = "", children }: { as?: "div" | "section" | "article"; className?: string; children: ReactNode }) {
  const Tag = as as "div";
  return <Tag className={`mx-auto w-full max-w-[1680px] gutter-x ${className}`}>{children}</Tag>;
}
