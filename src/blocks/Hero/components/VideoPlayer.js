"use client"

import { useEffect, useRef, useState } from "react";
import styles from "./VideoPlayer.module.css";
import posterImage from "@/assets/videoplaceholder.png";


export default function SmoothScrollResizeVideo() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [scrollYProgress, setScrollYProgress] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setViewportWidth(window.innerWidth);
    }

    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementCenter = rect.top + rect.height / 2;
      const screenCenter = window.innerHeight / 2;
      const distanceFromCenter = Math.abs(elementCenter - screenCenter);

      const maxDistance = windowHeight / 2; // граница, после которой scale = min

      let calculatedProgress = 1 - Math.min(distanceFromCenter / maxDistance, 1);

      const currentWindowScrollY = window.scrollY;
      const isScrollingDown = currentWindowScrollY > lastScrollY.current;

      let newProgress;

      if (isScrollingDown) {
        if (elementCenter <= screenCenter) {
          newProgress = 1;
        } else {
          newProgress = calculatedProgress;
        }
      } else {
        newProgress = calculatedProgress;
      }

      setScrollYProgress(newProgress);
      lastScrollY.current = currentWindowScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const minWidth = 1180;
  const maxWidth = viewportWidth;
  const currentWidth = minWidth + (maxWidth - minWidth) * scrollYProgress;

  return (
    <div
      ref={containerRef}
      className={styles.videoWrapper}
    >
      <video
        ref={videoRef}
        src="/video.mp4"
        poster={posterImage.src}
        autoPlay
        loop
        muted
        className={styles.video}
        style={{
          width: `${currentWidth}px`,
          borderRadius: `${16 - scrollYProgress * 16}px`
        }}
      />
    </div>
  );
}
