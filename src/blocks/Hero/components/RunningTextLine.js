'use client'

import React, { useState, useEffect, useRef } from "react";
import styles from "./RunningTextLine.module.css";

export default function RunningTextLine({ textLines: propTextLines }) {
  const marqueeContentRef = useRef(null);
  const animationFrameRef = useRef(null);
  const currentXRef = useRef(0);
  const firstContentSetWidthRef = useRef(0); // Stores the width of one full set of original content

  // Duplicate content enough times to ensure seamless loop
  // For safety, let's duplicate it 3 times.
  const duplicatedTextLines = [...propTextLines, ...propTextLines, ...propTextLines].map((line, i) => ({
    ...line,
    _id: `${line._id || `original-${i % propTextLines.length}`}-${i}-${Math.random()}`, // Unique key for each instance
  }));

  useEffect(() => {
    const measureContentWidth = () => {
      if (marqueeContentRef.current && propTextLines.length > 0) {
        let width = 0;
        // Measure the width of the first complete set of original content
        // We assume the first `propTextLines.length` children represent one full set.
        for (let i = 0; i < propTextLines.length; i++) {
          if (marqueeContentRef.current.children[i]) {
            width += marqueeContentRef.current.children[i].offsetWidth;
          }
        }
        firstContentSetWidthRef.current = width;
        // console.log("Measured firstContentSetWidth:", width); // Debugging
      }
    };

    // Initial measurement after render
    // Use requestAnimationFrame to ensure DOM is ready for measurement
    const initialMeasurementFrame = requestAnimationFrame(() => {
        measureContentWidth();
    });

    window.addEventListener('resize', measureContentWidth);

    const animate = () => {
      if (!marqueeContentRef.current || firstContentSetWidthRef.current === 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const speed = 0.5; // pixels per frame, adjustable for speed
      currentXRef.current -= speed;

      // If the content has scrolled past the width of one full set of original content,
      // reset its position to create the seamless loop.
      if (-currentXRef.current >= firstContentSetWidthRef.current) {
        currentXRef.current = 0; // Reset to 0
        // console.log("Resetting X to 0"); // Debugging
      }

      marqueeContentRef.current.style.transform = `translateX(${currentXRef.current}px)`;

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start the animation loop
    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup function
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (initialMeasurementFrame) {
          cancelAnimationFrame(initialMeasurementFrame);
      }
      window.removeEventListener('resize', measureContentWidth);
    };
  }, [propTextLines]); // Re-run effect if propTextLines changes

  return (
    <div className={styles.marquee}>
      <div className={styles.marqueeContent} ref={marqueeContentRef}>
        {duplicatedTextLines.map((line) => (
          <p key={line._id} className={styles.textLine}>
            <span className={styles.mainText}>{line.main}</span>
            { line.sub && 
              <>
                <span className={styles.separator}> — </span>
                <span className={styles.subText}>{line.sub}</span>
              </>
            }
          </p>
        ))}
      </div>
    </div>
  );
} 