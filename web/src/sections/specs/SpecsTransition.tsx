import styles from "./specs-transition.module.css";

const MANIFESTO_LINES = [
  "Some thoughts need time, space, and a physical trace to exist.",
  "Writing by hand creates focus, presence, and a deeper connection",
  "with ideas. This tool is built around that simple truth.",
];

/**
 * The transition overlay that closes the Specifications section:
 * 1. 4 stepped tiers grow outward from the center to fill the viewport with solid black.
 * 2. Directly on top of that solid black screen, the Manifesto text appears and reveals word-by-word.
 */
export function SpecsTransition() {
  return (
    <div data-specs-transition className={styles.transition} aria-hidden="true">
      <div data-specs-tier="stem" className={styles.stem} />
      <div data-specs-tier="bodyUpper" className={styles.bodyUpper} />
      <div data-specs-tier="bodyLower" className={styles.bodyLower} />
      <div data-specs-tier="base" className={styles.base} />

      <div data-specs-manifesto className={styles.manifestoWrapper}>
        <p className={styles.manifesto}>
          {MANIFESTO_LINES.map((line, lIndex) => (
            <span key={lIndex} className={styles.manifestoLine}>
              {line.split(/\s+/).map((word, wIndex) => (
                <span key={wIndex} className={styles.wordWrap}>
                  <span data-specs-word className={styles.word}>
                    {word}
                  </span>{" "}
                </span>
              ))}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
