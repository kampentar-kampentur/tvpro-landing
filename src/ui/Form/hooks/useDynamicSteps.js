import { useMemo } from 'react';
import { generateSubStepsForDynamicStep } from '../utils/formUtils';

export const useDynamicSteps = (currentStepConfig, value) => {
  return useMemo(() => {
    if (!currentStepConfig) {
      return [];
    }
    if (currentStepConfig.type === "dynamic") {
      return generateSubStepsForDynamicStep(currentStepConfig, value);
    } else {
      return [currentStepConfig];
    }
  }, [currentStepConfig, value]);
};