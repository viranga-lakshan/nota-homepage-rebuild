import styles from "./specs-transition.module.css";

/**
 * The transition overlay that closes the Specifications section:
 * 4 stepped tiers that grow downward from the top/center and expand
 * outward to form the Nota pen silhouette before filling the viewport
 * with solid black.
 *
 * aria-hidden="true" because this is visual transition chrome.
 */
export function SpecsTransition() {
  return (
    <div data-specs-transition className={styles.transition} aria-hidden="true">
      <div data-specs-tier="stem" className={styles.stem} />
      <div data-specs-tier="bodyUpper" className={styles.bodyUpper} />
      <div data-specs-tier="bodyLower" className={styles.bodyLower} />
      <div data-specs-tier="base" className={styles.base} />
    </div>
  );
}
