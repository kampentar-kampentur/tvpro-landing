"use client"
import { useState, useEffect, useRef } from "react";
import FilterButtons from "./FilterButtons";
import PhotoGrid from "./PhotoGrid";
import styles from "../GalleryOfWork.module.css";

export default function GalleryGrid({ filters }) {
  const [activeFilter, setActiveFilter] = useState(filters?.[0]?.type || "");
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [gridKey, setGridKey] = useState(`${activeFilter}-${Date.now()}`);
  const [containerHeight, setContainerHeight] = useState('auto');

  const containerRef = useRef(null);
  const cacheRef = useRef({});
  const timerRef = useRef(null);
  const transitionTimeoutRef = useRef(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const currentIndex = filters.findIndex((f) => f.type === activeFilter);
      const nextIndex = (currentIndex + 1) % filters.length;
      handleFilterChange(filters[nextIndex].type);
    }, 12000);
  };

  useEffect(() => {
    if (isAutoPlaying && filters?.length > 1) {
      startTimer();
    }
    return () => clearInterval(timerRef.current);
  }, [isAutoPlaying, filters, activeFilter]);

  const handleFilterChange = (filter, isManual = false) => {
    if (filter === activeFilter && !isTransitioning) return;

    if (timerRef.current) clearInterval(timerRef.current);

    setActiveFilter(filter);

    if (isManual) {
      setIsAutoPlaying(false);
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = setTimeout(() => setIsAutoPlaying(true), 45000);
    }
  };

  useEffect(() => {
    if (!activeFilter) return;

    const performUpdate = async () => {
      // 1. Capture and freeze current height
      if (containerRef.current) {
        setContainerHeight(`${containerRef.current.offsetHeight}px`);
      }

      // 2. Fade Out
      setIsTransitioning(true);

      // Wait for fade out to complete
      await new Promise(resolve => setTimeout(resolve, 400));

      // 3. Clear data and force remount
      setGalleryPhotos([]);
      setGridKey(`switching-${Date.now()}`);

      // 4. Load Data
      let nextData = [];
      if (cacheRef.current[activeFilter]) {
        nextData = cacheRef.current[activeFilter];
        await new Promise(resolve => setTimeout(resolve, 300));
      } else {
        setLoading(true);
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/galler-photos?populate=*&filters[type]=${encodeURIComponent(activeFilter)}`
          );
          const json = await res.json();
          nextData = json.data || [];
          cacheRef.current[activeFilter] = nextData;
        } catch (error) {
          console.error("Gallery fetch error:", error);
        } finally {
          setLoading(false);
        }
      }

      // 5. Apply Data
      setGalleryPhotos(nextData);
      setGridKey(`${activeFilter}-${Date.now()}`);

      // 6. Fade In
      // Tiny delay to ensure React commits the new data before fading in
      setTimeout(() => {
        setIsTransitioning(false);

        // 7. Unfreeze height after animation completes
        setTimeout(() => {
          setContainerHeight('auto');
        }, 500);
      }, 50);
    };

    performUpdate();
  }, [activeFilter]);

  return (
    <>
      <FilterButtons
        filters={filters}
        activeFilter={activeFilter}
        onChange={(filter) => handleFilterChange(filter, true)}
      />
      <div
        ref={containerRef}
        className={`${styles.gridContainer} ${isTransitioning ? styles.fadeOut : styles.fadeIn}`}
        style={{ minHeight: containerHeight }}
      >
        <PhotoGrid key={gridKey} images={galleryPhotos} />
      </div>
    </>
  );
}