"use client";

import React, { useState } from "react";
import styles from "./ExitIntentModal.module.css";
import Modal from "@/ui/Modal";
import { useModalState } from "@/providers/ModalProvider";
import TextField from "@/ui/Form/components/fields/TextField";
import Button from "@/ui/Button";
import Checkbox from "@/ui/Checkbox";
import { useRouter } from 'next/navigation';

const nameField = {
    "name": "name",
    "type": "text",
    "placeholder": "Your name *",
    "isRequired": true
};

const phoneField = {
    "name": "phone",
    "type": "tel",
    "placeholder": "Phone number *",
    "isRequired": true
};

const TermsText = () => {
    return (
        <div style={{ fontSize: '12px', maxWidth: "100%", textWrap: "wrap", textAlign: "left" }}>
            I agree to receive SMS from TVPro Handy Services LLC regarding appointments and service updates.
            <p>
                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="sms-link">Privacy Policy</a> and
                <a href="/terms" target="_blank" rel="noopener noreferrer" className="sms-link" style={{ marginLeft: 8 }}>Terms of Service</a>
            </p>
        </div>
    )
}

const ExitIntentModal = () => {
    const { isOpen, close } = useModalState("ExitIntentModal");
    const [formData, setFormData] = useState({ name: '', phone: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleChange = (fieldName) => (value) => {
        setFormData(prev => ({ ...prev, [fieldName]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.phone) return;

        setIsSubmitting(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_SRTAPI_URL || 'http://localhost:1337';
            const response = await fetch(`${apiUrl}/api/book-now`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    data: {
                        name: formData.name,
                        phone: formData.phone,
                        source: 'exit_intent_popup'
                    }
                }),
            });

            if (response.ok) {
                close();
                router.push('/see-you-soon');
            }
        } catch (error) {
            console.error("Exit Intent form error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={close} className={styles.exitModal}>
            <div className={styles.container}>
                <h2 className={styles.title}>Wait! Get $30 OFF</h2>
                <p className={styles.subtitle}>
                    Don&apos;t leave yet! Claim your discount for your first professional TV installation.
                </p>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <TextField
                        field={nameField}
                        value={formData.name}
                        onChange={handleChange('name')}
                        className={styles.input}
                    />
                    <TextField
                        field={phoneField}
                        value={formData.phone}
                        onChange={handleChange('phone')}
                        className={styles.input}
                    />

                    <div className={styles.footer}>
                        <Checkbox label={<TermsText />} />
                        <Button
                            type="submit"
                            variant="primary"
                            className={styles.submitBtn}
                            disabled={isSubmitting || !formData.name || !formData.phone}
                        >
                            {isSubmitting ? "Sending..." : "Claim My $30 Off"}
                        </Button>
                    </div>
                </form>

                <button type="button" className={styles.noThanks} onClick={close}>
                    No thanks, I&apos;ll pay full price
                </button>
            </div>
        </Modal>
    );
};

export default ExitIntentModal;
