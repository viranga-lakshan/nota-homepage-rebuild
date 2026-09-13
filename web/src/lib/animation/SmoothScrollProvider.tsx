"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap.client";

/**
 * Global smooth scroll, wired into GSAP's own ticker so Lenis and
 * ScrollTrigger share one requestAnimationFrame loop rather than two
 * independently-timed ones drifting apart from each other.
 *
 * Two options from the brief's spec do not exist on the installed Lenis
 * (1.3.26) and passing them would be a TypeScript error, not a silent
 * no-op - the API changed between whatever version that spec was written
 * against and this one:
 *
 *   smoothTouch: false   -> now `syncTouch`, already false by default.
 *                            Its purpose (no synthetic smoothing on touch,
 *                            native momentum instead) is unchanged; the
 *                            flag just does not need setting.
 *   normalizeWheel: true -> removed. No equivalent option remains, which
 *                            reads as the library now normalizing wheel
 *                            deltas unconditionally rather than behind a
 *                            toggle. Flagging rather than inventing a
 *                            replacement I cannot verify.
 *
 * `respectReducedMotion` defaults to true on this version - Lenis already
 * forces 1:1 scrolling under prefers-reduced-motion on its own. This
 * component still gates its own existence on the same preference (see
 * below), rather than leaning on that default alone: CLAUDE.md §8 says
 * every animation is gated explicitly, and that should hold regardless of
 * what a dependency happens to default to today.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      lerp: 0.08,
      smoothWheel: true,
      syncTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    function raf(time: number) {
      lenis.raf(time * 1000);
    }

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return children;
}
