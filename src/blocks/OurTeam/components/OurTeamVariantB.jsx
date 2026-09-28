"use client";

import React, { useState, useEffect, useMemo } from "react";
import TechCard from "./TechCard";
import QuoteButton from "@/ui/QuoteButton/QuoteButton";
import Button from "@/ui/Button";
import styles from "../OurTeam.module.css";
import ScrollSnapSlider from "@/ui/ScrollSnapSlider/ScrollSnapSlider";

export default function OurTeamVariantB({
  allTechs = [],
  initialTechs = [],
  initialTitle = "Meet Our TV Mounting Specialists in your area",
  subTitle = "Every technician is background-checked, insured, and certified — ready to deliver a flawless installation in your home.",
  footerText = "Ready to mount your TV? Book your service with one of our local specialists.",
}) {
  const [activeCity, setActiveCity] = useState(null);
  const [activeState, setActiveState] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Check URL search param (?city=Houston or ?city=Houston,%20TX)
    const params = new URLSearchParams(window.location.search);
    const qCity = params.get("city");

    if (qCity) {
      const decoded = decodeURIComponent(qCity).trim();
      const parts = decoded.split(",");
      const cityClean = parts[0]
        .trim()
        .replace(/-/g, " ")
        .replace(/\b[a-z]/g, (c) => c.toUpperCase());
      const stateClean = parts[1] ? parts[1].trim().toUpperCase() : null;
      setActiveCity(cityClean);
      if (stateClean) setActiveState(stateClean);
      return;
    }

    // 2. Check Cloudflare injected Geo-IP
    if (window.__GEO_CITY__?.city) {
      const geoCity = window.__GEO_CITY__.city.trim();
      const geoState = window.__GEO_CITY__.state
        ? window.__GEO_CITY__.state.trim().toUpperCase()
        : null;
      setActiveCity(geoCity);
      if (geoState) setActiveState(geoState);
    }
  }, []);

  // Compute technicians for activeCity if detected
  const currentTechs = useMemo(() => {
    if (!activeCity || allTechs.length === 0) {
      return initialTechs;
    }

    const techniciansOnly = allTechs.filter(
      (t) => !t.department || t.department === "technician"
    );
    const managersOnly = allTechs.filter((t) => t.department === "manager");

    const cityTechs = techniciansOnly.filter(
      (t) => t.city?.toLowerCase() === activeCity.toLowerCase()
    );

    if (cityTechs.length === 0) {
      return initialTechs;
    }

    if (cityTechs.length >= 6) {
      return cityTechs.slice(0, 6);
    }

    const cityManagers = managersOnly.filter(
      (t) => t.city?.toLowerCase() === activeCity.toLowerCase()
    );
    const otherManagers = managersOnly.filter(
      (t) => t.city?.toLowerCase() !== activeCity.toLowerCase()
    );
    const remainingSlots = 6 - cityTechs.length;
    const managersToFill = [...cityManagers, ...otherManagers].slice(
      0,
      remainingSlots
    );

    const slotsLeft = remainingSlots - managersToFill.length;
    let otherTechsToFill = [];
    if (slotsLeft > 0) {
      const otherTechs = techniciansOnly.filter(
        (t) => t.city?.toLowerCase() !== activeCity.toLowerCase()
      );
      otherTechsToFill = otherTechs.slice(0, slotsLeft);
    }

    return [...cityTechs, ...managersToFill, ...otherTechsToFill];
  }, [activeCity, allTechs, initialTechs]);

  const displayLocation = activeCity
    ? `${activeCity}${activeState ? `, ${activeState}` : ""}`
    : "your area";

  const headingTitle = activeCity
    ? `Meet Our TV Mounting Specialists in ${displayLocation}`
    : initialTitle;

  return (
    <section className={`block ${styles.ourTeam}`} id="team">
      <header className={styles.header}>
        <h2 className="blockHeading" suppressHydrationWarning={true}>
          {headingTitle}
        </h2>
        <p className="subText">{subTitle}</p>
      </header>

      <ScrollSnapSlider className={styles.sliderTrack} dotsPosition="top">
        {currentTechs.map((tech) => (
          <TechCard
            key={tech.id}
            tech={tech}
            cityName={activeCity || "your area"}
          />
        ))}
      </ScrollSnapSlider>

      <div className={styles.footer}>
        <p className={styles.footerText}>{footerText}</p>
        <div className={styles.buttonsGroup}>
          <QuoteButton size="big">Book Your Technician Today</QuoteButton>
          <Button variant="secondary" size="big" href="/our-team/">
            Meet All Specialists
          </Button>
        </div>
      </div>
    </section>
  );
}
