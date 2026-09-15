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
const TRANSITION_FADE_END = 4;
const EXPAND_START = 4;
const EXPAND_END = 12;

/* Manifesto Reveal (on solid black) */
const MANIFESTO_FADE_START = 12;
const MANIFESTO_FADE_END = 16;
const MANIFESTO_WORDS_START = 16;
const MANIFESTO_WORDS_END = 28;

/* Rest of Section Flow */
const DIVIDER_START = 28;
const DIVIDER_END = 32;

const LABEL_START = 29;
const LABEL_END = 32;

const RIGHT_ENTER_START = 32;
const RIGHT_ENTER_END = 38;

const INTRO_WORDS_START = 38;
const INTRO_WORDS_END = 48;

const CONTENT_SHIFT_START = 48;
const CONTENT_SHIFT_MID = 70;
const CONTENT_SHIFT_END = 84;

const PERSONA_1_TITLE_START = 46;
const PERSONA_1_TITLE_END = 54;
const PERSONA_1_BODY_START = 48;
const PERSONA_1_BODY_END = 56;

const PERSONA_2_TITLE_START = 52;
const PERSONA_2_TITLE_END = 60;
const PERSONA_2_BODY_START = 54;
const PERSONA_2_BODY_END = 62;

const PERSONA_3_TITLE_START = 56;
const PERSONA_3_TITLE_END = 64;
const PERSONA_3_BODY_START = 58;
const PERSONA_3_BODY_END = 66;

const VIDEO_STAGE_ENTER_START = 58;
const VIDEO_STAGE_ENTER_END = 66;

const VIDEO_EXPAND_START = 64;
const VIDEO_EXPAND_END = 72;

