"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import FilterButtons from "./FilterButtons";
import PhotoGrid from "./PhotoGrid";
import styles from "../GalleryOfWork.module.css";
import Modal from "@/ui/Modal/Modal";
import ImageWrapper from "@/ui/ImageWrapper/ImageWrapper";
import modalStyles from "./PhotoCard.module.css";

// SVG Arrow Left иконка
const ArrowLeftIcon = (props) => (
  <svg viewBox="0 0 24 24" width={24} height={24} fill="none" {...props}>
    <path
      d="M15 18l-6-6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// SVG Arrow Right иконка
const ArrowRightIcon = (props) => (
  <svg viewBox="0 0 24 24" width={24} height={24} fill="none" {...props}>
    <path
      d="M9 18l6-6-6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const sortPhotos = (photos) => {
  if (!photos) return [];
  return [...photos].sort((a, b) => {
    const orderA =
      a.order !== null && a.order !== undefined ? a.order : Infinity;
    const orderB =
      b.order !== null && b.order !== undefined ? b.order : Infinity;

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    return new Date(b.createdAt) - new Date(a.createdAt);
  });
};

export default function GalleryGrid({ filters, initialPhotos = [] }) {
  const [activeFilter, setActiveFilter] = useState(filters?.[0]?.type || "");
  const [galleryPhotos, setGalleryPhotos] = useState(() => {
    const defaultFilter = filters?.[0]?.type || "";
    if (initialPhotos && initialPhotos.length > 0) {
      const filtered = initialPhotos.filter(
        (photo) => photo.type === defaultFilter,
      );
      return sortPhotos(filtered);
    }
    return [];
  });
  const [loading, setLoading] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [gridKey, setGridKey] = useState(`${activeFilter}-${Date.now()}`);
  const [containerHeight, setContainerHeight] = useState("auto");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [modalImages, setModalImages] = useState([]);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const containerRef = useRef(null);
  const cacheRef = useRef({});
  const timerRef = useRef(null);
  const transitionTimeoutRef = useRef(null);
  const isFirstMount = useRef(true);

  // Pre-populate cache with initialPhotos on first render
  if (
    Object.keys(cacheRef.current).length === 0 &&
    initialPhotos &&
    initialPhotos.length > 0
  ) {
    initialPhotos.forEach((photo) => {
      const type = photo.type;
      if (type) {
        if (!cacheRef.current[type]) {
          cacheRef.current[type] = [];
        }
        cacheRef.current[type].push(photo);
      }
    });
    // Sort cached photos
    for (const key in cacheRef.current) {
      cacheRef.current[key] = sortPhotos(cacheRef.current[key]);
    }
  }

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const currentIndex = filters.findIndex((f) => f.type === activeFilter);
      const nextIndex = (currentIndex + 1) % filters.length;
      handleFilterChange(filters[nextIndex].type);
    }, 12000);
  }, [filters, activeFilter]);

  useEffect(() => {
    if (isAutoPlaying && filters?.length > 1) {
      startTimer();
    }
    return () => clearInterval(timerRef.current);
  }, [isAutoPlaying, filters, activeFilter, startTimer]);

  const handleFilterChange = (filter, isManual = false) => {
    if (filter === activeFilter && !isTransitioning) return;

    if (timerRef.current) clearInterval(timerRef.current);

    setActiveFilter(filter);

    if (isManual) {
      setIsAutoPlaying(false);
      if (transitionTimeoutRef.current)
        clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = setTimeout(
        () => setIsAutoPlaying(true),
        45000,
      );
    }
  };

  useEffect(() => {
    if (!activeFilter) return;

    // Skip the transition and fetch on the first mount if we already have initial photos
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    const performUpdate = async () => {
      // 1. Capture and freeze current height
      if (containerRef.current) {
        setContainerHeight(`${containerRef.current.offsetHeight}px`);
      }

      // 2. Fade Out
      setIsTransitioning(true);

      // Wait for fade out to complete
      await new Promise((resolve) => setTimeout(resolve, 400));

      // 3. Clear data and force remount
      setGalleryPhotos([]);
      setGridKey(`switching-${Date.now()}`);

      // 4. Load Data
      let nextData = [];
      if (cacheRef.current[activeFilter]) {
        nextData = cacheRef.current[activeFilter];
        await new Promise((resolve) => setTimeout(resolve, 300));
      } else {
        setLoading(true);
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_SRTAPI_URL}/api/galler-photos?populate=*&filters[type]=${encodeURIComponent(activeFilter)}&pagination[limit]=100`,
          );
          const json = await res.json();
          nextData = json.data || [];
          cacheRef.current[activeFilter] = sortPhotos(nextData);
        } catch (error) {
          console.error("Gallery fetch error:", error);
        } finally {
          setLoading(false);
        }
      }
      console.log("activeFilter", activeFilter);
      console.log("nextData", nextData);

      // 5. Apply Data
      setGalleryPhotos(sortPhotos(nextData));
      setGridKey(`${activeFilter}-${Date.now()}`);

      // Measure new height and trigger transition
      setTimeout(() => {
        if (containerRef.current) {
          const prevMinHeight = containerRef.current.style.minHeight;
          containerRef.current.style.minHeight = "0px";
          const newHeight = containerRef.current.scrollHeight;
          containerRef.current.style.minHeight = prevMinHeight;
          setContainerHeight(`${newHeight}px`);
        }
      }, 50);

      // 6. Fade In
      setTimeout(() => {
        setIsTransitioning(false);

        // 7. Unfreeze height after animation completes
        setTimeout(() => {
          setContainerHeight("auto");
        }, 500);
      }, 100);
    };

    performUpdate();
  }, [activeFilter]);

  // Modal Handlers
  const handleOpenModal = (index, currentImages, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setModalImages(currentImages);
    setModalIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIsModalOpen(false);
  };

  const photoItems = modalImages
    ? modalImages.filter((item) => item.image)
    : [];

  const handleNext = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    const currentPhotoIndex = photoItems.findIndex(
      (item) => item === modalImages[modalIndex],
    );
    const nextPhotoIndex = (currentPhotoIndex + 1) % photoItems.length;
    const nextItemIndex = modalImages.indexOf(photoItems[nextPhotoIndex]);
    setModalIndex(nextItemIndex);
  };

  const handlePrev = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    const currentPhotoIndex = photoItems.findIndex(
      (item) => item === modalImages[modalIndex],
    );
    const prevPhotoIndex =
      (currentPhotoIndex - 1 + photoItems.length) % photoItems.length;
    const prevItemIndex = modalImages.indexOf(photoItems[prevPhotoIndex]);
    setModalIndex(prevItemIndex);
  };

  // Swipe logic
  const minSwipeDistance = 50;
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = (e) => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) handleNext(e);
    if (distance < -minSwipeDistance) handlePrev(e);
  };

  const currentItem = modalImages[modalIndex];
  const currentIsVideo = currentItem
    ? Boolean(currentItem.videoUrl || currentItem.video)
    : false;
  const currentVideoSrc = currentItem
    ? currentItem.videoUrl || (currentItem.video && currentItem.video.url)
    : null;
  console.log("galleryPhotos", galleryPhotos);
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
        <PhotoGrid
          key={gridKey}
          images={galleryPhotos}
          onPhotoClick={handleOpenModal}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className={modalStyles.modalContainer}>
          <button className={modalStyles.arrowLeft} onClick={handlePrev}>
            <ArrowLeftIcon />
          </button>
          <div
            className={modalStyles.modalMediaContainer}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {currentItem && currentItem.image ? (
              <ImageWrapper
                media={currentItem.image}
                className={modalStyles.modalImage}
                defaultAlt="TV Installation Gallery Image"
                preferFormat="large"
              />
            ) : currentIsVideo ? (
              <video
                src={currentVideoSrc}
                className={modalStyles.modalVideo}
                controls
                muted
                playsInline
                autoPlay
              >
                <track kind="captions" src="" label="No captions" />
              </video>
            ) : null}
          </div>
          <button className={modalStyles.arrowRight} onClick={handleNext}>
            <ArrowRightIcon />
          </button>
        </div>
      </Modal>
    </>
  );
}
