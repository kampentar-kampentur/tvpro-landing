'use client'

import { useEffect } from 'react'
import styles from "./BookingSuccessModal.module.css";
import Modal from "@/ui/Modal";
import Button from "@/ui/Button";
import PriceSummary from "../../modals/BestQuoteModal/components/PriceSummary";

export default function BookingSuccessPage() {
  // Extract data from URL params or localStorage if needed
  // For now, show a basic success page without modal wrapper

  return (
    <div className={styles.bookingSuccess}>
      <div className={styles.successMessage}>
        Your TV installation is booked! 🎉
      </div>
      <div className={styles.subtitle}>
        Thanks for booking with us. Here are your order details:
      </div>
      <div className={styles.priceSummary}>
        <PriceSummary
          totalPrice={0}
          structuredCostBreakdown={[]}
        />
      </div>
      <Button variant="primary" size="big" className={styles.okButton} onClick={() => window.history.back()}>
        OK
      </Button>
    </div>
  );
}