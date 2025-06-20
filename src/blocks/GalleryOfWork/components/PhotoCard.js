"use client"
import styles from "./PhotoCard.module.css";
import Image from "next/image";

const PhotoCard = ({ src, alt, className }) => {
  return (
    <div className={`${styles.photoCard} ${className}`}>
      <Image src={src} alt={alt} width={300} height={400} className={styles.image}/>
    </div>
  );
};

export default PhotoCard; 