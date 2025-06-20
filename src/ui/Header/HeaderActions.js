import styles from "./Header.module.css";
import Navbar from "./components/Navbar";
import Button from "@/ui/Button";
import QuoteButton from "@/ui/QuoteButton/QuoteButton";
import buttonStyles from "@/ui/Button/Button.module.css";

export default function HeaderActions() {
    return (
        <>
            <input type="checkbox" id="menu-toggle" className={styles.menuToggle} />
            <Navbar />
            <div className={styles.cta}>
                <span className={styles.hours}>8 AM – 10 PM Daily</span>
                <Button variant="secondary" size="small" href="tel:8882666660" className={styles.phoneMobileHide}>(888) 266-6660</Button>
                <QuoteButton size="small" modalName="BookNow">Book Now</QuoteButton>
                <label 
                    htmlFor="menu-toggle" 
                    className={`${styles.menuButton} ${styles.menuLabel} ${buttonStyles.button} ${buttonStyles.secondary} ${buttonStyles.small}`}
                >
                    <span className="sr-only">Menu</span>
                </label>
            </div>
        </>
    )
} 