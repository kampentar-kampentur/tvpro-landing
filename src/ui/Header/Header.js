import Link from 'next/link';
import styles from "./Header.module.css";
import LogoSVG  from "@/assets/logo.svg"
import HeaderActions from './HeaderActions';

export default function Header({cta}) {
  return (
    <header className={styles.header}>
      <div className={styles.headerWrapper}>
        <div className={styles.headerNavWrapper}>
          <Link href="/" aria-label="TVPro Main Page" className="logo">
            <LogoSVG width="82" height="40"/>
            <span className="sr-only">TVPro Logo</span>
          </Link>
          <HeaderActions cta={cta} />
        </div>
      </div>
    </header>
  );
} 