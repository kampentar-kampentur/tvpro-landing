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
import ContactsDetails from "./components/ContactsDetails";

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

// Default export with data prop
export default async function Contacts({ data = {} }) {
  const [defaultContact, cta] = await Promise.all([getContactUs(), getCTA()]);

  // Merge: Use prop data if available, otherwise fallback to default
  const contact = {
    ...defaultContact,
    ...data,
    title: data?.title || defaultContact?.title,
    subTitle: data?.subTitle || defaultContact?.subTitle,
    // Social links - priority to prop data if present
    facebook: data?.facebook || defaultContact?.facebook,
    instagram: data?.instagram || defaultContact?.instagram,
    tiktok: data?.tiktok || defaultContact?.tiktok,
    youtube: data?.youtube || defaultContact?.youtube,
    yelp: data?.yelp || defaultContact?.yelp,
    thumbtack: data?.thumbtack || defaultContact?.thumbtack,
    pinterest: data?.pinterest || defaultContact?.pinterest,
    x: data?.x || defaultContact?.x,
  };
  return (
    <section className={styles.contacts} id="contact">
      <div className={`blockContainer ${styles.contactsContainer}`}>
        <h2 className={styles.heading}><Text text={contact.title} /></h2>
        <p className={styles.subHeading}><Text text={contact.subTitle} /></p>
        <div className={styles.mapWrap}>
          <div className={styles.contactDetailsSection}>
            <ContactsDetails />
          </div>

          {/* <iframe
            title="Location map of TVPro Handy Services"
            width="300"
            height="300"
            style={{border:0}}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed/v1/place?key=AIzaSyCu91rreI2noQjqeEJIbHzJFI8pWVgXXME&q=place_id:ChIJuVr9LojYwQERHVjQfs1s2O8">
          </iframe> */}
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

