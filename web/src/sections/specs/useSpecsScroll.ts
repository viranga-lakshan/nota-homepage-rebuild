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

/* Outro & Manifesto Transition Markers */
const OUTRO_FADE_START = 46;
const OUTRO_FADE_END = 50;
const HORIZONTAL_EXPAND_START = 50;
const HORIZONTAL_EXPAND_END = 66;

const MANIFESTO_FADE_START = 66;
const MANIFESTO_FADE_END = 70;
const MANIFESTO_WORDS_START = 70;
const MANIFESTO_WORDS_END = 95;

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

          const transitionOverlay = section.querySelector<HTMLElement>(
            "[data-specs-transition]"
          );
          const stem = section.querySelector<HTMLElement>("[data-specs-tier='stem']");
          const bodyUpper = section.querySelector<HTMLElement>("[data-specs-tier='bodyUpper']");
          const bodyLower = section.querySelector<HTMLElement>("[data-specs-tier='bodyLower']");
          const base = section.querySelector<HTMLElement>("[data-specs-tier='base']");
          const manifestoWrapper = section.querySelector<HTMLElement>(
            "[data-specs-manifesto]"
          );
          const manifestoWords = Array.from(
            section.querySelectorAll<HTMLElement>("[data-specs-word]")
          );

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

            // -------------------------------------------------------------
            // 5. Outro: Entire stepped silhouette appears simultaneously in center
            // -------------------------------------------------------------
            if (transitionOverlay) {
              timeline.fromTo(
                transitionOverlay,
                { opacity: 0 },
                {
                  opacity: 1,
                  ease: "power1.inOut",
                  duration: OUTRO_FADE_END - OUTRO_FADE_START,
                },
                OUTRO_FADE_START
              );
            }

            // -------------------------------------------------------------
            // 6. Outro: Pure Centered Horizontal Expansion (scaleY fixed)
            //    All 4 tiers expand horizontally simultaneously while
            //    maintaining the stepped pyramid proportions until 100% black.
            // -------------------------------------------------------------
            const expandDuration = HORIZONTAL_EXPAND_END - HORIZONTAL_EXPAND_START;

            if (stem) {
              timeline.fromTo(
                stem,
                { scaleX: 1, scaleY: 1, transformOrigin: "50% 50%" },
                {
                  scaleX: 120,
                  ease: "power1.inOut",
                  duration: expandDuration,
                },
                HORIZONTAL_EXPAND_START
              );
            }

            if (bodyUpper) {
              timeline.fromTo(
                bodyUpper,
                { scaleX: 1, scaleY: 1, transformOrigin: "50% 50%" },
                {
                  scaleX: 36,
                  ease: "power1.inOut",
                  duration: expandDuration,
                },
                HORIZONTAL_EXPAND_START
              );
            }

            if (bodyLower) {
              timeline.fromTo(
                bodyLower,
                { scaleX: 1, scaleY: 1, transformOrigin: "50% 50%" },
                {
                  scaleX: 15,
                  ease: "power1.inOut",
                  duration: expandDuration,
                },
                HORIZONTAL_EXPAND_START
              );
            }

            if (base) {
              timeline.fromTo(
                base,
                { scaleX: 1, scaleY: 1, transformOrigin: "50% 50%" },
                {
                  scaleX: 7,
                  ease: "power1.inOut",
                  duration: expandDuration,
                },
                HORIZONTAL_EXPAND_START
              );
            }

            // -------------------------------------------------------------
            // 7. Outro: Directly on the solid black screen, Manifesto appears in-place
            // -------------------------------------------------------------
            if (manifestoWrapper) {
              timeline.fromTo(
                manifestoWrapper,
                { opacity: 0 },
                {
                  opacity: 1,
                  ease: "power1.inOut",
                  duration: MANIFESTO_FADE_END - MANIFESTO_FADE_START,
                },
                MANIFESTO_FADE_START
              );
            }

            // 8. Outro: Manifesto words turn from gray to white word-by-word
            if (manifestoWords.length > 0) {
              const totalManifestoDuration = MANIFESTO_WORDS_END - MANIFESTO_WORDS_START;
              const step = totalManifestoDuration / manifestoWords.length;

              manifestoWords.forEach((word, index) => {
                const start = MANIFESTO_WORDS_START + index * step;
                timeline.fromTo(
                  word,
                  { color: "rgba(255, 255, 255, 0.4)" },
                  {
                    color: "#ffffff",
                    ease: "none",
                    duration: step * 1.5,
                  },
                  start
                );
              });
            }

            return () => {
              timeline.scrollTrigger?.kill();
              timeline.kill();
            };
          }

          // Mobile scrubbed transition pin
          if (isMobile) {
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
              },
            });

            // Mobile: Fade in entire stepped silhouette
            mobileTimeline.fromTo(
              transitionOverlay,
              { opacity: 0 },
              { opacity: 1, ease: "power1.inOut", duration: 10 },
              0
            );

            // Mobile: Symmetrical horizontal expansion (scaleY fixed)
            if (stem) {
              mobileTimeline.fromTo(
                stem,
                { scaleX: 1, scaleY: 1, transformOrigin: "50% 50%" },
                { scaleX: 45, ease: "power1.inOut", duration: 35 },
                10
              );
            }

            if (bodyUpper) {
              mobileTimeline.fromTo(
                bodyUpper,
                { scaleX: 1, scaleY: 1, transformOrigin: "50% 50%" },
                { scaleX: 14, ease: "power1.inOut", duration: 35 },
                10
              );
            }

            if (bodyLower) {
              mobileTimeline.fromTo(
                bodyLower,
                { scaleX: 1, scaleY: 1, transformOrigin: "50% 50%" },
                { scaleX: 6, ease: "power1.inOut", duration: 35 },
                10
              );
            }

            if (base) {
              mobileTimeline.fromTo(
                base,
                { scaleX: 1, scaleY: 1, transformOrigin: "50% 50%" },
                { scaleX: 3, ease: "power1.inOut", duration: 35 },
                10
              );
            }

            if (manifestoWrapper) {
              mobileTimeline.fromTo(
                manifestoWrapper,
                { opacity: 0 },
                { opacity: 1, ease: "power1.inOut", duration: 10 },
                45
              );
            }

            if (manifestoWords.length > 0) {
              const step = 40 / manifestoWords.length;
              manifestoWords.forEach((word, index) => {
                mobileTimeline.fromTo(
                  word,
                  { color: "rgba(255, 255, 255, 0.4)" },
                  { color: "#ffffff", ease: "none", duration: step * 1.5 },
                  55 + index * step
                );
              });
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
