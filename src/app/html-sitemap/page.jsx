import { getAllCities } from "@/lib/strapi";
import Link from "next/link";
import styles from "./sitemap.module.css";
import buttonStyles from "@/ui/Button/Button.module.css";

export const dynamic = "force-static";

export const metadata = {
  title: "Sitemap | TVPro Handy Services",
  description: "HTML sitemap of TVPro Handy Services LLC containing all location and service pages.",
  alternates: {
    canonical: "https://tvprousa.com/html-sitemap/",
  },
};

export default async function SitemapPage() {
  let cities = [];
  try {
    cities = await getAllCities();
  } catch (error) {
    console.error("[Sitemap Page Error] Failed to fetch cities:", error);
  }

  // Filter cities from Strapi
  const activeCities = cities.filter(
    (city) => !city.test_version && city.path && !city.metro_city_slug
  );

  // Ensure Chicago is included in locations (manually add it if missing from Strapi)
  const hasChicago = activeCities.some((c) => c.path === "chicago");
  if (!hasChicago) {
    activeCities.push({
      path: "chicago",
      city_name: "Chicago",
      state_code: "IL",
      id: "static-chicago",
    });
  }

  // Sort all cities alphabetically by name
  activeCities.sort((a, b) => (a.city_name || "").localeCompare(b.city_name || ""));

  return (
    <div className={styles.sitemapContainer}>
      <header className={styles.sitemapHeader}>
        <h1>Sitemap</h1>
        <p>A directory of all pages on TVPro Handy Services</p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Main Pages</h2>
        <div className={styles.linkGrid}>
          <Link href="/" title="Go to Home page" className={`${buttonStyles.button} ${buttonStyles.secondary} ${buttonStyles.small}`}>
            Home
          </Link>
          <Link href="/about/" title="Go to About Us page" className={`${buttonStyles.button} ${buttonStyles.secondary} ${buttonStyles.small}`}>
            About Us
          </Link>
          <Link href="/contact/" title="Go to Contact Us page" className={`${buttonStyles.button} ${buttonStyles.secondary} ${buttonStyles.small}`}>
            Contact Us
          </Link>
        </div>
      </section>

      {activeCities.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Serviced Locations</h2>
          <div className={styles.linkGrid}>
            {activeCities.map((city) => {
              const displayName = city.city_name
                ? `${city.city_name}${city.state_code ? `, ${city.state_code}` : ""}`
                : city.path;
              return (
                <Link
                  key={city.id || city.path}
                  href={`/${city.path}/`}
                  title={`Go to ${displayName} page`}
                  className={`${buttonStyles.button} ${buttonStyles.secondary} ${buttonStyles.small}`}
                >
                  {displayName}
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
