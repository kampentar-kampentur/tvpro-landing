"use client"
import { useState } from "react";
import styles from "./CertificateCard.module.css";
import ImageWrapper from "@/ui/ImageWrapper/ImageWrapper";
import Modal from "@/ui/Modal/Modal";

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

const CertificateCard = ({ image, className, certificates, currentIndex }) => {
  const [open, setOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(currentIndex);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const handleOpen = () => {
    setModalIndex(currentIndex);
    setOpen(true);
  };

  const handleNext = () => {
    const nextIndex = (modalIndex + 1) % certificates.length;
    setModalIndex(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex = (modalIndex - 1 + certificates.length) % certificates.length;
    setModalIndex(prevIndex);
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

  const currentCertificate = certificates[modalIndex];

  return (
    <>
      <div
        className={`${styles.certificateCard} ${className}`}
        tabIndex={0}
        role="button"
        onClick={handleOpen}
      >
        {image && <ImageWrapper media={image} className={styles.image} defaultAlt="Professional Certification" />}
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
            {currentCertificate && <ImageWrapper media={currentCertificate} className={styles.modalImage} defaultAlt="Enlarged Certificate View" />}
          </div>
          <button className={styles.arrowRight} onClick={handleNext}>
            <ArrowRightIcon />
          </button>
        </div>
      </Modal>
    </>
  );
};

export default CertificateCard;