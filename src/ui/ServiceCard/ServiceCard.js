import styles from "./ServiceCard.module.css";
import SendIcon from "@/assets/icons/send.svg";
import QuoteButton from "@/ui/QuoteButton/QuoteButton";
import ImageWrapper from "@/ui/ImageWrapper/ImageWrapper";
import Text from "@/ui/Text/Text";

export default function ServiceCard({ image, title, description, buttonText, modalName, cityContext }) {
  return (
    <div className={styles.serviceCard}>
      <SendIcon className={styles.sendIcon} width="16" height="16" />
      <div className={styles.imageContainer}>
        <ImageWrapper media={image} defaultAlt={title} sizes="(max-width: 768px) 100px, 150px" />
      </div>

      <div className={styles.textWrapper}>
        <h3 className={styles.title}><Text text={title} cityContext={cityContext} /></h3>
        <span className={styles.description}><Text text={description} cityContext={cityContext} /></span>
      </div>
      <QuoteButton className={styles.hiddenButton} variant="primary" size="small" modalName={modalName || "BookNow"}>
        {buttonText}
      </QuoteButton>
      <QuoteButton className={styles.invisibleButton} modalName={modalName || "BookNow"} />
    </div>
  );
} 