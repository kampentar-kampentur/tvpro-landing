import React from "react";
import styles from "./Contacts.module.css";
import FacebookDefault from "@/assets/socialIcons/FacebookDefault.svg";
import FacebookHover from "@/assets/socialIcons/FacebookHover.svg";
import InstagramDefault from "@/assets/socialIcons/InstagramDefault.svg";
import InstagramHover from "@/assets/socialIcons/InstagramHover.svg";
import TikTokDefault from "@/assets/socialIcons/TikTokDefault.svg";
import TikTokHover from "@/assets/socialIcons/TikTokHover.svg";
import YouTubeDefault from "@/assets/socialIcons/YouTubeDefault.svg";
import YouTubeHover from "@/assets/socialIcons/YouTubeHover.svg";
import YelpDefault from "@/assets/socialIcons/YelpDefault.svg";
import YelpHover from "@/assets/socialIcons/YelpHover.svg";
import ThumbtackDefault from "@/assets/socialIcons/ThumbtackDefault.svg";
import ThumbtackHover from "@/assets/socialIcons/ThumbtackHover.svg";

async function getCTA() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/cta`);
    const json = await res.json();

    return json.data;
}  

const Contacts = async () => {
  const cta = await getCTA();
  return (
    <section className={styles.contacts} id="contact">
      <div className={`blockContainer ${styles.contactsContainer}`}>
        <h2 className={styles.heading}>Our Contacts</h2>
        <p className={styles.subHeading}>
          We offer a range of secure, high-quality mounting options to match your TV, wall type, and viewing needs.
        </p>
        <div className={styles.contactDetailsSection}>
            <div className={styles.detailItem}>
                <h3 className={styles.detailTitle}>Working Hours</h3>
                <p className={styles.detailText}>{cta.workHours}</p>
            </div>
            <div className={styles.detailItem}>
                <h3 className={styles.detailTitle}>Phone Number</h3>
                <p className={styles.detailText}>
                    <a href={`tel:${cta.phone}`}>{cta.phoneLabel}</a>
                </p>
            </div>
            <div className={styles.detailItem}>
                <h3 className={styles.detailTitle}>Email</h3>
                <p className={styles.detailText}>
                    <a href={`mailto:${cta.email}`}>{cta.email}</a>
                </p>
            </div>
        </div>
        <div className={styles.socialNetworksSection}>
          <h3 className={styles.detailTitle}>Social Networks</h3>
          <div className={styles.socialIcons}>
            <a href="https://www.facebook.com/share/1DgjVSoeN5/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className={styles.socialIconLink}>
              <FacebookDefault className={styles.defaultIcon} />
              <FacebookHover className={styles.hoverIcon} />
            </a>
            <a href="https://www.instagram.com/tvprohandyservices?igsh=d3RrZ2N3bW5iOHg0" target="_blank" rel="noopener noreferrer" className={styles.socialIconLink}>
              <InstagramDefault className={styles.defaultIcon} />
              <InstagramHover className={styles.hoverIcon} />
            </a>
            <a href="https://www.tiktok.com/@tvpro.handy.servi?_t=ZT-8xNfkpJVEjN&_r=1" target="_blank" rel="noopener noreferrer" className={styles.socialIconLink}>
              <TikTokDefault className={styles.defaultIcon} />
              <TikTokHover className={styles.hoverIcon} />
            </a>
            {/* <a href="#" target="_blank" rel="noopener noreferrer" className={styles.socialIconLink}>
              <YouTubeDefault className={styles.defaultIcon} />
              <YouTubeHover className={styles.hoverIcon} />
            </a> */}
            <a href="https://yelp.to/361jlVGZ50" target="_blank" rel="noopener noreferrer" className={styles.socialIconLink}>
              <YelpDefault className={styles.defaultIcon} />
              <YelpHover className={styles.hoverIcon} />
            </a>
            <a href="https://www.thumbtack.com/tx/houston/tv-wall-mount-install/tvprohandyservices/service/538968360070111254" target="_blank" rel="noopener noreferrer" className={styles.socialIconLink}>
              <ThumbtackDefault className={styles.defaultIcon} />
              <ThumbtackHover className={styles.hoverIcon} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacts; 