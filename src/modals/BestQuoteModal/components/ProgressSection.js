import React from 'react';
import styles from './ProgressSection.module.css';

const ProgressSection = ({
  currentStep,
  totalSteps,
  status,
  label
}) => {
  const progressWidth = (currentStep / totalSteps) * 100;

  return (
    <div className={`${styles.progressSection} ${styles[status]}`}>
      <div className={styles.statusContainer}>
        <p className={styles.statusLabel}>{label}</p>
        <div className={styles.badge}></div>
      </div>
      <div className={styles.progressBarBackground}>
        <div
          className={styles.progressBarFill}
          style={{ width: `${progressWidth || 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressSection; 