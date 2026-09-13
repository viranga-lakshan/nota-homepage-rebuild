"use client";

import { useMemo, useRef } from "react";
import type { ReactNode } from "react";
import type { Persona, WhoSection } from "@/domain/sections";
import { useWhoScroll } from "./useWhoScroll";
import styles from "./who.module.css";

interface WhoProps {
  section: WhoSection;
}

const DEFAULT_MANIFESTO_LINES = [
  "Some thoughts need time, space, and a physical trace to exist.",
  "Writing by hand creates focus, presence, and a deeper connection",
  "with ideas. This tool is built around that simple truth.",
];

const DEFAULT_INTRO_STRUCTURE = [
  ["This tool is made for people who think on paper. It"],
  [
    "keeps handwriting natural and focused, letting you write the way",
    "you always have without distractions or screens getting in the way.",
  ],
  ["Everything you write syncs to the app, where"],
  [
    "your notes are organized, searchable, and ready to work with AI",
    "when you need more clarity or structure.",
  ],
];

const DEFAULT_PERSONAS: Persona[] = [
  {
    title: "Students & Learners",
    body: "Handwritten notes stay personal and intuitive, but become searchable, organized, and easy to study. Lectures, ideas, and revisions are captured as they are — then supported by AI summaries, text recognition, and quick navigation when it matters most.",
  },
  {
    title: "Creators, Designers & Architects",
    body: "Sketches, diagrams, concepts, and fragments of ideas belong on paper. This tool makes sure they don’t disappear. Everything drawn or written is safely stored, easy to revisit, and ready to evolve into something bigger — without interrupting the creative flow.",
  },
  {
    title: "Managers & Product Thinkers",
    body: "Meetings start on paper and end with structure. Notes turn into clear summaries, tasks, and follow-ups. The pen captures everything quietly, while the app helps organize decisions without pulling attention away from the room.",
  },
];

function getManifestoLines(manifesto: string): string[] {
  if (!manifesto) {
    return DEFAULT_MANIFESTO_LINES;
  }

  if (manifesto.includes("\n")) {
    const lines = manifesto
      .split(/\r?\n+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (lines.length > 0) {
      return lines;
    }
  }

  const regex =
    /(Some thoughts need time, space, and a physical trace to exist\.)\s*(Writing by hand creates focus, presence, and a deeper connection)\s*(with ideas\. This tool is built around that simple truth\.)/i;
  const match = manifesto.match(regex);
  if (match) {
    return [match[1], match[2], match[3]];
  }

  return DEFAULT_MANIFESTO_LINES;
}

function getIntroStructure(intro: string): string[][] {
  if (!intro) {
    return DEFAULT_INTRO_STRUCTURE;
  }

  if (intro.includes("\n\n")) {
    return intro
      .split(/\r?\n\r?\n+/)
      .map((p) => p.split(/\r?\n+/).map((l) => l.trim()).filter(Boolean))
      .filter((p) => p.length > 0);
  }

  return DEFAULT_INTRO_STRUCTURE;
}

/**
 * Splits text into animated word spans while preserving whitespace and inheriting typography.
 */
function renderAnimatedWords(text: string, dataAttribute: string): ReactNode {
  const words = text.split(/\s+/).filter(Boolean);

  return words.map((word, index) => (
    <span key={index} className={styles.wordWrap}>
      <span {...{ [dataAttribute]: "" }} className={styles.word}>
        {word}
      </span>
      {index < words.length - 1 ? " " : ""}
    </span>
  ));
}

/**
 * The Who It's For / Manifesto section:
 *
 * Sequence:
 *   1. Manifesto: ONE large serif paragraph (Instrument Serif), exactly 3 lines.
 *   2. Divider: Thin horizontal rule.
 *   3. Left Label: "Who it's for:" in subtle uppercase sans-serif.
 *   4. Intro: FOUR separate <p> elements, exactly 6 lines total.
 *   5. Personas: 3 audience blocks entering sequentially from RIGHT -> LEFT with title/body subtle stagger.
 *   6. Video: Framed with 0.5cm top/bottom black bars & 1.5cm side black borders, expanding to fill the frame.
 */
export function Who({ section }: WhoProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useWhoScroll({ sectionRef });

  const manifestoLines = useMemo(
    () => getManifestoLines(section.manifesto),
    [section.manifesto]
  );

  const introParagraphs = useMemo(
    () => getIntroStructure(section.intro),
    [section.intro]
  );

  const personas = useMemo(
    () => (section.personas && section.personas.length > 0 ? section.personas : DEFAULT_PERSONAS),
    [section.personas]
  );

  return (
    <section ref={sectionRef} className={styles.who}>
      <div className={styles.camera}>
        {/* Text Layer: Manifesto + Intro + Personas */}
        <div data-text-layer className={styles.textLayer}>
          <div data-content-wrapper className={styles.contentWrapper}>
            {/* Top Manifesto: ONE single paragraph in Instrument Serif */}
            <div data-manifesto-block className={styles.manifestoBlock}>
              <p className={styles.manifesto}>
                {manifestoLines.map((lineText, lIndex) => (
                  <span key={lIndex} className={styles.manifestoLine}>
                    {renderAnimatedWords(lineText, "data-manifesto-word")}
                    {lIndex < manifestoLines.length - 1 ? " " : ""}
                  </span>
                ))}
              </p>
            </div>

            {/* Thin Horizontal Divider */}
            <div data-divider className={styles.divider} />

            {/* Lower Content: Left Label + Right Column Group */}
            <div className={styles.lowerSection}>
              <div data-who-label className={styles.leftColumn}>
                <h2 className={styles.whoLabel}>{section.whoLabel}</h2>
              </div>

              <div className={styles.rightColumnGroup}>
                {/* 4-Paragraph Intro */}
                <div data-right-column className={styles.rightColumn}>
                  {introParagraphs.map((lines, pIndex) => (
                    <p key={pIndex} className={styles.introParagraph}>
                      {lines.map((lineText, lIndex) => (
                        <span key={lIndex} className={styles.introLine}>
                          {renderAnimatedWords(lineText, "data-intro-word")}
                          {lIndex < lines.length - 1 ? " " : ""}
                        </span>
                      ))}
                    </p>
                  ))}
                </div>

                {/* 3 Audience / Persona Blocks */}
                <div data-personas-wrapper className={styles.thesesWrapper}>
                  {personas.map((persona, index) => (
                    <div
                      key={index}
                      data-persona-item={index}
                      className={styles.personaItem}
                    >
                      <h3 data-persona-title className={styles.personaTitle}>
                        {persona.title}
                      </h3>
                      <p data-persona-body className={styles.personaBody}>
                        {persona.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Stage Frame: Precision black framing on all 4 sides */}
        <div data-video-stage className={styles.videoStage}>
          <div data-video-wrapper className={styles.videoWrapper}>
            <video
              data-who-video
              className={styles.video}
              src={section.video?.url || "https://nota.uprock.pro/video/pen.mp4"}
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
        </div>
      </div>
    </section>
  );
}
