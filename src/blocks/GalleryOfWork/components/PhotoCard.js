"use client"
import { useState } from "react";
import styles from "./PhotoCard.module.css";
import ImageWrapper from "@/ui/ImageWrapper/ImgaeWrapper";
import Modal from "@/ui/Modal/Modal";

// SVG Play иконка
const PlayIcon = (props) => (
  <svg viewBox="0 0 48 48" width={48} height={48} fill="none" {...props}>
    <circle cx="24" cy="24" r="24" fill="rgba(0,0,0,0.5)"/>
    <polygon points="19,16 36,24 19,32" fill="#fff" />
  </svg>
);

const PhotoCard = ({ image, videoUrl, video, className }) => {
  const [open, setOpen] = useState(false);
  const isVideo = Boolean(videoUrl || video);
  const videoSrc = videoUrl || (video && video.url);

  return (
    <>
      <div
        className={`${styles.photoCard} ${className}`}
        tabIndex={0}
        role="button"
        onClick={() => setOpen(true)}
      >
        {image && <ImageWrapper media={image} className={styles.image} />}
        {isVideo && (
          <span className={styles.playIconWrap}>
            <PlayIcon />
          </span>
        )}
      </div>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <div className={styles.modalMediaContainer}>
          {isVideo ? (
            <video src={videoSrc} controls autoPlay className={styles.modalVideo} />
          ) : (
            image && <ImageWrapper media={image} className={styles.modalImage} />
          )}
        </div>
      </Modal>
    </>
  );
};

export default PhotoCard; 