"use client";

import React from "react";
import QuoteButton from "@/ui/QuoteButton/QuoteButton";
import { useCTA } from "@/providers/CTAProvider";
import styles from "../Hero.module.css";

export default function HeroCTA({ className, isVariantB }) {
  const cta = useCTA();

  if (isVariantB) {
    return (
      <div className={`${styles.buttonWrapper} ${styles.buttonWrapperB}`}>
        <p className={`subText ${styles.boldSubText} ${styles.buttonCTATesxt}`}>
          Take a quick quiz to get your price &amp; save $30.
        </p>
        <QuoteButton
          size="big"
          className={className}
          modalName="BestQuote"
          modalProps={{ source: "hero-cta-get-my-quote" }}
        >
          GET MY QUOTE
        </QuoteButton>
      </div>
    );
  }

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
