import styles from "./OptionalAddons.module.css";

export default function OptionalAddons({ addons }) {
  if (!addons || !addons.length) return null;
  return (
    <div className={styles.optionalAddonsContainer}>
      <h4 className={styles.heading}>Optional Add-ons</h4>
      <div className={styles.buttonsContainer}>
        {addons.map((addon, idx) => (
          <button className={styles.button} key={idx}>{addon.label}</button>
        ))}
      </div>
    </div>
  );
} 