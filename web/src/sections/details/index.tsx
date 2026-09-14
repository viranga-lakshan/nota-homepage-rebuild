"use client";

import type { DetailsSection, DetailCard } from "@/domain/sections";
import styles from "./details.module.css";

interface DetailsProps {
  section: DetailsSection;
}

const DEFAULT_CARDS: DetailCard[] = [
  {
    label: "Ergonomic balanced grip",
    image: {
      url: "/images/detail_1.jpg",
      alt: "Ergonomic balanced grip",
      width: 800,
      height: 600,
    },
    video: null,
  },
  {
    label: "Precision pressure sensor",
    image: {
      url: "/images/detail_2.jpg",
      alt: "Precision pressure sensor",
      width: 800,
      height: 600,
    },
    video: null,
  },
  {
    label: "USB-C fast charging port",
    image: {
      url: "/images/detail_3.jpg",
      alt: "USB-C fast charging port",
      width: 800,
      height: 600,
    },
    video: null,
  },
  {
    label: "Durable metal nib, low-profile control button",
    image: null,
    video: {
      url: "https://nota.uprock.pro/video/pen.mp4",
      mime: "video/mp4",
    },
  },
  {
    label: "Integrated Bluetooth module",
    image: {
      url: "/images/detail_5.jpg",
      alt: "Integrated Bluetooth module",
      width: 800,
      height: 600,
    },
    video: null,
  },
];

export function Details({ section }: DetailsProps) {
  const cards = section.cards && section.cards.length > 0 ? section.cards : DEFAULT_CARDS;
  const backgroundVideoUrl = section.video?.url;

  return (
    <section className={styles.detailsSection} data-details-section>
      {backgroundVideoUrl && (
        <div className={styles.backgroundVideoWrapper} aria-hidden="true">
          <video
            className={styles.backgroundVideo}
            src={backgroundVideoUrl}
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      )}

      <div className={styles.container}>
        <div className={styles.cardsGrid}>
          {cards.map((card, index) => {
            const hasVideo = Boolean(card.video?.url);
            const hasImage = Boolean(card.image?.url);

            return (
              <div key={index} className={styles.card} data-detail-card={index}>
                <div className={styles.mediaWrapper}>
                  {hasVideo && card.video ? (
                    <video
                      className={styles.mediaVideo}
                      src={card.video.url}
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : hasImage && card.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      className={styles.mediaImage}
                      src={card.image.url}
                      alt={card.image.alt || card.label || `Detail ${index + 1}`}
                      loading="lazy"
                    />
                  ) : null}
                </div>

                {card.label && (
                  <div className={styles.labelPill}>
                    <span className={styles.labelText}>{card.label}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
