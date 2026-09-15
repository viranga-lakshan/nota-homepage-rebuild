"use client";

import { useMemo, useState, useEffect, useRef } from "react";
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
    name: "Deeply",
    tagline: "intuitive",
    image: {
      url: "/images/variant_2_graphite.jpg",
      alt: "Black smart fountain pen",
      width: 1920,
      height: 1080,
    },
  },
  {
    name: "Effortless",
    tagline: "clarity",
    image: {
      url: "/images/variant_3_mist_blue.jpg",
      alt: "Blue smart fountain pen",
      width: 1920,
      height: 1080,
    },
  },
  {
    name: "Distraction",
    tagline: "free",
    image: {
      url: "/images/variant_4_precision_red.jpg",
      alt: "Red smart fountain pen",
      width: 1920,
      height: 1080,
    },
  },
  {
    name: "Natural",
    tagline: "precision",
    image: {
      url: "/images/variant_5_bright_orange.jpg",
      alt: "Orange smart fountain pen",
      width: 1920,
      height: 1080,
    },
  },
];

const COLOR_NAMES = [
  "silver",
  "graphite",
  "graphite black",
  "mist blue",
  "precision red",
  "bright orange",
  "orange",
  "red",
  "blue",
  "black",
];

export function ColorVariants({ section }: ColorVariantsProps) {
  const variants = useMemo(() => {
    return DEFAULT_VARIANTS.map((defaultVariant, i) => {
      const c = section.colors?.[i];
      const imageUrl = c?.image?.url || defaultVariant.image?.url;
      const alt = c?.image?.alt || defaultVariant.image?.alt;

      const isColor = Boolean(
        c?.name && COLOR_NAMES.includes(c.name.trim().toLowerCase())
      );
      const name = isColor || !c?.name ? defaultVariant.name : c.name;
      const tagline = isColor || !c?.tagline ? defaultVariant.tagline : c.tagline;

      return {
        name,
        tagline,
        image: {
          url: imageUrl,
          alt: alt || `${name} ${tagline}`,
          width: 1920,
          height: 1080,
        },
      };
    });
  }, [section.colors]);

  const { containerRef, activeIndex: desktopActiveIndex, scrollToVariant } =
    useColorVariantsScroll(variants.length);

  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 992);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const activeIndex = isMobile ? mobileActiveIndex : desktopActiveIndex;

  // Touch swipe support for mobile
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Trigger horizontal swipe if horizontal movement is prominent
    if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        // Swipe left -> Next variant
        setMobileActiveIndex((prev) => Math.min(variants.length - 1, prev + 1));
      } else {
        // Swipe right -> Prev variant
        setMobileActiveIndex((prev) => Math.max(0, prev - 1));
      }
    }
  };

  const handleIndicatorClick = (index: number) => {
    if (isMobile) {
      setMobileActiveIndex(index);
    } else {
      scrollToVariant(index);
    }
  };

  return (
    <section
      ref={containerRef}
      className={styles.track}
      data-color-variants-section
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className={styles.camera}>
        {variants.map((variant, index) => {
          const isActive = activeIndex === index;
          const imageUrl =
            variant.image?.url || DEFAULT_VARIANTS[index]?.image?.url || "";

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
        <div
          className={styles.indicators}
          role="tablist"
          aria-label="Color variant navigation"
        >
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
                onClick={() => handleIndicatorClick(index)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
