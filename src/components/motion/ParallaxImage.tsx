"use client";

import Image from "next/image";
import { useRef } from "react";
import type { ProductImage } from "@/commerce/types";
import { gsap } from "@/lib/gsap";
import { useScene } from "@/lib/motion";

interface ParallaxImageProps {
  image: ProductImage;
  className?: string;
  sizes: string;
  /** Travel as a fraction of the frame height (0.1 = ±10%). */
  speed?: number;
  priority?: boolean;
  imgClassName?: string;
}

/**
 * Image that drifts inside its frame while the frame scrolls past —
 * the midground layer of the VELORA depth system.
 */
export function ParallaxImage({ image, className = "", sizes, speed = 0.1, priority, imgClassName = "" }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);

  useScene(ref, ({ reduce, mobile }, el) => {
    if (reduce) return;
    const s = (mobile ? speed * 0.5 : speed) * 100;
    gsap.fromTo(
      el.querySelector("[data-parallax-inner]"),
      { yPercent: -s },
      { yPercent: s, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
    );
  });

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <div data-parallax-inner className="absolute inset-x-0 will-change-transform" style={{ top: `-${speed * 100}%`, bottom: `-${speed * 100}%` }}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          preload={priority}
          className={`object-cover ${imgClassName}`}
          style={{ objectPosition: image.focal ?? "50% 50%" }}
        />
      </div>
    </div>
  );
}
