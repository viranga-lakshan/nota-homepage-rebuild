"use client";

import { useRef } from "react";
import type { RefObject } from "react";
import { useHeroSmartPenScroll } from "./useHeroSmartPenScroll";
import styles from "./hero-smart-pen.module.css";

const CURTAIN_COUNT = 6;

interface HeroSmartPenProps {
  /** The pinned hero this transition rides; see the hook. */
  heroRef: RefObject<HTMLElement | null>;
}

/**
 * The scroll-driven white transition that closes the hero — six vertical
 * curtains climbing over the pen in a staggered sequence until the viewport
 * is white, with a black veil darkening what is still visible between them.
 *
 * Deliberately not a CMS section and deliberately not in the section
 * registry. It holds no text, image, link or price — there is nothing here
 * for an editor to write, so modelling it in Strapi would mean a component
 * with no editable fields. The reference treats it the same way: in its own
 * markup this is a contentless block (named `transition-specs`) grouped with
 * the hero rather than standing alone.
 *
 * `aria-hidden` and no heading: this is chrome, not content. Nothing here is
 * information a screen-reader user would be missing, and it must not appear
 * in the document outline between the hero's h1 and whatever follows.
 */
export function HeroSmartPen({ heroRef }: HeroSmartPenProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useHeroSmartPenScroll({ overlayRef, heroRef });

  return (
    <div ref={overlayRef} className={styles.transition} aria-hidden="true">
      <div data-veil className={styles.veil} />

      <div className={styles.curtains}>
        {Array.from({ length: CURTAIN_COUNT }, (_, index) => (
          <div key={index} data-curtain className={styles.curtain} />
        ))}
      </div>
    </div>
  );
}
