"use client";

import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { usePathname } from "next/navigation";
import { useCTA } from "@/providers/CTAProvider";
import styles from "./Header.module.css";
import LogoSVG from "@/assets/logo.svg"
import HeaderActions from './HeaderActions';

export default function Header({ cta: parentCta }) {
  const cta = useCTA();
  const pathname = usePathname();
  const isBlog = pathname && pathname.startsWith("/blog");
  const [hideAnnouncement, setHideAnnouncement] = useState(true);

  useEffect(() => {
    const isHidden = sessionStorage.getItem("hide_announcement_bar") === "true";
    setHideAnnouncement(isHidden);
  }, []);

  const handleCloseAnnouncement = () => {
    sessionStorage.setItem("hide_announcement_bar", "true");
    setHideAnnouncement(true);
  };

  return (
    <div className={styles.headerContainer}>
      {isBlog && !hideAnnouncement && (
        <div className={styles.announcementBar}>
          <div className={styles.announcementContent}>
            <span>Professional TV Mounting & Home Theater Installation Services.</span>
            <Link href="/book-now/" className={styles.announcementLink}>Book Online</Link>
          </div>
          <button 
            onClick={handleCloseAnnouncement} 
            className={styles.closeAnnouncement}
            aria-label="Close announcement"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}
      <header className={`${styles.header} ${isBlog ? styles.blogHeaderOverride : ""}`}>
        <div className={styles.headerWrapper}>
          <div className={styles.headerNavWrapper}>
            <Link href={cta?.homeLink || "/"} aria-label="TVPro Main Page" className="logo">
              <LogoSVG width="82" height="40" />
              <span className="sr-only">TVPro Logo</span>
            </Link>
            <HeaderActions cta={cta} isBlog={isBlog} />
          </div>
        </div>
      </header>
    </div>
  );
}  