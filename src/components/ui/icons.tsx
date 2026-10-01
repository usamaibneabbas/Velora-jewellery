import type { SVGProps } from "react";

const base = { fill: "none", stroke: "currentColor", strokeWidth: 1, vectorEffect: "non-scaling-stroke" } as const;

export function ArrowRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 28 10" width="28" height="10" aria-hidden {...props}>
      <path d="M0 5h26M22 1l4 4-4 4" {...base} />
    </svg>
  );
}

export function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden {...props}>
      <circle cx="8.5" cy="8.5" r="6.5" {...base} />
      <path d="M13.5 13.5 19 19" {...base} />
    </svg>
  );
}

export function BagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 22" width="17" height="19" aria-hidden {...props}>
      <path d="M2.5 6.5h15l-1 14h-13z" {...base} />
      <path d="M6.5 6.5V5a3.5 3.5 0 0 1 7 0v1.5" {...base} />
    </svg>
  );
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden {...props}>
      <path d="M2 2l16 16M18 2 2 18" {...base} />
    </svg>
  );
}

export function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden {...props}>
      <path d="M6 0v12M0 6h12" {...base} />
    </svg>
  );
}

export function MinusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden {...props}>
      <path d="M0 6h12" {...base} />
    </svg>
  );
}
