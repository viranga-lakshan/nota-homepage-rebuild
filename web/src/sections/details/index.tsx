"use client";

import type { DetailsSection, DetailCard } from "@/domain/sections";
import styles from "./details.module.css";

interface DetailsProps {
  section: DetailsSection;
}

const DEFAULT_CARDS: DetailCard[] = [
  {
    label: "Flush-fit precision cap",
    image: {
      url: "/images/detail_1.jpg",
      alt: "Flush-fit precision cap",
      width: 800,
      height: 600,
    },
    video: null,
  },
  {
    label: "Refined colors. Personal expression",
    image: {
      url: "/images/detail_2.jpg",
      alt: "Refined colors. Personal expression",
      width: 800,
      height: 1200,
    },
    video: null,
  },
  {
    label: null,
    image: {
      url: "/images/detail_3.jpg",
      alt: "Control button detail",
      width: 800,
      height: 800,
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
    label: "Aluminum body",
    image: {
      url: "/images/detail_5.jpg",
      alt: "Aluminum body",
      width: 800,
      height: 600,
    },
    video: null,
  },
  {
    label: null,
    image: {
      url: "/images/detail_6.jpg",
      alt: "Control button detail",
      width: 800,
      height: 800,
    },
    video: null,
  },
];

const CARD_CLASSES = [
  styles.card1,
  styles.card2,
  styles.card3,
  styles.card4,
  styles.card5,
  styles.card6,
];

export function Details({ section }: DetailsProps) {
  const cards = section.cards && section.cards.length > 0 ? section.cards : DEFAULT_CARDS;

  return (
    <section className={styles.section} data-details-section>
      <div className={styles.grid}>
        {cards.map((card, index) => {
          const cardClass = CARD_CLASSES[index] || styles.card1;
          const hasVideo = Boolean(card.video?.url);
          const hasImage = Boolean(card.image?.url);
          const hasLabel = Boolean(card.label && card.label.trim().length > 0);

          return (
            <div key={index} className={cardClass} data-detail-card={index}>
              {hasVideo && card.video ? (
                <video
                  className={styles.cardVideo}
                  src={card.video.url}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : hasImage && card.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className={styles.cardImage}
                  src={card.image.url}
                  alt={card.image.alt || card.label || `Detail ${index + 1}`}
                  loading="lazy"
                />
              ) : null}

              {hasLabel && (
                <div className={styles.label}>
                  <span>{card.label}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
