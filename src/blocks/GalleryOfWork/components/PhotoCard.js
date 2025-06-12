import React from "react";
import styles from "./PhotoCard.module.css";
import StarIcon from "@/assets/icons/Star.svg";
import Image from "next/image";

const PhotoCard = ({ src, alt }) => {
  return (
    <div className={styles.photoCard}>
      <Image src={src} alt={alt} width={372} height={360} className={styles.image}/>
    </div>
  );
};

export default PhotoCard; 