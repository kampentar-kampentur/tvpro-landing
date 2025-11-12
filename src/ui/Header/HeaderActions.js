import styles from "./Header.module.css";
import Navbar from "./components/Navbar";
import Button from "@/ui/Button";
import QuoteButton from "@/ui/QuoteButton/QuoteButton";
import buttonStyles from "@/ui/Button/Button.module.css";
import MenuAutoClose from "./MenuAutoClose";
import PhoneIcon from "@/assets/icons/phone.svg";

export default function HeaderActions({cta}) {
    return (
        <>
            <input type="checkbox" id="menu-toggle" className={styles.menuToggle} />
            <Navbar />
            <MenuAutoClose menuToggleId="menu-toggle" menuWrapperClass="navbarWrapper" />
            <div className={styles.cta}>
                <span className={styles.hours}>{cta.workHours}</span>
                <Button variant="secondary" size="small" href={`tel:${cta.phone}`} className={styles.phoneMobileHide}>{cta.phoneLabel}</Button>
                <QuoteButton size="small" modalName="BookNow">Call Me Back</QuoteButton>
                <label 
                    htmlFor="menu-toggle" 
                    className={`${styles.menuButton} ${styles.menuLabel} ${buttonStyles.button} ${buttonStyles.secondary} ${buttonStyles.small}`}
                >
                    <span className="sr-only">Menu</span>
                </label>
            </div>
            <Button
              className={styles.phoneButton}
              href={`tel:${cta.phone}`}
            >
                <PhoneIcon width="24" height="24" style={{fill: "currentColor"}}/>
                <span className="visually-hidden">Telephones to TVPro Handy Services</span>
            </Button>
        </>
    )
} 