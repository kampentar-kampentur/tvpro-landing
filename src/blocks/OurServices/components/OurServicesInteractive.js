"use client"

import React, { useState, useEffect, useRef } from "react";
import styles from "../OurServices.module.css";
import QuoteButton from "@/ui/QuoteButton/QuoteButton";
import ImageWrapper from "@/ui/ImageWrapper/ImgaeWrapper";
import ObjectRenderer from "@/modals/BestQuoteModal/components/ObjDeb";

const INTERVAL_TIME = 5000; // 5 seconds
const ANIMATION_DURATION = 600; // ms

export default function OurServicesInteractive({servicesData}) {
    const [activeServiceId, setActiveServiceId] = useState(null);
    const [displayedServiceId, setDisplayedServiceId] = useState(null);
    const [animating, setAnimating] = useState(false);
    const timeoutRef = useRef(null);
    const animationTimeoutRef = useRef(null);

    // Смена услуги с анимацией
    const handleChangeService = (newServiceId) => {
      if (newServiceId === activeServiceId) return;
      setAnimating(true);
      animationTimeoutRef.current = setTimeout(() => {
        setDisplayedServiceId(newServiceId);
        setAnimating(false);
        setActiveServiceId(newServiceId);
      }, ANIMATION_DURATION);
    };

    // Автоматический переход
    const startTimer = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      const currentIndex = servicesData.findIndex(
        (service) => service.id === activeServiceId
      );
      const nextIndex = (currentIndex + 1) % servicesData.length;
      timeoutRef.current = setTimeout(() => {
        handleChangeService(servicesData[nextIndex].id);
      }, INTERVAL_TIME);
    };

    useEffect(() => {
      setActiveServiceId(servicesData[0].id);
      setDisplayedServiceId(servicesData[0].id);
    }, [servicesData]); 

    useEffect(() => {
      if (!animating) startTimer();
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, [activeServiceId, animating]);

    useEffect(() => {
      return () => {
        if (animationTimeoutRef.current) {
          clearTimeout(animationTimeoutRef.current);
        }
      };
    }, []);

    return (
        <>
            <div className={styles.categoriesWrapper}>
            {servicesData.map((service) => (
                <button
                key={service.id}
                className={`${styles.categoryButton} ${
                    activeServiceId === service.id ? styles.active : ""
                }`}
                onClick={() => handleChangeService(service.id)}
                style={{ '--interval-time': `${INTERVAL_TIME / 1000}s` }}
                >
                <span className={styles.progress}></span>
                <span className={styles.categoryButtonText}>{service.label || service.title}</span>
                </button>
            ))}
            </div>

            {servicesData.map(service => (
                service.id === displayedServiceId && (
                <div
                  className={
                    `${styles.detailsWrapper} ` +
                    (animating ? styles.fadeOut : styles.fadeIn)
                  }
                  key={service.id}
                >
                    <div className={styles.detailsImage}>
                        <ImageWrapper media={service.image} />
                    </div>
                    <div className={styles.detailsContent}>
                        <h3 className={styles.detailsTitle}>{service.title}</h3>
                    <p className={styles.detailsDescription}>
                        {service.description}
                    </p>
                        <QuoteButton modalName="BookNow">Book Now</QuoteButton>
                    </div>
                </div>
                )
            ))}
        </>
    )
}