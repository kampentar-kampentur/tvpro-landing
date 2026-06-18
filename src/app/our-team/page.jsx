import React from "react";
import SEOBreadcrumbs from "@/ui/SEOBreadcrumbs/SEOBreadcrumbs";
import TechCard from "@/blocks/OurTeam/components/TechCard";
import { getAllTechnicians } from "@/lib/strapi";
import QuoteButton from "@/ui/QuoteButton/QuoteButton";
import styles from "./our-team-page.module.css";

export const metadata = {
  title: "Meet Our Certified TV Mounting Specialists | TVPro",
  description: "Meet our background-checked, insured, and certified TV mounting and AV specialists. Safe installations, flawless setups, and same-day service.",
  alternates: {
    canonical: "https://tvprousa.com/our-team/",
  },
};

export default async function OurTeamPage() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Our Team", url: "/our-team/" }
  ];

  let strapiTechs = [];
  try {
    strapiTechs = await getAllTechnicians();
  } catch (e) {
    console.error("Failed to fetch technicians:", e);
  }

  return (
    <div className={styles.teamPage}>
      {/* Breadcrumbs */}
      <SEOBreadcrumbs items={breadcrumbItems} />

      {/* Header */}
      <header className={`block ${styles.header}`}>
        <h1 className={`blockHeading ${styles.title}`}>Meet Our TV Mounting Specialists</h1>
        <p className={`subText ${styles.subtitle}`}>
          Every technician is background-checked, insured, and certified — ready to deliver a flawless installation in your home.
        </p>
      </header>

      {/* Grid of All Specialists */}
      <section className={`block ${styles.gridSection}`}>
        <div className={styles.grid}>
          {strapiTechs.map((tech) => {
            // Check if there is a photo object inside attributes or directly in tech
            const photoUrl = tech.photo?.url || tech.photo?.data?.attributes?.url;

            const techData = {
              ...tech,
              photo: photoUrl || "/images/tech/placeholder.png", // fallback image
              // parse tags if it's a string, just like in OurTeam.js
              tags: typeof tech.tags === 'string' ? tech.tags.split(',').map(tag => tag.trim()) : (tech.tags || [])
            };

            return (
              <TechCard
                key={tech.id}
                tech={techData}
                cityName="your area"
              />
            );
          })}
        </div>
      </section>

      {/* CTA Bottom Section */}
      <div className={`block ${styles.ctaWrapper}`} style={{ paddingTop: 0 }}>
        <p className={styles.ctaText}>
          Ready to mount your TV? Book your service with one of our local specialists.
        </p>
        <QuoteButton size="big" modalName="BookNow">
          Book Your Technician Today
        </QuoteButton>
      </div>
    </div>
  );
}
