"use client";

import Link from 'next/link';
import { useCTA } from "@/providers/CTAProvider";
import styles from "./Header.module.css";
import LogoSVG from "@/assets/logo.svg"
import HeaderActions from './HeaderActions';

export default function Header({ cta: parentCta }) {
  const cta = useCTA();

  return (
    <header className={styles.header}>
      <div className={styles.headerWrapper}>
        <div className={styles.headerNavWrapper}>
          <Link href={cta?.homeLink || "/"} aria-label="TVPro Main Page" className="logo">
            <LogoSVG width="82" height="40" />
            <span className="sr-only">TVPro Logo</span>
          </Link>
          <HeaderActions cta={cta} />
        </div>
      </div>
    </header>
  );
} 