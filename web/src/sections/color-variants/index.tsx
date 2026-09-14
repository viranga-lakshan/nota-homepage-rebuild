"use client";

import { useMemo } from "react";
import type { ColorVariantsSection, ColorVariant } from "@/domain/sections";
import { useColorVariantsScroll } from "./useColorVariantsScroll";
import styles from "./color-variants.module.css";

interface ColorVariantsProps {
  section: ColorVariantsSection;
}

const DEFAULT_VARIANTS: ColorVariant[] = [
  {
    name: "Impossible to",
    tagline: "overthink",
    image: {
      url: "/images/variant_1_silver.jpg",
      alt: "Silver smart fountain pen",
      width: 1920,
      height: 1080,
    },
  },
  {
    name: "Graphite Black.",
    tagline: "Clarity in silence.",
    image: {
      url: "/images/variant_2_graphite.jpg",
      alt: "Black smart fountain pen",
      width: 1920,
      height: 1080,
    },
  },
  {
    name: "Mist Blue.",
    tagline: "Light thinking.",
    image: {
      url: "/images/variant_3_mist_blue.jpg",
      alt: "Blue smart fountain pen",
      width: 1920,
      height: 1080,
    },
  },
  {
    name: "Precision Red.",
    tagline: "Form follows thought.",
    image: {
      url: "/images/variant_4_precision_red.jpg",
      alt: "Red smart fountain pen",
      width: 1920,
      height: 1080,
    },
  },
  {
    name: "Bright Orange.",
    tagline: "Steady focus.",
    image: {
      url: "/images/variant_5_bright_orange.jpg",
      alt: "Orange smart fountain pen",
      width: 1920,
      height: 1080,
    },
  },
];

export function ColorVariants({ section }: ColorVariantsProps) {
  const variants = useMemo(() => {
    if (section.colors && section.colors.length > 0) {
      return section.colors.map((c, i) => ({
        ...DEFAULT_VARIANTS[i % DEFAULT_VARIANTS.length],
        ...c,
        image: c.image?.url ? c.image : DEFAULT_VARIANTS[i % DEFAULT_VARIANTS.length].image,
      }));
    }
    return DEFAULT_VARIANTS;
  }, [section.colors]);

  const { containerRef, activeIndex, scrollToVariant } = useColorVariantsScroll(variants.length);

  return (
    <section ref={containerRef} className={styles.track} data-color-variants-section>
      <div className={styles.camera}>
        {variants.map((variant, index) => {
          const isActive = activeIndex === index;
          const imageUrl = variant.image?.url || DEFAULT_VARIANTS[index]?.image?.url || "";

          return (
            <div
              key={index}
              className={`${styles.slideLayer} ${isActive ? styles.active : ""}`}
              data-variant-slide={index}
              data-variant-name={variant.name}
            >
              {/* Background Pen Image */}
              {imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className={styles.bgImage}
                  src={imageUrl}
                  alt={variant.image?.alt || variant.name}
                  loading={index <= 1 ? "eager" : "lazy"}
                />
              )}

              {/* Text Typography flanking the pen */}
              <div className={styles.content}>
                <h2 className={styles.textLeft}>{variant.name}</h2>
                <p className={styles.textRight}>{variant.tagline}</p>
              </div>
            </div>
          );
        })}

        {/* 5-bar pagination indicator at bottom */}
        <div className={styles.indicators} role="tablist" aria-label="Color variant navigation">
          {variants.map((variant, index) => {
            const isActive = activeIndex === index;
            return (
              <button
                key={index}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to ${variant.name}`}
                className={`${styles.indicatorBar} ${isActive ? styles.activeIndicator : ""}`}
                onClick={() => scrollToVariant(index)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
