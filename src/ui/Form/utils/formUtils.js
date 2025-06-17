export const shouldRenderField = (showIfCondition, currentFormData, currentStepId) => {
  if (!showIfCondition) {
    return true; 
  }

  const { field, condition, value: targetValue, values: targetValues } = showIfCondition;
  
  let fieldValue;
  if (field.includes('.')) {
    const [refStepId, refFieldName] = field.split('.');
    fieldValue = currentFormData[refStepId] ? currentFormData[refStepId][refFieldName] : undefined;
  } else {
    fieldValue = currentFormData[currentStepId] ? currentFormData[currentStepId][field] : undefined;
  }

  switch (condition) {
    case "equals":
      return fieldValue === targetValue;
    case "notEquals":
      return fieldValue !== targetValue;
    case "hasAny":
      return Array.isArray(fieldValue) && Array.isArray(targetValues) && 
             fieldValue.some(item => targetValues.includes(item.value));
    case "equalsAny":
      if (!Array.isArray(targetValues)) return false;
      if (Array.isArray(fieldValue)) {
        return fieldValue.some(item =>
          targetValues.includes(item.value !== undefined ? item.value : item)
        );
      }
      return targetValues.includes(fieldValue);
    case "isToday":
      if (fieldValue) {
        const today = new Date();
        const selectedDate = new Date(fieldValue);
        return today.toDateString() === selectedDate.toDateString();
      }
      return false;
    default:
      return true; 
  }
};

export const generateSubStepsForDynamicStep = (dynamicStepConfig, formData) => {
  if (!dynamicStepConfig || dynamicStepConfig.type !== "dynamic") {
    return [];
  }

  const [sourceStepId, sourceFieldName] = dynamicStepConfig.generateFrom.split('.');
  const sourceData = formData[sourceStepId] ? formData[sourceStepId][sourceFieldName] : [];
  
  if (!Array.isArray(sourceData)) {
    return [];
  }

  const itemsToGenerate = sourceData.filter(item => item.count > 0);
  let dynamicStepIndex = 1;

  return itemsToGenerate.flatMap(item => {
    const subSteps = [];
    for (let i = 0; i < item.count; i++) {
      const subStepId = `${dynamicStepConfig.id}-${dynamicStepIndex}`;
      let subStepTitle = dynamicStepConfig.template.subTitle
        .replace(/#{index}/g, dynamicStepIndex)
        .replace(/{size}/g, item.label || item.value);
      subSteps.push({
        ...dynamicStepConfig.template,
        title: dynamicStepConfig.title,
        id: subStepId,
        subTitle: subStepTitle,
      });
      dynamicStepIndex++;
    }
    return subSteps;
  });
}; 