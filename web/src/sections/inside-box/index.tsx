"use client";

import { useRef } from "react";
import type { InsideBoxSection, BoxItem } from "@/domain/sections";
import { useInsideBoxScroll } from "./useInsideBoxScroll";
import styles from "./inside-box.module.css";

interface InsideBoxProps {
  section: InsideBoxSection;
}

const DEFAULT_HEADING_LINE1 = "Inside";
const DEFAULT_HEADING_LINE2 = "the box";

const DEFAULT_ITEMS: BoxItem[] = [
  {
    title: "A complete, ready-to-use set",
    description:
      "Smart pen, Smartpaper notepad, charging\ncable, and instructions — carefully packaged\nfor a hassle-free start.",
    image: {
      url: "/images/inside_box_1.jpg",
      alt: "NŌTA complete set",
      width: 952,
      height: 670,
    },
  },
  {
    title: "The NŌTA Smart Pen",
    description:
      "Aluminum body, USB-C charging, physical control button, and Bluetooth connectivity. Up to 8 hours of active use with a lightweight, balanced design for everyday writing.",
    image: {
      url: "https://nota-homepage-rebuild-production.up.railway.app/uploads/inside_box_2_27c30f9cc7.jpg",
      alt: "NŌTA smart pen close-up",
      width: 900,
      height: 1000,
    },
  },
  {
    title: "Charging Adapter",
    description:
      "Compact USB-C power adapter with stable output for everyday charging. Designed for safe, efficient power delivery with minimal heat.",
    image: {
      url: "https://nota-homepage-rebuild-production.up.railway.app/uploads/inside_box_3_83c8a900ce.jpg",
      alt: "NŌTA charging adapter",
      width: 900,
      height: 1000,
    },
  },
];

const DEFAULT_DESCRIPTION_LINES = [
  "A precision smart pen with a solid aluminum body, designed for",
  "natural handwriting and accurate digital capture. Seamlessly",
  "connects to smart paper, translating every stroke into structured",
  "digital data — no screens, no distractions, just writing.",
];

const BLINDS_COUNT = 25;

