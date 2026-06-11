import React from "react";
import Link from "next/link";
import styles from "./SEOBreadcrumbs.module.css";

export default function SEOBreadcrumbs({ cityContext }) {
  if (!cityContext || !cityContext.city_name) return null;

  const cityName = cityContext.city_name;
  const stateCode = cityContext.state_code || "";
  const displayLocation = stateCode ? `${cityName}, ${stateCode}` : cityName;
  
  // We can construct paths dynamically
  const baseUrl = "https://tvprousa.com";
  // Convert city name to slug format if path isn't provided directly (usually it's matched by slug in cityContext or we can use lowercase)
  const citySlug = cityContext.path || cityName.toLowerCase().replace(/\s+/g, "-");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${baseUrl}/`,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": displayLocation,
        "item": `${baseUrl}/${citySlug}/`,
      },
    ],
  };

  return (
    <div className={`block ${styles.breadcrumbsWrapper}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
        <Link href="/" className={`${styles.step} ${styles.clickable}`}>
          Home
        </Link>
        <svg
          className={styles.chevron}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="none"
        >
          <path
            stroke="currentColor"
            strokeWidth="1.5"
            d="m6 4 4 4-4 4"
          />
        </svg>
        <span className={`${styles.step} ${styles.current}`}>
          {displayLocation}
        </span>
      </nav>
    </div>
  );
}
