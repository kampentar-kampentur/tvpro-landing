import React from "react";
import styles from "./UtpBar.module.css";

export default function UtpBar() {
  const items = [
    {
      id: "tvs-mounted",
      icon: (
        <svg viewBox="0 0 24 24" className={styles.icon} fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="13" rx="2" />
          <path d="M12 16v4M8 20h8" />
        </svg>
      ),
      number: "10,000+",
      text: "TVs Mounted",
    },
    {
      id: "fully-insured",
      icon: (
        <svg viewBox="0 0 24 24" className={styles.icon} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 11 2 2 4-4" />
        </svg>
      ),
      number: "Fully",
      text: "Insured",
    },
    {
      id: "warranty",
      icon: (
        <svg viewBox="0 0 24 24" className={styles.icon} fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="7" />
          <path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12" />
        </svg>
      ),
      number: "2-Year",
      text: "Warranty",
    },
    {
      id: "reviews",
      isReviews: true,
      number: "1,000+",
      text: "5-Star Reviews",
    },
  ];

  return (
    <section className={styles.utpSection}>
      <div className={`blockContainer ${styles.utpContainer}`}>
        <div className={styles.utpCard}>
          {items.map((item) => (
            <div key={item.id} className={styles.utpItem}>
              {item.isReviews ? (
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
                    <span className={styles.highlight}>{item.number}</span> {item.text}
                  </div>
                </div>
              ) : (
                <div className={styles.standardWidget}>
                  <div className={styles.iconWrapper}>{item.icon}</div>
                  <div className={styles.itemText}>
                    <span className={styles.highlight}>{item.number}</span> {item.text}
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
