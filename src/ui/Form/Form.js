import React, { useEffect } from 'react';
import { useFormNavigation } from './hooks/useFormNavigation';
import { useDynamicSteps } from './hooks/useDynamicSteps';
import FormStep from './components/FormStep';
import FormNavigation from './components/FormNavigation';
import FormProgress from './components/FormProgress';
import styles from './Form.module.css';
import { shouldRenderField } from './utils/formUtils';
import { usePriceCalculation } from '@/modals/BestQuoteModal/hooks/usePriceCalculation';

const Form = ({ scheme, value, onChange, onSubmit, onStepChange, showProgress = true, onPriceChange }) => {
  const {
    currentStepIndex,
    currentSubStepIndex,
    currentStepConfig,
    isFirstStep,
    isLastMainStep,
    goToNextStep,
    goToPreviousStep
  } = useFormNavigation(scheme, onStepChange, value);

  const renderedSteps = useDynamicSteps(currentStepConfig, value);
  
  const { totalPrice, structuredCostBreakdown } = usePriceCalculation(value, scheme, renderedSteps);

  const stepToRender = currentStepConfig?.type === "dynamic" 
    ? renderedSteps[currentSubStepIndex]
    : currentStepConfig;

  useEffect(() => {
    if (onPriceChange) {
      onPriceChange(totalPrice, structuredCostBreakdown);
    }
  }, [totalPrice, structuredCostBreakdown, onPriceChange]);

  useEffect(() => {
    if (onStepChange) {
      onStepChange(currentStepIndex, currentSubStepIndex, renderedSteps.length);
    }
  }, [currentStepIndex, currentSubStepIndex, renderedSteps.length, onStepChange]);

  const handleFieldChange = (stepId, fieldName, fieldValue) => {
    onChange(prevData => ({
      ...prevData,
      [stepId]: {
        ...(prevData[stepId] || {}),
        [fieldName]: fieldValue
      }
    }));
  };

  const handleNext = () => goToNextStep(renderedSteps.length);
  const handlePrevious = () => goToPreviousStep();

  const isLastOverallStep = isLastMainStep && currentSubStepIndex === renderedSteps.length - 1;

  const canGoBack = !isFirstStep;
  
  // Validation logic
  const isCurrentStepValid = () => {
    if (!stepToRender || !stepToRender.fields) {
      return true; // No fields to validate
    }

    return stepToRender.fields.every(field => {
      if (field.isRequired && shouldRenderField(field.showIf, value, stepToRender.id)) {
        const fieldValue = value[stepToRender.id] ? value[stepToRender.id][field.name] : undefined;
        // Check for undefined, null, empty string, or empty array for checkboxWithCounter/checkboxGroup
        if (fieldValue === undefined || fieldValue === null || fieldValue === '') {
          return false;
        }
        if (Array.isArray(fieldValue) && fieldValue.length === 0) {
          return false;
        }
        if (field.type === "checkboxWithCounter" && Array.isArray(fieldValue)) {
          // Check if any item in checkboxWithCounter has a count > 0
          return fieldValue.some(item => item.count && item.count > 0);
        }
      }
      return true;
    });
  };

  const canGoForward = isCurrentStepValid();
  const isSubmitButton = isLastOverallStep && isCurrentStepValid();

  return (
    <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
      <h2 className={styles.bestQuoteTitle}>{stepToRender?.title}</h2>
      {showProgress && (
        <FormProgress
          steps={scheme.steps}
          currentMainStep={currentStepIndex}
          currentSubStep={currentSubStepIndex}
          totalSubSteps={renderedSteps.length}
        />
      )}
      <FormStep
        step={stepToRender}
        formData={value}
        onFieldChange={handleFieldChange}
        currentSubStep={currentSubStepIndex}
        totalSubSteps={renderedSteps.length}
      />
      
      <FormNavigation
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={onSubmit}
        isLastStep={isSubmitButton}
      />
    </form>
  );
};

export default Form;