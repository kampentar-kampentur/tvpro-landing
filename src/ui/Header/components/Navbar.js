// Replaced next/link with <a>
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <div className={styles.navbarWrapper}>
      <nav className={styles.navbar} aria-label="Main Navigation">
        <ul className={styles.navLinks}>
          <li><a href="/">Home</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#reviews">Reviews</a></li>
          <li><a href="#gallery">Gallery</a></li>
          <li><a href="#about">About Us</a></li>
          <li><a href="#faq">FAQ</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </div>
  );
}
