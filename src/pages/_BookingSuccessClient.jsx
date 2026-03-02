'use client'

import { useEffect, useState } from 'react'
import styles from "@/modals/BookingSuccessModal/BookingSuccessModal.module.css";
import Button from "@/ui/Button";
import PriceSummary from "@/modals/BestQuoteModal/components/PriceSummary";

export default function BookingSuccessClient() {
    const [pricingData, setPricingData] = useState(null);

    useEffect(() => {
        const data = localStorage.getItem('pricingData');
        if (data) {
            try {
                setPricingData(JSON.parse(data));
                // We might want to keep it briefly for the view, but Next.js removed it
                localStorage.removeItem('pricingData');
            } catch (e) {
                console.error("Failed to parse pricingData", e);
            }
        }
    }, []);

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
                    totalPrice={pricingData?.totalPrice || 0}
                    structuredCostBreakdown={pricingData?.structuredCostBreakdown || []}
                />
            </div>
            <Button variant="primary" size="big" className={styles.okButton} onClick={() => window.history.back()}>
                OK
            </Button>
        </div>
    );
}
