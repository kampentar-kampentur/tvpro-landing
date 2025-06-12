import styles from "./Footer.module.css";
import Link from 'next/link';
import LogoSVG from "@/assets/logo.svg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.footerContent}>
        <div className={styles.logoWrapper}>
          <Link 
            href="/" 
            aria-label="TVPro Handy Services - Home" 
            className={styles.logoLink}
            title="TVPro Handy Services - Professional handyman services"
          >
            <LogoSVG 
              width="82" 
              height="40" 
              alt="TVPro Handy Services Logo"
              role="img"
            />
          </Link>
          <div className={styles.copyright}>
            <p>© {currentYear} TV PRO Handy Services</p>
            <p>All Rights Reserved</p>
          </div>
        </div>
        
        <div className={styles.contactInfo}>
          <div className={styles.contactItem}>
            <h4 className={styles.contactLabel}>Phone</h4>
            <p className={styles.contactText}>
              <a
                href="tel:+18882666660" 
                className={styles.phoneLink}
                aria-label="Call TVPro Handy Services"
                title="Call us at (888) 266-6660"
              >
                (888) 266-6660
              </a>
              (8 AM – 10 PM Daily)
            </p>
          </div>
          
          <div className={styles.contactItem}>
            <h4 className={styles.contactLabel}>Email</h4>
            <p className={styles.contactText}>
              <a 
                href="mailto:tvprohandyservices@gmail.com" 
                className={styles.emailLink}
                aria-label="Email TVPro Handy Services"
                title="Send us an email"
              >
                tvprohandyservices@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;