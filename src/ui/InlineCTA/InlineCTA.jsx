"use client";

import React from "react";
import QuoteButton from "@/ui/QuoteButton/QuoteButton";
import styles from "./InlineCTA.module.css";

export default function InlineCTA({ category }) {
    const normalizedCategory = category ? category.toLowerCase().trim() : "";

    let heading = "Ready for Professional Setup?";
    let text = "Get a free, no-obligation estimate from local certified technicians in the Greater Houston Area.";
    let buttonText = "Get The Best Quote";
    let badgeText = "Special Offer";

    if (normalizedCategory.includes("mount") || normalizedCategory.includes("install")) {
        heading = "Need Your TV Professionally Mounted?";
        text = "Save time and secure your screen. Our technicians handle drywall, plaster, brick walls, and wire concealment.";
        buttonText = "Book TV Mounting";
        badgeText = "TV Installation";
    } else if (normalizedCategory.includes("smart") || normalizedCategory.includes("home")) {
        heading = "Configure Your Smart Home Devices";
        text = "Struggling with smart cameras, doorbells, or thermostats? We get everything connected and synced.";
        buttonText = "Book Smart Setup";
        badgeText = "Smart Home";
    } else if (normalizedCategory.includes("sound") || normalizedCategory.includes("audio") || normalizedCategory.includes("speaker")) {
        heading = "Theater-Grade Audio Configured for You";
        text = "From high-end soundbars to 5.1 surround sound arrays, our specialists calibrate audio levels for premium depth.";
        buttonText = "Get Audio Quote";
        badgeText = "Sound & Audio";
    }

    return (
        <div className={styles.inlineCtaCard}>
            <div className={styles.headerRow}>
                <div className={styles.statusIndicator} />
                <span className={styles.badge}>{badgeText}</span>
            </div>
            <div className={styles.contentBlock}>
                <h3 className={styles.heading}>{heading}</h3>
                <p className={styles.text}>{text}</p>
            </div>
            <div className={styles.actionRow}>
                <QuoteButton size="big" modalName="BookNow">
                    {buttonText}
                </QuoteButton>
            </div>
        </div>
    );
}
