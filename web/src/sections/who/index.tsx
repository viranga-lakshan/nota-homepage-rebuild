"use client";

import { useRef } from "react";
import type { WhoSection as WhoSectionData } from "@/domain/sections";
import { useManifestoFill } from "./useManifestoFill";
import styles from "./who.module.css";

interface WhoProps {
  section: WhoSectionData;
}

/**
 * Built to CLAUDE.md §3's description (manifesto text-fill, sticky label
 * with flowing content, looping video) rather than the reference's actual
 * mechanism — confirmed via fetched CSS to involve a sticky "camera",
 * 180vh-tall scroll-pinned tracks, a video animated with 3D perspective
 * transforms, and a horizontally-clipped persona reveal. That is
 * substantially more elaborate than either spec document assumed, and not
 * something reproducible with confidence from static CSS alone with no
 * way to watch it animate. Documented as a known simplification (README),
 * same treatment as the hero frame sequence and the hardcoded brand marks.
 */
export function Who({ section }: WhoProps) {
  const manifestoRef = useRef<HTMLParagraphElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const words = section.manifesto.split(/\s+/).filter(Boolean);

  useManifestoFill({ containerRef: manifestoRef, wordRefs });

  return (
    <section className={styles.section}>
      <p ref={manifestoRef} className={styles.manifesto} aria-label={section.manifesto}>
        <span aria-hidden="true">
          {words.map((word, index) => (
            <span
              key={index}
              ref={(el) => {
                wordRefs.current[index] = el;
              }}
              className={styles.word}
            >
              {word}{" "}
            </span>
          ))}
        </span>
      </p>

      <div className={styles.whoWrapper}>
        <div className={styles.labelCol}>
          <span className={styles.label}>{section.whoLabel}</span>
        </div>

        <div className={styles.contentCol}>
          <p className={styles.intro}>{section.intro}</p>

          {section.personas.map((persona) => (
            <div key={persona.title} className={styles.persona}>
              <h3 className={styles.personaTitle}>{persona.title}</h3>
              <p className={styles.personaBody}>{persona.body}</p>
            </div>
          ))}
        </div>
      </div>

      <video className={styles.video} autoPlay muted loop playsInline>
        <source src={section.video.url} type={section.video.mime} />
      </video>
    </section>
  );
}
