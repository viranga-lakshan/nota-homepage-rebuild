import type { Footer as FooterType } from "@/domain/site";
import styles from "./Footer.module.css";

interface FooterProps {
  footer: FooterType | null;
}

const DEFAULT_NAV_LINKS = [
  { label: "Specifications", href: "#specifications" },
  { label: "Who it's for", href: "#who-its-for" },
  { label: "About", href: "#about" },
  { label: "Inside the box", href: "#inside-the-box" },
];

function formatDescription(text: string) {
  if (text.includes("\n")) {
    return text.split("\n").map((line, i, arr) => (
      <span key={i}>
        {line}
        {i < arr.length - 1 && <br />}
      </span>
    ));
  }

  // Format standard statement into the exact 4 lines requested
  if (
    text.toLowerCase().includes("tools that respect") &&
    text.toLowerCase().includes("digital structure")
  ) {
    return (
      <>
        <span>NŌTA creates tools that respect the</span>
        <br />
        <span>way people think and write.</span>
        <br />
        <span>Natural handwriting, quietly</span>
        <br />
        <span>connected to digital structure.</span>
      </>
    );
  }

  return text;
}

export function Footer({ footer }: FooterProps) {
  const description =
    footer?.description ||
    "NŌTA creates tools that respect the way people think and write. Natural handwriting, quietly connected to digital structure.";

  const navLinks =
    footer?.navLinks && footer.navLinks.length > 0
      ? footer.navLinks
      : DEFAULT_NAV_LINKS;

  const year = footer?.year || "2026";
  const copyright = footer?.copyright || "@2026 Nōta Team";

  // Group credit links: first 2 for left team ("Made in Taptop", "Builded by NōtaTeam"), rest for design team ("Designed by Alice", "& UPROCK Studio")
  const creditLinks = footer?.creditLinks ?? [];
  const madeInLink = creditLinks.find((l) => l.label.toLowerCase().includes("taptop")) || {
    label: "Made in Taptop",
    href: "https://taptop.pro/",
  };
  const builtByLink = creditLinks.find((l) => l.label.toLowerCase().includes("build")) || {
    label: "Builded by NōtaTeam",
    href: null,
  };
  const designLinks = creditLinks.filter(
    (l) =>
      !l.label.toLowerCase().includes("taptop") &&
      !l.label.toLowerCase().includes("build")
  );

  return (
    <footer className={styles.footer} id="footer">
      {/* Top section with description & navigation */}
      <div className={styles.contentTop}>
        <div className={styles.descriptionWrapper}>
          <p className={styles.description}>{formatDescription(description)}</p>
        </div>

        <div className={styles.infoWrapper}>
          <div className={styles.menuColumn}>
            <h2 className={styles.columnTitle}>Navigation</h2>
            <nav className={styles.navLinks} aria-label="Footer navigation">
              {navLinks.map((link, index) => (
                <a key={index} href={link.href} className={styles.navLink}>
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className={styles.yearColumn}>
            <h3 className={styles.columnTitle}>Year</h3>
            <p className={styles.yearText}>{year}</p>
          </div>
        </div>
      </div>

      {/* Bottom section with copyright and attribution credits */}
      <div className={styles.contentBottom}>
        <p className={styles.copyright}>{copyright}</p>

        <div className={styles.teamWrapper}>
          <div className={styles.teamGroup}>
            {madeInLink.href ? (
              <a
                href={madeInLink.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.creditLink}
              >
                {madeInLink.label}
              </a>
            ) : (
              <span className={styles.creditText}>{madeInLink.label}</span>
            )}

            {footer?.madeInLogo?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={footer.madeInLogo.url}
                alt={footer.madeInLogo.alt || "Dot"}
                className={styles.teamIconImg}
              />
            ) : (
              <span className={styles.teamIcon} aria-hidden="true" />
            )}

            {builtByLink.href ? (
              <a
                href={builtByLink.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.creditLink}
              >
                {builtByLink.label}
              </a>
            ) : (
              <span className={styles.creditText}>{builtByLink.label}</span>
            )}
          </div>

          <div className={styles.designTeam}>
            {designLinks.length > 0 ? (
              designLinks.map((link, index) =>
                link.href ? (
                  <a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.creditLink}
                  >
                    {link.label}
                  </a>
                ) : (
                  <span key={index} className={styles.creditText}>
                    {link.label}
                  </span>
                )
              )
            ) : (
              <>
                <a
                  href="https://www.behance.net/alicem"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.creditLink}
                >
                  Designed by Alice
                </a>
                <a
                  href="https://www.uprock.ru/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.creditLink}
                >
                  &amp; UPROCK Studio
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
