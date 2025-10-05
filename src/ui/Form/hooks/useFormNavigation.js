import { useState, useMemo, useEffect } from 'react';
import { generateSubStepsForDynamicStep } from '../utils/formUtils';

export const useFormNavigation = (scheme, onStepChange, formData) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentSubStepIndex, setCurrentSubStepIndex] = useState(0);

  const currentStepConfig = useMemo(
    () => (scheme && scheme.steps ? scheme.steps[currentStepIndex] : null),
    [currentStepIndex, scheme]
  );

  useEffect(() => {
    // onStepChange will be called from Form.js with totalSubStepsCount
    onStepChange?.(currentStepIndex, currentSubStepIndex);
  }, [currentStepIndex, currentSubStepIndex, onStepChange]);

  const isFirstStep = currentStepIndex === 0 && currentSubStepIndex === 0;
  
  // isLastStep will be determined in Form.js based on renderedSteps length
  const isLastMainStep = currentStepIndex === scheme.steps.length - 1;

  const goToNextStep = (totalRenderedSubSteps) => {
    if (currentStepConfig.type === "dynamic" && currentSubStepIndex < totalRenderedSubSteps - 1) {
      setCurrentSubStepIndex(prevIndex => prevIndex + 1);
    } else if (currentStepIndex < scheme.steps.length - 1) {
      setCurrentStepIndex(prevStep => prevStep + 1);
      setCurrentSubStepIndex(0);
    }
  };

  const goToPreviousStep = () => {
    if (currentStepConfig.type === "dynamic" && currentSubStepIndex > 0) {
      setCurrentSubStepIndex(prevIndex => prevIndex - 1);
    } else if (currentStepIndex > 0) {
      const previousStepIndex = currentStepIndex - 1;
      const previousStepConfig = scheme.steps[previousStepIndex];

      if (previousStepConfig && previousStepConfig.type === "dynamic") {
        const totalSubStepsInPreviousDynamicStep = generateSubStepsForDynamicStep(previousStepConfig, formData).length;
        setCurrentStepIndex(previousStepIndex);
        setCurrentSubStepIndex(totalSubStepsInPreviousDynamicStep > 0 ? totalSubStepsInPreviousDynamicStep - 1 : 0);
      } else {
        setCurrentStepIndex(previousStepIndex);
        setCurrentSubStepIndex(0);
      }
    }
  };

  const goToStep = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < scheme.steps.length) {
      setCurrentStepIndex(stepIndex);
      setCurrentSubStepIndex(0);
    }
  };

  return {
    currentStepIndex,
    currentSubStepIndex,
    currentStepConfig,
    isFirstStep,
    isLastMainStep, // Renamed to clearly indicate it's about the main step
    goToNextStep,
    goToPreviousStep,
    goToStep,
  };
};
