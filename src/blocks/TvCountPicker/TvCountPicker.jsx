import React from "react";
import styles from "./TvCountPicker.module.css";
import ServiceCard from "@/ui/ServiceCard/ServiceCard";
import Text from "@/ui/Text/Text";

export default function TvCountPicker({ cityContext }) {
  const cards = [
    {
      id: "tv-count-1",
      title: "1 TV",
      description: "Perfect for single room mounting: bedroom, living room, or office.",
      tvCount: "1",
    },
    {
      id: "tv-count-2",
      title: "2 TVs",
      description: "Mount two TVs in your house. Save on multiple installations.",
      tvCount: "2",
    },
    {
      id: "tv-count-3",
      title: "3 TVs",
      description: "Ideal multi-room layout. Complete setup for three screens.",
      tvCount: "3",
    },
    {
      id: "tv-count-4",
      title: "4+ TVs",
      description: "Volume package. Home theaters, offices, or commercial settings.",
      tvCount: "4+",
    },
  ];

  const renderCardIcon = (id) => {
    switch (id) {
      case "tv-count-1":
        return (
          <svg viewBox="0 0 160 100" className={styles.cardIcon}>
            {/* TV Stand */}
            <path d="M72 80 h16 v6 h-16 z" fill="#91929C" />
            <path d="M62 86 h36 v2 h-36 z" fill="#91929C" />
            {/* Screen */}
            <rect x="25" y="15" width="110" height="65" rx="3" fill="#E2E2E6" stroke="#91929C" strokeWidth="2" />
          </svg>
        );
      case "tv-count-2":
        return (
          <svg viewBox="0 0 160 100" className={styles.cardIcon}>
            {/* TV 2 (Back) */}
            <path d="M52 68 h12 v4 h-12 z" fill="#A1A2AC" opacity="0.7" />
            <path d="M44 72 h28 v1.5 h-28 z" fill="#A1A2AC" opacity="0.7" />
            <rect x="15" y="10" width="85" height="58" rx="3" fill="#E2E2E6" stroke="#A1A2AC" strokeWidth="2" opacity="0.7" />
            {/* TV 1 (Front) */}
            <path d="M96 80 h14 v6 h-14 z" fill="#91929C" />
            <path d="M87 86 h32 v2 h-32 z" fill="#91929C" />
            <rect x="50" y="22" width="100" height="58" rx="3" fill="#E2E2E6" stroke="#91929C" strokeWidth="2" />
          </svg>
        );
      case "tv-count-3":
        return (
          <svg viewBox="0 0 160 100" className={styles.cardIcon}>
            {/* TV 3 (Back Left) */}
            <rect x="10" y="8" width="70" height="48" rx="2" fill="#E2E2E6" stroke="#A1A2AC" strokeWidth="2" opacity="0.5" />
            {/* TV 2 (Back Right) */}
            <rect x="80" y="8" width="70" height="48" rx="2" fill="#E2E2E6" stroke="#A1A2AC" strokeWidth="2" opacity="0.5" />
            {/* TV 1 (Front Center) */}
            <path d="M73 80 h14 v6 h-14 z" fill="#91929C" />
            <path d="M64 86 h32 v2 h-32 z" fill="#91929C" />
            <rect x="32" y="24" width="96" height="56" rx="3" fill="#E2E2E6" stroke="#91929C" strokeWidth="2" />
          </svg>
        );
      case "tv-count-4":
        return (
          <svg viewBox="0 0 160 100" className={styles.cardIcon}>
            {/* 2x2 Grid of small TVs */}
            {/* Top Left */}
            <rect x="15" y="10" width="60" height="38" rx="2" fill="#E2E2E6" stroke="#91929C" strokeWidth="1.5" />
            {/* Top Right */}
            <rect x="85" y="10" width="60" height="38" rx="2" fill="#E2E2E6" stroke="#91929C" strokeWidth="1.5" />
            {/* Bottom Left */}
            <rect x="15" y="54" width="60" height="38" rx="2" fill="#E2E2E6" stroke="#91929C" strokeWidth="1.5" />
            {/* Bottom Right */}
            <rect x="85" y="54" width="60" height="38" rx="2" fill="#E2E2E6" stroke="#91929C" strokeWidth="1.5" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section className={`block ${styles.tvCountPicker}`}>
      <header className={styles.header}>
        <h2 className="blockHeading">
          <Text text="How Many TVs Do You Need Mounted?" cityContext={cityContext} />
        </h2>
        <p className="subText">
          <Text text="Select the number of screens to open the quote builder with pre-selected settings." cityContext={cityContext} />
        </p>
      </header>

      <div className={styles.cardsGrid}>
        {cards.map((card) => (
          <ServiceCard
            key={card.id}
            customIcon={<div className={styles.iconContainer}>{renderCardIcon(card.id)}</div>}
            title={card.title}
            description={card.description}
            buttonText="Calculate Quote"
            modalName="BestQuote"
            modalProps={{ tvCount: card.tvCount, isNewQuiz: true }}
            cityContext={cityContext}
          />
        ))}
      </div>
    </section>
  );
}
