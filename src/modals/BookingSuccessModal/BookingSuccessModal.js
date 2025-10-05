"use client";

import { useModalState } from "@/providers/ModalProvider";
import styles from "./BookingSuccessModal.module.css";
import Modal from "@/ui/Modal";
import Button from "@/ui/Button";
import PriceSummary from "../BestQuoteModal/components/PriceSummary";

const BookingSuccessModal = () => {
    const { isOpen, close, data } = useModalState('BookingSuccess');
    const { totalPrice, structuredCostBreakdown } = data?.props || {};

    return (
        <Modal isOpen={isOpen} onClose={close} className={styles.bookingSuccess}>
            <div className={styles.successMessage}>
                Your TV installation is booked! 🎉
            </div>
            <div className={styles.subtitle}>
                Thanks for booking with us. Here are your order details:
            </div>
            <div className={styles.priceSummary}>
                <PriceSummary
                    totalPrice={totalPrice}
                    structuredCostBreakdown={structuredCostBreakdown}
                />
            </div>
            <Button variant="primary" size="big" className={styles.okButton} onClick={close}>
                OK
            </Button>
        </Modal>
    );
};

export default BookingSuccessModal;