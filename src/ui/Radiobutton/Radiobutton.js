import React from "react";
import styles from "./Radiobutton.module.css";

export default function Radiobutton({ checked, onChange, label, name, value, disabled }) {
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
    </label>
  );
} 