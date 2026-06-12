"use client";

import React, { useState, useEffect } from "react";
import { technicians } from "./data/technicians";
import TechCard from "./components/TechCard";
import QuoteButton from "@/ui/QuoteButton/QuoteButton";
import styles from "./OurTeam.module.css";

export default function OurTeam({ data = {}, cityContext }) {
  const [selectedTechs, setSelectedTechs] = useState([]);

  const cityName = cityContext?.city_name || "your area";
  const stateCode = cityContext?.state_code ? `, ${cityContext.state_code}` : "";
  const displayLocation = `${cityName}${stateCode}`;

  useEffect(() => {
    const shuffled = [...technicians].sort(() => 0.5 - Math.random());
    setSelectedTechs(shuffled.slice(0, 6));
  }, []);

  const title =
    data?.title ||
    `Meet Our TV Mounting Specialists in ${displayLocation}`;

  const subTitle =
    data?.subTitle ||
    "Every technician is background-checked, insured, and certified — ready to deliver a flawless installation in your home.";

  const footerText =
    data?.footerText ||
    "Ready to mount your TV? Book your service with one of our local specialists.";

  return (
    <section className={`block ${styles.ourTeam}`} id="team">
      <header className={styles.header}>
        <h2 className="blockHeading">{title}</h2>
        <p className="subText">{subTitle}</p>
      </header>

      <div className={styles.sliderTrack}>
        {selectedTechs.map((tech) => (
          <TechCard
            key={tech.id}
            tech={tech}
            cityName={cityName}
          />
        ))}
      </div>

      <div className={styles.footer}>
        <p className={styles.footerText}>{footerText}</p>
        <QuoteButton size="big">Book Your Technician Today</QuoteButton>
      </div>
    </section>
  );
}
