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

    // Instant Hash Scroll Fix to prevent layout/scroll jumping on mount
    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const style = document.createElement('style');
            style.id = 'temp-disable-smooth-scroll';
            style.innerHTML = 'html { scroll-behavior: auto !important; }';
            document.head.appendChild(style);

            const handleHashScroll = () => {
                const element = document.getElementById(hash.substring(1));
                if (element) {
                    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                    window.scrollTo({
                        top: elementPosition - 80,
                        behavior: 'auto'
                    });
                }
            };

            handleHashScroll();
            // Run again after a short delay for image/content layout stabilization
            const timer = setTimeout(() => {
                handleHashScroll();
                if (style.parentNode) style.parentNode.removeChild(style);
            }, 150);

            return () => {
                clearTimeout(timer);
                if (style.parentNode) style.parentNode.removeChild(style);
            };
        }
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
