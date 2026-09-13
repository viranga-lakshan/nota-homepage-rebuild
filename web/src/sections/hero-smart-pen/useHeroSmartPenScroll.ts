"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import { gsap } from "@/lib/animation/gsap.client";

/**
 * Timeline units are percentages of the hero's scrubbed scroll range, which is
 * 300vh (see useHeroScroll). The curtains occupy its final third — the last
 * 100vh of it — so the hero scrubs its pen for two thirds of the range
 * and is then covered.
 *
 * Within that third, the windows are the reference's own keyframe values,
 * offset by PHASE_START:
 *
 *   curtain 1   0 -> 50      curtain 4  30 -> 80
 *   curtain 2  10 -> 60      curtain 5  40 -> 90
 *   curtain 3  20 -> 70      curtain 6  50 -> 100
 *
 * Each curtain travels for half the phase and each starts 10% after the one
 * to its left, which is what makes this read as a staggered climb rather
 * than six panels moving as one. The last lands exactly as the pin ends.
 *
 * One difference from the reference worth stating plainly: there the curtain
 * phase is an 80vh section of its own, overlapping the hero by 100vh. Here
 * it is the last 100vh of the hero's scrub. The sequence and the proportions
 * between the six curtains are identical; the absolute scroll distance is
 * approximately, not exactly, the reference's.
 */
const HERO_SCRUB_LENGTH = 300;
const PHASE_START = 200;
const CURTAIN_TRAVEL = 50;
const CURTAIN_STAGGER_STEP = 10;
const VEIL_START = 25;
const VEIL_OPACITY = 0.75;

interface UseHeroSmartPenScrollOptions {
  /** The overlay holding the curtains and the veil. */
  overlayRef: RefObject<HTMLDivElement | null>;
  /**
   * The hero section. This transition rides the hero's existing scrub
   * rather than creating a range of its own — it is the element whose
   * camera is already stuck on screen, and the curtains have to cover it
   * while it is still there.
   */
  heroRef: RefObject<HTMLElement | null>;
}

export function useHeroSmartPenScroll({
  overlayRef,
  heroRef,
}: UseHeroSmartPenScrollOptions) {
  useEffect(() => {
    const overlay = overlayRef.current;
    const hero = heroRef.current;

    if (!overlay || !hero) {
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

          // Both cases are already `display: none` in CSS; this is the
          // matching half of that decision, so no ScrollTrigger is created
          // for an element that is not on the page. It also keeps this hook
          // in step with useHeroScroll, which skips its scrub under exactly
          // the same two conditions — without it there is nothing for
          // these curtains to ride.
          if (!isDesktop || reduceMotion) {
            return;
          }

          const curtains = Array.from(
            overlay.querySelectorAll<HTMLElement>("[data-curtain]")
          );
          const veil = overlay.querySelector<HTMLElement>("[data-veil]");

          const timeline = gsap.timeline({
            scrollTrigger: {
              // Same element and same range as the hero's own scrub, so
              // the two are driven by one identical stretch of scrolling:
              // the hero is 400vh with a 100vh sticky camera, giving the
              // HERO_SCRUB_LENGTH below.
              trigger: hero,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
            },
          });

          curtains.forEach((curtain, index) => {
            timeline.fromTo(
              curtain,
              // `y: 0` is load-bearing. The curtain's off-screen start is
              // set in CSS (`translate3d(0, 100%, 0)`) so it never paints
              // over the hero before this runs, and GSAP parses that
              // existing transform into its own `y` — 900px on a 900px-tall
              // viewport. Without zeroing it, `yPercent: 100` stacks on top
              // of it and the curtain starts two viewports down instead of
              // one, then never fully arrives.
              { yPercent: 100, y: 0 },
              { yPercent: 0, ease: "power1.inOut", duration: CURTAIN_TRAVEL },
              PHASE_START + index * CURTAIN_STAGGER_STEP
            );
          });

          if (veil) {
            timeline.fromTo(
              veil,
              { opacity: 0 },
              {
                opacity: VEIL_OPACITY,
                ease: "none",
                duration: HERO_SCRUB_LENGTH - (PHASE_START + VEIL_START),
              },
              PHASE_START + VEIL_START
            );
          }

          return () => {
            timeline.scrollTrigger?.kill();
            timeline.kill();
          };
        }
      );
    }, overlay);

    return () => context.revert();
  }, [overlayRef, heroRef]);
}
