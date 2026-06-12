import styles from "./TechCard.module.css";

/**
 * TechCard — built in the DNA of TrustCard / ServiceCard.
 * White box, circular avatar, no photo-overlay tricks.
 *
 * Props:
 *   tech     — technician object from technicians.js
 *   cityName — string for the active dot title attr
 */
const TechCard = ({ tech, cityName = "your area" }) => {
  const ratingNum = tech.rating.replace(" ★", "").trim();  // "5.0"
  const jobsShort = tech.jobsCount.replace(" done", "").trim(); // "180+"

  return (
    <div className={styles.techCard}>

      {/* Active pulse dot — top-right corner */}
      <div className={styles.activeDot} title={`Active in ${cityName}`}>
        <span className={styles.pulse} />
      </div>

      {/* Avatar + name */}
      <div className={styles.topRow}>
        <div className={styles.photoWrapper}>
          <img
            src={tech.photo}
            alt={tech.name}
            className={styles.photo}
            loading="lazy"
            width={72}
            height={72}
          />
        </div>
        <div className={styles.nameBlock}>
          <h3 className={styles.name}>{tech.name}</h3>
          <p className={styles.role}>{tech.role}</p>
        </div>
      </div>

      {/* Stat pill — e.g. "★ 5.0 · 180+ jobs" */}
      <span className={styles.statPill}>
        <span className={styles.statStar}>★</span>
        {ratingNum} &middot; {jobsShort} jobs
      </span>

      {/* Bio */}
      <p className={styles.bio}>{tech.bio}</p>

      {/* Skill tags */}
      <div className={styles.tags}>
        {tech.tags.map((tag, i) => (
          <span key={i} className={styles.tag}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TechCard;
