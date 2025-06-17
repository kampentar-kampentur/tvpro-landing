
import styles from "./Button.module.css";

export default function Button({
  variant = "primary", // primary | secondary
  size = "big", // big | small
  disabled = false,
  as,
  href,
  children,
  icon,
  className,
  type="button",
  ...props
}) {
  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    disabled ? styles.disabled : "",
    className
  ].join(" ");

  // Render as <a> if as="a" or href is provided
  if (as === "a" || href) {
    return (
      <a
        className={classNames}
        href={disabled ? undefined : href}
        aria-disabled={disabled ? "true" : undefined}
        tabIndex={disabled ? -1 : 0}
        {...props}
      >
        <span className={styles.content}>{children}</span>
        {icon && <span className={styles.icon}>{icon}</span>}
      </a>
    );
  }

  return (
    <button className={classNames} disabled={disabled} type={type} {...props}>
      <span className={styles.content}>{children}</span>
      {icon && <span className={styles.icon}>{icon}</span>}
    </button>
  );
} 