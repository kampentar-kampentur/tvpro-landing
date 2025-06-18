import React from 'react';
import ProgressSection from './ProgressSection';
import styles from './FormProgress.module.css';

const FormProgress = ({
  steps, 
  currentMainStep, 
  currentSubStep, 
  totalSubSteps 
}) => {
  const getStepStatus = (stepIndex) => {
    if (stepIndex === currentMainStep) return 'current';
    if (stepIndex < currentMainStep) return 'completed';
    return 'next';
  };

  const getCurrentStepProgress = (stepIndex) => {
    if (stepIndex === currentMainStep) {
      return currentSubStep + 1;
    }
    return 0;
  };

  return (
    <div className={styles.progressContainer}>
      {steps.map((step, index) => (
        <ProgressSection
          key={step.id}
          currentStep={getCurrentStepProgress(index)}
          totalSteps={index === currentMainStep ? totalSubSteps : 1}
          status={getStepStatus(index)}
          label={step.title}
        />
      ))}
    </div>
  );
};

export default FormProgress; 