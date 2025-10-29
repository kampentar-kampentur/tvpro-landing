"use client"

import { useRouter } from 'next/navigation';
import { useModalState, useModal } from "@/providers/ModalProvider";
import styles from "./BookNowModal.module.css";
import Modal from "@/ui/Modal";
import React, { useState } from "react";
import TextField from "@/ui/Form/components/fields/TextField";
import Button from "@/ui/Button";
import Checkbox from "@/ui/Checkbox";

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
    const router = useRouter();
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
                
                dataLayer.push({
                    event: 'form_send_ok',
                    'user_data.phone_number': formData.phone.replace(/\D/g, ''),
                });
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'conversion', {'send_to': 'AW-17416148778/aAZCCNeF9vsaEKqu1fBA'});
                }
                router.push('/see-you-soon');
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

    const isFormValid = formData.name && formData.phone;

    const TermsText = () => {
        return(
        <div style={{fontSize: '12px', maxWidth: "100%", textWrap: "wrap", textAlign: "left"}}>
            I agree to receive SMS from TVPro Handy Services LLC regarding appointments and service updates.
            <p>
            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="sms-link">Privacy Policy</a> and
            <a href="/terms" target="_blank" rel="noopener noreferrer" className="sms-link" style={{marginLeft: 8}}>Terms of Service</a>
            </p>
        </div>
        )
    }

    return (
        <Modal isOpen={isOpen} onClose={close} className={styles.bookNow}>
            <h3 className={styles.title}>Get a Quick Quote</h3>
            <p className={styles.subtitle}>Leave your number — we’ll call and give you the exact price</p>
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
            <div className={styles.discountBanner}>
                <p className={styles.discountLabel}>Installing 2 or more TVs?</p>
                <p className={styles.discountText}>Let the manager know to receive a multi-TVs <span className={styles.discountWord}>DISCOUNT</span>: <span className={styles.discountPercent}>10% OFF</span> for 2 TVs, <span className={styles.discountPercent}>15% OFF</span> for 3, <span className={styles.discountPercent}>20% OFF</span> for 4 or more.</p>
            </div>

            <div className={styles.btnWrap}>
                <Checkbox label={<TermsText/>}/>
                <Button className={styles.button} onClick={handleSubmit} disabled={isSubmitting || !isFormValid}>
                    {isSubmitting ? 'Sending...' : 'Send'}
                </Button>
            </div>  
        </Modal>
    );
};

export default BookNowModal; 