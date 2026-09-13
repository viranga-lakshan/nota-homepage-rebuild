"use client";

import { useRef } from "react";
import Image from "next/image";
import type { SpecsSection } from "@/domain/sections";
import { useSpecsScroll } from "./useSpecsScroll";
import styles from "./specs.module.css";

interface SpecsProps {
  section: SpecsSection;
}

/**
 * The Specifications section: the heading rises into place, the pen climbs
 * in behind, and the three spec columns arrive at staggered times.
 *
 * One tree, not two. The hero needs a desktop/mobile split because its
 * canvas frame sequence must never be fetched on mobile; nothing here is
 * expensive enough to warrant that, so the same markup serves both and CSS
 * decides whether it is a scroll stage or an ordinary stacked block.
 *
 * The CMS guarantees exactly three groups (min 3 / max 3 in the schema), so
 * the three-column grid cannot be broken by an editor — but nothing here
 * assumes the count either: the grid is declared once and the array is
 * rendered as it comes.
 */
export function Specs({ section }: SpecsProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useSpecsScroll({ sectionRef });

  return (
    <section ref={sectionRef} className={styles.specs}>
      <div className={styles.camera}>
        <div data-content className={styles.content}>
          <div data-heading className={styles.headingBlock}>
            {/* One heading set on two lines, not two headings. The eyebrow
                is the same sentence in a lighter colour — making it its own
                h2 would put "Nota pen" into the document outline as a
                section of its own. */}
            <h2 className={styles.heading}>
              <span className={styles.eyebrow}>{section.eyebrow}</span>
              <span>{section.heading}</span>
            </h2>
          </div>

          <div data-pen className={styles.penWrap}>
            <Image
              src={section.penImage.url}
              alt={section.penImage.alt}
              width={section.penImage.width}
              height={section.penImage.height}
              sizes="(max-width: 991px) 40vh, 71vh"
              className={styles.pen}
            />
          </div>

          <div className={styles.cards}>
            {section.groups.map((group) => (
              <div key={group.title} data-card className={styles.card}>
                <h3 className={styles.cardTitle}>{group.title}</h3>

                <ul className={styles.cardItems}>
                  {group.items.map((item) => (
                    <li key={item.label} className={styles.cardItem}>
                      <span className={styles.cardItemLabel}>{item.label}</span>
                      <span aria-hidden="true" className={styles.cardItemDot} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
