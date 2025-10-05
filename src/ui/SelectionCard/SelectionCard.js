import React from 'react';
import styles from './SelectionCard.module.css';

const SelectionCard = ({ label, description, price, selected, onClick }) => {
  return (
    <div
      className={`${styles.card} ${selected ? styles.selected : ''}`}
      onClick={onClick}
    >
      <div className={styles.label}>{label}</div>
      {description && <div className={styles.description}>{description}</div>}
      {price !== null && <div className={styles.price}>{price}</div>}
    </div>
  );
};

export default SelectionCard;