import { RevealText } from "@/components/motion/RevealText";

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  align?: "left" | "center";
}

export function SectionTitle({ eyebrow, title, as = "h2", className = "", align = "left" }: SectionTitleProps) {
  return (
    <div className={`${align === "center" ? "text-center" : ""} ${className}`}>
      {eyebrow && <RevealText as="p" split="words" className="eyebrow mb-6 opacity-70">{eyebrow}</RevealText>}
      <RevealText as={as} className="serif-display text-headline uppercase">
        {title}
      </RevealText>
    </div>
  );
}
