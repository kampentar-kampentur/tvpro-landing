"use client";

import React from "react";
import styles from "../Contacts.module.css";
import { useCTA } from "@/providers/CTAProvider";

export default function ContactsDetails() {
    const cta = useCTA();

    return (
        <>
            <div className={styles.detailItem}>
                <h3 className={styles.detailTitle}>Working Hours</h3>
                <p className={styles.detailText}>{cta?.workHours || 'Mon-Sun 8:00 AM - 8:00 PM'}</p>
            </div>
            <div className={styles.detailItem}>
                <h3 className={styles.detailTitle}>Phone Number</h3>
                <p className={styles.detailText}>
                    <a href={`tel:${cta?.phone || '(877) 455-5535'}`}>{cta?.phoneLabel || 'Call Us'}</a>
                </p>
            </div>
            <div className={styles.detailItem}>
                <h3 className={styles.detailTitle}>Email</h3>
                <p className={styles.detailText}>
                    <a href={`mailto:${cta?.email || 'tvprohandyservices@gmail.com'}`}>{cta?.email || 'info@tvprousa.com'}</a>
                </p>
            </div>
        </>
    );
}
