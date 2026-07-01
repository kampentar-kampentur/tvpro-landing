"use client";

import React, { useRef, useState, useEffect } from "react";
import styles from "./ScrollSnapSlider.module.css";

export default function ScrollSnapSlider({ children, className, dotsPosition = "top" }) {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [childCount, setChildCount] = useState(0);
  const [isOverflowing, setIsOverflowing] = useState(false);

  // Sync count of children
  useEffect(() => {
    if (containerRef.current) {
      setChildCount(containerRef.current.children.length);
    }
  }, [children]);

  // Monitor overflow (to hide dots on desktop where the grid fits on one screen)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const checkOverflow = () => {
      setIsOverflowing(container.scrollWidth > container.clientWidth);
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [children, childCount]);

  // Track scrolling to update active dot
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isOverflowing) return;

    const handleScroll = () => {
      const childrenElements = Array.from(container.children);
      if (childrenElements.length === 0) return;

      const containerRect = container.getBoundingClientRect();
      let closestIndex = 0;
      let minDistance = Infinity;

      childrenElements.forEach((child, index) => {
        const childRect = child.getBoundingClientRect();
        // Calculate horizontal distance between the left edge of the child and the left edge of the container
        const distance = Math.abs(childRect.left - containerRect.left);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    // Run initial detection
    handleScroll();

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [isOverflowing, childCount]);

  const handleDotClick = (index) => {
    const container = containerRef.current;
    if (!container || !container.children[index]) return;

    const targetElement = container.children[index];
    
    // Calculate scroll target offset
    const containerScrollLeft = container.scrollLeft;
    const containerLeft = container.getBoundingClientRect().left;
    const targetLeft = targetElement.getBoundingClientRect().left;
    
    container.scrollTo({
      left: containerScrollLeft + (targetLeft - containerLeft),
      behavior: "smooth"
    });
    
    setActiveIndex(index);
  };

  const showDots = isOverflowing && childCount > 1;

  return (
    <div className={styles.sliderWrapper}>
      {showDots && dotsPosition === "top" && (
        <div className={styles.dotsContainer}>
          {Array.from({ length: childCount }).map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`${styles.dot} ${index === activeIndex ? styles.active : ""}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      <div ref={containerRef} className={className}>
        {children}
      </div>

      {showDots && dotsPosition === "bottom" && (
        <div className={styles.dotsContainer}>
          {Array.from({ length: childCount }).map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`${styles.dot} ${index === activeIndex ? styles.active : ""}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
