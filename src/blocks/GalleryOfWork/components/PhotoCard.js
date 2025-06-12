import React from "react";
import styles from "./PhotoCard.module.css";
import Image from "next/image";

const PhotoCard = ({ src, alt, width = 335, height = 480 }) => {
  return (
    <div className={styles.photoCard} style={{width: width, height: height}}>
      <Image src={src} alt={alt} width={width} height={height} className={styles.image}/>
    </div>
  );
};

export default PhotoCard; 