import type { Footer as FooterData } from "@/domain/site";
import styles from "./Footer.module.css";

interface FooterProps {
  footer: FooterData;
}

/**
 * Server Component — nothing here is interactive. Confirmed against
 * fetched reference CSS: footer text uses a single shared style
 * (.footer-title, ~1.41vw, weight 600) rather than the two visually
 * distinct sizes a supplied spec assumed for description vs. credits —
 * built against the closest existing token (--text-button, 1.39vw)
 * rather than add a near-duplicate token for a 0.02vw difference.
 */
export function Footer({ footer }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <p className={styles.description}>{footer.description}</p>

      <nav className={styles.navLinks} aria-label="Footer">
        <ul>
          {footer.navLinks.map((item) => (
            <li key={item.href}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.credits}>
        <span>{footer.copyright}</span>
        <span>{footer.credit}</span>
      </div>
    </footer>
  );
}
