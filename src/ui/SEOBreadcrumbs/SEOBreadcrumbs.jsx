import React from "react";
import Link from "next/link";
import styles from "./SEOBreadcrumbs.module.css";

export default function SEOBreadcrumbs({ cityContext, items }) {
  const baseUrl = "https://tvprousa.com";
  let breadcrumbItems = [];

  if (items && items.length > 0) {
    breadcrumbItems = items;
  } else if (cityContext && cityContext.city_name) {
    const cityName = cityContext.city_name;
    const stateCode = cityContext.state_code || "";
    const displayLocation = stateCode ? `${cityName}, ${stateCode}` : cityName;
    const citySlug = cityContext.path || cityName.toLowerCase().replace(/\s+/g, "-");

    breadcrumbItems = [
      { name: "Home", url: "/" },
      { name: displayLocation, url: `/${citySlug}/` }
    ];
  } else {
    return null;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems.map((item, index) => {
      let itemUrl = item.url;
      if (itemUrl) {
        if (!itemUrl.startsWith("http://") && !itemUrl.startsWith("https://")) {
          itemUrl = `${baseUrl}${itemUrl.startsWith("/") ? itemUrl : "/" + itemUrl}`;
        }
      }
      return {
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": itemUrl || undefined,
      };
    }).filter(x => x.item),
  };

  return (
    <div className={`block ${styles.breadcrumbsWrapper}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          return (
            <React.Fragment key={index}>
              {isLast ? (
                <span className={`${styles.step} ${styles.current}`}>
                  {item.name}
                </span>
              ) : (
                <>
                  <Link href={item.url || "/"} className={`${styles.step} ${styles.clickable}`}>
                    {item.name}
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
                </>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </div>
  );
}
