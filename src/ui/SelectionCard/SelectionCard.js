import React from 'react';
import styles from './SelectionCard.module.css';
import CheckMark from '@/assets/icons/CheckmarkCircle.svg'
import InfoCircle from '@/assets/icons/InfoCircle.svg'
import InfoCircleActive from '@/assets/icons/InfoCircleActive.svg'

const SelectionCard = ({ label, description, price, subtitle, selected, onClick, isInfoShow, onInfoClick }) => {
  function handleInfoClick(e) {
    e.preventDefault()
    e.stopPropagation()
    onInfoClick()
  }
  return (
    <div
      className={`${styles.card} ${selected ? styles.selected : ''} ${isInfoShow  ? styles.showInfo : ''}`}
      onClick={onClick}
    >
      <div className={styles.label}>{label}</div>
      {description && isInfoShow && <div className={styles.description}>{description}</div>}
      {price !== null && <div className={styles.price}>{price}</div>}
      {subtitle && !isInfoShow && <span className={styles.subtitle}>{subtitle}</span>}
      <CheckMark className={styles.checkMark}/>
      {description && (!selected ? 
        isInfoShow ? <InfoCircleActive onClick={handleInfoClick} className={styles.info}/> : <InfoCircle onClick={handleInfoClick} className={styles.info}/> :
        <InfoCircleActive onClick={handleInfoClick} className={styles.info}/>)}
    </div>
  );
};

export default SelectionCard;