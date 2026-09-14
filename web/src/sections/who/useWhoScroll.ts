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
 *              while contentWrapper smoothly translates upward
 *   68 -> 76:  Video enters as a compact 34vh card at BOTTOM-RIGHT strictly below Managers text
 *   76 -> 86:  Text layer scrolls up & fades out as Video expands to fill the framed stage (exact 0.5cm top/bottom gaps)
 *   86 -> 94:  Video HOLDS full-screen framed state firmly in view
 *   94 -> 100: ONLY AFTER HOLD, with continued scroll: Video shrinks (scale: 1 -> 0.65) as Paper climbs up
 */
/* Entrance Transition Markers (4-tier silhouette -> black screen) */
const TRANSITION_FADE_START = 0;
const TRANSITION_FADE_END = 5;
const EXPAND_START = 5;
const EXPAND_END = 16;

/* Manifesto Reveal (on solid black) */
const MANIFESTO_FADE_START = 16;
const MANIFESTO_FADE_END = 20;
const MANIFESTO_WORDS_START = 20;
const MANIFESTO_WORDS_END = 36;

/* Rest of Section Flow */
const DIVIDER_START = 36;
const DIVIDER_END = 40;

const LABEL_START = 38;
const LABEL_END = 42;

const RIGHT_ENTER_START = 42;
const RIGHT_ENTER_END = 50;

const INTRO_WORDS_START = 50;
const INTRO_WORDS_END = 62;

const CONTENT_SHIFT_START = 62;
const CONTENT_SHIFT_END = 80;

const PERSONA_1_TITLE_START = 62;
const PERSONA_1_TITLE_END = 68;
const PERSONA_1_BODY_START = 64;
const PERSONA_1_BODY_END = 70;

const PERSONA_2_TITLE_START = 70;
const PERSONA_2_TITLE_END = 76;
const PERSONA_2_BODY_START = 72;
const PERSONA_2_BODY_END = 78;

const PERSONA_3_TITLE_START = 78;
const PERSONA_3_TITLE_END = 84;
const PERSONA_3_BODY_START = 80;
const PERSONA_3_BODY_END = 86;

const VIDEO_STAGE_ENTER_START = 82;
const VIDEO_STAGE_ENTER_END = 88;

const TEXT_EXIT_START = 88;
const TEXT_EXIT_END = 94;

const VIDEO_EXPAND_START = 88;
const VIDEO_EXPAND_END = 95;

