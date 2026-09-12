"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import type { PaperSection as PaperSectionData } from "@/domain/sections";
import { usePinnedSlides } from "@/shared/hooks/usePinnedSlides";
import styles from "./paper.module.css";

interface PaperProps {
  section: PaperSectionData;
}

/**
 * Desktop: pinned, full-bleed slides cross-fading on scroll (CLAUDE.md §3
 * — the "works with smart paper" sequence). Mobile: a Swiper carousel,
 * matching the reference's own approach below 991px rather than trying to
 * force the pinned desktop version into a touch context it wasn't built
 * for.
 */
export function Paper({ section }: PaperProps) {
  const containerRef = useRef<HTMLElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  usePinnedSlides({ containerRef, slideRefs, onActiveChange: setActiveIndex });

  return (
    <>
      <div className={styles.heading}>
        <span className={styles.headingLight}>{section.headingLight}</span>
        <span className={styles.headingBold}>{section.headingBold}</span>
      </div>

      {/* Desktop */}
      <section ref={containerRef} className={styles.desktop}>
        {section.slides.map((slide, index) => (
          <div
            key={slide.headline}
            ref={(el) => {
              slideRefs.current[index] = el;
            }}
            className={styles.slide}
          >
            <Image
              src={slide.image.url}
              alt={slide.image.alt}
              fill
              sizes="100vw"
              className={styles.slideImage}
            />
            <h3 className={styles.slideHeadline}>{slide.headline}</h3>
            <div className={styles.callout}>
              <h4 className={styles.calloutTitle}>{slide.calloutTitle}</h4>
              <p className={styles.calloutBody}>{slide.calloutBody}</p>
            </div>
          </div>
        ))}

        <div className={styles.pagination} aria-hidden="true">
          {section.slides.map((slide, index) => (
            <span
              key={slide.headline}
              className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ""}`}
            />
          ))}
        </div>
      </section>

      {/* Mobile */}
      <div className={styles.mobile}>
        <Swiper spaceBetween={0} slidesPerView={1}>
          {section.slides.map((slide) => (
            <SwiperSlide key={slide.headline}>
              <div className={styles.mobileSlide}>
                <Image
                  src={slide.image.url}
                  alt={slide.image.alt}
                  width={slide.image.width}
                  height={slide.image.height}
                  sizes="100vw"
                  className={styles.mobileSlideImage}
                />
                <h3 className={styles.mobileSlideHeadline}>{slide.headline}</h3>
                <div className={styles.mobileCallout}>
                  <h4 className={styles.calloutTitle}>{slide.calloutTitle}</h4>
                  <p className={styles.calloutBody}>{slide.calloutBody}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}
