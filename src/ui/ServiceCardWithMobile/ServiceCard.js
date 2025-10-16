'use client'

import styles from "./ServiceCard.module.css";
import SendIcon from "@/assets/icons/send.svg"
import QuoteButton from "@/ui/QuoteButton/QuoteButton";
import ImageWrapper from "@/ui/ImageWrapper/ImgaeWrapper";
import { useState } from "react";
import InfoCircle from '@/assets/icons/InfoCircle.svg'
import InfoCircleActive from '@/assets/icons/InfoCircleActive.svg'

export default function ServiceCard({ image, title, description, buttonText, modalName, price }) {
  const [isInfoShow, setIsInfoShow] = useState(false)
    function handleInfoClick(e) {
    e.preventDefault()
    e.stopPropagation()
    setIsInfoShow(!isInfoShow)
  }
  return (
    <div className={`${styles.serviceCard} ${isInfoShow ? styles.isShowInfo : ''}`}>
        {/* <SendIcon className={styles.sendIcon} width="16" height="16"/> */}
        <div className={styles.imageContainer}>
          <ImageWrapper media={image}/>
        </div>
        
        <div className={styles.textWrapper}>
          <h3 className={styles.title}>{title}</h3>
          <span className={styles.description}>{description}</span>
        </div>
        <QuoteButton className={styles.hiddenButton} variant="primary" size="small" modalName={modalName || "BestQuote"}>
            {buttonText}
        </QuoteButton>
        <QuoteButton className={styles.invisibleButton} modalName={modalName || "BestQuote"} />
        {description && (
          isInfoShow ?
            <InfoCircleActive onClick={handleInfoClick} className={styles.info}/> :
            <InfoCircle onClick={handleInfoClick} className={styles.info}/>
        )}
        {price && <span className={styles.price}>$59</span>}
    </div>
  );
} 