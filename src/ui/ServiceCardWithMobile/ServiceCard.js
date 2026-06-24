'use client'

import styles from "./ServiceCard.module.css";
import SendIcon from "@/assets/icons/send.svg";
import QuoteButton from "@/ui/QuoteButton/QuoteButton";
import ImageWrapper from "@/ui/ImageWrapper/ImageWrapper";
import { useState } from "react";
import InfoCircle from '@/assets/icons/InfoCircle.svg';
import InfoCircleActive from '@/assets/icons/InfoCircleActive.svg';
import Text from "@/ui/Text/Text";
import { useModal } from "@/providers/ModalProvider";

export default function ServiceCard({ image, title, description, buttonText, modalName, price, cityContext }) {
  const [isInfoShow, setIsInfoShow] = useState(false)
  const { openModal } = useModal();
  function handleInfoClick(e) {
    e.preventDefault()
    e.stopPropagation()
    setIsInfoShow(!isInfoShow)
  }
  return (
    <div className={`${styles.serviceCard} ${isInfoShow ? styles.isShowInfo : ''}`}>
      {/* <SendIcon className={styles.sendIcon} width="16" height="16"/> */}
      <div className={styles.imageContainer}>
        <ImageWrapper media={image} defaultAlt={title} sizes="(max-width: 768px) 100px, 150px" />
      </div>

      <div className={styles.textWrapper}>
        <h3 className={styles.title}>
          <Text text={(title || '').split(" - ")[0]} cityContext={cityContext} />
        </h3>
        <span className={styles.description}>
          <Text text={description} cityContext={cityContext} />
        </span>
      </div>
      <QuoteButton className={styles.hiddenButton} variant="primary" size="small" modalName={modalName || "BestQuote"}>
        {buttonText}
      </QuoteButton>
      <button 
        className={styles.invisibleButton} 
        onClick={() => openModal(modalName || "BestQuote")}
        aria-label={`Book ${title}`}
      />
      {description && (
        isInfoShow ?
          <InfoCircleActive onClick={handleInfoClick} className={styles.info} /> :
          <InfoCircle onClick={handleInfoClick} className={styles.info} />
      )}
      {price && <span className={styles.price}>${price}</span>}
    </div>
  );
} 