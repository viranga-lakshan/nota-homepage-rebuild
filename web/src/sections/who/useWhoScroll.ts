"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import { gsap } from "@/lib/animation/gsap.client";

interface UseWhoScrollOptions {
  sectionRef: RefObject<HTMLElement | null>;
}

/**
 * Timeline milestones (% of section scroll range 0 -> 100):
 *
 *   0 -> 5:    Initial quiet black entry
 *   5 -> 22:   Top manifesto words turn from gray to white sequentially
 *   22 -> 26:  Divider & "WHO IT'S FOR" left label fade in
 *   26 -> 36:  Right-side intro paragraph enters from right (gray)
 *   36 -> 48:  Right-side intro paragraph words turn from gray to white sequentially
 *   48 -> 72:  Personas sequence (Students & Learners -> Creators -> Managers)
 *              entering horizontally from RIGHT -> LEFT with title/body subtle stagger
 *              while contentWrapper smoothly translates upward (y: 0 -> -38vw)
 *   68 -> 78:  Video enters as a compact 34vh card at BOTTOM-RIGHT strictly below Managers text
 *   78 -> 94:  Text layer scrolls up & fades out as Video expands to fill the 100% frame (exact 0.5cm top/bottom gaps)
 *   94 -> 100: Video card holds centered before handing over to next section
 */
const MANIFESTO_WORDS_START = 5;
const MANIFESTO_WORDS_END = 22;

const DIVIDER_START = 22;
const DIVIDER_END = 26;

const LABEL_START = 23;
const LABEL_END = 26;

const RIGHT_ENTER_START = 26;
const RIGHT_ENTER_END = 36;

const INTRO_WORDS_START = 36;
const INTRO_WORDS_END = 48;

const CONTENT_SHIFT_START = 48;
const CONTENT_SHIFT_END = 78;

const PERSONA_1_TITLE_START = 48;
const PERSONA_1_TITLE_END = 54;
const PERSONA_1_BODY_START = 50;
const PERSONA_1_BODY_END = 56;

const PERSONA_2_TITLE_START = 56;
const PERSONA_2_TITLE_END = 62;
const PERSONA_2_BODY_START = 58;
const PERSONA_2_BODY_END = 64;

const PERSONA_3_TITLE_START = 64;
const PERSONA_3_TITLE_END = 70;
const PERSONA_3_BODY_START = 66;
const PERSONA_3_BODY_END = 72;

const VIDEO_STAGE_ENTER_START = 68;
const VIDEO_STAGE_ENTER_END = 78;

const TEXT_EXIT_START = 78;
const TEXT_EXIT_END = 88;

const VIDEO_EXPAND_START = 78;
const VIDEO_EXPAND_END = 94;

