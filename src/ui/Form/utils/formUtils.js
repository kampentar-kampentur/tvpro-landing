export const shouldRenderField = (showIfCondition, currentFormData, currentStepId, parentContext) => {
  if (!showIfCondition) {
    return true; 
  }

  // --- Новая логика: массив условий (AND)
  if (Array.isArray(showIfCondition)) {
    return showIfCondition.every(cond => shouldRenderField(cond, currentFormData, currentStepId, parentContext));
  }

  // --- Новая логика: объект с all/any
  if (typeof showIfCondition === 'object' && showIfCondition !== null) {
    if (Array.isArray(showIfCondition.all)) {
      return showIfCondition.all.every(cond => shouldRenderField(cond, currentFormData, currentStepId, parentContext));
    }
    if (Array.isArray(showIfCondition.any)) {
      return showIfCondition.any.some(cond => shouldRenderField(cond, currentFormData, currentStepId, parentContext));
    }
  }

  // --- Старый формат (один объект-условие)
  const { field, condition, value: targetValue, values: targetValues } = showIfCondition;

  let fieldValue;
  if (field === '$parentValue' && parentContext && parentContext.parentValue !== undefined) {
    fieldValue = parentContext.parentValue;
  } else if (field && field.includes('.')) {
    const [refStepId, refFieldName] = field.split('.');
    fieldValue = currentFormData[refStepId] ? currentFormData[refStepId][refFieldName] : undefined;
  } else if (field) {
    fieldValue = currentFormData[currentStepId] ? currentFormData[currentStepId][field] : undefined;
  }

  // Resolve field references in targetValue
  let resolvedTargetValue = targetValue;
  if (typeof targetValue === 'object' && targetValue !== null && targetValue.field) {
    const refField = targetValue.field;
    if (refField === '$parentValue' && parentContext && parentContext.parentValue !== undefined) {
      resolvedTargetValue = parentContext.parentValue;
    } else if (refField && refField.includes('.')) {
      const [refStepId, refFieldName] = refField.split('.');
      resolvedTargetValue = currentFormData[refStepId] ? currentFormData[refStepId][refFieldName] : undefined;
    } else if (refField) {
      resolvedTargetValue = currentFormData[currentStepId] ? currentFormData[currentStepId][refField] : undefined;
    }
  }

  // Resolve field references in targetValues array
  let resolvedTargetValues = targetValues;
  if (Array.isArray(targetValues)) {
    resolvedTargetValues = targetValues.map(val => {
      if (typeof val === 'object' && val !== null && val.field) {
        const refField = val.field;
        if (refField === '$parentValue' && parentContext && parentContext.parentValue !== undefined) {
          return parentContext.parentValue;
        } else if (refField && refField.includes('.')) {
          const [refStepId, refFieldName] = refField.split('.');
          return currentFormData[refStepId] ? currentFormData[refStepId][refFieldName] : undefined;
        } else if (refField) {
          return currentFormData[currentStepId] ? currentFormData[currentStepId][refField] : undefined;
        }
      }
      return val;
    });
  }

  switch (condition) {
    case "equals":
      return fieldValue === resolvedTargetValue;
    case "notEquals":
      return fieldValue !== resolvedTargetValue;
    case "hasAny":
      return Array.isArray(fieldValue) && Array.isArray(resolvedTargetValues) &&
             fieldValue.some(item => resolvedTargetValues.includes(item.value));
    case "equalsAny":
        if (!Array.isArray(resolvedTargetValues)) return false;
        if (Array.isArray(fieldValue)) {
            return fieldValue.some(item =>
                resolvedTargetValues.includes(item.value !== undefined ? item.value : item)
            );
        }
      return resolvedTargetValues.includes(fieldValue);
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

export const isStepComplete = (step, formData) => {
  if (!step || !step.fields) return true;
  console.log("formData", formData);
  // debugger
  
  console.log(step.fields.filter(field => {
    if (!shouldRenderField(field.showIf, formData, step.id, step.parentContext)) {
      return true; // not visible, so "complete"
    }

    const fieldValue = formData[step.id] ? formData[step.id][field.name] : undefined;

    // Check if has value
    if (fieldValue === undefined || fieldValue === null || fieldValue === '') return false;
    if (Array.isArray(fieldValue) && fieldValue.length === 0) return false;
    // For checkboxWithCounter, check if any item has count > 0
    if (field.type === "checkboxWithCounter" && Array.isArray(fieldValue)) {
      return fieldValue.some(item => item.count && item.count > 0);
    }

    return true;
  }));
  
  return step.fields.every(field => {
    if (!shouldRenderField(field.showIf, formData, step.id, step.parentContext)) {
      return true; // not visible, so "complete"
    }

    const fieldValue = formData[step.id] ? formData[step.id][field.name] : undefined;

    // Check if has value
    if (fieldValue === undefined || fieldValue === null || fieldValue === '') return false;
    if (Array.isArray(fieldValue) && fieldValue.length === 0) return false;
    // For checkboxWithCounter, check if any item has count > 0
    if (field.type === "checkboxWithCounter" && Array.isArray(fieldValue)) {
      return fieldValue.some(item => item.count && item.count > 0);
    }

    return true;
  });
};

export const hasConditionalFields = (step) => {
  if (!step || !step.fields) return false;
  return step.fields.some(field => field.showIf);
};

export const clearHiddenFields = (scheme, formData) => {
  const cleanedFormData = { ...formData };
  console.log('🔄 clearHiddenFields called with formData:', JSON.stringify(formData, null, 2));

  scheme.forEach(step => {
    if (!step.fields) return;

    step.fields.forEach(field => {
      if (field.type === 'split' && field.fields) {
        // Handle split field sub-fields
        field.fields.forEach(subField => {
          if (!shouldRenderField(subField.showIf, cleanedFormData, step.id, step.parentContext)) {
            if (cleanedFormData[step.id] && cleanedFormData[step.id][field.name]) {
              console.log(`🗑️ Clearing hidden sub-field: ${step.id}.${field.name}.${subField.name}`);
              delete cleanedFormData[step.id][field.name][subField.name];
            }
          }
        });
      } else {
        // Handle regular fields
        if (!shouldRenderField(field.showIf, cleanedFormData, step.id, step.parentContext)) {
          if (cleanedFormData[step.id]) {
            console.log(`🗑️ Clearing hidden field: ${step.id}.${field.name}`);
            delete cleanedFormData[step.id][field.name];
          }
        }
      }
    });
  });

  console.log('✅ clearHiddenFields result:', JSON.stringify(cleanedFormData, null, 2));
  return cleanedFormData;
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
        parentContext: { parentValue: item.value, parentLabel: item.label },
      });
      dynamicStepIndex++;
    }
    return subSteps;
  });
};