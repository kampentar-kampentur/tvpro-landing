import { useState, useMemo, useEffect } from 'react';
import { generateSubStepsForDynamicStep, shouldRenderField } from '../utils/formUtils';

// Helper to check if a step should be visible based on showIf condition
const shouldRenderStep = (step, formData) => {
  if (!step.showIf) return true;
  // For step-level showIf, we need to check the condition against form data
  // The field reference should point to another step's field (e.g. "tvSelection" refers to "tv-size.tvSelection")
  return shouldRenderField(step.showIf, formData, 'tv-size', null);
};

export const useFormNavigation = (scheme, onStepChange, formData) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentSubStepIndex, setCurrentSubStepIndex] = useState(0);

  // Get visible steps based on showIf conditions
  const visibleStepIndices = useMemo(() => {
    if (!scheme?.steps) return [];
    return scheme.steps
      .map((step, index) => ({ step, index }))
      .filter(({ step }) => shouldRenderStep(step, formData))
      .map(({ index }) => index);
  }, [scheme, formData]);

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

  const goToNextStep = (totalRenderedSubSteps, updatedFormData) => {
    // Use updatedFormData if provided, otherwise fall back to formData from props
    const dataToCheck = updatedFormData || formData;

    if (currentStepConfig.type === "dynamic" && currentSubStepIndex < totalRenderedSubSteps - 1) {
      setCurrentSubStepIndex(prevIndex => prevIndex + 1);
    } else if (currentStepIndex < scheme.steps.length - 1) {
      // Find next visible step
      let nextIndex = currentStepIndex + 1;
      while (nextIndex < scheme.steps.length && !shouldRenderStep(scheme.steps[nextIndex], dataToCheck)) {
        nextIndex++;
      }
      if (nextIndex < scheme.steps.length) {
        setCurrentStepIndex(nextIndex);
        setCurrentSubStepIndex(0);
      }
    }
  };

  const goToPreviousStep = () => {
    if (currentStepConfig.type === "dynamic" && currentSubStepIndex > 0) {
      setCurrentSubStepIndex(prevIndex => prevIndex - 1);
    } else if (currentStepIndex > 0) {
      // Find previous visible step
      let previousStepIndex = currentStepIndex - 1;
      while (previousStepIndex >= 0 && !shouldRenderStep(scheme.steps[previousStepIndex], formData)) {
        previousStepIndex--;
      }
      if (previousStepIndex >= 0) {
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
    }
  };

  const goToStep = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < scheme.steps.length && shouldRenderStep(scheme.steps[stepIndex], formData)) {
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
    visibleStepIndices, // Export for breadcrumbs
  };
};
