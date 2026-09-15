"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { PaperSection, PaperSlide } from "@/domain/sections";
import { usePaperScroll } from "./usePaperScroll";
import styles from "./paper.module.css";

interface PaperProps {
  section: PaperSection;
}

const DEFAULT_HEADING_LIGHT = "Works with";
const DEFAULT_HEADING_BOLD = "smart paper";

const DEFAULT_SLIDES: PaperSlide[] = [
  {
    headline: "We use special paper\nwith a nearly invisible\npattern",
    image: {
      url: "/images/nota_paper_slide_bg.jpg",
      alt: "Nota Smart Paper Notebook cover",
      width: 1920,
      height: 1080,
    },
    calloutTitle: "For the pen, it's a precise map",
    calloutBody:
      "The pattern defines exact coordinates across the\npage, allowing the pen to capture every stroke with\nprecision and consistency. For you, it feels like\nordinary paper. For the system, it becomes a stable\nreference that turns handwriting into structured,\naccurate digital data.",
  },
  {
    headline: "A natural paper feel\nfor unrestricted\nthinking",
    image: {
      url: "/images/nota_paper_slide_2_bg.jpg",
      alt: "Nota Smart Paper open notebook sketches",
      width: 1920,
      height: 1080,
    },
    calloutTitle: "Uncompromised tactile feedback",
    calloutBody:
      "Thick, high-grade textured paper absorbs ink smoothly\nwithout bleed-through. You get the friction, resistance,\nand warmth of physical pages with zero lag or screen\nglare.",
  },
  {
    headline: "Micro-optical dots\nengineered with\nsub-millimeter precision",
    image: {
      url: "/images/nota_paper_slide_3_bg.jpg",
      alt: "Micro-optical dot code pattern closeup",
      width: 1920,
      height: 1080,
    },
    calloutTitle: "Sub-millimeter optical grid",
    calloutBody:
      "Each page contains millions of microscopic coordinates\nthat the pen's infrared sensor reads at 200 frames per\nsecond, guaranteeing zero lost strokes even when writing\nrapidly.",
  },
  {
    headline: "Everything you write is synced\nto your phone in real time",
    image: {
      url: "/images/nota_paper_slide_4_bg.jpg",
      alt: "Everything you write is synced to your phone in real time",
      width: 1920,
      height: 1080,
    },
    calloutTitle: "Your notes. Already there.",
    calloutBody:
      "Every note is instantly transferred to your device\nand safely stored in your personal space. Access\nyour thoughts anytime, organize them effortlessly,\nand continue working across devices. Your\nhandwriting becomes part of a system that is\nsearchable, structured, and always available.",
  },
];

const CURTAIN_COUNT = 6;
const DIVIDER_POSITIONS = [
  "16.6667%",
  "33.3333%",
  "50%",
  "66.6667%",
  "83.3333%",
];

export function Paper({ section }: PaperProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const darkStageRef = useRef<HTMLDivElement>(null);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);

  usePaperScroll({ sectionRef });

  const headingLight = section.headingLight || DEFAULT_HEADING_LIGHT;
  const headingBold = section.headingBold || DEFAULT_HEADING_BOLD;

  const slides = section.slides && section.slides.length > 0 ? section.slides : DEFAULT_SLIDES;

  const handleMobileScroll = () => {
    const el = darkStageRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const slideWidth = el.offsetWidth || (typeof window !== "undefined" ? window.innerWidth : 390);
    if (slideWidth > 0) {
      const newIndex = Math.round(scrollLeft / slideWidth);
      if (newIndex >= 0 && newIndex < slides.length && newIndex !== mobileActiveIndex) {
        setMobileActiveIndex(newIndex);
      }
    }
  };

  const scrollToSlide = (index: number) => {
    const el = darkStageRef.current;
    if (!el) return;
    const slideWidth = el.offsetWidth || (typeof window !== "undefined" ? window.innerWidth : 390);
    el.scrollTo({
      left: index * slideWidth,
      behavior: "smooth",
    });
    setMobileActiveIndex(index);
  };

  return (
    <section ref={sectionRef} className={styles.paper}>
      <div className={styles.camera}>
        {/* Intro Heading / White Cover: "Works with smart paper" */}
        <div data-paper-heading className={styles.headingWrapper}>
          <h2 className={styles.heading}>
            <span className={styles.headingLight}>{headingLight}</span>
            <span className={styles.headingBold}>{headingBold}</span>
          </h2>
        </div>

        {/* 6 White Curtain Panels & 5 Divider Lines Overlay (Desktop only) */}
        <div data-paper-curtains-overlay className={styles.curtainOverlay} aria-hidden="true">
          <div className={styles.curtains}>
            {Array.from({ length: CURTAIN_COUNT }, (_, index) => (
              <div
                key={index}
                data-paper-curtain={index}
                className={styles.curtain}
              />
            ))}
          </div>

          <div className={styles.gridDividers}>
            {DIVIDER_POSITIONS.map((pos, index) => (
              <div
                key={index}
                data-paper-line={index}
                className={styles.dividerLine}
                style={{ left: pos }}
              />
            ))}
          </div>
        </div>

        {/* Underneath Dark Showcase Stage (Holding All 4 Slides / Mobile Swipeable Carousel) */}
        <div
          ref={darkStageRef}
          onScroll={handleMobileScroll}
          data-paper-dark-stage
          className={styles.darkStage}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              data-paper-slide={index}
              className={`${styles.slideLayer} ${index === 0 ? styles.slideActive : styles.slideInactive}`}
            >
              {/* Headline on Top */}
              <div data-slide-headline className={styles.stageHeadlineWrap}>
                <h3 className={styles.stageHeadline}>
                  {slide.headline.split("\n").map((line, lineIdx) => (
                    <span key={lineIdx} className={styles.headlineLine}>
                      {line}
                    </span>
                  ))}
                </h3>
              </div>

              {/* Full-width Product Background Image */}
              <div className={styles.stageBgWrap}>
                <Image
                  src={slide.image.url}
                  alt={slide.image.alt || `Nota Smart Paper Slide ${index + 1}`}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 991px) 90vw, 100vw"
                  className={styles.stageBgImage}
                />
              </div>

              {/* Floating Callout Card on Bottom */}
              <div data-slide-callout className={styles.calloutWrap}>
                <div className={styles.calloutTitleBox}>
                  <h4 className={styles.calloutTitle}>{slide.calloutTitle}</h4>
                </div>
                <div className={styles.calloutBodyBox}>
                  <p className={styles.calloutBody}>{slide.calloutBody}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slide Progress Indicators (Synced to 4 Slides) */}
        <div data-stage-indicators className={styles.indicatorsWrap} aria-hidden="true">
          <div className={styles.indicatorTrack}>
            {slides.map((_, index) => (
              <span
                key={index}
                data-indicator-bar={index}
                onClick={() => scrollToSlide(index)}
                className={`${styles.indicatorBar} ${
                  index === mobileActiveIndex ? styles.mobileIndicatorActive : ""
                } ${index === 0 ? styles.indicatorActive : ""}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
