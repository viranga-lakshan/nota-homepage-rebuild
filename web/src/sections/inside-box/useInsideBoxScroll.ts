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
          // 1. Expanding Perfect 1:1 Circle (0 -> 16)
          // Covers the full viewport in pure solid white (#ffffff).
          // -------------------------------------------------------------------
          if (circle) {
            timeline.fromTo(
              circle,
              { scale: 0, transformOrigin: "50% 50%" },
              {
                scale: 1,
                ease: "power1.inOut",
                duration: 16,
              },
              0
            );
          }

          // -------------------------------------------------------------------
          // 2. Centered "Inside the box" Heading Fades In (8 -> 18)
          // -------------------------------------------------------------------
          if (heading) {
            timeline.fromTo(
              heading,
              { opacity: 0, scale: 0.94 },
              {
                opacity: 1,
                scale: 1,
                ease: "power1.out",
                duration: 10,
              },
              8
            );

            // -----------------------------------------------------------------
            // 3. Heading Exits Upwards (24 -> 34)
            // -----------------------------------------------------------------
            timeline.to(
              heading,
              {
                opacity: 0,
                y: "-60vh",
                ease: "power1.inOut",
                duration: 10,
              },
              24
            );
          }

          // -------------------------------------------------------------------
          // 4. Unboxing Stage Climbs Upwards from Below (28 -> 44)
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
              28
            );

            // -----------------------------------------------------------------
            // 5. Unboxing Stage Exits Upwards (48 -> 56)
            // -----------------------------------------------------------------
            timeline.to(
              unboxingStage,
              {
                opacity: 0,
                y: "-35vh",
                ease: "power1.inOut",
                duration: 8,
              },
              48
            );
          }

          // -------------------------------------------------------------------
          // 6. 25 Horizontal Blinds / Slits Reveal on Packaging Set (32 -> 44)
          // -------------------------------------------------------------------
          if (blindSlits.length > 0) {
            blindSlits.forEach((slit, index) => {
              const slitStart = 32 + index * 0.4;
              timeline.fromTo(
                slit,
                { scaleY: 1, opacity: 1 },
                {
                  scaleY: 0,
                  opacity: 0,
                  ease: "power1.inOut",
                  duration: 8,
                },
                slitStart
              );
            });
          }

          // -------------------------------------------------------------------
          // 7. Top-Right Copywriting Settles (36 -> 46)
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
              36
            );
          }

          // -------------------------------------------------------------------
          // 8. Blinds Item Settle Polish (34 -> 46)
          // -------------------------------------------------------------------
          if (blindsItem) {
            timeline.fromTo(
              blindsItem,
              { scale: 0.96 },
              {
                scale: 1,
                ease: "power1.out",
                duration: 12,
              },
              34
            );
          }

          // -------------------------------------------------------------------
          // 9. Phase 4: Centered Description Stage Enters & Fills Simultaneously (48 -> 56)
          // Words finish turning black right as the stage covers the screen!
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
                duration: 8,
              },
              48
            );

            // Locked Fixed-Gap Translation Upwards with Device Cards (56 -> 76)
            timeline.to(
              descStage,
              {
                opacity: 0,
                y: "-110vh",
                ease: "power1.inOut",
                duration: 20,
              },
              56
            );
          }

          // -------------------------------------------------------------------
          // 10. Word-by-Word Color Fill during Stage Entry (48 -> 56)
          // Fully black the instant the stage takes full screen!
          // -------------------------------------------------------------------
          if (charSpans.length > 0) {
            const fillDuration = 8;
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
                48 + index * step
              );
            });
          }

          // -------------------------------------------------------------------
          // 11. Phase 5: 2-Column Device Cards Stage Climbs Up with Fixed Gap (56 -> 76)
          // Constant distance maintained directly beneath departing text stage
          // -------------------------------------------------------------------
          if (devicesStage) {
            timeline.fromTo(
              devicesStage,
              { opacity: 1, y: "110vh" },
              {
                opacity: 1,
                y: "0vh",
                ease: "power1.inOut",
                duration: 20,
              },
              56
            );
          }

          // -------------------------------------------------------------------
          // 12. 25 Horizontal Blinds / Slits Reveal on Device Images (60 -> 74)
          // Slits slice across images horizontally as cards enter
          // -------------------------------------------------------------------
          if (cardBlindSlits.length > 0) {
            const BLINDS_COUNT = 25;
            cardBlindSlits.forEach((slit, index) => {
              const slitRowIndex = index % BLINDS_COUNT;
              const slitStart = 60 + slitRowIndex * 0.45;
              timeline.fromTo(
                slit,
                { scaleY: 1, opacity: 1 },
                {
                  scaleY: 0,
                  opacity: 0,
                  ease: "power1.inOut",
                  duration: 8,
                },
                slitStart
              );
            });
          }

          // -------------------------------------------------------------------
          // 13. Device Cards Settle & Polish (64 -> 78)
          // -------------------------------------------------------------------
          if (deviceCards.length > 0) {
            timeline.fromTo(
              deviceCards,
              { scale: 0.97 },
              {
                scale: 1,
                ease: "power1.out",
                duration: 14,
                stagger: 0.6,
              },
              64
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
