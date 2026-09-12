"use client";

import { useRef } from "react";
import type { RefObject } from "react";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { useHeroScroll } from "./useHeroScroll";
import styles from "./hero.module.css";

interface PenSequenceProps {
  sequenceBasePath: string;
  sequenceFrameCount: number;
  /** The element that pins and defines the scrub's scroll distance. */
  containerRef: RefObject<HTMLElement | null>;
}

/**
 * The scroll-scrubbed pen animation. Always present in the desktop tree's
 * markup — CSS is what hides it on mobile (CLAUDE.md §3) — but the frame
 * sequence itself is only fetched when `useMediaQuery` confirms a desktop
 * viewport, so a mobile visitor never downloads 75 images for a canvas they
 * will never see.
 *
 * `aria-hidden`: this canvas is decorative. The headline and order details
 * it sits behind are real text elsewhere in the section; nothing here is
 * content a screen reader user would be missing.
 */
export function PenSequence({
  sequenceBasePath,
  sequenceFrameCount,
  containerRef,
}: PenSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDesktop = useMediaQuery("(min-width: 992px)");

  useHeroScroll({
    canvasRef,
    containerRef,
    sequenceBasePath,
    sequenceFrameCount,
    enabled: isDesktop,
  });

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
