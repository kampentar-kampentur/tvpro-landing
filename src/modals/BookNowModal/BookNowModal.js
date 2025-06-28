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

const zipField = {
    "name": "zip",
    "type": "number",
    "textLabel": "Enter your zip code",
    "placeholder": "Zip Code *",
    "isRequired": true
};

const addressField = {
    "name": "address",
    "type": "text",
    "textLabel": "Enter your address",
    "placeholder": "Address"
};

const emailField = {
    "name": "email",
    "type": "text",
    "textLabel": "Enter your email address",
    "placeholder": "Email address"
};

const BookNowModal = () => {
    const { isOpen, close } = useModalState('BookNow');
    const { openModal } = useModal();
    const [formData, setFormData] = useState({ name: '', phone: '', zip: '', address: '', email: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (fieldName) => (value) => {
        setFormData(prev => ({ ...prev, [fieldName]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.phone || !formData.zip) {
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
                        zip: formData.zip,
                        address: formData.address,
                        email: formData.email,
                    }
                }),
            });

            if (response.ok) {
                close();
                setFormData({ name: '', phone: '', zip: '', address: '', email: '' });
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

    const isFormValid = formData.name && formData.phone && formData.zip;

    return (
        <Modal isOpen={isOpen} onClose={close} className={styles.bookNow}>
            <h3 className={styles.title}>Let’s Talk — One Minute Callback</h3>
            <TextField
                field={nameField}
                value={formData.name}
                onChange={handleChange('name')}
                className={styles.bookNowInput}
            />
            <TextField
                field={phoneField}
                value={formData.phone}
                onChange={handleChange('phone')}
                className={styles.bookNowInput}
            />
            <TextField
                field={zipField}
                value={formData.zip}
                onChange={handleChange('zip')}
                className={styles.bookNowInput}
            />
            <TextField
                field={addressField}
                value={formData.address}
                onChange={handleChange('address')}
                className={styles.bookNowInput}
            />
            <TextField
                field={emailField}
                value={formData.email}
                onChange={handleChange('email')}
                className={styles.bookNowInput}
            />
            <Button className={styles.button} onClick={handleSubmit} disabled={isSubmitting || !isFormValid}>
                {isSubmitting ? 'Sending...' : 'Send'}
            </Button>
        </Modal>
    );
};

export default BookNowModal; 