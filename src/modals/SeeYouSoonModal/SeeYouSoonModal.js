"use client";

import { useModalState } from "@/providers/ModalProvider";
import styles from "./SeeYouSoonModal.module.css";
import Modal from "@/ui/Modal";
import Button from "@/ui/Button";

const SeeYouSoonModal = () => {
    const { isOpen, close } = useModalState('SeeYouSoon');

    return (
        <Modal isOpen={isOpen} onClose={close} className={styles.seeYouSoon}>
            <h3 className={styles.title}>You&apos;re all set!<br/>We&apos;ll see you soon.</h3>
            <div className={styles.subtitle}>Get a Free Consultation Within 15 Minutes!</div>
            <Button variant="primary" size="big" className={styles.button} onClick={close}>OK</Button>
        </Modal>
    );
};

export default SeeYouSoonModal; 