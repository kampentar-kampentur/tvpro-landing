import ElfsightWidget from "./components/ElfsightWidget";
import styles from "./CustomerReviews.module.css";

export default function CustomerReviewsClient() {
  return (
    <div className={styles.widgetContainer}>
      <ElfsightWidget />
    </div>
  );
}