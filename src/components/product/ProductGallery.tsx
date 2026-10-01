"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import type { ProductImage } from "@/commerce/types";
import { CloseIcon } from "@/components/ui/icons";
import { gsap } from "@/lib/gsap";
import { useScene } from "@/lib/motion";
import { useOverlay } from "@/lib/useOverlay";

/**
 * Immersive gallery.
 * Desktop: tall images stacked with sticky positioning — each new image glides
 * over the last, which recedes slightly. Mobile: a swipeable, snapping row.
 * Any image opens full screen.
 */
export function ProductGallery({ images, title }: { images: ProductImage[]; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<number | null>(null);

  useScene(ref, ({ reduce, desktop, tablet }, root) => {
    const q = gsap.utils.selector(root);
    if (reduce) return;
    // Entrance: the first image softly expands into place.
    gsap.fromTo(q("[data-gallery-item]")[0], { clipPath: "inset(6% 8% 6% 8%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.out", delay: 0.15 });
    gsap.fromTo(q("[data-gallery-img]")[0], { scale: 1.12 }, { scale: 1, duration: 2, ease: "expo.out", delay: 0.15 });
    if (!(desktop || tablet)) return;
    const items = q("[data-gallery-item]");
    items.forEach((item, i) => {
      const next = items[i + 1];
      if (!next) return;
      gsap.to(item.querySelector("[data-gallery-inner]"), {
        scale: 0.93,
        filter: "brightness(0.7)",
        ease: "none",
        scrollTrigger: { trigger: next, start: "top bottom", end: "top top+=76", scrub: true },
      });
    });
  });

  const onScrollRow = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    setActive(Math.round(el.scrollLeft / el.clientWidth));
  }, []);

  return (
    <div ref={ref}>
      <div
        onScroll={onScrollRow}
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] md:block md:overflow-visible"
        aria-label={`${title} images`}
        role="region"
      >
        {images.map((img, i) => (
          <figure
            key={img.src}
            data-gallery-item
            className="relative w-full shrink-0 snap-center md:sticky md:top-[var(--header-h)] md:mb-[8vh] md:h-[calc(100svh-var(--header-h)-4vh)]"
          >
            <button
              type="button"
              onClick={() => setZoom(i)}
              data-cursor="view"
              aria-label={`View image ${i + 1} of ${images.length} full screen`}
              className="block h-full w-full"
            >
              <div data-gallery-inner className="relative aspect-[4/5] h-full w-full origin-top overflow-hidden bg-champagne md:aspect-auto">
                <Image
                  data-gallery-img
                  src={img.src}
                  alt={img.alt}
                  fill
                  preload={i === 0}
                  sizes="(min-width: 768px) 58vw, 100vw"
                  className="object-cover"
                  style={{ objectPosition: img.focal }}
                />
                {img.placeholder && <span className="eyebrow absolute inset-x-4 bottom-6 text-center text-[10px] text-espresso/50">Photography coming soon</span>}
              </div>
            </button>
          </figure>
        ))}
      </div>
      {images.length > 1 && (
        <p className="eyebrow gutter-x mt-4 text-[10px] opacity-60 md:hidden" aria-live="polite">
          {String(active + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </p>
      )}
      <Lightbox images={images} index={zoom} onClose={() => setZoom(null)} onIndex={setZoom} />
    </div>
  );
}

function Lightbox({ images, index, onClose, onIndex }: { images: ProductImage[]; index: number | null; onClose: () => void; onIndex: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const open = index !== null;
  useOverlay(open, onClose, ref);
  const img = open ? images[index] : null;

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      inert={!open}
      aria-hidden={!open}
      className={`fixed inset-0 z-[80] bg-pearl transition-opacity duration-500 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
    >
      {img && (
        <Image src={img.src} alt={img.alt} fill sizes="100vw" className="object-contain p-[4vw]" />
      )}
      <button type="button" onClick={onClose} className="absolute right-6 top-6 p-3" aria-label="Close image viewer" data-autofocus>
        <CloseIcon />
      </button>
      {images.length > 1 && open && (
        <div className="eyebrow absolute inset-x-0 bottom-8 flex items-center justify-center gap-10 text-[10px]">
          <button type="button" className="link-line" onClick={() => onIndex((index - 1 + images.length) % images.length)}>
            Previous
          </button>
          <span className="tabular-nums opacity-60">
            {index + 1} / {images.length}
          </span>
          <button type="button" className="link-line" onClick={() => onIndex((index + 1) % images.length)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
