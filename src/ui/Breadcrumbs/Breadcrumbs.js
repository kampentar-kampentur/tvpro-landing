import React from 'react';
import styles from './Breadcrumbs.module.css';

const Breadcrumbs = ({
  steps,
  currentMainStep,
  onStepClick,
  completedSteps = []
}) => {
  return (
    <div className={styles.breadcrumbs}>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          {completedSteps.includes(index) && onStepClick ? (
            <button
              type="button"
              className={`${styles.step} ${index === currentMainStep ? styles.current : styles.past} ${styles.clickable}`}
              onClick={() => onStepClick(index)}
            >
              {step.title}
            </button>
          ) : (
            <span
              className={`${styles.step} ${index === currentMainStep ? styles.current : styles.past}`}
            >
              {step.title}
            </span>
          )}
          {index < steps.length - 1 && (
            <svg
              className={styles.chevron}
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
            >
              <path
                stroke="currentColor"
                strokeWidth="1.5"
                d="m6 4 4 4-4 4"
              />
            </svg>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumbs;