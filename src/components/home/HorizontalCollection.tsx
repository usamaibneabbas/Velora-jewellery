"use client";

import Image from "next/image";
import { useRef } from "react";
import type { Product } from "@/commerce/types";
import { Link } from "@/components/layout/PageTransition";
import { ArrowRight } from "@/components/ui/icons";
import { Price } from "@/components/ui/Price";
import { gsap } from "@/lib/gsap";
import { useScene } from "@/lib/motion";

/**
 * SCENE 04 — New Objects.
 * Desktop: vertical scroll drives a horizontal exhibition (pinned).
 * Tablet / mobile / reduced motion: a native, touch-friendly horizontal row with snap.
 */
export function HorizontalCollection({ products }: { products: Product[] }) {
  const ref = useRef<HTMLElement>(null);

  useScene(ref, ({ desktop }, root) => {
    if (!desktop) return;
    const q = gsap.utils.selector(root);
    const track = q("[data-track]")[0];
    root.dataset.mode = "pinned";
    const distance = () => track.scrollWidth - window.innerWidth;

    const move = gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    // Each photograph drifts inside its frame as it travels — depth within motion.
    q("[data-h-img]").forEach((img) => {
      gsap.fromTo(
        img,
        { xPercent: -8 },
        {
          xPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: img.parentElement, containerAnimation: move, start: "left right", end: "right left", scrub: true },
        },
      );
    });
    gsap.to(q("[data-h-title]"), {
      xPercent: -30,
      ease: "none",
      scrollTrigger: { trigger: root, start: "top top", end: () => `+=${distance()}`, scrub: true },
    });

    return () => {
      delete root.dataset.mode;
    };
  });

  return (
    <section ref={ref} data-header="light" aria-labelledby="new-title" className="group/h relative overflow-hidden bg-champagne text-ink">
      <div
        data-track
        className="flex h-auto snap-x snap-mandatory items-center gap-[6vw] overflow-x-auto px-[var(--gutter)] py-24 [scrollbar-width:none] lg:h-[100svh] lg:py-0 group-data-[mode=pinned]/h:snap-none group-data-[mode=pinned]/h:overflow-visible"
        tabIndex={0}
        aria-label="New objects — scroll horizontally"
      >
        <div className="w-[80vw] shrink-0 snap-start md:w-[46vw] lg:w-[40vw]">
          <p className="eyebrow mb-6 opacity-60">Just arrived</p>
          <h2 id="new-title" data-h-title className="serif-display whitespace-nowrap text-[18vw] uppercase leading-[0.85] md:text-[12vw]">
            New
            <br />
            <span className="italic text-gold">Objects</span>
          </h2>
          <p className="mt-8 max-w-sm text-sm leading-relaxed opacity-70">
            The latest pieces to leave the atelier. Scroll to move through the exhibition.
          </p>
        </div>

        {products.map((p, i) => {
          const img = p.images[i % 2 === 0 ? 0 : 1] ?? p.featuredImage;
          return (
            <article key={p.id} className="group grid w-[84vw] shrink-0 snap-center gap-8 md:w-[70vw] md:grid-cols-[1.35fr_1fr] md:items-end lg:w-[66vw]">
              <Link href={`/products/${p.slug}`} data-cursor="view" aria-label={`View ${p.title}`} className="relative block aspect-[4/5] overflow-hidden bg-sand md:aspect-[5/6] lg:h-[74svh] lg:aspect-auto">
                <div data-h-img className="absolute -inset-x-[10%] inset-y-0 will-change-transform">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 1024px) 44vw, (min-width: 768px) 46vw, 84vw"
                    className="object-cover transition-transform duration-[1600ms] ease-[var(--ease-luxe)] group-hover:scale-[1.03]"
                    style={{ objectPosition: img.focal }}
                  />
                </div>
                {img.placeholder && <span className="eyebrow absolute inset-x-4 bottom-4 text-center text-[9px] text-espresso/50">Photography coming soon</span>}
              </Link>
              <div className="pb-2">
                <p className="eyebrow text-[10px] opacity-50">0{i + 1} / 0{products.length}</p>
                <h3 className="serif-display mt-4 text-5xl leading-none md:text-6xl">{p.title}</h3>
                <p className="mt-5 max-w-xs text-sm leading-relaxed opacity-70">{p.material}</p>
                <Price money={p.price} className="mt-5 block font-serif text-2xl" />
                <Link href={`/products/${p.slug}`} className="eyebrow group/v mt-8 inline-flex items-center gap-4">
                  <span className="link-line">View piece</span>
                  <ArrowRight className="transition-transform duration-700 group-hover/v:translate-x-1" />
                </Link>
              </div>
            </article>
          );
        })}

        <div className="w-[60vw] shrink-0 snap-center md:w-[30vw]">
          <Link href="/collections/new-arrivals" className="group serif-display flex items-center gap-6 text-5xl italic md:text-6xl">
            <span className="link-line">See all</span>
            <ArrowRight className="transition-transform duration-700 group-hover:translate-x-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
