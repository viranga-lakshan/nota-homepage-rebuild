"use client";

import { useState } from "react";
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
      url: "/images/detail_2.png",
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
      url: "/videos/details_pen.mp4",
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

function CardMedia({
  card,
  defaultCard,
  index,
}: {
  card?: DetailCard;
  defaultCard: DetailCard;
  index: number;
}) {
  const isVideoCard = index === 3 || Boolean(card?.video?.url);
  const videoUrl = card?.video?.url || defaultCard.video?.url;
  const initialImageUrl = card?.image?.url || defaultCard.image?.url || "";
  const fallbackImageUrl = defaultCard.image?.url || "";

  const [imgSrc, setImgSrc] = useState(initialImageUrl);

  if (isVideoCard && videoUrl) {
    return (
      <video
        className={styles.cardVideo}
        src={videoUrl}
        autoPlay
        loop
        muted
        playsInline
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={styles.cardImage}
      src={imgSrc || fallbackImageUrl}
      alt={card?.image?.alt || defaultCard.image?.alt || `Detail ${index + 1}`}
      loading="lazy"
      onError={() => {
        if (fallbackImageUrl && imgSrc !== fallbackImageUrl) {
          setImgSrc(fallbackImageUrl);
        }
      }}
    />
  );
}

export function Details({ section }: DetailsProps) {
  // Always ensure 6 cards in exact reference grid layout
  const cards = Array.from({ length: 6 }, (_, index) => {
    const defaultCard = DEFAULT_CARDS[index];
    const rawCard = section.cards?.[index];

    // For slot 3 (Card 4), it is always the video card
    if (index === 3) {
      return {
        ...defaultCard,
        ...(rawCard?.video ? { video: rawCard.video } : {}),
        label: "Durable metal nib, low-profile control button",
      };
    }

    // For slot 4 (Card 5), it is "Aluminum body"
    if (index === 4) {
      return {
        ...defaultCard,
        ...(rawCard?.image ? { image: rawCard.image } : {}),
        label: "Aluminum body",
      };
    }

    if (!rawCard) return defaultCard;

    // Clean label: empty/whitespace string should become null
    const cleanedLabel =
      rawCard.label && rawCard.label.trim().length > 0
        ? rawCard.label.trim()
        : defaultCard.label;

    return {
      ...defaultCard,
      ...rawCard,
      label: cleanedLabel,
    };
  });

  return (
    <section className={styles.section} data-details-section>
      <div className={styles.grid}>
        {cards.map((card, index) => {
          const cardClass = CARD_CLASSES[index] || styles.card1;
          const defaultCard = DEFAULT_CARDS[index];
          const hasLabel = Boolean(card.label && card.label.trim().length > 0);

          return (
            <div key={index} className={cardClass} data-detail-card={index}>
              <CardMedia card={card} defaultCard={defaultCard} index={index} />

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
