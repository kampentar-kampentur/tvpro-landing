"use client"
import { useState } from "react";
import styles from "./PhotoCard.module.css";
import ImageWrapper from "@/ui/ImageWrapper/ImageWrapper";
import Modal from "@/ui/Modal/Modal";
import { useInView } from "@/hooks/useInView";

// SVG Play иконка
const PlayIcon = (props) => (
  <svg viewBox="0 0 48 48" width={48} height={48} fill="none" {...props}>
    <circle cx="24" cy="24" r="24" fill="rgba(0,0,0,0.5)" />
    <polygon points="19,16 36,24 19,32" fill="#fff" />
  </svg>
);
// SVG Arrow Left иконка
const ArrowLeftIcon = (props) => (
  <svg viewBox="0 0 24 24" width={24} height={24} fill="none" {...props}>
    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// SVG Arrow Right иконка
const ArrowRightIcon = (props) => (
  <svg viewBox="0 0 24 24" width={24} height={24} fill="none" {...props}>
    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PhotoCard = ({ image, videoUrl, video, className, images, currentIndex }) => {
  const [ref, isInView] = useInView();
  const [open, setOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(currentIndex);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Filter to only photos (items with image)
  const photos = images ? images.filter(item => item.image) : [];
  const currentPhotoIndex = photos.findIndex(item => item === images[currentIndex]);

  const isVideo = Boolean(videoUrl || video);
  const videoSrc = videoUrl || (video && video.url);

  const handleOpen = () => {
    setModalIndex(currentIndex);
    setOpen(true);
  };

  const handleNext = () => {
    const currentPhotoIndex = photos.findIndex(item => item === images[modalIndex]);
    const nextPhotoIndex = (currentPhotoIndex + 1) % photos.length;
    const nextItemIndex = images.indexOf(photos[nextPhotoIndex]);
    setModalIndex(nextItemIndex);
  };

  const handlePrev = () => {
    const currentPhotoIndex = photos.findIndex(item => item === images[modalIndex]);
    const prevPhotoIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
    const prevItemIndex = images.indexOf(photos[prevPhotoIndex]);
    setModalIndex(prevItemIndex);
  };

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null); // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrev();
    }
  };

  const currentItem = images[modalIndex];
  const currentIsVideo = Boolean(currentItem.videoUrl || currentItem.video);
  const currentVideoSrc = currentItem.videoUrl || (currentItem.video && currentItem.video.url);

  return (
    <>
      <div
        ref={ref}
        className={`${styles.photoCard} ${className} ${isInView ? styles.reveal : ""}`}
        style={{ "--reveal-delay": `${(currentIndex % 4) * 0.1}s` }}
        tabIndex={0}
        role="button"
        onClick={handleOpen}
      >
        {image && <ImageWrapper
          media={image}
          className={styles.image}
          defaultAlt="TV Installation Project"
          width={400}
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 400px"
        />}
        {isVideo && (
          <span className={styles.playIconWrap}>
            <PlayIcon />
          </span>
        )}
      </div>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <div className={styles.modalContainer}>
          <button className={styles.arrowLeft} onClick={handlePrev}>
            <ArrowLeftIcon />
          </button>
          <div
            className={styles.modalMediaContainer}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {currentItem.image ? (
              <ImageWrapper media={currentItem.image} className={styles.modalImage} defaultAlt="TV Installation Gallery Image" />
            ) : currentIsVideo ? (
              <video
                src={currentVideoSrc}
                className={styles.modalVideo}
                controls
                muted
                playsInline
                autoPlay
              >
                <track kind="captions" src="" label="No captions" />
              </video>
            ) : null}
          </div>
          <button className={styles.arrowRight} onClick={handleNext}>
            <ArrowRightIcon />
          </button>
        </div>
      </Modal>
    </>
  );
};

export default PhotoCard; 