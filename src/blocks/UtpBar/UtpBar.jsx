import React from "react";
import styles from "./UtpBar.module.css";
import { resolveSpintax } from "@/lib/spintax";
import Text from "@/ui/Text/Text";

async function getUtpBarData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/utp-bar?populate=*`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (error) {
    return null;
  }
}

const defaultItems = [
  {
    id: "tvs-mounted",
    iconName: "tv",
    number: "20,000+",
    text: "TVs Mounted",
  },
  {
    id: "fully-insured",
    iconName: "shield",
    number: "Fully",
    text: "Insured",
  },
  {
    id: "warranty",
    iconName: "award",
    number: "5-Year",
    text: "Warranty",
  },
  {
    id: "reviews",
    iconName: "star",
    number: "2,000+",
    text: "5-Star Reviews",
    isReviews: true,
  },
];

const variantBItems = [
  {
    id: "tvs-mounted-b",
    iconName: "tv",
    number: "20,000+",
    text: "TVs Mounted",
  },
  {
    id: "reviews-b",
    iconName: "google",
    number: "2,000+",
    text: "5-Star Reviews",
    isReviews: true,
    link: "#reviews",
  },
  {
    id: "any-tv-b",
    iconName: "mount",
    number: "Any TV.",
    text: "Any Wall. Any Mount.",
  },
  {
    id: "clean-install-b",
    iconName: "clean",
    number: "Clean,",
    text: "Professional Installation",
  },
];

export default async function UtpBar({ data = {}, cityContext, isVariantB = false }) {
  const globalUtpData = (await getUtpBarData()) || {};

  const mergedItems = isVariantB
    ? variantBItems
    : (data?.items && data.items.length > 0)
      ? data.items
      : (globalUtpData?.items && globalUtpData.items.length > 0)
        ? globalUtpData.items
        : defaultItems;

  const resolvedItems = mergedItems.map((item, index) => ({
    ...item,
    id: item.id || `utp-${index}`,
    number: resolveSpintax(item.number || ""),
    text: resolveSpintax(item.text || ""),
  }));

  const renderIcon = (iconName) => {
    switch (iconName) {
      case "tv":
        return (
          <svg viewBox="0 0 24 24" className={styles.icon} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="13" rx="2" />
            <path d="M12 16v4M8 20h8" />
          </svg>
        );
      case "mount":
        return (
          <svg viewBox="0 0 24 24" className={styles.icon} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="13" rx="2" />
            <path d="M12 16v4M8 20h8" />
          </svg>
        );
      case "clean":
        return (
          <svg viewBox="0 0 24 24" className={styles.icon} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" />
          </svg>
        );
      case "shield":
        return (
          <svg viewBox="0 0 24 24" className={styles.icon} fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 11 2 2 4-4" />
          </svg>
        );
      case "award":
        return (
          <svg viewBox="0 0 24 24" className={styles.icon} fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="7" />
            <path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.utpSection}>
      <div className={`blockContainer ${styles.utpContainer}`}>
        <div className={`${styles.utpCard} ${isVariantB ? styles.utpCardVariantB : ""}`}>
          {resolvedItems.map((item) => {
            const isReviewItem = item.isReviews || item.iconName === "star" || item.iconName === "google";
            const content = isReviewItem ? (
              <div className={styles.reviewsWidget}>
                <div className={isVariantB ? styles.googleStarsHeader : styles.starsRow}>
                  {isVariantB && (
                    <svg width="18" height="18" viewBox="0 0 24 24" className={styles.googleIcon} aria-label="Google">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                    </svg>
                  )}
                  <div className={styles.starsRow}>
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        viewBox="0 0 24 24"
                        className={styles.starIcon}
                        fill="currentColor"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <div className={styles.itemText}>
                  <span className={styles.highlight}>
                    <Text text={item.number} cityContext={cityContext} />
                  </span>{" "}
                  <Text text={item.text} cityContext={cityContext} />
                </div>
              </div>
            ) : (
              <div className={styles.standardWidget}>
                <div className={styles.iconWrapper}>{renderIcon(item.iconName)}</div>
                <div className={styles.itemText}>
                  <span className={styles.highlight}>
                    <Text text={item.number} cityContext={cityContext} />
                  </span>{" "}
                  <Text text={item.text} cityContext={cityContext} />
                </div>
              </div>
            );

            return (
              <div key={item.id} className={styles.utpItem}>
                {item.link ? (
                  <a href={item.link} className={styles.reviewsLink} aria-label="View customer reviews">
                    {content}
                  </a>
                ) : (
                  content
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
