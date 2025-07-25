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
import PinterestDefault from "@/assets/socialIcons/pinterest.svg"
import PinterestHover from "@/assets/socialIcons/pinterestHover.svg"
import XDefault from "@/assets/socialIcons/X.svg"
import XHover from "@/assets/socialIcons/XHover.svg"
import Text from "@/ui/Text/Text";

async function getContactUs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/contact-us`);
  const json = await res.json();
  return json.data;
}

async function getCTA() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/cta`);
    const json = await res.json();
    return json.data;
}  

const Contacts = async () => {
  const [contact, cta] = await Promise.all([getContactUs(), getCTA()]);
  return (
    <section className={styles.contacts} id="contact">
      <div className={`blockContainer ${styles.contactsContainer}`}>
        <h2 className={styles.heading}><Text text={contact.title} /></h2>
        <p className={styles.subHeading}><Text text={contact.subTitle} /></p>
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
            {contact.facebook && (
              <a href={contact.facebook} target="_blank" rel="noopener noreferrer" className={styles.socialIconLink} aria-label="FaceBook">
                <FacebookDefault className={styles.defaultIcon} />
                <FacebookHover className={styles.hoverIcon} />
                <span className="sr-only">FaceBook</span>
              </a>
            )}
            {contact.instagram && (
              <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className={styles.socialIconLink} aria-label="Instagram">
                <InstagramDefault className={styles.defaultIcon} />
                <InstagramHover className={styles.hoverIcon} />
                <span className="sr-only">Instagram</span>
              </a>
            )}
            {contact.tiktok && (
              <a href={contact.tiktok} target="_blank" rel="noopener noreferrer" className={styles.socialIconLink} aria-label="TikTok">
                <TikTokDefault className={styles.defaultIcon} />
                <TikTokHover className={styles.hoverIcon} />
                <span className="sr-only">TikTok</span>
              </a>
            )}
            {contact.youtube && (
              <a href={contact.youtube} target="_blank" rel="noopener noreferrer" className={styles.socialIconLink} aria-label="YouTube">
                <YouTubeDefault className={styles.defaultIcon} />
                <YouTubeHover className={styles.hoverIcon} />
                <span className="sr-only">YouTube</span>
              </a>
            )}
            {contact.yelp && (
              <a href={contact.yelp} target="_blank" rel="noopener noreferrer" className={styles.socialIconLink} aria-label="Yelp">
                <YelpDefault className={styles.defaultIcon} />
                <YelpHover className={styles.hoverIcon} />
                <span className="sr-only">Yelp</span>
              </a>
            )}
            {contact.thumbtack && (
              <a href={contact.thumbtack} target="_blank" rel="noopener noreferrer" className={styles.socialIconLink} aria-label="Thumbtack">
                <ThumbtackDefault className={styles.defaultIcon} />
                <ThumbtackHover className={styles.hoverIcon} />
                <span className="sr-only">Thumbtack</span>
              </a>
            )}
            {contact.pinterest && (
              <a href={contact.pinterest} target="_blank" rel="noopener noreferrer" className={styles.socialIconLink} aria-label="Pinterest">
                <PinterestDefault className={styles.defaultIcon} />
                <PinterestHover className={styles.hoverIcon} />
                <span className="sr-only">Pinterest</span>
              </a>
            )}
            {contact.x && (
              <a href={contact.x} target="_blank" rel="noopener noreferrer" className={styles.socialIconLink} aria-label="X">
                <XDefault className={styles.defaultIcon} />
                <XHover className={styles.hoverIcon} />
                <span className="sr-only">X</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacts; 