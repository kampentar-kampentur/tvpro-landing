import React, { useEffect } from 'react';
import { useFormNavigation } from './hooks/useFormNavigation';
import { useDynamicSteps } from './hooks/useDynamicSteps';
import FormStep from './components/FormStep';
import FormNavigation from './components/FormNavigation';
import Breadcrumbs from '@/ui/Breadcrumbs';
import styles from './Form.module.css';
import { shouldRenderField, isStepComplete, hasConditionalFields } from './utils/formUtils';
import { usePriceCalculation } from '@/modals/BestQuoteModal/hooks/usePriceCalculation';
import { sendGTMEvent } from '@next/third-parties/google'

const discountOptions = {
  discountType: "fixed",
  discountValue: 30,
  discountCondition: (total) => total > 200,
  discountLabel: "Discount"
};

const Form = ({ scheme, value, onChange, onSubmit, onStepChange, showProgress = true, onPriceChange, disableSubmitBtn, isMobile, initialStepIndex, onClose, onBack }) => {
  const {
    currentStepIndex,
    currentSubStepIndex,
    currentStepConfig,
    isFirstStep,
    isLastMainStep,
    goToNextStep,
    goToPreviousStep,
    goToStep
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
    console.log("--------------------------");
    const fd = {
      ...value,
      [stepId]: {
        ...(value[stepId] || {}),
        [fieldName]: fieldValue
      }
    }
    if(isStepComplete(stepToRender, fd)) {
      handleNext()
    }
  };

  const handleNext = () => {
    if(renderedSteps.length - 1 === currentSubStepIndex) {
      if (typeof sendGTMEvent !== 'undefined') {
        sendGTMEvent({event: `form_step_${currentStepIndex + 1}`})
      }
    }
    return goToNextStep(renderedSteps.length)
  };

  const handleSubmit = async (...args) => {
    try {
      await onSubmit(...args)
      if (typeof sendGTMEvent !== 'undefined') {
        sendGTMEvent({
          event: `form_step_${currentStepIndex + 1}_send`,
          'user_data.phone_number': value.contactInfo.phone.replace(/\D/g, ''),
          'user_data.email': value.contactInfo.email
        })
      }
    } catch (e) {
      console.error('something went wrong', e)
    }
  }
  const handlePrevious = () => goToPreviousStep();

  const handleBack = () => goToStep(currentStepIndex - 1);

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
        // Специальная валидация для splited полей
        if (field.type === "splited") {
          if (field.fields && Array.isArray(field.fields)) {
            // Validate each field in the fields array
            for (const subField of field.fields) {
              const subFieldValue = fieldValue && typeof fieldValue === 'object' ? fieldValue[subField.name] : undefined;
              if (subField.isRequired && (!subFieldValue || String(subFieldValue).trim() === '')) {
                return false;
              }
              // Универсальная валидация minLength/maxLength для text/number/tel
              if (["text", "number", "tel"].includes(subField.type) && (subField.minLength || subField.maxLength)) {
                const strValue = subFieldValue ? String(subFieldValue) : "";
                if (subField.minLength && strValue.length < subField.minLength) {
                  return false;
                }
                if (subField.maxLength && strValue.length > subField.maxLength) {
                  return false;
                }
              }
            }
          } else if (field.isRequired) {
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

  // Check if current step is completed
  const isCurrentStepComplete = (() => {
    if (currentStepConfig.type === "dynamic") {
      return currentSubStepIndex >= renderedSteps.length - 1 && isStepComplete(stepToRender, value);
    } else {
      return isStepComplete(currentStepConfig, value);
    }
  })();

  // Determine which steps are accessible for navigation
  const getCompletedSteps = () => {
    const completed = [];
    // All steps up to current are accessible
    for (let i = 0; i <= currentStepIndex; i++) {
      completed.push(i);
    }
    // If current is complete, allow next step
    if (currentStepIndex < scheme.steps.length - 1 && isCurrentStepComplete) {
      completed.push(currentStepIndex + 1);
    }
    return completed;
  };

  const handleStepClick = (stepIndex) => {
    if (getCompletedSteps().includes(stepIndex)) {
      goToStep(stepIndex);
    }
  };

  return (
    <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
      {/* <h2 className={styles.bestQuoteTitle}>{stepToRender?.title}</h2> */}
      {showProgress && (
        <Breadcrumbs
          steps={scheme.steps}
          currentMainStep={currentStepIndex}
          onStepClick={handleStepClick}
          completedSteps={getCompletedSteps()}
        />
      )}
      <FormStep
        step={stepToRender}
        formData={value}
        onFieldChange={handleFieldChange}
        currentSubStep={currentSubStepIndex}
        totalSubSteps={renderedSteps.length}
        isMobile={isMobile}
        currentStepIndex={currentStepIndex}
        onClose={onClose}
        onBack={onBack || handleBack}
      />
      {/* <div style={{flexGrow: 1}}></div> */}
      {/* <FormNavigation
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={handleSubmit}
        isLastStep={isLastOverallStep}
        disableSubmitBtn={disableSubmitBtn}
      /> */}
    </form>
  );
};

export default Form;