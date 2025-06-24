"use client"
import styles from "./PhotoCard.module.css";
import Image from "next/image";
import ImageWrapper from "@/ui/ImageWrapper/ImgaeWrapper";

const PhotoCard = ({ image, className }) => {
  return (
    <div className={`${styles.photoCard} ${className}`}>
      {image && <ImageWrapper media={image} className={styles.image} />}
    </div>
  );
};

export default PhotoCard; 