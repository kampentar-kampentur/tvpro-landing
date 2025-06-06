import React from "react";
import styles from "./Checkbox.module.css";

export default function Checkbox({ checked, onChange, label, name, value, disabled }) {
  return (
    <label className={styles.wrapper}>
      <input
        type="checkbox"
        className={styles.input}
        checked={checked}
        onChange={onChange}
        name={name}
        value={value}
        disabled={disabled}
      />
      <span className={styles.checkbox} aria-checked={checked} />
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
} 