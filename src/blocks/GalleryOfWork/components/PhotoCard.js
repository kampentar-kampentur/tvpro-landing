"use client"
import styles from "./PhotoCard.module.css";
import ImageWrapper from "@/ui/ImageWrapper/ImageWrapper";
import { useInView } from "@/hooks/useInView";

// SVG Play иконка
const PlayIcon = (props) => (
  <svg viewBox="0 0 48 48" width={48} height={48} fill="none" {...props}>
    <circle cx="24" cy="24" r="24" fill="rgba(0,0,0,0.5)" />
    <polygon points="19,16 36,24 19,32" fill="#fff" />
  </svg>
);

const PhotoCard = ({ image, videoUrl, video, className, currentIndex, onClick }) => {
  const [ref, isInView] = useInView();
  const isVideo = Boolean(videoUrl || video);

  return (
    <div
      ref={ref}
      className={`${styles.photoCard} ${className} ${isInView ? styles.reveal : ""}`}
      style={{ "--reveal-delay": `${(currentIndex % 4) * 0.1}s` }}
      tabIndex={0}
      role="button"
      onClick={onClick}
    >
      {image && <ImageWrapper
        media={image}
        className={styles.image}
        defaultAlt="TV Installation Project"
        width={375}
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 375px"
      />}
      {isVideo && (
        <span className={styles.playIconWrap}>
          <PlayIcon />
        </span>
      )}
    </div>
  );
};

export default PhotoCard;