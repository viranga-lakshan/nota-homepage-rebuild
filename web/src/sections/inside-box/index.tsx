"use client";

import { useRef } from "react";
import Image from "next/image";
import type { InsideBoxSection as InsideBoxSectionData } from "@/domain/sections";
import { useTitleFill } from "./useTitleFill";
import styles from "./inside-box.module.css";

interface InsideBoxProps {
  section: InsideBoxSectionData;
}

/**
 * Simplified from the reference's actual mechanism, for the same reason
 * as Who: fetched CSS shows a 25-row "blinds" reveal wiping between a
 * background image and a hover-state image per item, which isn't
 * something reproducible with confidence from static CSS with no way to
 * watch it animate. Built instead as heading (grey-to-black word fill,
 * same technique as Who's manifesto) + description + a plain grid of box
 * items. Documented as a known simplification (README).
 *
 * Also: the CMS schema has one `heading` field, not the two-part
 * light/bold heading a supplied spec assumed (that assumption came from
 * Paper's "works with / smart paper" pattern, which doesn't apply here).
 */
export function InsideBox({ section }: InsideBoxProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const words = section.heading.split(/\s+/).filter(Boolean);

  useTitleFill({ containerRef: headingRef, wordRefs });

  return (
    <section className={styles.section}>
      <h2 ref={headingRef} className={styles.heading} aria-label={section.heading}>
        <span aria-hidden="true">
          {words.map((word, index) => (
            <span
              key={index}
              ref={(el) => {
                wordRefs.current[index] = el;
              }}
              className={styles.word}
            >
              {word}{" "}
            </span>
          ))}
        </span>
      </h2>

      <p className={styles.description}>{section.descriptionText}</p>

      <div className={styles.items}>
        {section.items.map((item) => (
          <div key={item.title} className={styles.item}>
            <div className={styles.itemImageWrap}>
              <Image
                src={item.image.url}
                alt={item.image.alt}
                fill
                sizes="(max-width: 991px) 100vw, 33vw"
                className={styles.itemImage}
              />
            </div>
            <h3 className={styles.itemTitle}>{item.title}</h3>
            <p className={styles.itemDescription}>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
