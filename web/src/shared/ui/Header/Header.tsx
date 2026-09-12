"use client";

import { useState } from "react";
import type { Footer, Navigation } from "@/domain/site";
import { NotaLogo } from "@/shared/ui/NotaLogo";
import { BurgerIcon } from "@/shared/ui/BurgerIcon";
import { MobileMenu } from "@/shared/ui/MobileMenu/MobileMenu";
import styles from "./Header.module.css";

interface HeaderProps {
  navigation: Navigation;
  footer: Footer | null;
}

/**
 * The persistent header: logo, nav links, order button, and — below 991px —
 * the burger that opens MobileMenu. Visually overlays the hero because hero
 * is full-viewport, but it is not part of the hero section; it renders
 * once, above every section, sourced from the separate Navigation single
 * type (plus Footer, passed through only for the mobile overlay's credit
 * line).
 *
 * 'use client' now, unlike its first version: opening/closing the mobile
 * menu is real interactivity, not something a Server Component can own.
 */
export function Header({ navigation, footer }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className={styles.header}>
        <NotaLogo color="white" className={styles.logo} />

        <nav className={styles.nav} aria-label="Primary">
          <ul className={styles.navList}>
            {navigation.items.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Not yet a real trigger — becomes one once the order popup exists.
            Duplicates the hero section's own order card by design: the
            content model gives each its own fields (CLAUDE.md §7) since one
            is section content and the other is persistent chrome. */}
        <div className={styles.orderButton}>
          <span>{navigation.orderButtonLabel}</span>
          <span>{navigation.orderProductName}</span>
          <span>{navigation.orderPrice}</span>
        </div>

        <button
          type="button"
          className={styles.burger}
          aria-label="Open menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(true)}
        >
          <BurgerIcon color="white" />
        </button>
      </header>

      <MobileMenu
        navigation={navigation}
        footer={footer}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
}
