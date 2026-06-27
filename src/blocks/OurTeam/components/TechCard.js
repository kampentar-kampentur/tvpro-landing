"use client";

import { useState } from "react";
import styles from "./TechCard.module.css";
import ImageWrapper from "@/ui/ImageWrapper/ImageWrapper";
import { technicians as localTechnicians } from "../data/technicians";

function nameToHSL(name) {
  if (!name) return "hsl(0, 55%, 45%)";
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 55%, 45%)`;
}

function getInitials(name) {
  if (!name) return "??";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Icons for the attributes
const TargetIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="6"></circle>
    <circle cx="12" cy="12" r="2"></circle>
  </svg>
);
const ToolsIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
  </svg>
);
const ClockIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);
const ShieldIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);
const HeartIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);
const VerifiedCheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);
const CheckCircleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const FlipBackIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="16"
    height="16"
  >
    <polyline points="1 4 1 10 7 10"></polyline>
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
  </svg>
);

const TechCard = ({ tech, cityName = "your area" }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    if (window.innerWidth <= 1024) {
      setIsFlipped((prev) => !prev);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleFlip();
    }
  };

  const localTech =
    localTechnicians.find(
      (l) =>
        l.name &&
        tech.name &&
        (l.name.toLowerCase() === tech.name.toLowerCase() ||
          tech.name.toLowerCase().startsWith(l.name.toLowerCase()) ||
          l.name.toLowerCase().startsWith(tech.name.toLowerCase())),
    ) || {};

  const isInvalidJobsCount = (val) => {
    if (!val) return true;
    const lower = String(val).toLowerCase();
    return lower.includes("known as") || lower.trim() === "" || lower === "0";
  };

  const cleanJobsCount = !isInvalidJobsCount(tech.jobsCount)
    ? tech.jobsCount
    : !isInvalidJobsCount(localTech.jobsCount)
      ? localTech.jobsCount
      : "100+ Projects";

  const cleanExperience =
    tech.experience ||
    localTech.experience ||
    (cleanJobsCount && cleanJobsCount !== "100+ Projects"
      ? cleanJobsCount.replace(" jobs done", "").trim()
      : "100+ Projects");

  const ratingStr = String(tech.rating || localTech.rating || "5.0");
  const ratingNum = ratingStr.replace(" ★", "").trim();

  const mediaObj =
    typeof tech.photo === "string" ? { url: tech.photo } : tech.photo;

  // Ignore missing/placeholder images so the fallback (initials) works properly
  const hasValidPhoto =
    mediaObj && mediaObj.url && !mediaObj.url.includes("placeholder.png");

  // Extract custom fields mapped to new UI elements
  const whatILove =
    tech.bio || tech.headline || localTech.bio || localTech.headline || null;
  const specializesIn =
    tech.tags && tech.tags.length > 0
      ? Array.isArray(tech.tags)
        ? tech.tags.join(", ")
        : tech.tags
      : localTech.tags
        ? localTech.tags.join(", ")
        : tech.bestFor || localTech.bestFor || null;
  const experience = cleanExperience;
  const speedReliability =
    tech.signature ||
    localTech.signature ||
    "Always on time, always professional.";
  const howIHelp = tech.whyRemember || localTech.whyRemember || null;
  const blueStatValue = cleanJobsCount;
  const blueStatLabel = "";
  const mottoText = tech.motto || localTech.motto || "";

  const cardInnerClass = `${styles.cardInner}${isFlipped ? ` ${styles.flipped}` : ""}`;

  return (
    <div
      className={styles.techCard}
      onClick={handleFlip}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Flip card to see more details"
    >
      <div className={cardInnerClass}>
        {/* ── FRONT FACE ── */}
        <div className={styles.front}>
          {/* Top Image Container */}
          <div className={styles.coverPhoto}>
            {/* Verified Badge Overlay */}
            <div className={styles.verifiedBadge}>
              <VerifiedCheckIcon /> Verified Pro
            </div>

            {hasValidPhoto ? (
              <ImageWrapper
                media={mediaObj}
                defaultAlt={tech.name}
                className={styles.photo}
                sizes="(max-width: 768px) 100vw, 400px"
                width={400}
                height={400}
              />
            ) : (
              <div
                className={styles.avatarInitials}
                style={{ backgroundColor: nameToHSL(tech.name) }}
              >
                {getInitials(tech.name)}
              </div>
            )}
          </div>

          <div className={styles.content}>
            <div className={styles.nameBlock}>
              <h3 className={styles.name}>{tech.name}</h3>
              <p className={styles.role}>{tech.role}</p>
              {mottoText && (
                <p className={styles.motto}>&ldquo;{mottoText}&rdquo;</p>
              )}
            </div>

            <span className={styles.statPill}>
              <span className={styles.statStar}>★</span>
              {ratingNum}
            </span>

            {/* Blue Stat Block - shown on front for mobile, in desktopOnly for desktop */}
            <div className={styles.blueStatBlockMobile}>
              <div className={styles.blueStatIcon}>
                <CheckCircleIcon />
              </div>
              <div className={styles.blueStatText}>
                <span className={styles.blueStatValue}>{blueStatValue}</span>
                <span className={styles.blueStatLabel}>{blueStatLabel}</span>
              </div>
            </div>

            {/* Desktop-only content: show everything below the fold on desktop */}
            <div className={styles.desktopOnly}>
              <div className={styles.attributesList}>
                {whatILove && (
                  <div className={styles.attributeItem}>
                    <div className={styles.attributeIcon}>
                      <TargetIcon />
                    </div>
                    <div className={styles.attributeText}>
                      <span className={styles.attributeLabel}>Headline</span>
                      <span className={styles.attributeValue}>{whatILove}</span>
                    </div>
                  </div>
                )}
                {specializesIn && (
                  <div className={styles.attributeItem}>
                    <div className={styles.attributeIcon}>
                      <ToolsIcon />
                    </div>
                    <div className={styles.attributeText}>
                      <span className={styles.attributeLabel}>Best For</span>
                      <span className={styles.attributeValue}>
                        {specializesIn}
                      </span>
                    </div>
                  </div>
                )}
                {speedReliability && (
                  <div className={styles.attributeItem}>
                    <div className={styles.attributeIcon}>
                      <ShieldIcon />
                    </div>
                    <div className={styles.attributeText}>
                      <span className={styles.attributeLabel}>
                        Signature Challenge
                      </span>
                      <span className={styles.attributeValue}>
                        {speedReliability}
                      </span>
                    </div>
                  </div>
                )}
                {howIHelp && (
                  <div className={styles.attributeItem}>
                    <div className={styles.attributeIcon}>
                      <HeartIcon />
                    </div>
                    <div className={styles.attributeText}>
                      <span className={styles.attributeLabel}>
                        Why Customers Remember Him
                      </span>
                      <span className={styles.attributeValue}>{howIHelp}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Large Blue Block */}
              <div className={styles.blueStatBlock}>
                <div className={styles.blueStatIcon}>
                  <CheckCircleIcon />
                </div>
                <div className={styles.blueStatText}>
                  <span className={styles.blueStatValue}>{blueStatValue}</span>
                  <span className={styles.blueStatLabel}>{blueStatLabel}</span>
                </div>
              </div>

              {/* Bottom tags - if any */}
              {tech.badges && (
                <div className={styles.tags}>
                  {tech.badges
                    .split(/[,·]+/)
                    .map((b) => b.trim())
                    .filter(Boolean)
                    .map((tag, i) => (
                      <span key={i} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                </div>
              )}
            </div>

            {/* Mobile-only flip hint */}
            <div className={styles.flipHint}>
              <span>Tap to see more</span>
            </div>
          </div>
        </div>

        {/* ── BACK FACE (mobile only) ── */}
        <div className={styles.back}>
          <div className={styles.content}>
            <div className={styles.attributesList}>
              {whatILove && (
                <div className={styles.attributeItem}>
                  <div className={styles.attributeIcon}>
                    <TargetIcon />
                  </div>
                  <div className={styles.attributeText}>
                    <span className={styles.attributeLabel}>Headline</span>
                    <span className={styles.attributeValue}>{whatILove}</span>
                  </div>
                </div>
              )}
              {specializesIn && (
                <div className={styles.attributeItem}>
                  <div className={styles.attributeIcon}>
                    <ToolsIcon />
                  </div>
                  <div className={styles.attributeText}>
                    <span className={styles.attributeLabel}>Best For</span>
                    <span className={styles.attributeValue}>
                      {specializesIn}
                    </span>
                  </div>
                </div>
              )}
              {speedReliability && (
                <div className={styles.attributeItem}>
                  <div className={styles.attributeIcon}>
                    <ShieldIcon />
                  </div>
                  <div className={styles.attributeText}>
                    <span className={styles.attributeLabel}>
                      Signature Challenge
                    </span>
                    <span className={styles.attributeValue}>
                      {speedReliability}
                    </span>
                  </div>
                </div>
              )}
              {howIHelp && (
                <div className={styles.attributeItem}>
                  <div className={styles.attributeIcon}>
                    <HeartIcon />
                  </div>
                  <div className={styles.attributeText}>
                    <span className={styles.attributeLabel}>
                      Why Customers Remember Him
                    </span>
                    <span className={styles.attributeValue}>{howIHelp}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom tags - if any */}
            {tech.badges && (
              <div className={styles.tags}>
                {tech.badges
                  .split(/[,·]+/)
                  .map((b) => b.trim())
                  .filter(Boolean)
                  .map((tag, i) => (
                    <span key={i} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
              </div>
            )}

            {/* Close / flip-back hint */}
            <div className={styles.flipHint}>
              <FlipBackIcon />
              <span>Tap to flip back</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechCard;
