
import styles from "./Radiobutton.module.css";

export default function Radiobutton({ checked, onChange, label, subLabel, name, value, disabled }) {
  return (
    <label className={styles.wrapper}>
      <input
        type="radio"
        className={styles.input}
        checked={checked}
        onChange={onChange}
        name={name}
        value={value}
        disabled={disabled}
      />
      <span className={styles.radio} aria-checked={checked} />
      {label && <span className={styles.label}>{label}</span>}
      {subLabel && <span className={styles.subLabel}>{subLabel}</span>}
    </label>
  );
} 