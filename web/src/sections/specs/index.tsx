"use client";

import { useRef } from "react";
import Image from "next/image";
import type { SpecsSection as SpecsSectionData } from "@/domain/sections";
import { useSpecsScroll } from "./useSpecsScroll";
import styles from "./specs.module.css";

interface SpecsProps {
  section: SpecsSectionData;
}

/**
 * Pinned section: the pen scales up behind three cards while the heading
 * holds position (CLAUDE.md §3). Below 991px, no pin and no scale/stagger —
 * the cards just stack in normal document flow (CLAUDE.md §3: all scroll
 * animation off below that breakpoint).
 */
export function Specs({ section }: SpecsProps) {
  const containerRef = useRef<HTMLElement>(null);
  const penRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useSpecsScroll({ containerRef, penRef, cardRefs });

  return (
    <section ref={containerRef} className={styles.section}>
      <div className={styles.headingWrapper}>
        <span className={styles.eyebrow}>{section.eyebrow}</span>
        <span className={styles.heading}>{section.heading}</span>
      </div>

      <div ref={penRef} className={styles.penWrapper}>
        <Image
          src={section.penImage.url}
          alt={section.penImage.alt}
          width={section.penImage.width}
          height={section.penImage.height}
          sizes="(max-width: 991px) 60vw, 17vw"
          className={styles.penImage}
        />
      </div>

      <div className={styles.cards}>
        {section.groups.map((group, index) => (
          <div
            key={group.title}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className={styles.card}
          >
            <h3 className={styles.cardTitle}>{group.title}</h3>
            <ul className={styles.itemList}>
              {group.items.map((item) => (
                <li key={item.label} className={styles.item}>
                  <span className={styles.dot} aria-hidden="true" />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
