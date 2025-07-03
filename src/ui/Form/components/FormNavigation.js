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
  disableSubmitBtn
}) => {
  return (
    <div className={styles.navigationButtons}>
      <Button 
        size='small'
        onClick={isLastStep ? onSubmit : onNext}
        type={isLastStep ? "submit" : "button"}
        disabled={!canGoForward || disableSubmitBtn}
      >
        {isLastStep ? "Next" : "Next"}
      </Button>
      {canGoBack && (
        <Button onClick={onPrevious} variant="secondary" size='small'>Back</Button>
      )}
    </div>
  );
};

export default FormNavigation;
