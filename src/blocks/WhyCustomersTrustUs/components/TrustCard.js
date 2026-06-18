'use client'

import styles from "./TrustCard.module.css";
import ImageWrapper from "@/ui/ImageWrapper/ImageWrapper";
import { useState, useRef, useEffect } from "react";
import InfoCircle from '@/assets/icons/InfoCircle.svg'
import InfoCircleActive from '@/assets/icons/InfoCircleActive.svg'
import Text from "@/ui/Text/Text";

const TrustCard = ({ image, title, description, cityContext }) => {
  const [isInfoShow, setIsInfoShow] = useState(false)
  const cardRef = useRef(null)

  function handleInfoClick(e) {
    e.preventDefault()
    e.stopPropagation()
    setIsInfoShow(!isInfoShow)
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (cardRef.current && !cardRef.current.contains(event.target) && isInfoShow) {
        setIsInfoShow(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isInfoShow])

  return (
    <div ref={cardRef} className={`${styles.trustCard} ${isInfoShow ? styles.isShowInfo : ''}`}>
      <div className={styles.iconContainer}>
        <ImageWrapper
          media={image}
          defaultAlt={title}
          preferFormat="thumbnail"
          sizes="48px"
        />
      </div>
      <div>
        <h3 className={styles.title}><Text text={title} cityContext={cityContext} /></h3>
        <p className={styles.description}><Text text={description} cityContext={cityContext} /></p>
        {description && (
          isInfoShow ?
            <InfoCircleActive onClick={handleInfoClick} className={styles.info} /> :
            <InfoCircle onClick={handleInfoClick} className={styles.info} />
        )}
      </div>
    </div>
  );
};

export default TrustCard; 