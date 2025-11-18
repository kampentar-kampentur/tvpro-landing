import styles from "./Footer.module.css";
import Link from 'next/link';
import LogoSVG from "@/assets/logoFooter.svg";

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
            <h3 className={styles.contactLabel}>Phone Number</h3>
            <p className={styles.contactText}>
              <a
                href={`tel:${cta?.phone || '(877) 455-5535'}`}
                className={styles.phoneLink}
                aria-label="Call TVPro Handy Services"
                title={`Call us at ${cta?.phoneLabel || 'Call Us'}`}
              >
                {cta?.phoneLabel || 'Call Us'}
              </a>
              <span> </span>
              <span>({cta?.workHours || 'Mon-Sun 8:00 AM - 8:00 PM'})</span>
            </p>
          </div>
          
          <div className={styles.contactItem}>
            <h3 className={styles.contactLabel}>Email</h3>
            <p className={styles.contactText}>
              <a
                href={`mailto:${cta?.email || 'tvprohandyservices@gmail.com'}`}
                className={styles.emailLink}
                aria-label="Email TVPro Handy Services"
                title="Send us an email"
              >
                {cta?.email || 'tvprohandyservices@gmail.com'}
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;