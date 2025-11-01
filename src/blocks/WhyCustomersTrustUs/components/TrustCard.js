'use client'

import styles from "./TrustCard.module.css";
import ImageWrapper from "@/ui/ImageWrapper/ImgaeWrapper";
import { useState } from "react";
import InfoCircle from '@/assets/icons/InfoCircle.svg'
import InfoCircleActive from '@/assets/icons/InfoCircleActive.svg'

const TrustCard = ({ image, title, description }) => {
  const [isInfoShow, setIsInfoShow] = useState(false)
  function handleInfoClick(e) {
    e.preventDefault()
    e.stopPropagation()
    setIsInfoShow(!isInfoShow)
  }
  return (
    <div className={`${styles.trustCard} ${isInfoShow ? styles.isShowInfo : ''}`}>
      <div className={styles.iconContainer}>
        <ImageWrapper media={image} />
      </div>
      <div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        {description && (
          isInfoShow ?
            <InfoCircleActive onClick={handleInfoClick} className={styles.info}/> :
            <InfoCircle onClick={handleInfoClick} className={styles.info}/>
        )}
      </div>
    </div>
  );
};

export default TrustCard; 