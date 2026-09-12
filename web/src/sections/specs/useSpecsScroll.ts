"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import { gsap } from "@/lib/animation/gsap.client";

interface UseSpecsScrollOptions {
  containerRef: RefObject<HTMLElement | null>;
  penRef: RefObject<HTMLDivElement | null>;
  cardRefs: RefObject<(HTMLDivElement | null)[]>;
}

/**
 * Pins the section while the pen scales up and the three cards enter at
 * staggered offsets (CLAUDE.md §3: "pen scales up behind three cards while
 * the heading holds position" / "three columns entering at different
 * vertical speeds").
 *
 * The exact stagger timing isn't sourced from a value I could verify —
 * two different "exact spec" documents gave two different, mutually
 * inconsistent sets of keyframe percentages for this specific animation,
 * which is exactly the kind of claim that's turned out wrong elsewhere
 * this project. A clean, even stagger is what's built here instead of
 * picking one of two unverifiable numbers.
 */
export function useSpecsScroll({ containerRef, penRef, cardRefs }: UseSpecsScrollOptions) {
  useEffect(() => {
    const container = containerRef.current;
    const pen = penRef.current;
    const cards = cardRefs.current;

    if (!container || !pen || !cards) {
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
            gsap.set(pen, { scale: 1 });
            gsap.set(cards, { y: "0%", opacity: 1 });
            return;
          }

          gsap.set(pen, { scale: 0.7 });
          gsap.set(cards, { y: "140%" });

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: container,
              start: "top top",
              end: "+=150%",
              pin: true,
              scrub: true,
            },
          });

          timeline.to(pen, { scale: 1, ease: "none" }, 0);
          timeline.to(cards, { y: "0%", stagger: 0.15, ease: "none" }, 0.1);

          return () => timeline.scrollTrigger?.kill();
        }
      );
    }, container);

    return () => context.revert();
  }, [containerRef, penRef, cardRefs]);
}
