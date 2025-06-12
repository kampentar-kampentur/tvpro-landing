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

const Contacts = () => {
  return (
    <section className={styles.contacts}>
      <div className={`blockContainer ${styles.contactsContainer}`}>
        <h2 className={styles.heading}>Our Contacts</h2>
        <p className={styles.subHeading}>
          We offer a range of secure, high-quality mounting options to match your TV, wall type, and viewing needs.
        </p>
        <div className={styles.contactDetailsSection}>
            <div className={styles.detailItem}>
                <h3 className={styles.detailTitle}>Working Hours</h3>
                <p className={styles.detailText}>8 AM – 10 PM Daily</p>
            </div>
            <div className={styles.detailItem}>
                <h3 className={styles.detailTitle}>Phone Number</h3>
                <p className={styles.detailText}>
                    <a href="tel:+18882666660">(888) 266-6660</a>
                </p>
            </div>
            <div className={styles.detailItem}>
                <h3 className={styles.detailTitle}>Email</h3>
                <p className={styles.detailText}>
                    <a href="mailto:tvprohandyservices@gmail.com">tvprohandyservices@gmail.com</a>
                </p>
            </div>
        </div>
        <div className={styles.socialNetworksSection}>
          <h3 className={styles.detailTitle}>Social Networks</h3>
          <div className={styles.socialIcons}>
            <a href="#" className={styles.socialIconLink}>
              <FacebookDefault className={styles.defaultIcon} />
              <FacebookHover className={styles.hoverIcon} />
            </a>
            <a href="#" className={styles.socialIconLink}>
              <InstagramDefault className={styles.defaultIcon} />
              <InstagramHover className={styles.hoverIcon} />
            </a>
            <a href="#" className={styles.socialIconLink}>
              <TikTokDefault className={styles.defaultIcon} />
              <TikTokHover className={styles.hoverIcon} />
            </a>
            <a href="#" className={styles.socialIconLink}>
              <YouTubeDefault className={styles.defaultIcon} />
              <YouTubeHover className={styles.hoverIcon} />
            </a>
            <a href="#" className={styles.socialIconLink}>
              <YelpDefault className={styles.defaultIcon} />
              <YelpHover className={styles.hoverIcon} />
            </a>
            <a href="#" className={styles.socialIconLink}>
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