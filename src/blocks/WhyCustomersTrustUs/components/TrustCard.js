import styles from "./TrustCard.module.css";
import ImageWrapper from "@/ui/ImageWrapper/ImgaeWrapper";

const TrustCard = ({ image, title, description }) => {
  return (
    <div className={styles.trustCard}>
      <div className={styles.iconContainer}>
        <ImageWrapper media={image} />
      </div>
      <div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
};

export default TrustCard; 