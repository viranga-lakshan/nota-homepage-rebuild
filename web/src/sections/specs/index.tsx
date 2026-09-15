"use client";

import { useRef } from "react";
import Image from "next/image";
import type { SpecsSection } from "@/domain/sections";
import { useSpecsScroll } from "./useSpecsScroll";
import { SpecsTransition } from "./SpecsTransition";
import styles from "./specs.module.css";

interface SpecsProps {
  section: SpecsSection;
}

/**
 * The Specifications section: the heading rises into place, the pen climbs
 * in behind, and the three spec columns arrive at staggered times.
 *
 * An outro transition (SpecsTransition) then scales a 4-tier black geometric
 * silhouette of the Nota pen outward from the center, seamlessly covering
 * the section before handing off to the next section.
 */
export function Specs({ section }: SpecsProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useSpecsScroll({ sectionRef });

  const mobilePenSrc =
    section.mobilePenImage?.url || "/images/specs_pen_mobile.webp";
  const mobilePenAlt =
    section.mobilePenImage?.alt ||
    section.penImage.alt ||
    "Nota pen specifications view";

  return (
    <section ref={sectionRef} className={styles.specs}>
      <div className={styles.camera}>
        <div data-content className={styles.content}>
          <div data-heading className={styles.headingBlock}>
            <h2 className={styles.heading}>
              <span className={styles.eyebrow}>{section.eyebrow}</span>
              <span>{section.heading}</span>
            </h2>
          </div>

          <div className={styles.mobilePenWrap}>
            <Image
              src={mobilePenSrc}
              alt={mobilePenAlt}
              width={756}
              height={148}
              priority
              className={styles.mobilePen}
            />
          </div>

          <div data-pen className={styles.desktopPenWrap}>
            <Image
              src={section.penImage.url}
              alt={section.penImage.alt}
              width={section.penImage.width || 440}
              height={section.penImage.height || 980}
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