const VIDEO_PUSHBACK_START = 77;
const VIDEO_PUSHBACK_END = 83;

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
            // Explicit initial states to prevent any immediateRender flash on first page load
            if (transitionOverlay) gsap.set(transitionOverlay, { opacity: 0 });
            if (stem) gsap.set(stem, { scaleX: 1, scaleY: 1, transformOrigin: "50% 50%" });
            if (bodyUpper) gsap.set(bodyUpper, { scaleX: 1, scaleY: 1, transformOrigin: "50% 50%" });
            if (bodyLower) gsap.set(bodyLower, { scaleX: 1, scaleY: 1, transformOrigin: "50% 50%" });
            if (base) gsap.set(base, { scaleX: 1, scaleY: 1, transformOrigin: "50% 50%" });

            if (textLayer) gsap.set(textLayer, { opacity: 0, y: "0vw" });
            if (manifestoWords.length > 0) gsap.set(manifestoWords, { color: "rgba(255, 255, 255, 0.4)" });
            if (divider) gsap.set(divider, { opacity: 0 });
            if (leftLabel) gsap.set(leftLabel, { opacity: 0 });
            if (rightCol) gsap.set(rightCol, { x: "8vw", opacity: 0 });
            if (introWords.length > 0) gsap.set(introWords, { color: "rgba(255, 255, 255, 0.4)" });
            if (contentWrapper) gsap.set(contentWrapper, { y: "0vw" });
            if (personaTitles.length > 0) gsap.set(personaTitles, { x: "12vw", opacity: 0 });
            if (videoWrapper) gsap.set(videoWrapper, { opacity: 0, x: "25vw", width: "65vw", height: "24vh", right: "0vw", bottom: "0vh", scale: 1 });

            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: "bottom bottom",
                scrub: true,
                onUpdate: (self) => {
                  if (whoVideo) {
                    if (self.progress >= 0.72) {
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

            // 0. Transition Overlay fade in (0 -> 5%)
            if (transitionOverlay) {
              timeline.to(
                transitionOverlay,
                {
                  opacity: 1,
                  ease: "power1.inOut",
                  duration: TRANSITION_FADE_END - TRANSITION_FADE_START,
                },
                TRANSITION_FADE_START
              );
            }

            // 0.1 Four tiers expand to full black (5 -> 16%)
            const expandDuration = EXPAND_END - EXPAND_START;
            if (stem) {
              timeline.to(stem, { scaleX: 120, ease: "power1.inOut", duration: expandDuration }, EXPAND_START);
            }
            if (bodyUpper) {
              timeline.to(bodyUpper, { scaleX: 36, ease: "power1.inOut", duration: expandDuration }, EXPAND_START);
            }
            if (bodyLower) {
              timeline.to(bodyLower, { scaleX: 15, ease: "power1.inOut", duration: expandDuration }, EXPAND_START);
            }
            if (base) {
              timeline.to(base, { scaleX: 7, ease: "power1.inOut", duration: expandDuration }, EXPAND_START);
            }

            // 1. Text Layer (Manifesto) fades in directly on top of solid black screen (16 -> 20%)
            if (textLayer) {
              timeline.to(
                textLayer,
                {
                  opacity: 1,
                  ease: "power1.inOut",
                  duration: MANIFESTO_FADE_END - MANIFESTO_FADE_START,
                },
                MANIFESTO_FADE_START
              );
            }

            // 2. Manifesto words turn from gray to white word-by-word (20 -> 36%)
            if (manifestoWords.length > 0) {
              const totalManifestoDuration = MANIFESTO_WORDS_END - MANIFESTO_WORDS_START;
              const step = totalManifestoDuration / manifestoWords.length;
              manifestoWords.forEach((word, index) => {
                const start = MANIFESTO_WORDS_START + index * step;
                timeline.to(
                  word,
                  { color: "#ffffff", ease: "none", duration: step * 1.5 },
                  start
                );
              });
            }

            // 3. Horizontal divider appearance (36 -> 40%)
            if (divider) {
              timeline.to(
                divider,
                {
                  opacity: 1,
                  ease: "power1.inOut",
                  duration: DIVIDER_END - DIVIDER_START,
                },
                DIVIDER_START
              );
            }

            // 4. Left label appearance (38 -> 42%)
            if (leftLabel) {
              timeline.to(
                leftLabel,
                {
                  opacity: 1,
                  ease: "power1.inOut",
                  duration: LABEL_END - LABEL_START,
                },
                LABEL_START
              );
            }

            // 5. Right column entry from right (42 -> 50%)
            if (rightCol) {
              timeline.to(
                rightCol,
                {
                  x: "0vw",
                  opacity: 1,
                  ease: "power1.out",
                  duration: RIGHT_ENTER_END - RIGHT_ENTER_START,
                },
                RIGHT_ENTER_START
              );
            }

            // 6. Right intro paragraph color reveal (gray -> white all together, not word-by-word) (38 -> 48%)
            if (introWords.length > 0) {
              timeline.to(
                introWords,
                {
                  color: "#ffffff",
                  ease: "power1.inOut",
                  duration: INTRO_WORDS_END - INTRO_WORDS_START,
                },
                INTRO_WORDS_START
              );
            }

            // 7. Smooth upward shift of the whole content wrapper (48 -> 74%)
            // 7. Continuous upward scroll of content wrapper
            // 7. Continuous upward scroll of content wrapper
            // Stage 1 (46 -> 60%): Brings Persona 3 and the video below it smoothly into view
            if (contentWrapper) {
              timeline.to(
                contentWrapper,
                {
                  y: "-50vw",
                  ease: "power1.inOut",
                  duration: 60 - PERSONA_1_TITLE_START,
                },
                PERSONA_1_TITLE_START
              );

              // Stage 2 (64 -> 72%): Text continues scrolling naturally off the top as video expands
              timeline.to(
                contentWrapper,
                {
                  y: "-115vw",
                  ease: "power1.inOut",
                  duration: VIDEO_EXPAND_END - VIDEO_EXPAND_START,
                },
                VIDEO_EXPAND_START
              );
            }

            if (textLayer) {
              timeline.to(
                textLayer,
                {
                  opacity: 0,
                  ease: "power1.inOut",
                  duration: VIDEO_EXPAND_END - VIDEO_EXPAND_START,
                },
                VIDEO_EXPAND_START
              );
            }

            // 8. Persona 1: Students & Learners
            if (personaTitles[0]) {
              timeline.to(
                personaTitles[0],
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
              timeline.to(
                personaBodies[0],
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
              timeline.to(
                personaTitles[1],
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
              timeline.to(
                personaBodies[1],
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
              timeline.to(
                personaTitles[2],
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
              timeline.to(
                personaBodies[2],
                {
                  x: "0vw",
                  opacity: 1,
                  ease: "power2.out",
                  duration: PERSONA_3_BODY_END - PERSONA_3_BODY_START,
                },
                PERSONA_3_BODY_START
              );
            }

            // 11. Video stage entrance (58 -> 66%) — Enters from right into bottom half below Persona 3
            if (videoStage) {
              timeline.to(
                videoStage,
                {
                  opacity: 1,
                  ease: "power1.inOut",
                  duration: VIDEO_STAGE_ENTER_END - VIDEO_STAGE_ENTER_START,
                },
                VIDEO_STAGE_ENTER_START
              );
            }

            if (videoWrapper) {
              timeline.to(
                videoWrapper,
                {
                  opacity: 1,
                  x: "0vw",
                  ease: "power2.out",
                  duration: VIDEO_STAGE_ENTER_END - VIDEO_STAGE_ENTER_START,
                },
                VIDEO_STAGE_ENTER_START
              );

              // 12. Video expands across entire framed stage (64 -> 72%) as text scrolls off top with matched easing
              timeline.to(
                videoWrapper,
                {
                  width: "100%",
                  height: "100%",
                  right: "0vw",
                  bottom: "0vh",
                  scale: 1,
                  ease: "power1.inOut",
                  duration: VIDEO_EXPAND_END - VIDEO_EXPAND_START,
                },
                VIDEO_EXPAND_START
              );

              // 13. Video pushes back into the background (77 -> 83%)
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

            return () => {
              timeline.scrollTrigger?.kill();
              timeline.kill();
            };
          }

          // Mobile: No scroll animations — clean, static presentation
          if (isMobile) {
            if (whoVideo) {
              whoVideo.loop = true;
              whoVideo.muted = true;
              whoVideo.playsInline = true;
              whoVideo.play().catch(() => {});
            }
            return;
          }
        }
      );
    }, section);

    return () => context.revert();
  }, [sectionRef]);
}
