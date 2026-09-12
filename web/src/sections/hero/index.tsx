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

        {/* Not yet a real trigger — becomes one once the order popup exists. */}
        <div className={styles.orderCard}>
          <span className={styles.orderLabel}>{section.orderLabel}</span>
          <span className={styles.orderProduct}>{section.productName}</span>
          <span className={styles.orderPrice}>{section.price}</span>
        </div>
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
