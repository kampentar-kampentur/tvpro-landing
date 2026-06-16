import styles from "./TechCard.module.css";
import ImageWrapper from "@/ui/ImageWrapper/ImageWrapper";

// Генерация цвета из имени (детерминировано)
function nameToHSL(name) {
  if (!name) return 'hsl(0, 55%, 45%)';
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 55%, 45%)`;
}

// Инициалы: "Artur H." → "AH"
function getInitials(name) {
  if (!name) return '??';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

/**
 * TechCard — built in the DNA of TrustCard / ServiceCard.
 * White box, circular avatar, no photo-overlay tricks.
 *
 * Props:
 *   tech     — technician object from technicians.js
 *   cityName — string for the active dot title attr
 */
const TechCard = ({ tech, cityName = "your area" }) => {
  const ratingStr = String(tech.rating || "5.0");
  const ratingNum = ratingStr.replace(" ★", "").trim();

  const jobsStr = String(tech.jobsCount || tech.reviewCount || "0");
  const jobsShort = jobsStr.replace(" done", "").trim();

  // Подготавливаем media-объект для ImageWrapper (на случай если это локальная строка-заглушка)
  const mediaObj = typeof tech.photo === 'string' ? { url: tech.photo } : tech.photo;

  return (
    <div className={styles.techCard}>

      {/* Active pulse dot — top-right corner */}
      <div className={styles.activeDot} title={`Active in ${cityName}`}>
        <span className={styles.pulse} />
      </div>

      {/* Avatar + name */}
      <div className={styles.topRow}>
        <div className={styles.photoWrapper}>
          {mediaObj && mediaObj.url ? (
            <ImageWrapper
              media={mediaObj}
              defaultAlt={tech.name}
              className={styles.photo}
              sizes="72px"
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

      {/* Premium Content */}
      {tech.headline && <p className={styles.headline}>{tech.headline}</p>}
      
      {tech.bestFor && (
        <p className={styles.textBlock}>
          <span className={styles.label}>Best for: </span>
          {tech.bestFor}
        </p>
      )}

      {tech.whyRemember && (
        <p className={styles.textBlock}>
          <span className={styles.label}>Why customers remember him: </span>
          {tech.whyRemember}
        </p>
      )}

      {tech.signature && (
        <p className={styles.textBlock}>
          <span className={styles.label}>Signature challenge: </span>
          {tech.signature}
        </p>
      )}

      {tech.motto && <p className={styles.motto}>“{tech.motto.replace(/^["“”]|["“”]$/g, '').trim()}”</p>}

      {tech.bio && !tech.whyRemember && <p className={styles.bio}>{tech.bio}</p>}

      {/* Skill tags */}
      {tech.badges && (
        <div className={styles.tags}>
          {tech.badges.split(/[,·]+/).map(b => b.trim()).filter(Boolean).map((tag, i) => (
            <span key={i} className={styles.tag}>{tag}</span>
          ))}
        </div>
      )}
      {!tech.badges && tech.tags && tech.tags.length > 0 && (
        <div className={styles.tags}>
          {tech.tags.map((tag, i) => (
            <span key={i} className={styles.tag}>{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TechCard;
