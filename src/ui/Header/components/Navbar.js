import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <div className={styles.navbarWrapper}>
      <nav className={styles.navbar} aria-label="Main Navigation">
        <ul className={styles.navLinks}>
          <li><Link href="/">Home</Link></li>
          <li><Link href="#services">Services</Link></li>
          <li><Link href="#reviews">Reviews</Link></li>
          <li><Link href="#gallery">Gallery</Link></li>
          <li><Link href="#about">About Us</Link></li>
          <li><Link href="#faq">FAQ</Link></li>
          <li><Link href="#contact">Contact</Link></li>
        </ul>
      </nav>
    </div>
  );
}
