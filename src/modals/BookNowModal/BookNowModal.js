"use client"

import { useModalState, useModal } from "@/providers/ModalProvider";
import styles from "./BookNowModal.module.css";
import Modal from "@/ui/Modal";
import React, { useState } from "react";
import TextField from "@/ui/Form/components/fields/TextField";
import Button from "@/ui/Button";

const nameField = {
    "name": "name",
    "type": "text",
    "textLabel": "Enter your name",
    "placeholder": "Your name *",
    "isRequired": true
};

const phoneField = {
    "name": "phone",
    "type": "tel",
    "textLabel": "Enter your phone",
    "placeholder": "Phone number *",
    "isRequired": true
};

const BookNowModal = () => {
    const { isOpen, close } = useModalState('BookNow');
    const { openModal } = useModal();
    const [formData, setFormData] = useState({ name: '', phone: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (fieldName) => (value) => {
        setFormData(prev => ({ ...prev, [fieldName]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.phone) {
            alert("Please fill in all required fields.");
            return;
        }
        setIsSubmitting(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_SRTAPI_URL || 'http://localhost:1337';
            const response = await fetch(`${apiUrl}/api/book-now`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: {
                        name: formData.name,
                        phone: formData.phone,
                    }
                }),
            });

            if (response.ok) {
                close();
                setFormData({ name: '', phone: '' });
                openModal('SeeYouSoon');
            } else {
                const errorData = await response.json();
                console.error("Form submission error:", errorData);
                alert("An error occurred. Please try again.");
            }
        } catch (error) {
            console.error("Failed to send form:", error);
            alert("Failed to send request. Please check your connection.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={close} className={styles.bookNow}>
            <h3 className={styles.title}>Get a Quote</h3>
            <TextField
                field={nameField}
                value={formData.name}
                onChange={handleChange('name')}
            />
            <TextField
                field={phoneField}
                value={formData.phone}
                onChange={handleChange('phone')}
            />
            <Button className={styles.button} onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send'}
            </Button>
        </Modal>
    );
};

export default BookNowModal; 