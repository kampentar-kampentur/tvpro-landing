import React from "react";
import styles from "./Button.module.css";

export default function Button({
  variant = "primary", // primary | secondary
  size = "big", // big | small
  disabled = false,
  children,
  icon,
  ...props
}) {
  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    disabled ? styles.disabled : "",
  ].join(" ");

  return (
    <button className={classNames} disabled={disabled} {...props}>
      <span className={styles.content}>{children}</span>
      {icon && <span className={styles.icon}>{icon}</span>}
    </button>
  );
} 