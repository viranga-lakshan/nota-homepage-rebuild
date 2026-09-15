"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/animation/gsap.client";

interface UseHeroScrollOptions {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  containerRef: RefObject<HTMLElement | null>;
  sequenceBasePath: string;
  sequenceFrameCount: number;
  /**
   * Only the desktop tree pins and scrubs — the mobile tree shows a single
   * CMS image instead (CLAUDE.md §8), so this hook does nothing at all when
   * false. Belt-and-braces alongside the CSS-hidden desktop tree: the
   * frame sequence must never be fetched on a connection it will never be
   * seen on, and CSS visibility alone does not stop a network request that
   * already fired.
   */
  enabled: boolean;
}

function frameUrl(basePath: string, index: number): string {
  return `${basePath}frame-${String(index).padStart(3, "0")}.webp`;
}

/**
 * Preloads the frame sequence and drives it from scroll position.
 *
 * The pin/scrub ScrollTrigger and the frame preload are independent
 * processes: the ScrollTrigger is created immediately, and each frame
 * redraws the canvas the moment it finishes loading rather than waiting for
 * all 75 to arrive. A scrub that outruns the network shows the most
 * recently loaded frame instead of a blank canvas, and catches up as the
 * rest of the sequence arrives.
 */
export function useHeroScroll({
  canvasRef,
  containerRef,
  sequenceBasePath,
  sequenceFrameCount,
  enabled,
}: UseHeroScrollOptions) {
  const currentFrameRef = useRef(0);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) {
      return;
    }

    const ctx2d = canvas.getContext("2d");

    if (!ctx2d) {
      return;
    }

    const images: HTMLImageElement[] = new Array(sequenceFrameCount);

    // The canvas fills the sticky camera (its own parent), which is one
    // viewport tall. The section it lives in is 400vh — four times too
    // tall to size a canvas from.
    const camera = canvas.parentElement!;

    function resizeCanvas() {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas!.clientWidth;
      const height = canvas!.clientHeight;

      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx2d!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // Cover-fit: fills the canvas without distorting the frame's aspect
    // ratio, cropping whichever axis overflows — the same behaviour as
    // CSS `object-fit: cover`, reimplemented because a canvas has none.
    function drawFrame(index: number) {
      const img = images[index];

      if (!img || !img.complete || img.naturalWidth === 0) {
        return;
      }

      const width = canvas!.clientWidth;
      const height = canvas!.clientHeight;
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const boxRatio = width / height;

      const drawWidth = imgRatio > boxRatio ? height * imgRatio : width;
      const drawHeight = imgRatio > boxRatio ? height : width / imgRatio;
      const offsetX = (width - drawWidth) / 2;
      const offsetY = (height - drawHeight) / 2;

      ctx2d!.clearRect(0, 0, width, height);
      ctx2d!.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }

    resizeCanvas();

    for (let i = 0; i < sequenceFrameCount; i++) {
      const img = new Image();
      img.src = frameUrl(sequenceBasePath, i);
      img.onload = () => {
        // Only redraw if this frame is still the one on screen — an
        // earlier frame finishing late should not rewind a scrub that has
        // since moved on.
        if (i === currentFrameRef.current) {
          drawFrame(i);
        }
      };
      images[i] = img;
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

          if (!isDesktop) {
            return;
          }

          if (reduceMotion) {
            // CLAUDE.md §8: render the final state, do not animate. The
            // pin itself is a motion experience, not just the scrub — so
            // no ScrollTrigger is created at all here, not merely scrubbed
            // to completion.
            currentFrameRef.current = sequenceFrameCount - 1;
            drawFrame(currentFrameRef.current);
            return;
          }

          const trigger = ScrollTrigger.create({
            trigger: container,
            start: "top top",
            // The section is 400vh with a 100vh sticky camera, so this is a
            // 300vh scrub. No `pin`: the camera is held by CSS sticky
            // instead (see hero.module.css for why that swap happened).
            end: "bottom bottom",
            scrub: true,
            onUpdate: (self) => {
              const index = Math.round(self.progress * (sequenceFrameCount - 1));
              currentFrameRef.current = index;
              drawFrame(index);
            },
          });

          return () => trigger.kill();
        }
      );
    }, container);

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      context.revert();
    };
  }, [enabled, canvasRef, containerRef, sequenceBasePath, sequenceFrameCount]);
}
