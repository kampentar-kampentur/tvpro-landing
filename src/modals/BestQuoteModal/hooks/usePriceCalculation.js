import { useState, useEffect } from 'react';
import { shouldRenderField } from '../../../ui/Form/utils/formUtils';

export const usePriceCalculation = (
  formData,
  scheme,
  renderedSteps,
  {
    discountType = null, // "fixed" | "percent" | null
    discountValue = 0,
    discountCondition = (total) => false, // по умолчанию скидка не применяется
    discountLabel = "Discount"
  } = {}
) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [structuredCostBreakdown, setStructuredCostBreakdown] = useState([]);

  useEffect(() => {
    if (!scheme || !scheme.priceCalculation || !scheme.steps || !renderedSteps) {
      setTotalPrice(0);
      setStructuredCostBreakdown([]);
      return;
    }

    let currentTotal = scheme.priceCalculation.baseCost || 0;
    const tempStructuredBreakdown = [];

    // Helper function to process a single field config and return item(s) for breakdown
    const processField = (fieldConfig, fieldValue) => {
      const items = [];
      if (fieldValue !== undefined && fieldValue !== null) {
        if (fieldConfig.type === "checkbox") {
          if (fieldValue && fieldConfig.cost) {
            items.push({ label: fieldConfig.label || fieldConfig.name, cost: fieldConfig.cost, fieldName: fieldConfig.name });
          }
        } else if (fieldConfig.type === "radio") {
          const selectedOption = fieldConfig.options?.find(opt => opt.value === fieldValue);
          if (selectedOption) {
            items.push({ label: selectedOption.label, cost: (selectedOption.cost || 0), fieldName: fieldConfig.name });
          }
        } else if (fieldConfig.type === "checkboxGroup" && Array.isArray(fieldValue)) {
          fieldValue.forEach(item => {
            const option = fieldConfig.options?.find(opt => opt.value === (item.value !== undefined ? item.value : item));
            if (option) {
              items.push({ label: option.label, cost: (option.cost || 0), fieldName: fieldConfig.name });
            }
          });
        } else if (fieldConfig.type === "counter" && fieldConfig.costPerUnit && fieldValue > 0) {
          const cost = fieldConfig.costPerUnit * fieldValue;
          items.push({ label: fieldConfig.label || fieldConfig.name, cost: cost, fieldName: fieldConfig.name });
        } else if (fieldConfig.type === "checkboxWithCounter" && Array.isArray(fieldValue)) {
          fieldValue.forEach(item => {
            if (item.count > 0) {
              const option = fieldConfig.options?.find(opt => opt.value === item.value);
              if (option) {
                const cost = (option.cost || 0) * item.count;
                items.push({
                  label: `${option.label}${item.count > 1 ? ` ×${item.count}` : ""}`,
                  cost,
                  fieldName: fieldConfig.name
                });
              }
            }
          });
        }
      }
      return items;
    };

    // Process all steps
    scheme.steps.forEach(stepConfig => {
      const stepFormData = formData[stepConfig.id];
      if (stepFormData) {
        let stepItems = [];

        stepConfig.fields.forEach(fieldConfig => {
          if (shouldRenderField(fieldConfig.showIf, formData, stepConfig.id)) {
            stepItems.push(...processField(fieldConfig, stepFormData[fieldConfig.name]));
          }
        });

        // Sum up costs for this group and add to structured breakdown if items exist
        if (stepItems.length > 0) {
          const groupTotal = stepItems.reduce((sum, item) => sum + item.cost, 0);
          currentTotal += groupTotal;

          tempStructuredBreakdown.push({
            type: stepConfig.id,
            label: stepConfig.title || stepConfig.label || stepConfig.id,
            items: stepItems,
          });
        }
      }
    });

    let discountApplied = false;
    let discountAmount = 0;
    const discountGroup = { type: "discount", label: discountLabel, items: [] };

    if (
      discountType &&
      typeof discountCondition === "function" &&
      discountCondition(currentTotal)
    ) {
      if (discountType === "percent") {
        discountAmount = -Math.round(currentTotal * (discountValue / 100));
      } else if (discountType === "fixed") {
        discountAmount = -discountValue;
      }
      if (discountAmount !== 0) {
        currentTotal += discountAmount;
        discountApplied = true;
      }
    }

    if (discountApplied) {
      discountGroup.items.push({ label: discountLabel, cost: discountAmount });
      tempStructuredBreakdown.push(discountGroup);
    }

    setTotalPrice(currentTotal);
    setStructuredCostBreakdown(tempStructuredBreakdown);

  }, [formData, scheme, renderedSteps, discountType, discountValue, discountCondition, discountLabel]);

  return { totalPrice, structuredCostBreakdown };
};