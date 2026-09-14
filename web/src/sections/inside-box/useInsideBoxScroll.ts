"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import { gsap } from "@/lib/animation/gsap.client";

interface UseInsideBoxScrollOptions {
  sectionRef: RefObject<HTMLElement | null>;
}

export function useInsideBoxScroll({ sectionRef }: UseInsideBoxScrollOptions) {
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

          const circle = section.querySelector<HTMLElement>("[data-expanding-circle]");
          const heading = section.querySelector<HTMLElement>("[data-box-heading]");
          const unboxingStage = section.querySelector<HTMLElement>("[data-unboxing-stage]");
          const blindsItem = section.querySelector<HTMLElement>("[data-blinds-item]");
          const boxInfo = section.querySelector<HTMLElement>("[data-box-info]");
          const blindSlits = Array.from(
            section.querySelectorAll<HTMLElement>("[data-blind-slit]")
          );
          const descStage = section.querySelector<HTMLElement>("[data-desc-stage]");
          const charSpans = Array.from(
            section.querySelectorAll<HTMLElement>("[data-char-span]")
          );
          const devicesStage = section.querySelector<HTMLElement>("[data-devices-stage]");
          const deviceCards = Array.from(
            section.querySelectorAll<HTMLElement>("[data-device-card]")
          );
          const cardBlindSlits = Array.from(
            section.querySelectorAll<HTMLElement>("[data-card-blind-slit]")
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
          // 1. Expanding 1:1 Circle (0 -> 18)
          // -------------------------------------------------------------------
          if (circle) {
            timeline.fromTo(
              circle,
              { scale: 0, transformOrigin: "50% 50%" },
              {
                scale: 1,
                ease: "power1.inOut",
                duration: 18,
              },
              0
            );
          }

          // -------------------------------------------------------------------
          // 2. "Inside the box" Heading Fades In (10 -> 22)
          // -------------------------------------------------------------------
          if (heading) {
            timeline.fromTo(
              heading,
              { opacity: 0, scale: 0.94 },
              {
                opacity: 1,
                scale: 1,
                ease: "power1.out",
                duration: 12,
              },
              10
            );

            // 3. Heading Exits Upwards (26 -> 36)
            timeline.to(
              heading,
              {
                opacity: 0,
                y: "-60vh",
                ease: "power1.inOut",
                duration: 10,
              },
              26
            );
          }

          // -------------------------------------------------------------------
          // 4. Unboxing Stage Climbs Upwards (30 -> 46)
          // -------------------------------------------------------------------
          if (unboxingStage) {
            timeline.fromTo(
              unboxingStage,
              { opacity: 0, y: "65vh" },
              {
                opacity: 1,
                y: "0vh",
                ease: "power1.inOut",
                duration: 16,
              },
              30
            );

            // 5. Unboxing Stage Exits Upwards (52 -> 62)
            timeline.to(
              unboxingStage,
              {
                opacity: 0,
                y: "-35vh",
                ease: "power1.inOut",
                duration: 10,
              },
              52
            );
          }

          // -------------------------------------------------------------------
          // 6. 25 Horizontal Blinds Reveal on Packaging Set (34 -> 46)
          // -------------------------------------------------------------------
          if (blindSlits.length > 0) {
            blindSlits.forEach((slit, index) => {
              const slitStart = 34 + index * 0.35;
              timeline.fromTo(
                slit,
                { scaleY: 1, opacity: 1 },
                {
                  scaleY: 0,
                  opacity: 0,
                  ease: "power1.inOut",
                  duration: 6,
                },
                slitStart
              );
            });
          }

          // -------------------------------------------------------------------
          // 7. Top-Right Copywriting Settles (38 -> 48)
          // -------------------------------------------------------------------
          if (boxInfo) {
            timeline.fromTo(
              boxInfo,
              { opacity: 0, y: "3vh" },
              {
                opacity: 1,
                y: "0vh",
                ease: "power1.out",
                duration: 10,
              },
              38
            );
          }

          if (blindsItem) {
            timeline.fromTo(
              blindsItem,
              { scale: 0.96 },
              {
                scale: 1,
                ease: "power1.out",
                duration: 10,
              },
              36
            );
          }

          // -------------------------------------------------------------------
          // 8. Description Stage Enters & Fills (54 -> 68)
          // -------------------------------------------------------------------
          if (descStage) {
            timeline.fromTo(
              descStage,
              { opacity: 0, y: "30vh", scale: 0.98 },
              {
                opacity: 1,
                y: "0vh",
                scale: 1,
                ease: "power1.out",
                duration: 10,
              },
              54
            );

            // Description Stage Exits Upwards with Device Cards (68 -> 84)
            timeline.to(
              descStage,
              {
                opacity: 0,
                y: "-110vh",
                ease: "power1.inOut",
                duration: 16,
              },
              68
            );
          }

          // Character Color Fill (56 -> 68)
          if (charSpans.length > 0) {
            const fillDuration = 12;
            const step = fillDuration / charSpans.length;

            charSpans.forEach((span, index) => {
              timeline.fromTo(
                span,
                { color: "#dddddd" },
                {
                  color: "#000000",
                  ease: "power2.out",
                  duration: 0.15,
                },
                56 + index * step
              );
            });
          }

          // -------------------------------------------------------------------
          // 9. 2-Column Device Cards Stage (68 -> 88)
          // -------------------------------------------------------------------
          if (devicesStage) {
            timeline.fromTo(
              devicesStage,
              { opacity: 1, y: "110vh" },
              {
                opacity: 1,
                y: "0vh",
                ease: "power1.inOut",
                duration: 16,
              },
              68
            );
          }

          if (cardBlindSlits.length > 0) {
            const BLINDS_COUNT = 25;
            cardBlindSlits.forEach((slit, index) => {
              const slitRowIndex = index % BLINDS_COUNT;
              const slitStart = 72 + slitRowIndex * 0.35;
              timeline.fromTo(
                slit,
                { scaleY: 1, opacity: 1 },
                {
                  scaleY: 0,
                  opacity: 0,
                  ease: "power1.inOut",
                  duration: 6,
                },
                slitStart
              );
            });
          }

          if (deviceCards.length > 0) {
            timeline.fromTo(
              deviceCards,
              { scale: 0.97 },
              {
                scale: 1,
                ease: "power1.out",
                duration: 10,
                stagger: 0.4,
              },
              76
            );
          }

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
