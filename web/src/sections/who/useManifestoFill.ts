"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/animation/gsap.client";

interface UseManifestoFillOptions {
  containerRef: RefObject<HTMLElement | null>;
  wordRefs: RefObject<(HTMLSpanElement | null)[]>;
}

/**
 * Fills the manifesto from grey to white as it scrolls through the
 * viewport (CLAUDE.md §3). Word-level, not character-level: character
 * splitting is the usual way to build this effect, but it means hundreds
 * of meaningless DOM nodes for a screen reader to wade through, and a
 * plain CSS gradient-text version of the same idea breaks reading order
 * across wrapped lines (a horizontal gradient tracks the block's geometry,
 * not the text's reading order). Word-level keeps the node count sane and
 * the fill order correct; the real sentence is exposed once via
 * `aria-label` on the paragraph, with the decorative per-word spans
 * hidden from assistive tech (see index.tsx).
 */
export function useManifestoFill({ containerRef, wordRefs }: UseManifestoFillOptions) {
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
            // Render the final state, do not animate (CLAUDE.md §8).
            words.forEach((word) => {
              if (word) word.style.color = "var(--color-white)";
            });
            return;
          }

          words.forEach((word) => {
            if (word) word.style.color = "var(--color-gray)";
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
                word.style.color = index < litCount ? "var(--color-white)" : "var(--color-gray)";
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
