"use client";

import { useState } from "react";
import type { Footer, Navigation } from "@/domain/site";
import { NotaLogo } from "@/shared/ui/NotaLogo";
import { NotaMark } from "@/shared/ui/NotaMark";
import { BurgerIcon } from "@/shared/ui/BurgerIcon";
import { MobileMenu } from "@/shared/ui/MobileMenu/MobileMenu";
import styles from "./Header.module.css";

interface HeaderProps {
  navigation: Navigation;
  footer: Footer | null;
}

/**
 * The persistent header: logo, nav links, order button, and — below 991px —
 * the burger that opens MobileMenu. `fixed`, not `absolute` — it stays
 * pinned through the whole page scroll, not just while it overlaps hero.
 *
 * The order button is two visually separate pieces inside one white box,
 * not one pill (confirmed against the reference's own live CSS, which
 * disagreed with an earlier "exact spec" document on this point — the mark
 * icon on the left, a genuinely separate black pill on the right, with
 * visible white space between them). Hidden entirely below 991px, not
 * shown differently — its own CSS confirms this, so it needs no mobile
 * variant here.
 *
 * No persistent mark icon in the collapsed mobile header (logo + burger
 * only) — an earlier version added one based on the same document, which
 * invented a `.header__mark` class that does not exist anywhere in the
 * reference's actual CSS.
 *
 * 'use client': opening/closing the mobile menu is real interactivity, not
 * something a Server Component can own.
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

        {/* Not yet a real trigger — becomes one once the order popup
            exists (this is what it opens on the reference site). */}
        <button type="button" className={styles.orderButton}>
          <NotaMark color="black" className={styles.orderMark} />
          <span className={styles.orderContent}>
            <span className={styles.orderTexts}>
              <span>{navigation.orderButtonLabel}</span>
              <span className={styles.orderProduct}>{navigation.orderProductName}</span>
            </span>
            <span className={styles.orderDot} aria-hidden="true" />
            <span>{navigation.orderPrice}</span>
          </span>
        </button>

        <button
          type="button"
          className={styles.burger}
          aria-label="Open menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(true)}
        >
          <BurgerIcon color="white" className={styles.burgerIcon} />
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
