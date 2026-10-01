import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "@/components/layout/PageTransition";
import { Magnetic } from "@/components/motion/MagneticButton";
import { ArrowRight } from "./icons";

type Variant = "solid" | "outline" | "text";
type Tone = "dark" | "light";

const styles: Record<Variant, Record<Tone, string>> = {
  solid: {
    dark: "bg-espresso text-ivory hover:bg-ink",
    light: "bg-ivory text-espresso hover:bg-pearl",
  },
  outline: {
    dark: "border border-espresso/40 text-espresso hover:border-espresso",
    light: "border border-ivory/40 text-ivory hover:border-ivory",
  },
  text: { dark: "text-espresso", light: "text-ivory" },
};

interface CommonProps {
  children: ReactNode;
  variant?: Variant;
  tone?: Tone;
  arrow?: boolean;
  magnetic?: boolean;
  className?: string;
}

function Inner({ children, arrow }: { children: ReactNode; arrow?: boolean }) {
  return (
    <>
      <span className="relative">{children}</span>
      {arrow && (
        <span className="relative ml-4 inline-flex w-7 overflow-hidden">
          <ArrowRight className="transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:translate-x-[3px]" />
        </span>
      )}
    </>
  );
}

const cls = (variant: Variant, tone: Tone, className = "") =>
  `group eyebrow inline-flex items-center justify-center transition-colors duration-500 ${
    variant === "text" ? "py-2" : "h-14 px-9"
  } ${styles[variant][tone]} ${className}`;

export function ButtonLink({
  href,
  children,
  variant = "outline",
  tone = "dark",
  arrow = true,
  magnetic = true,
  className,
  ...rest
}: CommonProps & { href: string; "aria-label"?: string }) {
  const el = (
    <Link href={href} className={cls(variant, tone, className)} {...rest}>
      <Inner arrow={arrow}>{children}</Inner>
    </Link>
  );
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}

export function Button({
  children,
  variant = "solid",
  tone = "dark",
  arrow = false,
  magnetic = false,
  className,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  const el = (
    <button className={cls(variant, tone, `disabled:opacity-50 ${className ?? ""}`)} {...rest}>
      <Inner arrow={arrow}>{children}</Inner>
    </button>
  );
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}
