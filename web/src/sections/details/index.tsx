import Image from "next/image";
import type { DetailsSection as DetailsSectionData } from "@/domain/sections";
import styles from "./details.module.css";

interface DetailsProps {
  section: DetailsSectionData;
}

/**
 * A grid of close-up product photos with a label pill on each, plus one
 * looping video. No scroll animation on this one in any source consulted
 * — a Server Component, since nothing here needs client-side JS.
 */
export function Details({ section }: DetailsProps) {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {section.cards.map((card) => (
          <div key={card.label} className={styles.card}>
            <Image
              src={card.image.url}
              alt={card.image.alt}
              fill
              sizes="(max-width: 991px) 50vw, 33vw"
              className={styles.cardImage}
            />
            <span className={styles.cardLabel}>{card.label}</span>
          </div>
        ))}

        <div className={styles.videoCard}>
          <video className={styles.video} autoPlay muted loop playsInline>
            <source src={section.video.url} type={section.video.mime} />
          </video>
        </div>
      </div>
    </section>
  );
}
