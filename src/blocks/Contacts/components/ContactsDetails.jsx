"use client";

import React from "react";
import styles from "../Contacts.module.css";
import { useCTA } from "@/providers/CTAProvider";

export default function ContactsDetails({ cityContext }) {
    const cta = useCTA();

    const mapQuery = cityContext?.city_name
      ? `${cityContext.city_name}, ${cityContext.state_code || ""}`
      : "Houston, TX";

    return (
        <>
            <div className={styles.detailItem}>
                <h3 className={styles.detailTitle}>Working Hours</h3>
                <p className={`${styles.detailText} ${styles.nonClickable}`}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.detailIcon}>
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>{cta?.workHours || 'Mon-Sun 8:00 AM - 8:00 PM'}</span>
                </p>
            </div>
            <div className={styles.detailItem}>
                <h3 className={styles.detailTitle}>Phone Number</h3>
                <p className={styles.detailText}>
                    <a href={`tel:${cta?.phone || '(877) 455-5535'}`} className={styles.clickableLink}>
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.detailIcon}>
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        <span>{cta?.phoneLabel || 'Call Us'}</span>
                    </a>
                </p>
            </div>
            <div className={styles.detailItem}>
                <h3 className={styles.detailTitle}>Email</h3>
                <p className={styles.detailText}>
                    <a href={`mailto:${cta?.email || 'tvprohandyservices@gmail.com'}`} className={styles.clickableLink}>
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.detailIcon}>
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        <span>{cta?.email || 'info@tvprousa.com'}</span>
                    </a>
                </p>
            </div>
            <div className={styles.detailItem}>
                <h3 className={styles.detailTitle}>Service Location</h3>
                <p className={styles.detailText}>
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.clickableLink}
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.detailIcon}>
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span>{mapQuery} (Get Directions)</span>
                    </a>
                </p>
            </div>
        </>
    );
}
