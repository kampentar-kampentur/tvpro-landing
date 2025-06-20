"use client"

import { useModalState } from "@/providers/ModalProvider";
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
    const [formData, setFormData] = useState({ name: '', phone: '' });

    const handleChange = (fieldName) => (value) => {
        setFormData(prev => ({ ...prev, [fieldName]: value }));
    };

    const handleSubmit = () => {
        // TODO: Replace with your actual API call
        console.log("Sending data:", formData);
        alert(`Thank you, ${formData.name}! We will call you at ${formData.phone} soon.`);
        close(); // Close modal on submit
        setFormData({ name: '', phone: '' }); // Reset form
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
            <Button className={styles.button} onClick={handleSubmit}>Send</Button>
        </Modal>
    );
};

export default BookNowModal; 