export function useWhoScroll({ sectionRef }: UseWhoScrollOptions) {
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
          const isMobile = Boolean(ctx.conditions?.isMobile);
          const reduceMotion = Boolean(ctx.conditions?.reduceMotion);

          if (reduceMotion) {
            return;
          }

          const manifestoWords = Array.from(
            section.querySelectorAll<HTMLElement>("[data-manifesto-word]")
          );
          const introWords = Array.from(
            section.querySelectorAll<HTMLElement>("[data-intro-word]")
          );
          const divider = section.querySelector<HTMLElement>("[data-divider]");
          const leftLabel = section.querySelector<HTMLElement>("[data-who-label]");
          const rightCol = section.querySelector<HTMLElement>("[data-right-column]");
          const textLayer = section.querySelector<HTMLElement>("[data-text-layer]");
          const contentWrapper = section.querySelector<HTMLElement>("[data-content-wrapper]");
          const personaTitles = Array.from(
            section.querySelectorAll<HTMLElement>("[data-persona-title]")
          );
          const personaBodies = Array.from(
            section.querySelectorAll<HTMLElement>("[data-persona-body]")
          );
          const videoStage = section.querySelector<HTMLElement>("[data-video-stage]");
          const videoWrapper = section.querySelector<HTMLElement>("[data-video-wrapper]");

          if (isDesktop) {
            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: "bottom bottom",
                scrub: true,
              },
            });

            // 1. Top manifesto word-by-word color reveal (gray -> white)
            if (manifestoWords.length > 0) {
              const totalManifestoDuration = MANIFESTO_WORDS_END - MANIFESTO_WORDS_START;
              const step = totalManifestoDuration / manifestoWords.length;

              manifestoWords.forEach((word, index) => {
                const start = MANIFESTO_WORDS_START + index * step;
                timeline.fromTo(
                  word,
                  { color: "rgba(255, 255, 255, 0.4)" },
                  {
                    color: "#ffffff",
                    ease: "none",
                    duration: step * 1.5,
                  },
                  start
                );
              });
            }

            // 2. Horizontal divider appearance
            if (divider) {
              timeline.fromTo(
                divider,
                { opacity: 0 },
                {
                  opacity: 1,
                  ease: "power1.inOut",
                  duration: DIVIDER_END - DIVIDER_START,
                },
                DIVIDER_START
              );
            }

            // 3. Left label appearance (stays gray)
            if (leftLabel) {
              timeline.fromTo(
                leftLabel,
                { opacity: 0 },
                {
                  opacity: 1,
                  ease: "power1.inOut",
                  duration: LABEL_END - LABEL_START,
                },
                LABEL_START
              );
            }

            // 4. Right column entry from right
            if (rightCol) {
              timeline.fromTo(
                rightCol,
                { x: "8vw", opacity: 0 },
                {
                  x: "0vw",
                  opacity: 1,
                  ease: "power1.out",
                  duration: RIGHT_ENTER_END - RIGHT_ENTER_START,
                },
                RIGHT_ENTER_START
              );
            }

            // 5. Right intro paragraph word-by-word color reveal (gray -> white)
            if (introWords.length > 0) {
              const totalIntroDuration = INTRO_WORDS_END - INTRO_WORDS_START;
              const step = totalIntroDuration / introWords.length;

              introWords.forEach((word, index) => {
                const start = INTRO_WORDS_START + index * step;
                timeline.fromTo(
                  word,
                  { color: "rgba(255, 255, 255, 0.4)" },
                  {
                    color: "#ffffff",
                    ease: "none",
                    duration: step * 1.5,
                  },
                  start
                );
              });
            }

            // 6. Upward translation of contentWrapper bringing personas to upper screen
            if (contentWrapper) {
              timeline.fromTo(
                contentWrapper,
                { y: "0vw" },
                {
                  y: "-38vw",
                  ease: "power1.inOut",
                  duration: CONTENT_SHIFT_END - CONTENT_SHIFT_START,
                },
                CONTENT_SHIFT_START
              );
            }

            // 7. Persona 1 (Students & Learners) entrance from RIGHT -> LEFT with title/body subtle stagger
            if (personaTitles[0]) {
              timeline.fromTo(
                personaTitles[0],
                { x: "18vw", opacity: 0 },
                {
                  x: "0vw",
                  opacity: 1,
                  ease: "power2.out",
                  duration: PERSONA_1_TITLE_END - PERSONA_1_TITLE_START,
                },
                PERSONA_1_TITLE_START
              );
            }
            if (personaBodies[0]) {
              timeline.fromTo(
                personaBodies[0],
                { x: "18vw", opacity: 0 },
                {
                  x: "0vw",
                  opacity: 1,
                  ease: "power2.out",
                  duration: PERSONA_1_BODY_END - PERSONA_1_BODY_START,
                },
                PERSONA_1_BODY_START
              );
            }

            // 8. Persona 2 (Creators, Designers & Architects) entrance from RIGHT -> LEFT with subtle stagger
            if (personaTitles[1]) {
              timeline.fromTo(
                personaTitles[1],
                { x: "18vw", opacity: 0 },
                {
                  x: "0vw",
                  opacity: 1,
                  ease: "power2.out",
                  duration: PERSONA_2_TITLE_END - PERSONA_2_TITLE_START,
                },
                PERSONA_2_TITLE_START
              );
            }
            if (personaBodies[1]) {
              timeline.fromTo(
                personaBodies[1],
                { x: "18vw", opacity: 0 },
                {
                  x: "0vw",
                  opacity: 1,
                  ease: "power2.out",
                  duration: PERSONA_2_BODY_END - PERSONA_2_BODY_START,
                },
                PERSONA_2_BODY_START
              );
            }

            // 9. Persona 3 (Managers & Product Thinkers) entrance from RIGHT -> LEFT with subtle stagger
            if (personaTitles[2]) {
              timeline.fromTo(
                personaTitles[2],
                { x: "18vw", opacity: 0 },
                {
                  x: "0vw",
                  opacity: 1,
                  ease: "power2.out",
                  duration: PERSONA_3_TITLE_END - PERSONA_3_TITLE_START,
                },
                PERSONA_3_TITLE_START
              );
            }
            if (personaBodies[2]) {
              timeline.fromTo(
                personaBodies[2],
                { x: "18vw", opacity: 0 },
                {
                  x: "0vw",
                  opacity: 1,
                  ease: "power2.out",
                  duration: PERSONA_3_BODY_END - PERSONA_3_BODY_START,
                },
                PERSONA_3_BODY_START
              );
            }

            // 10. Video stage entrance strictly below Managers & Product Thinkers
            if (videoStage) {
              timeline.fromTo(
                videoStage,
                { opacity: 0 },
                {
                  opacity: 1,
                  ease: "power1.inOut",
                  duration: VIDEO_STAGE_ENTER_END - VIDEO_STAGE_ENTER_START,
                },
                VIDEO_STAGE_ENTER_START
              );
            }

            if (videoWrapper) {
              timeline.fromTo(
                videoWrapper,
                {
                  opacity: 0,
                  x: "15vw",
                  width: "50vw",
                  height: "34vh",
                },
                {
                  opacity: 1,
                  x: "0vw",
                  width: "50vw",
                  height: "34vh",
                  ease: "power2.out",
                  duration: VIDEO_STAGE_ENTER_END - VIDEO_STAGE_ENTER_START,
                },
                VIDEO_STAGE_ENTER_START
              );

              // 11. Video expands to full framed stage as text layer moves off-screen
              timeline.to(
                videoWrapper,
                {
                  width: "100%",
                  height: "100%",
                  ease: "power2.inOut",
                  duration: VIDEO_EXPAND_END - VIDEO_EXPAND_START,
                },
                VIDEO_EXPAND_START
              );
            }

            // 12. Text layer exit (gracefully moves up and fades out without overlapping video growth)
            if (textLayer) {
              timeline.fromTo(
                textLayer,
                { opacity: 1, y: "0vw" },
                {
                  opacity: 0,
                  y: "-15vw",
                  ease: "power1.inOut",
                  duration: TEXT_EXIT_END - TEXT_EXIT_START,
                },
                TEXT_EXIT_START
              );
            }

            return () => {
              timeline.scrollTrigger?.kill();
              timeline.kill();
            };
          }

          // Mobile scroll-driven word transitions
          if (isMobile) {
            const mobileTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: "top 75%",
                end: "bottom 75%",
                scrub: true,
              },
            });

            if (manifestoWords.length > 0) {
              const step = 30 / manifestoWords.length;
              manifestoWords.forEach((word, index) => {
                mobileTimeline.fromTo(
                  word,
                  { color: "rgba(255, 255, 255, 0.4)" },
                  { color: "#ffffff", ease: "none", duration: step * 1.5 },
                  5 + index * step
                );
              });
            }

            if (introWords.length > 0) {
              const step = 30 / introWords.length;
              introWords.forEach((word, index) => {
                mobileTimeline.fromTo(
                  word,
                  { color: "rgba(255, 255, 255, 0.4)" },
                  { color: "#ffffff", ease: "none", duration: step * 1.5 },
                  40 + index * step
                );
              });
            }

            return () => {
              mobileTimeline.scrollTrigger?.kill();
              mobileTimeline.kill();
            };
          }
        }
      );
    }, section);

    return () => context.revert();
  }, [sectionRef]);
}
