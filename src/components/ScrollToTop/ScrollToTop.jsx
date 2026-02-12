"use client"

import React, { useState, useEffect } from 'react';
import styles from './ScrollToTop.module.css';
import ChevronIcon from '@/assets/icons/chevron.svg';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 400) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    return (
        <button
            className={`${styles.scrollToTop} ${isVisible ? styles.visible : ''}`}
            onClick={scrollToTop}
            aria-label="Back to top"
        >
            <ChevronIcon className={styles.icon} />
        </button>
    );
};

export default ScrollToTop;
