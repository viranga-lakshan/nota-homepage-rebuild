"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/animation/gsap.client";

interface UseTitleFillOptions {
  containerRef: RefObject<HTMLElement | null>;
  wordRefs: RefObject<(HTMLSpanElement | null)[]>;
}

/**
 * Same word-level scroll fill as sections/who/useManifestoFill.ts (see
 * that file for why word-level rather than character-level), light grey
 * to black rather than grey to white — this section is on a white
 * background. Kept as its own co-located hook rather than factored into a
 * shared one: CLAUDE.md §8 co-locates a section's own hook with it, and
 * the only difference between the two (the colour pair) isn't worth a
 * shared abstraction with a parameter for something used by exactly two
 * call sites.
 */
export function useTitleFill({ containerRef, wordRefs }: UseTitleFillOptions) {
  useEffect(() => {
    const container = containerRef.current;
    const words = wordRefs.current;

    if (!container || !words || words.length === 0) {
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
            words.forEach((word) => {
              if (word) word.style.color = "var(--color-black)";
            });
            return;
          }

          words.forEach((word) => {
            if (word) word.style.color = "var(--color-gray-light)";
          });

          const trigger = ScrollTrigger.create({
            trigger: container,
            start: "top 80%",
            end: "bottom 40%",
            scrub: true,
            onUpdate: (self) => {
              const litCount = Math.round(self.progress * words.length);
              words.forEach((word, index) => {
                if (!word) return;
                word.style.color = index < litCount ? "var(--color-black)" : "var(--color-gray-light)";
              });
            },
          });

          return () => trigger.kill();
        }
      );
    }, container);

    return () => context.revert();
  }, [containerRef, wordRefs]);
}
