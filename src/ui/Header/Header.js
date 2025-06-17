"use client"
import Link from 'next/link';
import styles from "./Header.module.css";
import LogoSVG  from "@/assets/logo.svg"
import Navbar from "./components/Navbar";
import Button from "@/ui/Button"
import { useModal } from '@/providers/ModalProvider';
import { useState } from 'react';

export default function Header() {
  const {openModal} = useModal()
  const [showMenu, setShowMenu] = useState(false);
  return (
    <header className={styles.header}>
      <div className={styles.headerWrapper}>
        <div className={styles.headerNavWrapper}>
          <Link href="/" aria-label="TVPro Main Page" className="logo">
            <LogoSVG width="82" height="40"/>
            <span className="sr-only">TVPro Logo</span>
          </Link>
          <Navbar showMenu={showMenu} />
        </div>
        <div className={styles.cta}>
          <span className={styles.hours}>8 AM – 10 PM Daily</span>
          <Button variant="secondary" size="small" href="tel:8882666660" className={styles.phoneMobileHide}>(888) 266-6660</Button>
          <Button size="small" onClick={() => openModal("BestQuote")}>Book Now</Button>
          <Button
            variant="secondary"
            size="small"
            className={styles.menuButton}
            aria-label={showMenu ? "Close menu" : "Open menu"}
            onClick={() => setShowMenu(v => !v)}
          >
            {showMenu ? 'Close' : 'Menu'}
          </Button>
        </div>
      </div>
    </header>
  );
} 