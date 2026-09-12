"use client";

import Image from "next/image";
import type { Footer, Navigation } from "@/domain/site";
import { NotaLogo } from "@/shared/ui/NotaLogo";
import { NotaMark } from "@/shared/ui/NotaMark";
import styles from "./MobileMenu.module.css";

interface MobileMenuProps {
  navigation: Navigation;
  /** Optional: the overlay still works with nothing in its footer row if this hasn't been published yet. */
  footer: Footer | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * The full-screen mobile nav overlay. Always mounted, never conditionally
 * rendered — `inert` (not a class, not `display: none`) is what actually
 * removes it from the tab order and accessibility tree while closed, so a
 * CSS transition can animate it open/closed both ways rather than only
 * having an enter animation from a fresh mount.
 *
 * Nav links, the order pill's text, and the footer credits all come from
 * `navigation`/`footer` — nothing here is hardcoded, even though the task
 * that asked for this listed the link labels and footer text as if they
 * were fixed strings.
 */
export function MobileMenu({ navigation, footer, isOpen, onClose }: MobileMenuProps) {
  return (
    <div
      className={styles.overlay}
      data-open={isOpen}
      inert={!isOpen}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
    >
      <div className={styles.topBar}>
        <NotaLogo color="black" />
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close menu">
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
            <line x1="2" y1="2" x2="18" y2="18" stroke="black" strokeWidth="2" />
            <line x1="18" y1="2" x2="2" y2="18" stroke="black" strokeWidth="2" />
          </svg>
        </button>
        <NotaMark color="black" />
      </div>

      <nav className={styles.nav} aria-label="Mobile">
        <ul className={styles.navList}>
          {navigation.items.map((item) => (
            <li key={item.href}>
              <a href={item.href} onClick={onClose}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.productWrap}>
        <Image
          src={navigation.mobileMenuImage.url}
          alt={navigation.mobileMenuImage.alt}
          width={navigation.mobileMenuImage.width}
          height={navigation.mobileMenuImage.height}
          sizes="80vw"
          className={styles.productImage}
        />
        <div className={styles.orderPill}>
          {navigation.orderButtonLabel} {navigation.orderProductName} • {navigation.orderPrice}
        </div>
      </div>

      {footer && (
        <div className={styles.footer}>
          <span>{footer.copyright}</span>
          <span>{footer.credit}</span>
        </div>
      )}
    </div>
  );
}
