"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import { gsap } from "@/lib/animation/gsap.client";

/**
 * Timeline units are percentages of the section's scrubbed range — 200vh,
 * the 300vh section minus its 100vh camera. Every window below is the
 * reference's own, read from its animation config rather than eyeballed:
 *
 *   content   opacity 0 -> 1          0 -> 6
 *   heading   opacity 0 -> 1          2 -> 10   (held invisible for 0 -> 2)
 *   heading   y 32.68vh -> 0         10 -> 50
 *   cards     y 140% -> 0            25 -> 45 / 60 / 75
 *
 * The cards all start together and land at three different times, which is
 * what produces the staggered-parallax entrance: the left column settles
 * first, the right column is still climbing.
 *
 * Simplification worth stating: each card's move is expressed in the source
 * as four chained sub-keyframes with intermediate values (140% -> 113.69%
 * -> 0). The net motion is a single eased climb to 0 finishing at the times
 * above, which is what this reproduces; the intermediate stops are not.
 */
const CARD_RISE_START = 25;
const CARD_RISE_END = [45, 60, 75];
const CONTENT_FADE_END = 6;
const HEADING_FADE_START = 2;
const HEADING_FADE_END = 10;
const HEADING_RISE_END = 50;
const HEADING_OFFSET = "32.68vh";

/**
 * The pen is the one element not on that range. Its trigger starts a whole
 * viewport earlier — when the section's top reaches the *bottom* of the
 * screen rather than the top — so it is already rising while the curtains
 * ahead of it are still closing, and it keeps rising well into the section.
 * That is the reference's own configuration (`scrollerStartOffset: 100%`),
 * and it is why the pen appears to enter with the section rather than after
 * it.
 */
const PEN_RISE_START = 25;
const PEN_RISE_END = 75;
const PEN_OFFSET = 130;

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
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const isDesktop = Boolean(ctx.conditions?.isDesktop);
          const reduceMotion = Boolean(ctx.conditions?.reduceMotion);

          // The stylesheet already renders the finished state in both cases
          // (no camera, no offsets), so there is nothing here to animate and
          // no trigger to create.
          if (!isDesktop || reduceMotion) {
            return;
          }

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

          if (content) {
            timeline.fromTo(
              content,
              { opacity: 0 },
              { opacity: 1, ease: "power1.inOut", duration: CONTENT_FADE_END },
              0
            );
          }

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

            // Animating `y` in the same unit the stylesheet uses, rather
            // than yPercent, so GSAP overwrites that starting transform
            // instead of stacking a second offset on top of it.
            timeline.fromTo(
              heading,
              { y: HEADING_OFFSET },
              {
                y: 0,
                ease: "power1.inOut",
                duration: HEADING_RISE_END - HEADING_FADE_END,
              },
              HEADING_FADE_END
            );
          }

          cards.forEach((card, index) => {
            const end = CARD_RISE_END[index] ?? CARD_RISE_END[CARD_RISE_END.length - 1];

            timeline.fromTo(
              card,
              // `y: 0` zeroes the pixel offset GSAP reads back out of the
              // stylesheet's own `translate3d(0, 140%, 0)`; without it the
              // percentage below is added to it rather than replacing it.
              { yPercent: 140, y: 0 },
              {
                yPercent: 0,
                ease: "power1.inOut",
                duration: end - CARD_RISE_START,
              },
              CARD_RISE_START
            );
          });

          const penTimeline = pen
            ? gsap.timeline({
                scrollTrigger: {
                  trigger: section,
                  // One viewport earlier than the timeline above; see
                  // PEN_RISE_START.
                  start: "top bottom",
                  end: "bottom bottom",
                  scrub: true,
                },
              })
            : null;

          penTimeline?.fromTo(
            pen,
            { yPercent: PEN_OFFSET, y: 0 },
            {
              yPercent: 0,
              ease: "power1.inOut",
              duration: PEN_RISE_END - PEN_RISE_START,
            },
            PEN_RISE_START
          );

          return () => {
            timeline.scrollTrigger?.kill();
            timeline.kill();
            penTimeline?.scrollTrigger?.kill();
            penTimeline?.kill();
          };
        }
      );
    }, section);

    return () => context.revert();
  }, [sectionRef]);
}
