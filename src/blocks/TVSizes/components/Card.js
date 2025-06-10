import styles from "./Card.module.css";

export default function Card({svg, title, subText}) {

  return (
    <div className={styles.card}>
        {svg}
        <h5>{title}</h5>
        <span>{subText}</span>
    </div>
  );
}