import React from "react";
import SEOBreadcrumbs from "@/ui/SEOBreadcrumbs/SEOBreadcrumbs";
import TechCard from "@/blocks/OurTeam/components/TechCard";
import { getAllTechnicians } from "@/lib/strapi";
import QuoteButton from "@/ui/QuoteButton/QuoteButton";
import Button from "@/ui/Button";
import styles from "./our-team-page.module.css";

import { technicians as localTechnicians } from "@/blocks/OurTeam/data/technicians";

export const metadata = {
  title: "Meet Our Certified TV Mounting Specialists | TVPro",
  description:
    "Meet our background-checked, insured, and certified TV mounting and AV specialists. Safe installations, flawless setups, and same-day service.",
  alternates: {
    canonical: "https://tvprousa.com/our-team/",
  },
};

export default async function OurTeamPage() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Our Team", url: "/our-team/" },
  ];

  let strapiTechs = [];
  try {
    strapiTechs = await getAllTechnicians();
  } catch (e) {
    console.error("Failed to fetch technicians:", e);
  }

  // Сортируем техников по убыванию опыта/скиллов
  const getTechSkillLevel = (tech) => {
    const localTech =
      localTechnicians.find(
        (l) =>
          l.name &&
          tech.name &&
          (l.name.toLowerCase() === tech.name.toLowerCase() ||
            tech.name.toLowerCase().startsWith(l.name.toLowerCase()) ||
            l.name.toLowerCase().startsWith(tech.name.toLowerCase())),
      ) || {};

    const expStr = String(
      tech.experience ||
        localTech.experience ||
        tech.jobsCount ||
        localTech.jobsCount ||
        "0",
    );
    const match = expStr.replace(/,/g, "").match(/\d+/);
    if (match) {
      const num = parseInt(match[0], 10);
      if (expStr.toLowerCase().includes("year")) {
        return num * 500;
      }
      return num;
    }
    return 0;
  };

  strapiTechs.sort((a, b) => getTechSkillLevel(b) - getTechSkillLevel(a));

  // Split into departments
  const managers = strapiTechs.filter((tech) => tech.department === "manager");
  const technicians = strapiTechs.filter(
    (tech) => tech.department !== "manager",
  );

  // Sort managers: Senior Sales Manager first, then alphabetically by name
  managers.sort((a, b) => {
    const roleA = a.role || "";
    const roleB = b.role || "";
    const isSeniorA = roleA.toLowerCase().includes("senior sales manager");
    const isSeniorB = roleB.toLowerCase().includes("senior sales manager");

    if (isSeniorA && !isSeniorB) return -1;
    if (!isSeniorA && isSeniorB) return 1;

    const nameA = a.name || "";
    const nameB = b.name || "";
    return nameA.localeCompare(nameB);
  });

  // Helper to prepare tech data and render cards
  const renderTechCards = (techList) =>
    techList.map((tech) => {
      const photoUrl = tech.photo?.url || tech.photo?.data?.attributes?.url;

      const techData = {
        ...tech,
        photo: photoUrl || "/images/tech/placeholder.png",
        tags:
          typeof tech.tags === "string"
            ? tech.tags.split(",").map((tag) => tag.trim())
            : tech.tags || [],
      };

      return <TechCard key={tech.id} tech={techData} cityName="your area" />;
    });

  return (
    <div className={styles.teamPage}>
      {/* Breadcrumbs */}
      <SEOBreadcrumbs items={breadcrumbItems} />

      {/* Header */}
      <header className={`block ${styles.header}`}>
        <h1 className={`blockHeading ${styles.title}`}>
          Meet Our TV Mounting Specialists
        </h1>
        <p className={`subText ${styles.subtitle}`}>
          Every technician is background-checked, insured, and certified — ready
          to deliver a flawless installation in your home.
        </p>
        <div className={styles.headerButtons}>
          <Button href="/careers/" variant="primary">
            Join Our Team (Apply Now)
          </Button>
        </div>
      </header>

      {/* Managers Section */}
      {managers.length > 0 && (
        <section className={`block ${styles.gridSection}`}>
          <h2 className={styles.sectionTitle}>Customer Experience & Project Planning Team</h2>
          <div className={styles.grid}>{renderTechCards(managers)}</div>
        </section>
      )}

      {/* Technicians Section */}
      <section className={`block ${styles.gridSection}`}>
        <h2 className={styles.sectionTitle}>Our Technical Specialists</h2>
        <div className={styles.grid}>{renderTechCards(technicians)}</div>
      </section>

      {/* CTA Bottom Section */}
      <div className={`block ${styles.ctaWrapper}`} style={{ paddingTop: 0 }}>
        <p className={styles.ctaText}>
          Ready to mount your TV? Book your service with one of our local
          specialists.
        </p>
        <QuoteButton size="big" modalName="BookNow">
          Book Your Technician Today
        </QuoteButton>
      </div>
    </div>
  );
}
