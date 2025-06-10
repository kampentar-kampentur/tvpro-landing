import styles from "./ServiceCard.module.css";

export default function ServiceCard({ image, title, description }) {
  return (
    <div className={styles.serviceCard}>
      <div className={styles.imageContainer}>
        {image}
      </div>
      <h5 className={styles.title}>{title}</h5>
      <span className={styles.description}>{description}</span>
    </div>
  );
} 