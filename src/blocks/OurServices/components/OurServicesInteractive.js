"use client"

import React, { useState, useEffect, useRef } from "react";
import styles from "../OurServices.module.css";
import Image from "next/image";
import QuoteButton from "@/ui/QuoteButton/QuoteButton";

const INTERVAL_TIME = 5000; // 5 seconds

export default function OurServicesInteractive({servicesData}) {
    const [activeServiceId, setActiveServiceId] = useState(null);
    const timeoutRef = useRef(null);
    const resetAndStartTimer = (newServiceId) => {
      setActiveServiceId(newServiceId);
    };
  
    const startTimer = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      const currentIndex = servicesData.findIndex(
        (service) => service.id === activeServiceId
      );
      const nextIndex = (currentIndex + 1) % servicesData.length;
  
      timeoutRef.current = setTimeout(() => {
        resetAndStartTimer(servicesData[nextIndex].id);
      }, INTERVAL_TIME);
    };
  
    useEffect(() => {
      setActiveServiceId(servicesData[0].id);
    }, []); 
  
    useEffect(() => {
      startTimer();
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, [activeServiceId]);

    return (
        <>
            <div className={styles.categoriesWrapper}>
            {servicesData.map((service) => (
                <button
                key={service.id}
                className={`${styles.categoryButton} ${
                    activeServiceId === service.id ? styles.active : ""
                }`}
                onClick={() => resetAndStartTimer(service.id)}
                style={{ '--interval-time': `${INTERVAL_TIME / 1000}s` }}
                >
                <span className={styles.progress}></span>
                <span className={styles.categoryButtonText}>{service.label || service.title}</span>
                </button>
            ))}
            </div>

            {servicesData.map(service => (
                <div className={`${styles.detailsWrapper} ${service.id === activeServiceId ? '' : 'sr-only'}`} key={service.id}>
                    <div className={styles.detailsImage}>
                        <Image src={process.env.NEXT_PUBLIC_SRTAPI_URL + service.image.url} alt={service.title} width={400} height={300} />
                    </div>
                    <div className={styles.detailsContent}>
                        <h3 className={styles.detailsTitle}>{service.title}</h3>
                    <p className={styles.detailsDescription}>
                        {service.description}
                    </p>
                        <QuoteButton modalName="BookNow">Book Now</QuoteButton>
                    </div>
                </div>
            ))}
        </>
    )
}