export function InsideBox({ section }: InsideBoxProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useInsideBoxScroll({ sectionRef });

  const headingText = section.heading || `${DEFAULT_HEADING_LINE1} ${DEFAULT_HEADING_LINE2}`;
  const headingWords = headingText.split(" ");
  const line1 = headingWords.length > 1 ? headingWords.slice(0, 1).join(" ") : DEFAULT_HEADING_LINE1;
  const line2 = headingWords.length > 1 ? headingWords.slice(1).join(" ") : DEFAULT_HEADING_LINE2;

  const items = section.items && section.items.length > 0 ? section.items : DEFAULT_ITEMS;
  const activeItem = items[0] || DEFAULT_ITEMS[0];
  const itemImage = activeItem?.image?.url || DEFAULT_ITEMS[0].image.url;
  const itemDesc = activeItem.description || DEFAULT_ITEMS[0].description;

  const lines = DEFAULT_DESCRIPTION_LINES;

  const penItem = items[1] || DEFAULT_ITEMS[1];
  const penImage = penItem?.image?.url || DEFAULT_ITEMS[1].image.url;
  const penAlt = penItem?.image?.alt || penItem.title;
  const penDesc = penItem.description || DEFAULT_ITEMS[1].description;

  const adapterItem = items[2] || DEFAULT_ITEMS[2];
  const adapterImage = adapterItem?.image?.url || DEFAULT_ITEMS[2].image.url;
  const adapterAlt = adapterItem?.image?.alt || adapterItem.title;
  const adapterDesc = adapterItem.description || DEFAULT_ITEMS[2].description;

  return (
    <section ref={sectionRef} className={styles.insideBox}>
      <div className={styles.camera}>
        {/* Phase 1: Expanding White 1:1 Circle Transition */}
        <div data-circle-container className={styles.circleContainer} aria-hidden="true">
          <div data-expanding-circle className={styles.expandingCircle} />
        </div>

        {/* Phase 2: Intro Centered Headline ("Inside the box") */}
        <div data-box-heading className={styles.headingWrapper}>
          <h2 className={styles.heading}>
            <span className={styles.headingLine1}>{line1}</span>
            <span className={styles.headingLine2}>{line2}</span>
          </h2>
        </div>

        {/* Phase 3: Original Website Unboxing Stage Hierarchy */}
        <div data-unboxing-stage className={styles.unboxingStage}>
          <div className={styles.stageWrapper}>
            <div data-blinds-item className={styles.blindsItem}>
              {/* 1. Full Stage Image Layer */}
              <div
                data-blinds-image
                className={styles.blindsImage}
                style={{ backgroundImage: `url(${itemImage})` }}
                role="img"
                aria-label={activeItem.image?.alt || activeItem.title}
              />

              {/* 2. Blind Slits Animation Layer (25 stripes) */}
              <div data-blinds-overlay className={styles.blindsOverlay} aria-hidden="true">
                {Array.from({ length: BLINDS_COUNT }, (_, index) => (
                  <div key={index} data-blind-slit className={styles.blindSlit} />
                ))}
              </div>

              {/* 3. Top-Right Typography Content */}
              <div data-box-info className={styles.blindsContent}>
                <h3 className={styles.blindsTitle}>{activeItem.title}</h3>
                <p className={styles.blindsText}>
                  {itemDesc.split("\n").map((line, idx, arr) => (
                    <span key={idx}>
                      {line}
                      {idx < arr.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Phase 4: Centered Description Text Fill Reveal (4 Exact Lines, character-by-character) */}
        <div data-desc-stage className={styles.descriptionStage}>
          <div className={styles.descriptionWrapper}>
            <div className={styles.descAccentDot} aria-hidden="true" />
            <p data-desc-paragraph className={styles.descriptionText}>
              {lines.map((lineText, lIdx) => (
                <span key={lIdx} className={styles.descLine}>
                  {lineText.split(" ").map((word, wIdx, wordsArr) => (
                    <span key={wIdx} className={styles.wordSpan}>
                      {Array.from(word).map((char, cIdx) => (
                        <span key={cIdx} data-char-span className={styles.charSpan}>
                          {char}
                        </span>
                      ))}
                      {wIdx < wordsArr.length - 1 && (
                        <span data-char-span className={styles.charSpan}>
                          {"\u00A0"}
                        </span>
                      )}
                    </span>
                  ))}
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* Phase 5: 2-Column Device Cards Stage (The NŌTA Smart Pen & Charging Adapter) */}
        <div data-devices-stage className={styles.devicesStage}>
          <div className={styles.devicesGrid}>
            {/* Card 1: The NŌTA Smart Pen */}
            <div data-device-card className={styles.deviceCard}>
              <div
                className={styles.cardImage}
                style={{ backgroundImage: `url(${penImage})` }}
                role="img"
                aria-label={penAlt}
              />
              <div data-card-blinds className={styles.cardBlindsOverlay} aria-hidden="true">
                {Array.from({ length: BLINDS_COUNT }, (_, index) => (
                  <div key={index} data-card-blind-slit className={styles.blindSlit} />
                ))}
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{penItem.title}</h3>
                <p className={styles.cardDesc}>
                  {penDesc.split("\n").map((line, idx, arr) => (
                    <span key={idx}>
                      {line}
                      {idx < arr.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
            </div>

            {/* Card 2: Charging Adapter */}
            <div data-device-card className={styles.deviceCard}>
              <div
                className={styles.cardImage}
                style={{ backgroundImage: `url(${adapterImage})` }}
                role="img"
                aria-label={adapterAlt}
              />
              <div data-card-blinds className={styles.cardBlindsOverlay} aria-hidden="true">
                {Array.from({ length: BLINDS_COUNT }, (_, index) => (
                  <div key={index} data-card-blind-slit className={styles.blindSlit} />
                ))}
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{adapterItem.title}</h3>
                <p className={styles.cardDesc}>
                  {adapterDesc.split("\n").map((line, idx, arr) => (
                    <span key={idx}>
                      {line}
                      {idx < arr.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
