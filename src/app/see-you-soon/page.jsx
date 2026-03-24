'use client'

import styles from "@/modals/SeeYouSoonModal/SeeYouSoonModal.module.css";
import Button from "@/ui/Button";

export default function SeeYouSoonPage() {
  return (
    <div className={styles.seeYouSoon}>
      <h3 className={styles.title}>You're all set!<br/>We'll see you soon.</h3>
      <div className={styles.subtitle}>Get a Free Consultation Within 15 Minutes!</div>
      <Button 
        variant="primary" 
        size="big" 
        className={styles.button} 
        onClick={() => {
          const returnUrl = sessionStorage.getItem('quiz_return_url') || "/";
          sessionStorage.removeItem('quiz_return_url'); // Cleanup
          window.location.href = returnUrl;
        }}
      >
        OK
      </Button>
    </div>
  );
}