import type { Navigation } from "@/domain/site";
import styles from "./Header.module.css";

interface HeaderProps {
  navigation: Navigation;
}

/**
 * The persistent header: logo, nav links, order button. Visually overlays
 * the hero because hero is full-viewport, but it is not part of the hero
 * section — it renders once, above every section, sourced from the
 * separate `Navigation` single type.
 *
 * No client interactivity yet, so this stays a Server Component
 * (CLAUDE.md §8). The mobile burger below is deliberately just an icon: the
 * actual overlay menu (`.popup-menu` in the CLAUDE.md §3 correction) is
 * real work of its own — its own content, its own animation — not
 * something to improvise as a header detail. It has no click handler yet.
 */
export function Header({ navigation }: HeaderProps) {
  return (
    <header className={styles.header}>
      <span className={styles.logo}>{navigation.logoText}</span>

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
          content model gives each its own fields (CLAUDE.md §7 navigation
          conventions note this explicitly) since one is section content
          and the other is persistent chrome, even though on screen they
          may end up showing the same values. */}
      <div className={styles.orderButton}>
        <span>{navigation.orderButtonLabel}</span>
        <span>{navigation.orderProductName}</span>
        <span>{navigation.orderPrice}</span>
      </div>

      <button type="button" className={styles.burger} aria-label="Open menu" disabled>
        <span />
        <span />
        <span />
      </button>
    </header>
  );
}
