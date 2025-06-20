import styles from "./OptionalAddons.module.css";

export default function OptionalAddons() {
  return (
    <div className={styles.optionalAddonsContainer}>
      <h4 className={styles.heading}>Optional Add-ons</h4>
      <div className={styles.buttonsContainer}>
        <button className={styles.button}>Wire Concealment Kits</button>
        <button className={styles.button}>TV Bracket Supply</button>
        <button className={styles.button}>Soundbar Bracket Install</button>
        <button className={styles.button}>Fireplace installation</button>
        <button className={styles.button}>Shelves for media devices</button>
      </div>
    </div>
  );
} 