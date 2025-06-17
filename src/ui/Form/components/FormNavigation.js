import React from 'react';
import Button from '@/ui/Button';
import styles from './FormNavigation.module.css';

const FormNavigation = ({
  canGoBack,
  canGoForward,
  onPrevious,
  onNext,
  onSubmit,
  isLastStep,
}) => {
  return (
    <div className={styles.navigationButtons}>
      <Button 
        size='small'
        onClick={isLastStep ? onSubmit : onNext}
        type={isLastStep ? "submit" : "button"}
        disabled={!canGoForward}
      >
        {isLastStep ? "Submit" : "Next Step"}
      </Button>
      {canGoBack && (
        <Button onClick={onPrevious} variant="secondary" size='small'>Previous Step</Button>
      )}
    </div>
  );
};

export default FormNavigation;
