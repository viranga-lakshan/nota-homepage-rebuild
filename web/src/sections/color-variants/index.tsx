"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import type { ColorVariantsSection as ColorVariantsSectionData } from "@/domain/sections";
import { usePinnedSlides } from "@/shared/hooks/usePinnedSlides";
import styles from "./color-variants.module.css";

interface ColorVariantsProps {
  section: ColorVariantsSectionData;
}

/**
 * Same pin-and-crossfade mechanism as Paper (usePinnedSlides) on desktop,
 * same Swiper-carousel fallback below 991px.
 */
export function ColorVariants({ section }: ColorVariantsProps) {
  const containerRef = useRef<HTMLElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  usePinnedSlides({ containerRef, slideRefs, onActiveChange: setActiveIndex });

  return (
    <>
      {/* Desktop */}
      <section ref={containerRef} className={styles.desktop}>
        {section.colors.map((color, index) => (
          <div
            key={color.name}
            ref={(el) => {
              slideRefs.current[index] = el;
            }}
            className={styles.slide}
          >
            <Image
              src={color.image.url}
              alt={color.image.alt}
              fill
              sizes="100vw"
              className={styles.slideImage}
            />
            <div className={styles.slideText}>
              <span className={styles.colorName}>{color.name}</span>
              <span className={styles.tagline}>{color.tagline}</span>
            </div>
          </div>
        ))}

        <div className={styles.pagination} aria-hidden="true">
          {section.colors.map((color, index) => (
            <span
              key={color.name}
              className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ""}`}
            />
          ))}
        </div>
      </section>

      {/* Mobile */}
      <div className={styles.mobile}>
        <Swiper spaceBetween={0} slidesPerView={1}>
          {section.colors.map((color) => (
            <SwiperSlide key={color.name}>
              <div className={styles.mobileSlide}>
                <Image
                  src={color.image.url}
                  alt={color.image.alt}
                  fill
                  sizes="100vw"
                  className={styles.slideImage}
                />
                <div className={styles.slideText}>
                  <span className={styles.colorName}>{color.name}</span>
                  <span className={styles.tagline}>{color.tagline}</span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}
