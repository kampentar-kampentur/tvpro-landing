import styles from "./Footer.module.css";
import Link from 'next/link';
import LogoSVG from "@/assets/logo.svg";

const Footer = async ({cta}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
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
            <h4 className={styles.contactLabel}>Phone Number</h4>
            <p className={styles.contactText}>
              <a
                href={`tel:${cta.phone}`} 
                className={styles.phoneLink}
                aria-label="Call TVPro Handy Services"
                title={`Call us at ${cta.phoneLabel}`}
              >
                {cta.phoneLabel} 
              </a> 
              <span> </span>
              <span>({cta.workHours})</span>
            </p>
          </div>
          
          <div className={styles.contactItem}>
            <h4 className={styles.contactLabel}>Email</h4>
            <p className={styles.contactText}>
              <a 
                href={`mailto:${cta.email}`} 
                className={styles.emailLink}
                aria-label="Email TVPro Handy Services"
                title="Send us an email"
              >
                {cta.email}
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;