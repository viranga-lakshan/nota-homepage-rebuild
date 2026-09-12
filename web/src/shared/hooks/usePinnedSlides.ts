"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/animation/gsap.client";

interface UsePinnedSlidesOptions {
  containerRef: RefObject<HTMLElement | null>;
  slideRefs: RefObject<(HTMLElement | null)[]>;
  onActiveChange?: (index: number) => void;
  /** Scroll distance per slide transition, as a percentage of viewport height. */
  slideDurationVh?: number;
}

/**
 * Pins a full-viewport container while its children cross-fade in sequence
 * as the page scrolls — the mechanism behind both Paper and Color Variants
 * (CLAUDE.md §3: full-bleed slides that expand/contract, and a colour
 * carousel), factored out here rather than duplicated between them since
 * both need the exact same pin-and-crossfade behaviour, just with
 * different content and slide counts.
 *
 * Uses GSAP's own pin:true rather than a CSS position:sticky trick — see
 * sections/hero for why that choice was made deliberately, not by default.
 */
export function usePinnedSlides({
  containerRef,
  slideRefs,
  onActiveChange,
  slideDurationVh = 100,
}: UsePinnedSlidesOptions) {
  useEffect(() => {
    const container = containerRef.current;
    const slides = slideRefs.current;

    if (!container || !slides || slides.length === 0) {
      return;
    }

    const context = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 992px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const isDesktop = Boolean(ctx.conditions?.isDesktop);
          const reduceMotion = Boolean(ctx.conditions?.reduceMotion);

          if (!isDesktop || reduceMotion) {
            // Render the final state, do not animate (CLAUDE.md §8): the
            // first slide, plainly, no pin.
            slides.forEach((slide, index) => {
              if (slide) slide.style.opacity = index === 0 ? "1" : "0";
            });
            onActiveChange?.(0);
            return;
          }

          gsap.set(slides, { opacity: (index: number) => (index === 0 ? 1 : 0) });

          const totalDuration = slideDurationVh * (slides.length - 1);

          const trigger = ScrollTrigger.create({
            trigger: container,
            start: "top top",
            end: `+=${totalDuration}%`,
            pin: true,
            scrub: true,
            onUpdate: (self) => {
              const index = Math.min(slides.length - 1, Math.floor(self.progress * slides.length));

              slides.forEach((slide, i) => {
                if (slide) slide.style.opacity = i === index ? "1" : "0";
              });
              onActiveChange?.(index);
            },
          });

          return () => trigger.kill();
        }
      );
    }, container);

    return () => context.revert();
  }, [containerRef, slideRefs, onActiveChange, slideDurationVh]);
}
