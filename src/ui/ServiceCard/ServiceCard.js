import styles from "./ServiceCard.module.css";
import SendIcon from "@/assets/icons/send.svg"
import Button from "@/ui/Button"
import QuoteButton from "@/ui/QuoteButton/QuoteButton";

export default function ServiceCard({ image, title, description, buttonText }) {
  return (
    <div className={styles.serviceCard}>
        <SendIcon className={styles.sendIcon} width="16" height="16"/>
        <div className={styles.imageContainer}>
            {image}
        </div>
        
        <div className={styles.textWrapper}>
            <h4 className={styles.title}>{title}</h4>
            <span className={styles.description}>{description}</span>
        </div>
        <QuoteButton className={styles.hiddenButton} variant="primary" size="small">
            {buttonText}
        </QuoteButton>
        <QuoteButton className={styles.invisibleButton} />
    </div>
  );
} 