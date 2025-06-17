import React from 'react';
import styles from './DateField.module.css';

const DateField = ({ field, value = '', onChange }) => {
  return (
    <div className={styles.dateFieldContainer}>
      <input
        type="date"
        className={styles.dateInput}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default DateField; 