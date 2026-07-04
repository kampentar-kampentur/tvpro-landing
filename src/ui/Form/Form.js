import React, { useEffect, useRef } from 'react';
import { useFormNavigation } from './hooks/useFormNavigation';
import { useDynamicSteps } from './hooks/useDynamicSteps';
import quizTracker from '@/lib/quizTracker';
import FormStep from './components/FormStep';
import FormNavigation from './components/FormNavigation';
import Breadcrumbs from '@/ui/Breadcrumbs';
import styles from './Form.module.css';
import { shouldRenderField, isStepComplete, hasConditionalFields, clearHiddenFields } from './utils/formUtils';
import { validatePhone } from './utils/phoneValidation';
import { usePriceCalculation } from '@/modals/BestQuoteModal/hooks/usePriceCalculation';

import { sendGTMEvent } from '@next/third-parties/google'

const discountOptions = {
  discountType: null,
  discountValue: 0,
  discountCondition: (total) => false,
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
    goToStep,
    visibleStepIndices
  } = useFormNavigation(scheme, onStepChange, value, initialStepIndex);

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

  const totalPriceRef = useRef(totalPrice);
  totalPriceRef.current = totalPrice;

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

  // Track step views
  useEffect(() => {
    if (stepToRender?.id) {
      quizTracker.sendEvent("step_view", {
        stepId: stepToRender.id,
        stepIndex: currentStepIndex,
        additionalData: {
          stepTitle: stepToRender.title,
          totalPrice: totalPriceRef.current
        }
      });
    }
  }, [currentStepIndex, currentSubStepIndex, stepToRender?.id, stepToRender?.title]);

  // Track validation errors in the background
  const lastLoggedErrors = useRef(new Set());
  useEffect(() => {
    if (!stepToRender || !stepToRender.fields) return;

    const parentContext = stepToRender.parentContext;
    const currentErrors = new Set();

    stepToRender.fields.forEach(field => {
      if (shouldRenderField(field.showIf, value, stepToRender.id, parentContext)) {
        const fieldValue = value[stepToRender.id] ? value[stepToRender.id][field.name] : undefined;

        if (field.isRequired && (fieldValue === undefined || fieldValue === null || fieldValue === '' || (Array.isArray(fieldValue) && fieldValue.length === 0))) {
          currentErrors.add(`${field.name}:required`);
          return;
        }

        if (field.type === 'tel' && fieldValue && !validatePhone(fieldValue)) {
          currentErrors.add(`${field.name}:invalid_phone`);
        }

        if (field.type === "splited" && field.fields && Array.isArray(field.fields)) {
          field.fields.forEach(subField => {
            const subFieldValue = fieldValue && typeof fieldValue === 'object' ? fieldValue[subField.name] : undefined;
            if (subField.isRequired && (!subFieldValue || String(subFieldValue).trim() === '')) {
              currentErrors.add(`${field.name}.${subField.name}:required`);
            }
            if (subField.type === 'tel' && subFieldValue && !validatePhone(subFieldValue)) {
              currentErrors.add(`${field.name}.${subField.name}:invalid_phone`);
            }
            if (subField.name === 'zip' && subFieldValue && !/^\d{5}$/.test(subFieldValue)) {
              currentErrors.add(`${field.name}.${subField.name}:invalid_zip`);
            }
          });
        }
      }
    });

    currentErrors.forEach(errKey => {
      if (!lastLoggedErrors.current.has(errKey)) {
        const [fieldName, errorType] = errKey.split(':');
        quizTracker.sendEvent("validation_error", {
          stepId: stepToRender.id,
          stepIndex: currentStepIndex,
          fieldName,
          errorType,
          fieldValue: value[stepToRender.id]?.[fieldName.split('.')[0]],
          additionalData: {
            totalPrice: totalPriceRef.current
          }
        });
        lastLoggedErrors.current.add(errKey);
      }
    });

    lastLoggedErrors.current.forEach(errKey => {
      if (!currentErrors.has(errKey)) {
        lastLoggedErrors.current.delete(errKey);
      }
    });
  }, [value, stepToRender, currentStepIndex]);

  const handleFieldChange = (stepId, fieldName, fieldValue) => {
    console.log(`📝 Field change: ${stepId}.${fieldName} = ${JSON.stringify(fieldValue)}`);
    
    // Log the option_select event immediately
    quizTracker.sendEvent("option_select", {
      stepId,
      stepIndex: currentStepIndex,
      fieldName,
      fieldValue,
      additionalData: {
        totalPrice: totalPriceRef.current
      }
    });

    onChange(prevData => {
      const stepIndex = scheme.steps.findIndex(s => s.id === stepId);
      const updatedData = {
        ...prevData,
        [stepId]: {
          ...(prevData[stepId] || {}),
          [fieldName]: fieldValue
        }
      };

      // Clear subsequent steps except contactInfo
      scheme.steps.forEach((step, index) => {
        if (index > stepIndex && step.id !== 'contactInfo') {
          delete updatedData[step.id];
        }
      });

      const cleanedData = clearHiddenFields(scheme.steps, updatedData);
      console.log(`🔄 Form data after clearing:`, JSON.stringify(cleanedData, null, 2));
      return cleanedData;
    });
    console.log("--------------------------");
    const fd = {
      ...value,
      [stepId]: {
        ...(value[stepId] || {}),
        [fieldName]: fieldValue
      }
    }
    const fieldConfig = stepToRender?.fields?.find(f => f.name === fieldName);
    if (fieldConfig?.type !== "checkboxGroup" && isStepComplete(stepToRender, fd)) {
      handleNext(fd);
    }
  };

  const handleNext = (updatedFormData) => {
    if (renderedSteps.length - 1 === currentSubStepIndex) {
      if (typeof sendGTMEvent !== 'undefined') {
        sendGTMEvent({ event: `form_step_${currentStepIndex + 1}` })
      }
    }
    return goToNextStep(renderedSteps.length, updatedFormData)
  };

  const handleSubmit = async (...args) => {
    try {
      await onSubmit(...args)
      sessionStorage.setItem('form_submitted', 'true');
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

  const handleBack = () => goToPreviousStep();

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
        if (["text", "number"].includes(field.type) && (field.minLength || field.maxLength)) {
          const strValue = fieldValue ? String(fieldValue) : "";
          if (field.minLength && strValue.length < field.minLength) {
            return false;
          }
          if (field.maxLength && strValue.length > field.maxLength) {
            return false;
          }
        }
        // Phone validation
        if (field.type === 'tel' && !validatePhone(fieldValue)) {
          return false;
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
              // Универсальная валидация minLength/maxLength для text/number
              if (["text", "number"].includes(subField.type) && (subField.minLength || subField.maxLength)) {
                const strValue = subFieldValue ? String(subFieldValue) : "";
                if (subField.minLength && strValue.length < subField.minLength) {
                  return false;
                }
                if (subField.maxLength && strValue.length > subField.maxLength) {
                  return false;
                }
              }
              // Phone validation for subfields
              if (subField.type === 'tel' && !validatePhone(subFieldValue)) {
                return false;
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

  const currentStepPosition = visibleStepIndices ? visibleStepIndices.indexOf(currentStepIndex) : 0;
  const isContactStep = stepToRender?.id === "contactInfo";
  
  // Calculate progress including all steps, so it only reaches 100% at the final step
  const progressStepsCount = visibleStepIndices ? visibleStepIndices.length : 1;
  const progressPercent = progressStepsCount > 0
    ? Math.min(100, Math.round(((currentStepPosition + 1) / progressStepsCount) * 100))
    : 100;

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
        onNext={() => handleNext(value)}
      />
      {showProgress && !isContactStep && (
        <div className={styles.progressWrapper}>
          <div className={styles.progressFill} style={{ width: `${progressPercent}%` }}>
            <span className={styles.progressPercent}>{progressPercent}%</span>
          </div>
        </div>
      )}
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