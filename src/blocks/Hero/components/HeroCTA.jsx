"use client";

import React from "react";
import Button from "@/ui/Button/Button";
import { useCTA } from "@/providers/CTAProvider";
import styles from "../Hero.module.css";

export default function HeroCTA({ className }) {
    const cta = useCTA();

    return (
        <div className={styles.buttonWrapper}>
            <Button
                size="big"
                className={className}
                href={`tel:${cta?.phone || '+18326647597'}`}
            >
                Unlock $30 Off
            </Button>
        </div>
    );
}
