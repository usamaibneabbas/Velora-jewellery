"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Product } from "@/commerce/types";
import { ButtonLink } from "@/components/ui/Button";
import { gsap, type ScrollTrigger } from "@/lib/gsap";
import { useMediaQuery, useScene } from "@/lib/motion";

// Three.js is loaded only when this scene is about to be seen, on capable devices.
const ProductScene = dynamic(() => import("@/components/three/ProductScene"), { ssr: false });

const CAPTIONS = ["Suspended in light", "Turned by hand", "Seen from every angle"];

let webglSupport: boolean | undefined;
function supportsWebGL() {
  if (webglSupport === undefined) {
    try {
      const c = document.createElement("canvas");
      webglSupport = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}
const noopSubscribe = () => () => {};

/**
 * SCENE 07 — The showroom.
 * A pinned, art-directed 3D presentation: scroll controls rotation, camera,
 * elevation and light. Phones, reduced-motion users and devices without WebGL
 * receive a layered 2D composition with simulated depth instead.
 */
export function ShowcaseScene({ product, textureUrl }: { product: Product; textureUrl: string }) {
  const ref = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const [near, setNear] = useState(false);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const capable = useMediaQuery("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
  const webgl = useSyncExternalStore(noopSubscribe, supportsWebGL, () => false);
  const use3D = capable && webgl;
  const image = product.images[1] ?? product.images[0];

  // Load the 3D bundle shortly before the section arrives; render only while visible.
  useEffect(() => {
    const el = ref.current;
    if (!el || !use3D) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setNear(true);
        setActive(e.isIntersecting);
      },
      { rootMargin: "60% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [use3D]);

  useScene(ref, ({ reduce, mobile }, root) => {
    const q = gsap.utils.selector(root);
    if (reduce) return;

    const st = {
      trigger: root,
      start: "top top",
      end: mobile ? "+=120%" : "+=220%",
      pin: true,
      scrub: mobile ? 0.5 : 1,
      onUpdate: (self: ScrollTrigger) => {
        progress.current = self.progress;
        const idx = Math.min(CAPTIONS.length - 1, Math.floor(self.progress * CAPTIONS.length));
        q("[data-caption]").forEach((el, i) => gsap.to(el, { autoAlpha: i === idx ? 1 : 0, y: i === idx ? 0 : i < idx ? -16 : 16, duration: 0.6, overwrite: true }));
      },
    };
    const tl = gsap.timeline({ scrollTrigger: st, defaults: { ease: "none" } });

    // 2D fallback choreography (also harmless when the canvas is shown).
    tl.fromTo(q("[data-fallback-frame]"), { rotateY: -14, rotateX: 6, scale: 0.92 }, { rotateY: 12, rotateX: -4, scale: 1.04, duration: 1 }, 0)
      .fromTo(q("[data-fallback-shadow]"), { xPercent: 10, scaleX: 0.85 }, { xPercent: -10, scaleX: 1.05, duration: 1 }, 0)
      .fromTo(q("[data-fallback-light]"), { xPercent: -70 }, { xPercent: 70, duration: 1 }, 0)
      .fromTo(q("[data-showcase-title]"), { yPercent: 0 }, { yPercent: -40, duration: 1 }, 0)
      .fromTo(q("[data-showcase-cta]"), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.15 }, 0.8);

    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    root.addEventListener("pointermove", onMove);
    return () => root.removeEventListener("pointermove", onMove);
  });

  return (
    <section
      ref={ref}
      data-header="dark"
      aria-labelledby="showcase-title"
      className="relative h-[100svh] min-h-[600px] overflow-hidden bg-espresso text-ivory"
      style={{ background: "radial-gradient(70% 60% at 50% 55%, #3a3027 0%, #1b1611 55%, #120f0c 100%)" }}
    >
      {/* Large background title (slowest layer) */}
      <h2
        id="showcase-title"
        data-showcase-title
        className="serif-display pointer-events-none absolute inset-x-0 top-[14%] text-center text-[15vw] uppercase leading-[0.85] text-ivory/[0.07] md:top-[10%]"
      >
        The Showroom
      </h2>

      {/* Stage */}
      <div className="absolute inset-0 flex items-center justify-center [perspective:1200px]">
        {use3D && near ? (
          <div className={`absolute inset-0 transition-opacity duration-[1500ms] ${ready ? "opacity-100" : "opacity-0"}`}>
            <ProductScene progress={progress} pointer={pointer} active={active} textureUrl={textureUrl} onReady={() => setReady(true)} />
          </div>
        ) : null}

        {!use3D && (
          <div className="relative w-[70vw] max-w-[520px] md:w-[36vw]">
            <div data-fallback-shadow aria-hidden className="absolute -bottom-10 left-[10%] h-10 w-[80%] rounded-[50%] bg-black/50 blur-2xl" />
            <div data-fallback-frame className="relative aspect-square overflow-hidden shadow-[0_60px_120px_-40px_rgba(0,0,0,0.8)] [transform-style:preserve-3d]">
              <Image src={image.src} alt={image.alt} fill sizes="(min-width: 768px) 36vw, 70vw" className="object-cover" style={{ objectPosition: image.focal }} />
              <div
                data-fallback-light
                aria-hidden
                className="absolute inset-0 mix-blend-soft-light"
                style={{ background: "linear-gradient(100deg, transparent 30%, rgba(255,247,232,0.85) 50%, transparent 70%)" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Captions + CTA */}
      <div className="gutter-x absolute inset-x-0 bottom-0 mx-auto flex max-w-[1680px] items-end justify-between pb-10 md:pb-14">
        <div className="relative h-16 w-[60vw] md:w-[30vw]" aria-live="off">
          {CAPTIONS.map((c, i) => (
            <p key={c} data-caption className={`serif-display absolute bottom-0 left-0 text-3xl italic text-champagne md:text-4xl ${i === 0 ? "" : "opacity-0"}`}>
              {c}
            </p>
          ))}
        </div>
        <div data-showcase-cta className="hidden md:block">
          <ButtonLink href={`/products/${product.slug}`} tone="light">
            View the {product.title}
          </ButtonLink>
        </div>
      </div>
      <p className="eyebrow gutter-x absolute left-0 top-[calc(var(--header-h)+1.5rem)] text-[10px] text-ivory/50">N° 02 — {product.title}</p>
    </section>
  );
}
