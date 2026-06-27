"use client";

import React from "react";
import QuoteButton from "@/ui/QuoteButton/QuoteButton";
import { useCTA } from "@/providers/CTAProvider";
import styles from "../Hero.module.css";

export default function HeroCTA({ className }) {
  const cta = useCTA();

  return (
    <div className={styles.buttonWrapper}>
      <p className={`subText ${styles.boldSubText} ${styles.buttonCTATesxt}`}>
        Take a brief quiz to get a discount
      </p>
      <QuoteButton size="big" className={className}>
        Get $30 Off Now
      </QuoteButton>
    </div>
  );
}
