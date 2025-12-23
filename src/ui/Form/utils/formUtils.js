export const shouldRenderField = (showIfCondition, currentFormData, currentStepId, parentContext) => {
  console.log('🔍 shouldRenderField called with:', { showIfCondition, currentStepId, wallType: currentFormData[currentStepId]?.wallType });
  if (!showIfCondition) {
    console.log('🔍 No showIfCondition, returning true');
    return true;
  }

  // --- Новая логика: массив условий (AND)
  if (Array.isArray(showIfCondition)) {
    const result = showIfCondition.every(cond => shouldRenderField(cond, currentFormData, currentStepId, parentContext));
    console.log('🔍 Array condition result:', result);
    return result;
  }

  // --- Новая логика: объект с all/any
  if (typeof showIfCondition === 'object' && showIfCondition !== null) {
    if (Array.isArray(showIfCondition.all)) {
      const result = showIfCondition.all.every(cond => shouldRenderField(cond, currentFormData, currentStepId, parentContext));
      console.log('🔍 All condition result:', result, 'for conditions:', showIfCondition.all);
      return result;
    }
    if (Array.isArray(showIfCondition.any)) {
      const result = showIfCondition.any.some(cond => shouldRenderField(cond, currentFormData, currentStepId, parentContext));
      console.log('🔍 Any condition result:', result, 'for conditions:', showIfCondition.any);
      return result;
    }
  }

  // --- Старый формат (один объект-условие)
  const { field, condition, value: targetValue, values: targetValues } = showIfCondition;
  console.log('🔍 Single condition:', { field, condition, targetValue, targetValues });

  let fieldValue;
  if (field === '$parentValue' && parentContext && parentContext.parentValue !== undefined) {
    fieldValue = parentContext.parentValue;
  } else if (field && field.includes('.')) {
    const [refStepId, refFieldName] = field.split('.');
    fieldValue = currentFormData[refStepId] ? currentFormData[refStepId][refFieldName] : undefined;
  } else if (field) {
    fieldValue = currentFormData[currentStepId] ? currentFormData[currentStepId][field] : undefined;
  }
  console.log('🔍 fieldValue:', fieldValue);

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
  console.log('🔍 resolvedTargetValues:', resolvedTargetValues);

  switch (condition) {
    case "equals":
      const equalsResult = fieldValue === resolvedTargetValue;
      console.log('🔍 equals condition result:', equalsResult, '(', fieldValue, '===', resolvedTargetValue, ')');
      return equalsResult;
    case "notEquals":
      const notEqualsResult = fieldValue !== resolvedTargetValue;
      console.log('🔍 notEquals condition result:', notEqualsResult, '(', fieldValue, '!==', resolvedTargetValue, ')');
      return notEqualsResult;
    case "hasAny":
      const hasAnyResult = Array.isArray(fieldValue) && Array.isArray(resolvedTargetValues) &&
             fieldValue.some(item => resolvedTargetValues.includes(item.value));
      console.log('🔍 hasAny condition result:', hasAnyResult);
      return hasAnyResult;
    case "equalsAny":
        if (!Array.isArray(resolvedTargetValues)) {
          console.log('🔍 equalsAny: resolvedTargetValues is not an array');
          return false;
        }
        if (Array.isArray(fieldValue)) {
            const result = fieldValue.some(item =>
                resolvedTargetValues.includes(item.value !== undefined ? item.value : item)
            );
            console.log('🔍 equalsAny (array fieldValue) result:', result);
            return result;
        }
      const equalsAnyResult = resolvedTargetValues.includes(fieldValue);
      console.log('🔍 equalsAny result:', equalsAnyResult, '(', fieldValue, 'in', resolvedTargetValues, ')');
      return equalsAnyResult;
    case "isToday":
      if (fieldValue) {
        const today = new Date();
        const selectedDate = new Date(fieldValue);
        const result = today.toDateString() === selectedDate.toDateString();
        console.log('🔍 isToday result:', result);
        return result;
      }
      console.log('🔍 isToday: no fieldValue');
      return false;
    default:
      console.log('🔍 Unknown condition, returning true');
      return true;
  }
};

export const isStepComplete = (step, formData) => {
  if (!step || !step.fields) return true;
  console.log("formData", formData);
  
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
          const shouldRender = shouldRenderField(subField.showIf, cleanedFormData, step.id, step.parentContext);
          console.log(`🔍 Checking sub-field ${step.id}.${field.name}.${subField.name}: shouldRender=${shouldRender}, showIf=`, subField.showIf);
          if (!shouldRender) {
            if (cleanedFormData[step.id] && cleanedFormData[step.id][field.name]) {
              console.log(`🗑️ Clearing hidden sub-field: ${step.id}.${field.name}.${subField.name}`);
              delete cleanedFormData[step.id][field.name][subField.name];
            }
          }
        });
      } else {
        // Handle regular fields
        const shouldRender = shouldRenderField(field.showIf, cleanedFormData, step.id, step.parentContext);
        console.log(`🔍 Checking field ${step.id}.${field.name}: shouldRender=${shouldRender}, showIf=`, field.showIf, `, wallType=`, cleanedFormData[step.id]?.wallType);
        
        // Check if there are multiple fields with the same name
        const fieldsWithSameName = step.fields.filter(f => f.name === field.name);
        
        if (fieldsWithSameName.length > 1) {
          // If multiple fields have the same name, only delete if ALL of them should be hidden
          const allHidden = fieldsWithSameName.every(f =>
            !shouldRenderField(f.showIf, cleanedFormData, step.id, step.parentContext)
          );
          
          if (allHidden) {
            if (cleanedFormData[step.id]) {
              console.log(`🗑️ Clearing hidden field (all variants hidden): ${step.id}.${field.name}`);
              delete cleanedFormData[step.id][field.name];
            }
          } else {
            console.log(`🔍 Keeping field ${step.id}.${field.name} because at least one variant should be visible`);
          }
        } else {
          // Single field case - use original logic
          if (!shouldRender) {
            if (cleanedFormData[step.id]) {
              console.log(`🗑️ Clearing hidden field: ${step.id}.${field.name}`);
              delete cleanedFormData[step.id][field.name];
            }
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