const VIDEO_PUSHBACK_START = 97;
const VIDEO_PUSHBACK_END = 100;

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

          const transitionOverlay = section.querySelector<HTMLElement>(
            "[data-specs-transition]"
          );
          const stem = section.querySelector<HTMLElement>("[data-specs-tier='stem']");
          const bodyUpper = section.querySelector<HTMLElement>("[data-specs-tier='bodyUpper']");
          const bodyLower = section.querySelector<HTMLElement>("[data-specs-tier='bodyLower']");
          const base = section.querySelector<HTMLElement>("[data-specs-tier='base']");

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
          const whoVideo = section.querySelector<HTMLVideoElement>("[data-who-video]");

          let videoHasPlayed = false;

          if (whoVideo) {
            whoVideo.loop = false;
            whoVideo.muted = true;
            whoVideo.playsInline = true;
          }

          if (isDesktop) {
            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: "bottom bottom",
                scrub: true,
                onUpdate: (self) => {
                  if (whoVideo) {
                    if (self.progress >= 0.80) {
                      if (!videoHasPlayed) {
                        videoHasPlayed = true;
                        whoVideo.currentTime = 0;
                        whoVideo.play().catch(() => {});
                      }
                    } else {
                      if (videoHasPlayed) {
                        videoHasPlayed = false;
                        whoVideo.pause();
                        whoVideo.currentTime = 0;
                      }
                    }
                  }
                },
              },
            });

            // 0. Transition Overlay fade in
            if (transitionOverlay) {
              timeline.fromTo(
                transitionOverlay,
                { opacity: 0 },
                {
                  opacity: 1,
                  ease: "power1.inOut",
                  duration: TRANSITION_FADE_END - TRANSITION_FADE_START,
                },
                TRANSITION_FADE_START
              );
            }

            // 0.1 Four tiers expand to full black
            const expandDuration = EXPAND_END - EXPAND_START;
            if (stem) {
              timeline.fromTo(
                stem,
                { scaleX: 1, scaleY: 1, transformOrigin: "50% 50%" },
                { scaleX: 120, ease: "power1.inOut", duration: expandDuration },
                EXPAND_START
              );
            }
            if (bodyUpper) {
              timeline.fromTo(
                bodyUpper,
                { scaleX: 1, scaleY: 1, transformOrigin: "50% 50%" },
                { scaleX: 36, ease: "power1.inOut", duration: expandDuration },
                EXPAND_START
              );
            }
            if (bodyLower) {
              timeline.fromTo(
                bodyLower,
                { scaleX: 1, scaleY: 1, transformOrigin: "50% 50%" },
                { scaleX: 15, ease: "power1.inOut", duration: expandDuration },
                EXPAND_START
              );
            }
            if (base) {
              timeline.fromTo(
                base,
                { scaleX: 1, scaleY: 1, transformOrigin: "50% 50%" },
                { scaleX: 7, ease: "power1.inOut", duration: expandDuration },
                EXPAND_START
              );
            }

            // 1. Text Layer (Manifesto) fades in directly on top of solid black screen
            if (textLayer) {
              timeline.fromTo(
                textLayer,
                { opacity: 0 },
                {
                  opacity: 1,
                  ease: "power1.inOut",
                  duration: MANIFESTO_FADE_END - MANIFESTO_FADE_START,
                },
                MANIFESTO_FADE_START
              );
            }

            // 2. Manifesto words turn from gray to white word-by-word
            if (manifestoWords.length > 0) {
              const totalManifestoDuration = MANIFESTO_WORDS_END - MANIFESTO_WORDS_START;
              const step = totalManifestoDuration / manifestoWords.length;
              manifestoWords.forEach((word, index) => {
                const start = MANIFESTO_WORDS_START + index * step;
                timeline.fromTo(
                  word,
                  { color: "rgba(255, 255, 255, 0.4)" },
                  { color: "#ffffff", ease: "none", duration: step * 1.5 },
                  start
                );
              });
            }

            // 3. Horizontal divider appearance
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

            // 4. Left label appearance
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

            // 5. Right column entry from right
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

            // 6. Right intro paragraph word-by-word color reveal (gray -> white)
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

            // 7. Smooth upward shift of the whole content wrapper
            if (contentWrapper) {
              timeline.fromTo(
                contentWrapper,
                { y: "0vw" },
                {
                  y: "-13.5vw",
                  ease: "power1.inOut",
                  duration: CONTENT_SHIFT_END - CONTENT_SHIFT_START,
                },
                CONTENT_SHIFT_START
              );
            }

            // 8. Persona 1: Students & Learners
            if (personaTitles[0]) {
              timeline.fromTo(
                personaTitles[0],
                { x: "12vw", opacity: 0 },
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
                { x: "12vw", opacity: 0 },
                {
                  x: "0vw",
                  opacity: 1,
                  ease: "power2.out",
                  duration: PERSONA_1_BODY_END - PERSONA_1_BODY_START,
                },
                PERSONA_1_BODY_START
              );
            }

            // 9. Persona 2: Creators, Designers & Architects
            if (personaTitles[1]) {
              timeline.fromTo(
                personaTitles[1],
                { x: "12vw", opacity: 0 },
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
                { x: "12vw", opacity: 0 },
                {
                  x: "0vw",
                  opacity: 1,
                  ease: "power2.out",
                  duration: PERSONA_2_BODY_END - PERSONA_2_BODY_START,
                },
                PERSONA_2_BODY_START
              );
            }

            // 10. Persona 3: Managers & Product Thinkers
            if (personaTitles[2]) {
              timeline.fromTo(
                personaTitles[2],
                { x: "12vw", opacity: 0 },
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
                { x: "12vw", opacity: 0 },
                {
                  x: "0vw",
                  opacity: 1,
                  ease: "power2.out",
                  duration: PERSONA_3_BODY_END - PERSONA_3_BODY_START,
                },
                PERSONA_3_BODY_START
              );
            }

            // 11. Video stage entrance
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
                  scale: 1,
                },
                {
                  opacity: 1,
                  x: "0vw",
                  width: "50vw",
                  height: "34vh",
                  scale: 1,
                  ease: "power2.out",
                  duration: VIDEO_STAGE_ENTER_END - VIDEO_STAGE_ENTER_START,
                },
                VIDEO_STAGE_ENTER_START
              );

              // 12. Video expands to full framed stage as text layer moves off-screen
              timeline.to(
                videoWrapper,
                {
                  width: "100%",
                  height: "100%",
                  scale: 1,
                  ease: "power2.inOut",
                  duration: VIDEO_EXPAND_END - VIDEO_EXPAND_START,
                },
                VIDEO_EXPAND_START
              );

              // 13. Video pushes back into the background
              timeline.to(
                videoWrapper,
                {
                  scale: 0.65,
                  opacity: 0.7,
                  ease: "power1.inOut",
                  duration: VIDEO_PUSHBACK_END - VIDEO_PUSHBACK_START,
                },
                VIDEO_PUSHBACK_START
              );
            }

            // 14. Text layer exit
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

            if (transitionOverlay) {
              mobileTimeline.fromTo(
                transitionOverlay,
                { opacity: 0 },
                { opacity: 1, ease: "power1.inOut", duration: 8 },
                0
              );
            }
            if (stem) mobileTimeline.fromTo(stem, { scaleX: 1, transformOrigin: "50% 50%" }, { scaleX: 45, ease: "power1.inOut", duration: 15 }, 5);
            if (bodyUpper) mobileTimeline.fromTo(bodyUpper, { scaleX: 1, transformOrigin: "50% 50%" }, { scaleX: 14, ease: "power1.inOut", duration: 15 }, 5);
            if (bodyLower) mobileTimeline.fromTo(bodyLower, { scaleX: 1, transformOrigin: "50% 50%" }, { scaleX: 6, ease: "power1.inOut", duration: 15 }, 5);
            if (base) mobileTimeline.fromTo(base, { scaleX: 1, transformOrigin: "50% 50%" }, { scaleX: 3, ease: "power1.inOut", duration: 15 }, 5);

            if (textLayer) {
              mobileTimeline.fromTo(
                textLayer,
                { opacity: 0 },
                { opacity: 1, ease: "power1.inOut", duration: 5 },
                18
              );
            }

            if (manifestoWords.length > 0) {
              const step = 20 / manifestoWords.length;
              manifestoWords.forEach((word, index) => {
                mobileTimeline.fromTo(
                  word,
                  { color: "rgba(255, 255, 255, 0.4)" },
                  { color: "#ffffff", ease: "none", duration: step * 1.5 },
                  20 + index * step
                );
              });
            }

            if (introWords.length > 0) {
              const step = 20 / introWords.length;
              introWords.forEach((word, index) => {
                mobileTimeline.fromTo(
                  word,
                  { color: "rgba(255, 255, 255, 0.4)" },
                  { color: "#ffffff", ease: "none", duration: step * 1.5 },
                  45 + index * step
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
