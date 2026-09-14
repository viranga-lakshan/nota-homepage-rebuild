"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import { gsap } from "@/lib/animation/gsap.client";

/**
 * Entrance keyframe timeline units (% of section scrub range):
 *
 *   content   opacity 0 -> 1          0 -> 5
 *   heading   opacity 0 -> 1          2 -> 8
 *   heading   y 32.68vh -> 0          8 -> 35
 *   cards     y 140% -> 0             15 -> 32 / 40 / 48
 *   pen       yPercent 130 -> 0       15 -> 45
 *
 * Settle window (48 -> 54):
 *   Specifications section rests in full view.
 *
 * Outro Transition (Two distinct, sequential phases):
 *   Phase 1 (54 -> 68): Initial top-to-bottom reveal of the 4-tier Nota pen silhouette.
 *                       At 68%, all 4 parts are fully established in the center.
 *                       Vertical positions and heights (scaleY) freeze completely.
 *   Phase 2 (68 -> 100): All 4 original parts expand horizontally from the center
 *                        (scaleX increasing), maintaining their distinct stepped
 *                        proportions at all times until solid black fills the viewport.
 */
const CONTENT_FADE_END = 8;

const HEADING_FADE_START = 0;
const HEADING_FADE_END = 18;
const HEADING_RISE_START = 0;
const HEADING_RISE_END = 22;
const HEADING_OFFSET = "22vh";

const PEN_RISE_START = 5;
const PEN_RISE_END = 28;
const PEN_OFFSET = 120;

const CARD_RISE_START = 18;
const CARD_RISE_END = [30, 36, 42];

interface UseSpecsScrollOptions {
  sectionRef: RefObject<HTMLElement | null>;
}

export function useSpecsScroll({ sectionRef }: UseSpecsScrollOptions) {
  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const context = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 992px)",
          isMobile: "(max-width: 991px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const isDesktop = Boolean(ctx.conditions?.isDesktop);
          const reduceMotion = Boolean(ctx.conditions?.reduceMotion);

          if (reduceMotion) {
            return;
          }

          if (isDesktop) {
            const content = section.querySelector<HTMLElement>("[data-content]");
            const heading = section.querySelector<HTMLElement>("[data-heading]");
            const pen = section.querySelector<HTMLElement>("[data-pen]");
            const cards = Array.from(
              section.querySelectorAll<HTMLElement>("[data-card]")
            );

            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: "bottom bottom",
                scrub: true,
              },
            });

            // 1. Entrance: Content fade in
            if (content) {
              timeline.fromTo(
                content,
                { opacity: 0 },
                { opacity: 1, ease: "power1.inOut", duration: CONTENT_FADE_END },
                0
              );
            }

            // 2. Entrance: Heading fade & rise
            if (heading) {
              timeline.fromTo(
                heading,
                { opacity: 0 },
                {
                  opacity: 1,
                  ease: "power1.inOut",
                  duration: HEADING_FADE_END - HEADING_FADE_START,
                },
                HEADING_FADE_START
              );

              timeline.fromTo(
                heading,
                { y: HEADING_OFFSET },
                {
                  y: 0,
                  ease: "power1.inOut",
                  duration: HEADING_RISE_END - HEADING_RISE_START,
                },
                HEADING_RISE_START
              );
            }

            // 3. Entrance: Cards staggered rise
            cards.forEach((card, index) => {
              const end = CARD_RISE_END[index] ?? CARD_RISE_END[CARD_RISE_END.length - 1];

              timeline.fromTo(
                card,
                { yPercent: 140, y: 0 },
                {
                  yPercent: 0,
                  ease: "power1.inOut",
                  duration: end - CARD_RISE_START,
                },
                CARD_RISE_START
              );
            });

            // 4. Entrance: Pen climb
            if (pen) {
              timeline.fromTo(
                pen,
                { yPercent: PEN_OFFSET, y: 0 },
                {
                  yPercent: 0,
                  ease: "power1.inOut",
                  duration: PEN_RISE_END - PEN_RISE_START,
                },
                PEN_RISE_START
              );
            }

            return () => {
              timeline.scrollTrigger?.kill();
              timeline.kill();
            };
          }
        }
      );
    }, section);

    return () => context.revert();
  }, [sectionRef]);
}
