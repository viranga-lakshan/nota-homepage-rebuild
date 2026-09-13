"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import { gsap } from "@/lib/animation/gsap.client";

interface UsePaperScrollOptions {
  sectionRef: RefObject<HTMLElement | null>;
}

export function usePaperScroll({ sectionRef }: UsePaperScrollOptions) {
  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const context = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 992px)",
          isMobile: "(max-width: 991px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const isDesktop = Boolean(ctx.conditions?.isDesktop);
          const reduceMotion = Boolean(ctx.conditions?.reduceMotion);

          if (reduceMotion || !isDesktop) {
            return;
          }

          const heading = section.querySelector<HTMLElement>("[data-paper-heading]");
          const lines = Array.from(
            section.querySelectorAll<HTMLElement>("[data-paper-line]")
          );
          const curtains = Array.from(
            section.querySelectorAll<HTMLElement>("[data-paper-curtain]")
          );
          const slides = Array.from(
            section.querySelectorAll<HTMLElement>("[data-paper-slide]")
          );
          const indicatorsWrap = section.querySelector<HTMLElement>(
            "[data-stage-indicators]"
          );
          const indicators = Array.from(
            section.querySelectorAll<HTMLElement>("[data-indicator-bar]")
          );

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
            },
          });

          // -------------------------------------------------------------------
          // 1. Intro Heading: fades out and floats up (0 -> 10)
          // -------------------------------------------------------------------
          if (heading) {
            timeline.to(
              heading,
              {
                opacity: 0,
                scale: 0.94,
                y: "-3vh",
                ease: "power1.inOut",
                duration: 10,
              },
              0
            );
          }

          // -------------------------------------------------------------------
          // 2. 5 Vertical Divider Lines: Draw Top -> Bottom, RIGHT -> LEFT (8 -> 20)
          // -------------------------------------------------------------------
          const reversedLines = [...lines].reverse();
          const lineStartBase = 8;
          const lineDuration = 10;
          const lineStagger = 2.0;

          reversedLines.forEach((line, index) => {
            const lineStart = lineStartBase + index * lineStagger;
            timeline.fromTo(
              line,
              { scaleY: 0 },
              {
                scaleY: 1,
                ease: "power1.inOut",
                duration: lineDuration,
              },
              lineStart
            );
          });

          // -------------------------------------------------------------------
          // 3. 6 White Curtains: Slide Down (0 -> 100%), LEFT -> RIGHT (20 -> 34)
          // -------------------------------------------------------------------
          const curtainStartBase = 20;
          const curtainDuration = 12;
          const curtainStagger = 2.4;

          curtains.forEach((curtain, index) => {
            const curtainStart = curtainStartBase + index * curtainStagger;
            timeline.fromTo(
              curtain,
              { yPercent: 0 },
              {
                yPercent: 100,
                ease: "power1.inOut",
                duration: curtainDuration,
              },
              curtainStart
            );
          });

          // Divider lines slide down with the curtains
          lines.forEach((line, index) => {
            const dividerStart = curtainStartBase + 1 + index * curtainStagger;
            timeline.to(
              line,
              {
                yPercent: 100,
                ease: "power1.inOut",
                duration: curtainDuration,
              },
              dividerStart
            );
          });

          // -------------------------------------------------------------------
          // 4. Slide 0 Reveal Under Curtains (22 -> 34)
          // -------------------------------------------------------------------
          if (slides[0]) {
            timeline.fromTo(
              slides[0],
              { opacity: 0.85, scale: 1.04 },
              { opacity: 1, scale: 1, ease: "none", duration: 14 },
              22
            );
          }

          // -------------------------------------------------------------------
          // 5. Cross-fade between the 4 Slides on Continued Scroll
          // -------------------------------------------------------------------
          // Slide 0: 34 -> 44
          // Transition 0 -> 1: 44 -> 49
          // Slide 1: 49 -> 59
          // Transition 1 -> 2: 59 -> 64
          // Slide 2: 64 -> 74
          // Transition 2 -> 3: 74 -> 79
          // Slide 3: 79 -> 88

          const slideTransitions = [
            { from: 0, to: 1, start: 44, duration: 5 },
            { from: 1, to: 2, start: 59, duration: 5 },
            { from: 2, to: 3, start: 74, duration: 5 },
          ];

          slideTransitions.forEach(({ from, to, start, duration }) => {
            const currentSlide = slides[from];
            const nextSlide = slides[to];
            const currentIndicator = indicators[from];
            const nextIndicator = indicators[to];

            if (currentSlide && nextSlide) {
              // Current slide exits
              timeline.to(
                currentSlide,
                {
                  opacity: 0,
                  scale: 0.96,
                  ease: "power1.inOut",
                  duration,
                },
                start
              );

              // Next slide enters
              timeline.fromTo(
                nextSlide,
                { opacity: 0, scale: 1.04 },
                {
                  opacity: 1,
                  scale: 1,
                  ease: "power1.inOut",
                  duration,
                },
                start
              );
            }

            // Sync indicators
            if (currentIndicator && nextIndicator) {
              timeline.to(
                currentIndicator,
                {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  duration: duration * 0.6,
                  ease: "none",
                },
                start
              );

              timeline.to(
                nextIndicator,
                {
                  backgroundColor: "#ffffff",
                  duration: duration * 0.6,
                  ease: "none",
                },
                start + duration * 0.4
              );
            }
          });

          // -------------------------------------------------------------------
          // 6. Outro Sequence on Slide 4 (88 -> 100)
          // -------------------------------------------------------------------
          // A) First: The 4 progress indicator bars fade out (88 -> 93)
          if (indicatorsWrap) {
            timeline.to(
              indicatorsWrap,
              {
                opacity: 0,
                y: "2vh",
                ease: "power1.inOut",
                duration: 5,
              },
              88
            );
          }

          // B) Second: Top-left headline and bottom-right callout card fade out (91 -> 97)
          const lastSlide = slides[slides.length - 1];
          if (lastSlide) {
            const lastHeadline = lastSlide.querySelector<HTMLElement>(
              "[data-slide-headline]"
            );
            const lastCallout = lastSlide.querySelector<HTMLElement>(
              "[data-slide-callout]"
            );

            if (lastHeadline) {
              timeline.to(
                lastHeadline,
                {
                  opacity: 0,
                  y: "-3vh",
                  ease: "power1.inOut",
                  duration: 6,
                },
                91
              );
            }

            if (lastCallout) {
              timeline.to(
                lastCallout,
                {
                  opacity: 0,
                  y: "3vh",
                  ease: "power1.inOut",
                  duration: 6,
                },
                91
              );
            }
          }

          // C) Clean standalone image remains in full view on screen (97 -> 100)

          return () => {
            timeline.scrollTrigger?.kill();
            timeline.kill();
          };
        }
      );
    }, section);

    return () => context.revert();
  }, [sectionRef]);
}
