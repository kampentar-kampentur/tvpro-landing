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
    number: "10,000+",
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
    number: "2-Year",
    text: "Warranty",
  },
  {
    id: "reviews",
    iconName: "star",
    number: "1,000+",
    text: "5-Star Reviews",
    isReviews: true,
  },
];

export default async function UtpBar({ data = {}, cityContext }) {
  const globalUtpData = await getUtpBarData() || {};

  const mergedItems = (data?.items && data.items.length > 0)
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
          <svg viewBox="0 0 24 24" className={styles.icon} fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="13" rx="2" />
            <path d="M12 16v4M8 20h8" />
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
    <section className={styles.utpSection}>
      <div className={`blockContainer ${styles.utpContainer}`}>
        <div className={styles.utpCard}>
          {resolvedItems.map((item) => (
            <div key={item.id} className={styles.utpItem}>
              {item.isReviews || item.iconName === "star" ? (
                <div className={styles.reviewsWidget}>
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
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
