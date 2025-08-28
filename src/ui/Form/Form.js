import React, { useEffect } from 'react';
import { useFormNavigation } from './hooks/useFormNavigation';
import { useDynamicSteps } from './hooks/useDynamicSteps';
import FormStep from './components/FormStep';
import FormNavigation from './components/FormNavigation';
import FormProgress from './components/FormProgress';
import styles from './Form.module.css';
import { shouldRenderField } from './utils/formUtils';
import { usePriceCalculation } from '@/modals/BestQuoteModal/hooks/usePriceCalculation';
import { sendGTMEvent } from '@next/third-parties/google'

const discountOptions = {
  discountType: "fixed",
  discountValue: 30,
  discountCondition: (total) => total > 100,
  discountLabel: "Online Order"
};

const Form = ({ scheme, value, onChange, onSubmit, onStepChange, showProgress = true, onPriceChange, disableSubmitBtn }) => {
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
  
  const { totalPrice, structuredCostBreakdown } = usePriceCalculation(
    value,
    scheme,
    renderedSteps,
    discountOptions
  );

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

  const handleNext = () => {
    if(renderedSteps.length - 1 === currentSubStepIndex) {
      sendGTMEvent({event: `form_step_${currentStepIndex + 1}`})
    }
    return goToNextStep(renderedSteps.length)
  };

  const handleSubmit = async (...args) => {
    try {
      await onSubmit(...args)
      sendGTMEvent({event: `form_step_${currentStepIndex + 1}_send`, phone: value.contactInfo.phone.replace(/\D/g, '')})
    } catch (e) {
      console.error('something went wrong', e)
    }
  }
  const handlePrevious = () => goToPreviousStep();

  const isLastOverallStep = isLastMainStep && currentSubStepIndex === renderedSteps.length - 1;

  const canGoBack = !isFirstStep;
  
  // Validation logic
  const isCurrentStepValid = () => {
    if (!stepToRender || !stepToRender.fields) {
      return true; // No fields to validate
    }

    const parentContext = stepToRender.parentContext;
    return stepToRender.fields.every(field => {
      if (field.isRequired && shouldRenderField(field.showIf, value, stepToRender.id, parentContext)) {
        const fieldValue = value[stepToRender.id] ? value[stepToRender.id][field.name] : undefined;
        // Универсальная валидация minLength/maxLength для text/number/tel
        if (["text", "number", "tel"].includes(field.type) && (field.minLength || field.maxLength)) {
          const strValue = fieldValue ? String(fieldValue) : "";
          if (field.minLength && strValue.length < field.minLength) {
            return false;
          }
          if (field.maxLength && strValue.length > field.maxLength) {
            return false;
          }
        }
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
      <div style={{flexGrow: 1}}></div>
      <FormNavigation
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={handleSubmit}
        isLastStep={isLastOverallStep}
        disableSubmitBtn={disableSubmitBtn}
      />
    </form>
  );
};

export default Form;