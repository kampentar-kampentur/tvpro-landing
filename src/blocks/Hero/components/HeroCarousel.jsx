"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import styles from "./HeroCarousel.module.css";
import ChevronIcon from "@/assets/icons/chevron.svg";
import VideoSlide from "./VideoSlide";

const DefaultBanner = ({ data }) => (
    <div style={{ padding: '40px', background: '#333', color: '#fff', textAlign: 'center' }}>
        <h3>{data?.title || 'Slide'}</h3>
        <p>{data?.text || ''}</p>
    </div>
);

const SLIDE_COMPONENTS = {
    video: VideoSlide,
    banner: DefaultBanner
};

export default function HeroCarousel({ slides = [], autoPlay = true, interval = 5000 }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const timerRef = useRef(null);

    const nextSlide = useCallback(() => {
        if (slides.length === 0) return;
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    const prevSlide = useCallback(() => {
        if (slides.length === 0) return;
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }, [slides.length]);

    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const handleTouchStart = (e) => {
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        const diff = touchStartX.current - touchEndX.current;
        if (diff > 50) {
            nextSlide();
        } else if (diff < -50) {
            prevSlide();
        }
    };

    useEffect(() => {
        if (autoPlay && !isHovered && slides[currentSlide]?.type !== 'video') {
            timerRef.current = setInterval(nextSlide, interval);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [autoPlay, isHovered, currentSlide, slides, interval, nextSlide]);

    const handleVideoEnd = () => {
        nextSlide();
    };

    if (!slides || slides.length === 0) return null;

    return (
        <div
            className={styles.carousel}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div
                className={styles.slidesContainer}
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                {slides.map((slide, index) => {
                    const Component = slide.component || SLIDE_COMPONENTS[slide.type] || SLIDE_COMPONENTS.banner;
                    return (
                        <div key={index} className={styles.slide}>
                            <Component
                                isActive={index === currentSlide}
                                onEnd={handleVideoEnd}
                                data={slide.data}
                            />
                        </div>
                    );
                })}
            </div>

            {slides.length > 1 && (
                <>
                    <button
                        className={`${styles.navButton} ${styles.prev} ${isHovered ? styles.visible : ''}`}
                        onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                        aria-label="Previous slide"
                    >
                        <ChevronIcon className={styles.iconPrev} />
                    </button>
                    <button
                        className={`${styles.navButton} ${styles.next} ${isHovered ? styles.visible : ''}`}
                        onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                        aria-label="Next slide"
                    >
                        <ChevronIcon className={styles.iconNext} />
                    </button>

                    <div className={styles.dots}>
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                className={`${styles.dot} ${index === currentSlide ? styles.active : ''}`}
                                onClick={(e) => { e.stopPropagation(); setCurrentSlide(index); }}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
