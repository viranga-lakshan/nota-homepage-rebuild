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
const CONTENT_FADE_END = 5;
const HEADING_FADE_START = 2;
const HEADING_FADE_END = 8;
const HEADING_RISE_START = 8;
const HEADING_RISE_END = 35;
const HEADING_OFFSET = "32.68vh";

const CARD_RISE_START = 15;
const CARD_RISE_END = [32, 40, 48];

const PEN_RISE_START = 15;
const PEN_RISE_END = 45;
const PEN_OFFSET = 130;

/* Outro Two-Phase Transition Markers */
const REVEAL_START = 54;
const STEM_REVEAL_END = 60;
const BODY_UP_REVEAL_START = 58;
const BODY_UP_REVEAL_END = 64;
const BODY_LOW_REVEAL_START = 61;
const BODY_LOW_REVEAL_END = 66;
const BASE_REVEAL_START = 64;
const BASE_REVEAL_END = 68;

const HORIZONTAL_EXPAND_START = 68;
const HORIZONTAL_EXPAND_END = 100;

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
          const isMobile = Boolean(ctx.conditions?.isMobile);
          const reduceMotion = Boolean(ctx.conditions?.reduceMotion);

          if (reduceMotion) {
            return;
          }

          const stem = section.querySelector<HTMLElement>("[data-specs-tier='stem']");
          const bodyUpper = section.querySelector<HTMLElement>("[data-specs-tier='bodyUpper']");
          const bodyLower = section.querySelector<HTMLElement>("[data-specs-tier='bodyLower']");
          const base = section.querySelector<HTMLElement>("[data-specs-tier='base']");

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
                onLeave: () => {
                  const trans = section.querySelector<HTMLElement>("[data-specs-transition]");
                  if (trans) trans.style.display = "none";
                },
                onEnterBack: () => {
                  const trans = section.querySelector<HTMLElement>("[data-specs-transition]");
                  if (trans) trans.style.display = "";
                },
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

            // -------------------------------------------------------------
            // 5. Outro Phase 1: Reveal 4 parts from top to bottom in center
            // -------------------------------------------------------------
            if (stem) {
              timeline.fromTo(
                stem,
                { scaleY: 0, scaleX: 1, xPercent: -50, transformOrigin: "50% 0%" },
                {
                  scaleY: 1,
                  ease: "power1.inOut",
                  duration: STEM_REVEAL_END - REVEAL_START,
                },
                REVEAL_START
              );
            }

            if (bodyUpper) {
              timeline.fromTo(
                bodyUpper,
                { scaleY: 0, scaleX: 1, xPercent: -50, transformOrigin: "50% 0%" },
                {
                  scaleY: 1,
                  ease: "power1.inOut",
                  duration: BODY_UP_REVEAL_END - BODY_UP_REVEAL_START,
                },
                BODY_UP_REVEAL_START
              );
            }

            if (bodyLower) {
              timeline.fromTo(
                bodyLower,
                { scaleY: 0, scaleX: 1, xPercent: -50, transformOrigin: "50% 0%" },
                {
                  scaleY: 1,
                  ease: "power1.inOut",
                  duration: BODY_LOW_REVEAL_END - BODY_LOW_REVEAL_START,
                },
                BODY_LOW_REVEAL_START
              );
            }

            if (base) {
              timeline.fromTo(
                base,
                { scaleY: 0, scaleX: 1, xPercent: -50, transformOrigin: "50% 0%" },
                {
                  scaleY: 1,
                  ease: "power1.inOut",
                  duration: BASE_REVEAL_END - BASE_REVEAL_START,
                },
                BASE_REVEAL_START
              );
            }

            // -------------------------------------------------------------
            // 6. Outro Phase 2: Pure Centered Horizontal Expansion (scaleY FIXED)
            //    All 4 original parts expand horizontally together while
            //    retaining their relative stepped geometry at every point.
            // -------------------------------------------------------------
            const expandDuration = HORIZONTAL_EXPAND_END - HORIZONTAL_EXPAND_START;

            if (stem) {
              timeline.fromTo(
                stem,
                { scaleX: 1 },
                {
                  scaleX: 45,
                  ease: "power1.inOut",
                  duration: expandDuration,
                },
                HORIZONTAL_EXPAND_START
              );
            }

            if (bodyUpper) {
              timeline.fromTo(
                bodyUpper,
                { scaleX: 1 },
                {
                  scaleX: 8,
                  ease: "power1.inOut",
                  duration: expandDuration,
                },
                HORIZONTAL_EXPAND_START
              );
            }

            if (bodyLower) {
              timeline.fromTo(
                bodyLower,
                { scaleX: 1 },
                {
                  scaleX: 4,
                  ease: "power1.inOut",
                  duration: expandDuration,
                },
                HORIZONTAL_EXPAND_START
              );
            }

            if (base) {
              timeline.fromTo(
                base,
                { scaleX: 1 },
                {
                  scaleX: 2.5,
                  ease: "power1.inOut",
                  duration: expandDuration,
                },
                HORIZONTAL_EXPAND_START
              );
            }

            return () => {
              timeline.scrollTrigger?.kill();
              timeline.kill();
            };
          }

          // Mobile scrubbed transition pin
          if (isMobile) {
            const transitionOverlay = section.querySelector<HTMLElement>(
              "[data-specs-transition]"
            );

            if (!transitionOverlay) {
              return;
            }

            const mobileTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: "bottom bottom",
                end: "+=120%",
                pin: true,
                scrub: true,
                onLeave: () => {
                  if (transitionOverlay) transitionOverlay.style.display = "none";
                },
                onEnterBack: () => {
                  if (transitionOverlay) transitionOverlay.style.display = "";
                },
              },
            });

            // Mobile Phase 1: Reveal 4 parts
            if (stem) {
              mobileTimeline.fromTo(
                stem,
                { scaleY: 0, scaleX: 1, xPercent: -50, transformOrigin: "50% 0%" },
                { scaleY: 1, ease: "power1.inOut", duration: 15 },
                0
              );
            }

            if (bodyUpper) {
              mobileTimeline.fromTo(
                bodyUpper,
                { scaleY: 0, scaleX: 1, xPercent: -50, transformOrigin: "50% 0%" },
                { scaleY: 1, ease: "power1.inOut", duration: 15 },
                8
              );
            }

            if (bodyLower) {
              mobileTimeline.fromTo(
                bodyLower,
                { scaleY: 0, scaleX: 1, xPercent: -50, transformOrigin: "50% 0%" },
                { scaleY: 1, ease: "power1.inOut", duration: 15 },
                16
              );
            }

            if (base) {
              mobileTimeline.fromTo(
                base,
                { scaleY: 0, scaleX: 1, xPercent: -50, transformOrigin: "50% 0%" },
                { scaleY: 1, ease: "power1.inOut", duration: 15 },
                24
              );
            }

            // Mobile Phase 2: Symmetrical horizontal expansion (scaleY fixed)
            if (stem) {
              mobileTimeline.fromTo(
                stem,
                { scaleX: 1 },
                { scaleX: 28, ease: "power1.inOut", duration: 65 },
                35
              );
            }

            if (bodyUpper) {
              mobileTimeline.fromTo(
                bodyUpper,
                { scaleX: 1 },
                { scaleX: 4.2, ease: "power1.inOut", duration: 65 },
                35
              );
            }

            if (bodyLower) {
              mobileTimeline.fromTo(
                bodyLower,
                { scaleX: 1 },
                { scaleX: 2.3, ease: "power1.inOut", duration: 65 },
                35
              );
            }

            if (base) {
              mobileTimeline.fromTo(
                base,
                { scaleX: 1 },
                { scaleX: 1.6, ease: "power1.inOut", duration: 65 },
                35
              );
            }

            return () => {
              mobileTimeline.scrollTrigger?.kill();
              mobileTimeline.kill();
            };
          }
        }
      );
    }, section);

    return () => context.revert();
  }, [sectionRef]);
}
