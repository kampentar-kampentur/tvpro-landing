"use client";

import styles from "./Header.module.css";
import Navbar from "./components/Navbar";
import Button from "@/ui/Button";
import QuoteButton from "@/ui/QuoteButton/QuoteButton";
import buttonStyles from "@/ui/Button/Button.module.css";
import MenuAutoClose from "./MenuAutoClose";
import PhoneIcon from "@/assets/icons/phone.svg";
import { useCTA } from "@/providers/CTAProvider";

export default function HeaderActions() {
    const cta = useCTA();
    return (
        <>
            <input type="checkbox" id="menu-toggle" className={styles.menuToggle} />
            <Navbar />
            <MenuAutoClose menuToggleId="menu-toggle" menuWrapperClass="navbarWrapper" />
            <div className={styles.cta}>
                <span className={styles.hours}>{cta?.workHours || 'Mon-Sun 7:00 AM - 10:00 PM'}</span>
                <Button variant="secondary" size="small" href={`tel:${cta?.phone || '(877) 455-5535'}`} className={styles.phoneMobileHide}>{cta?.phoneLabel || 'Call Us'}</Button>
                <QuoteButton size="small" modalName="BookNow">Book Now</QuoteButton>
                <label
                    htmlFor="menu-toggle"
                    className={`${styles.menuButton} ${styles.menuLabel} ${buttonStyles.button} ${buttonStyles.secondary} ${buttonStyles.small}`}
                >
                    <div className={styles.hamburger}>
                        <span className={styles.line}></span>
                        <span className={styles.line}></span>
                        <span className={styles.line}></span>
                    </div>
                    <span className="sr-only">Menu</span>
                </label>
            </div>
            <Button
                className={styles.phoneButton}
                href={`tel:${cta?.phone || '(877) 455-5535'}`}
            >
                <PhoneIcon width="24" height="24" style={{ fill: "currentColor" }} />
                <span className="visually-hidden">Telephones to TVPro Handy Services</span>
            </Button>
        </>
    )
} 