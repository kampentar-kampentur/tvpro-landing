"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import styles from "./VideoPlayer.module.css";

export default function OptimizedVideoPlayer({
  poster = "videoplaceholder-400.webp",
  alt = "Interactive video content",
  title = "Video Player",
  minWidth = 1180,
  aspectRatio = 16 / 9,
  preload = "metadata",
  className = "",
  ...props
}) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [scrollYProgress, setScrollYProgress] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const lastScrollY = useRef(0);
  const animationFrameId = useRef(null);
  const lastUpdateTime = useRef(0);
  const [isClient, setIsClient] = useState(false);

  // Intersection Observer for performance optimization
  const [isVisible] = useIntersectionObserver(containerRef, {
    threshold: 0.1,
    rootMargin: "100px",
  });

  // Detect low performance devices
  useEffect(() => {
    const checkPerformance = () => {
      const hardwareConcurrency = navigator.hardwareConcurrency || 1;
      const memory = navigator.deviceMemory || 1;
      const connection = navigator.connection;
      
      // Low performance indicators
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

  // Optimized resize handler with debouncing
  const handleResize = useCallback(() => {
    if (typeof window !== "undefined") {
      setViewportWidth(window.innerWidth);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setViewportWidth(window.innerWidth);
    }

    let resizeTimeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 100);
    };

    window.addEventListener("resize", debouncedResize, { passive: true });
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(resizeTimeout);
    };
  }, [handleResize]);

  // Smart scroll handler with adaptive performance
  const handleScroll = useCallback(() => {
    if (!containerRef.current || !isVisible) return;

    const now = performance.now();
    const timeSinceLastUpdate = now - lastUpdateTime.current;
    
    // Adaptive throttling based on device performance
    const throttleTime = isLowPerformance ? 32 : 16; // 30fps vs 60fps
    
    if (timeSinceLastUpdate < throttleTime) return;

    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    animationFrameId.current = requestAnimationFrame(() => {
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementCenter = rect.top + rect.height / 2;
      const screenCenter = windowHeight / 2;
      const distanceFromCenter = Math.abs(elementCenter - screenCenter);
      const maxDistance = windowHeight / 2;

      let calculatedProgress = 1 - Math.min(distanceFromCenter / maxDistance, 1);
      calculatedProgress = Math.max(0, Math.min(1, calculatedProgress));
      
      const currentWindowScrollY = window.scrollY;

      let newProgress;
      newProgress = elementCenter <= screenCenter ? 1 : calculatedProgress;

      // Apply easing only on high-performance devices
      const finalProgress = isLowPerformance ? 
        newProgress : 
        newProgress * newProgress * (3 - 2 * newProgress);
      
      setScrollYProgress(finalProgress);
      lastScrollY.current = currentWindowScrollY;
      lastUpdateTime.current = now;
    });
  }, [isVisible, isLowPerformance]);

  useEffect(() => {
    if (!isVisible) return;

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [handleScroll, isVisible]);

  useEffect(() => {
    if(isVisible && videoRef.current.paused) {
      
      videoRef.current.play()
    }
  }, [isVisible])

  // Video event handlers
  const handleVideoLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
  }, []);

  const handleVideoError = useCallback((e) => {
    console.error("Video loading error:", e);
    setHasError(true);
    setIsLoaded(false);
  }, []);

  const handleVideoPlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handleVideoPause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  // Keyboard accessibility
  const handleKeyDown = useCallback((e) => {
    if (!videoRef.current) return;
    
    switch (e.key) {
      case " ":
      case "k":
        e.preventDefault();
        if (videoRef.current.paused) {
          videoRef.current.play();
        } else {
          videoRef.current.pause();
        }
        break;
      case "m":
        e.preventDefault();
        videoRef.current.muted = !videoRef.current.muted;
        break;
      default:
        break;
    }
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate responsive dimensions
  let currentWidth = minWidth;
  let currentHeight = minWidth / aspectRatio;
  if (isClient) {
    const padding = 20;
    const adaptiveMinWidth = viewportWidth < minWidth ? Math.max(0, viewportWidth - padding) : minWidth;
    const maxWidth = viewportWidth;
    currentWidth = Math.max(
      adaptiveMinWidth,
      adaptiveMinWidth + (maxWidth - adaptiveMinWidth) * scrollYProgress
    );
    currentHeight = currentWidth / aspectRatio;
  }

  const videoStyle = {
    width: `${currentWidth}px`,
    height: `${currentHeight}px`,
    borderRadius: `${16 - scrollYProgress * 16}px`,
    transform: `translateZ(0)`, // Hardware acceleration
  };

  function getBestVideoSrc() {
    if (typeof navigator !== 'undefined' && navigator.connection) {
      const { effectiveType, downlink } = navigator.connection;
      if (effectiveType === '4g' && downlink > 3) return '/optimized/mainVideo2-720p.mp4';
      if (effectiveType === '3g' || downlink > 1.2) return '/optimized/mainVideo2-480p.mp4';
      return '/optimized/mainVideo2-360p.mp4';
    }
    return '/optimized/mainVideo2-480p.mp4'; // fallback
  }

  const [videoSrc, setVideoSrc] = useState(getBestVideoSrc());

  useEffect(() => {
    setVideoSrc(getBestVideoSrc());
  }, []);

  if (!isClient) {
    return (
      <div
        className={`${styles.videoWrapper} ${className}`}
        style={{ width: `${minWidth}px`, aspectRatio: aspectRatio }}
      />
    );
  }

  if (hasError) {
    return (
      <div className={`${styles.videoWrapper} ${styles.errorState} ${className}`}>
        <div className={styles.errorMessage} role="alert">
          <p>Unable to load video content</p>
          <button 
            onClick={() => {
              setHasError(false);
              videoRef.current?.load();
            }}
            className={styles.retryButton}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <section
      ref={containerRef}
      className={`${styles.videoWrapper} ${className}`}
      role="region"
      aria-label="Interactive video player"
    >
      <div className={styles.videoContainer} style={videoStyle}>
        {!isLoaded && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/videoplaceholder-800.webp"
            srcSet="
              /videoplaceholder-400.webp 400w,
              /videoplaceholder-800.webp 800w,
              /videoplaceholder-1180.webp 1180w
            "
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
            alt="Video preview"
            style={{
              objectFit: 'cover',
              zIndex: 2,
              borderRadius: "inherit",
              transition: "opacity 0.3s",
              width: "100%",
              height: "auto"
            }}
            fetchpriority="high"
          />
        )}
        <video
          ref={videoRef}
          src={videoSrc}
          poster={poster}
          autoPlay
          loop
          muted
          preload={preload}
          playsInline
          className={`${styles.video} ${isLoaded ? styles.loaded : ""}`}
          style={{ width: "100%", height: "100%", borderRadius: "inherit" }}
          onLoadedData={handleVideoLoad}
          onError={handleVideoError}
          onPlay={handleVideoPlay}
          onPause={handleVideoPause}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          aria-label={alt}
          title={title}
          fetchpriority="high"
          {...props}
        >
          <source src={videoSrc} type="video/mp4" />
          <p>
            Your browser doesn&apos;t support HTML5 video. 
            <a href={videoSrc} download>Download the video</a> instead.
          </p>
        </video>
      </div>

      {/* Screen reader friendly play/pause indicator */}
      <div className={styles.srOnly} aria-live="polite" aria-atomic="true">
        {isPlaying ? "Video is playing" : "Video is paused"}
      </div>
    </section>
  );
}