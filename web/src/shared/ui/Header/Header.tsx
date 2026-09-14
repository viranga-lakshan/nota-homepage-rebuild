"use client";

import { useState, useEffect, useRef } from "react";
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

export function Header({ navigation, footer }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;

      // At top of page, always show
      if (currentScrollY <= 60) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Delta threshold to avoid tiny micro-jitters
      const delta = currentScrollY - lastScrollY.current;
      if (Math.abs(delta) < 8) {
        return;
      }

      if (delta > 0 && currentScrollY > 100) {
        // Scrolling DOWN -> Hide Header
        setIsVisible(false);
      } else if (delta < 0) {
        // Scrolling UP -> Show Header
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const headerClass = `${styles.header} ${!isVisible && !isMenuOpen ? styles.headerHidden : ""}`;

  return (
    <>
      <header className={headerClass}>
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
