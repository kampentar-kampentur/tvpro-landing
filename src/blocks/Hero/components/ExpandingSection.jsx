"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import styles from "./ExpandingSection.module.css";

export default function ExpandingSection({
    children,
    minWidth = 1180,
    aspectRatio = 16 / 9,
    className = "",
}) {
    const containerRef = useRef(null);
    const [scrollYProgress, setScrollYProgress] = useState(0);
    const [viewportWidth, setViewportWidth] = useState(0);
    const [isLowPerformance, setIsLowPerformance] = useState(false);
    const animationFrameId = useRef(null);
    const lastUpdateTime = useRef(0);
    const [isClient, setIsClient] = useState(false);

    // Intersection Observer
    const [isVisible] = useIntersectionObserver(containerRef, {
        threshold: 0.1,
        rootMargin: "100px",
    });

    useEffect(() => {
        setIsClient(true);
        const checkPerformance = () => {
            const hardwareConcurrency = navigator.hardwareConcurrency || 1;
            const memory = navigator.deviceMemory || 1;
            const connection = navigator.connection;
            const isSlowDevice = hardwareConcurrency <= 2 || memory <= 2;
            const isSlowConnection = connection && (
                connection.effectiveType === 'slow-2g' ||
                connection.effectiveType === '2g' ||
                connection.effectiveType === '3g'
            );
            setIsLowPerformance(isSlowDevice || isSlowConnection);
        };
        checkPerformance();
    }, []);

    const handleResize = useCallback(() => {
        if (typeof window !== "undefined") {
            setViewportWidth(window.innerWidth);
        }
    }, []);

    useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize, { passive: true });
        return () => window.removeEventListener("resize", handleResize);
    }, [handleResize]);

    const handleScroll = useCallback(() => {
        if (!containerRef.current || !isVisible) return;

        const now = performance.now();
        const throttleTime = isLowPerformance ? 32 : 16;

        if (now - lastUpdateTime.current < throttleTime) return;

        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);

        animationFrameId.current = requestAnimationFrame(() => {
            const rect = containerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const elementCenter = rect.top + rect.height / 2;
            const screenCenter = windowHeight / 2;
            const distanceFromCenter = Math.abs(elementCenter - screenCenter);
            const maxDistance = windowHeight / 2;

            let calculatedProgress = 1 - Math.min(distanceFromCenter / maxDistance, 1);
            calculatedProgress = Math.max(0, Math.min(1, calculatedProgress));

            let newProgress = elementCenter <= screenCenter ? 1 : calculatedProgress;

            const finalProgress = isLowPerformance ?
                newProgress :
                newProgress * newProgress * (3 - 2 * newProgress);

            setScrollYProgress(finalProgress);
            lastUpdateTime.current = now;
        });
    }, [isVisible, isLowPerformance]);

    useEffect(() => {
        if (!isVisible) return;
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, [handleScroll, isVisible]);

    const dimensions = useMemo(() => {
        // Before hydration: use CSS defaults (width: 100%, aspect-ratio: 16/9)
        if (!isClient) return { width: null, borderRadius: 16 };

        const availableWidth = viewportWidth;

        let baseWidth, maxWidth;
        if (viewportWidth < 768) {
            // On mobile: always full width, no expanding animation
            return { width: null, borderRadius: 0 };
        } else if (viewportWidth < 1200) {
            baseWidth = availableWidth;
            maxWidth = availableWidth;
        } else {
            baseWidth = minWidth;
            maxWidth = availableWidth;
        }

        const currentWidth = baseWidth + (maxWidth - baseWidth) * scrollYProgress;
        const borderRadius = 16 * (1 - scrollYProgress);

        return {
            width: Math.round(currentWidth),
            borderRadius: Math.round(borderRadius)
        };
    }, [isClient, viewportWidth, minWidth, scrollYProgress]);

    const containerStyle = {
        width: dimensions.width ? `${dimensions.width}px` : undefined,
        maxWidth: isClient ? 'none' : undefined,
        borderRadius: dimensions.borderRadius != null ? `${dimensions.borderRadius}px` : undefined,
        transition: viewportWidth < 768 ? 'none' : 'width 0.1s ease-out, border-radius 0.1s ease-out'
    };

    return (
        <section ref={containerRef} className={`${styles.expandingWrapper} ${className}`}>
            <div className={styles.expandingContainer} style={containerStyle}>
                {children}
            </div>
        </section>
    );
}
