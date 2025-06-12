
import Link from 'next/link';
import styles from "./Header.module.css";
import LogoSVG  from "@/assets/logo.svg"
import Navbar from "./components/Navbar";
import Button from "@/ui/Button"

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerWrapper}>
        <div className={styles.headerNavWrapper}>
          <Link href="/" aria-label="TVPro Main Page" className="logo">
            <LogoSVG width="82" height="40"/>
            <span className="sr-only">TVPro Logo</span>
          </Link>
          <Navbar />
        </div>
        <div className={styles.cta}>
          <span className={styles.hours}>8 AM – 10 PM Daily</span>
          <Button variant="secondary" size="small" href="tel:8882666660">(888) 266-6660</Button>
          <Button size="small" as="a" href="#book">Book Now</Button>
        </div>
      </div>
    </header>
  );
} 