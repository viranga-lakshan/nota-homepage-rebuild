"use client";

import { useRef } from "react";
import Image from "next/image";
import type { HeroSection } from "@/domain/sections";
import { PenSequence } from "./PenSequence";
import styles from "./hero.module.css";

interface HeroProps {
  section: HeroSection;
}

/**
 * Both trees render unconditionally; CSS is what shows exactly one of them
 * at a time, at the 991px breakpoint (CLAUDE.md §3) — not React branching
 * on a media query, which would guess wrong on the server and flash on
 * hydration. See hero.module.css for the actual toggle.
 *
 * The logo/nav/order-button header is deliberately not here. It reads as
 * part of the hero visually because hero is full-viewport, but it is
 * Navigation content, not Hero content — a persistent Header component
 * renders it once, above every section, not duplicated into this one.
 *
 * No order card of its own, either — an earlier version rendered one here
 * from section.orderLabel/productName/price. Header's own order button is
 * `position: fixed`, so it is already visible throughout the hero (and
 * every other section); rendering a second one would put two overlapping
 * white pills in the same corner. sections.hero keeps these three CMS
 * fields regardless (removing them would be a schema change, not a
 * frontend one) — they are simply unused by this component now, the same
 * position Navigation's logo_image/nota_mark are already in.
 */
export function Hero({ section }: HeroProps) {
  const containerRef = useRef<HTMLElement>(null);

  return (
    <section ref={containerRef} className={styles.hero}>
      {/* Desktop tree — canvas-scrubbed pen, hidden below 992px via CSS */}
      <div className={styles.desktop}>
        <PenSequence
          sequenceBasePath={section.sequenceBasePath}
          sequenceFrameCount={section.sequenceFrameCount}
          containerRef={containerRef}
        />

        <h1 className={styles.headline}>
          <span className={styles.headlineLine1}>{section.headlineLine1}</span>
          <span className={styles.headlineLine2}>{section.headlineLine2}</span>
        </h1>
      </div>

      {/* Mobile tree — static CMS image, hidden at 992px and above via CSS */}
      <div className={styles.mobile}>
        <div className={styles.mobileImageWrap}>
          <Image
            src={section.mobileFallback.url}
            alt={section.mobileFallback.alt}
            width={section.mobileFallback.width}
            height={section.mobileFallback.height}
            sizes="(max-width: 479px) 80vw, 60vw"
            priority
            className={styles.mobileImage}
          />
        </div>

        <h1 className={styles.headline}>
          <span className={styles.headlineLine1}>{section.headlineLine1}</span>
          <span className={styles.headlineLine2}>{section.headlineLine2}</span>
        </h1>
      </div>
    </section>
  );
}
