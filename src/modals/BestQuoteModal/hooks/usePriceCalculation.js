import { useState, useEffect } from 'react';
import { shouldRenderField } from '../../../ui/Form/utils/formUtils';

export const usePriceCalculation = (formData, scheme, renderedSteps) => {
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

    let tvInstanceIndex = 0; // Initialize a counter for individual TV instances

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

    // 1. Process TV Size selections and related mounting options (unique dynamic step generation)
    const tvSizeStep = scheme.steps.find(s => s.id === "tv-size");
    const tvSelectionField = tvSizeStep?.fields.find(f => f.name === "tvSelection");
    const tvSelectionData = formData["tv-size"]?.tvSelection;

    if (tvSelectionField && Array.isArray(tvSelectionData)) {
      tvSelectionData.forEach((selection) => {
        if (selection.count > 0) {
          const option = tvSelectionField.options.find(opt => opt.value === selection.value);
          if (option) {
            const baseTvMountingCostPerUnit = (option.cost || 0);

            for (let i = 0; i < selection.count; i++) {
              tvInstanceIndex++;
              const tvSizeLabel = option.label;

              let tvSizeGroupItems = [{ label: "TV Mounting", cost: baseTvMountingCostPerUnit, fieldName: "tvMounting" }];

              // Process dynamic mounting step costs
              const dynamicStepId = `mounting-${tvInstanceIndex}`;
              const dynamicMountingData = formData[dynamicStepId];
              // Вычисляем parentContext вручную
              const parentContext = { parentValue: selection.value, parentLabel: selection.label };
              if (dynamicMountingData) {
                const mountingStepTemplate = scheme.steps.find(s => s.id === "mounting");
                if (mountingStepTemplate && mountingStepTemplate.template && mountingStepTemplate.template.fields) {
                  mountingStepTemplate.template.fields.forEach(fieldConfig => {
                    if (shouldRenderField(fieldConfig.showIf, formData, dynamicStepId, parentContext)) {
                      if (fieldConfig.name === "mountType") {
                        console.log("[usePriceCalculation] mountType processField", {
                          dynamicStepId,
                          fieldConfig,
                          value: dynamicMountingData[fieldConfig.name],
                          parentContext
                        });
                      }
                      tvSizeGroupItems.push(...processField(fieldConfig, dynamicMountingData[fieldConfig.name]));
                    }
                  });
                }
              }

              const tvSizeGroupTotal = tvSizeGroupItems.reduce((sum, item) => sum + item.cost, 0);
              currentTotal += tvSizeGroupTotal; // Add to global total

              tempStructuredBreakdown.push({
                type: "tvSize",
                label: tvSizeLabel,
                items: tvSizeGroupItems,
              });
            }
          }
        }
      });
    }

    // 2. Process ALL Other Static Steps (general purpose)
    scheme.steps.forEach(stepConfig => {
      // Skip steps already handled or template steps
      if (stepConfig.id === "tv-size" || stepConfig.id === "mounting") {
        return;
      }

      const stepFormData = formData[stepConfig.id];
      if (stepFormData) {
        let stepItems = []; // Collect all items for this step here

        // Extract special fields data first for post-processing
        let streamingData = [];
        let tvCountValue = 0;

        if (stepConfig.id === "additional-services") {
            const streamingFieldConfig = stepConfig.fields.find(f => f.name === "streaming");
            const tvCountFieldConfig = stepConfig.fields.find(f => f.name === "tvCount");

            if (streamingFieldConfig && shouldRenderField(streamingFieldConfig.showIf, formData, stepConfig.id)) {
                streamingData = processField(streamingFieldConfig, stepFormData.streaming);
            }
            if (tvCountFieldConfig && shouldRenderField(tvCountFieldConfig.showIf, formData, stepConfig.id)) {
                tvCountValue = stepFormData.tvCount; // Get raw value for multiplier
            }
        }

        const fieldsToProcess = stepConfig.fields || [];
        fieldsToProcess.forEach(fieldConfig => {
          // Skip 'needHelper' here as it's handled specifically later for placement
          // Skip 'streaming' and 'tvCount' as they are handled in post-processing for additional-services
          if (fieldConfig.name === "needHelper" ||
              (stepConfig.id === "additional-services" && (fieldConfig.name === "streaming" || fieldConfig.name === "tvCount"))) {
            return;
          }

          if (shouldRenderField(fieldConfig.showIf, formData, stepConfig.id)) {
            stepItems.push(...processField(fieldConfig, stepFormData[fieldConfig.name]));
          }
        });

        // POST-PROCESSING: Handle 'streaming' and 'tvCount' consolidation for 'additional-services'
        if (stepConfig.id === "additional-services") {
            if (streamingData.length > 0) {
                if (tvCountValue > 0) {
                    const initialStreamingTotal = streamingData.reduce((sum, item) => sum + item.cost, 0);
                    const totalStreamingCost = initialStreamingTotal * tvCountValue;

                    stepItems.push({
                        label: `Streaming Devices (${tvCountValue} devices)`,
                        cost: totalStreamingCost,
                        details: streamingData, // Store individual items as details
                        fieldName: "streamingConsolidated"
                    });
                } else {
                    // If no tvCount or tvCount is 0, add individual streaming items
                    stepItems.push(...streamingData);
                }
            }
        }

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

    // Handle 'needHelper' (specific placement logic)
    const needHelperFieldConfig = tvSizeStep?.fields.find(f => f.name === "needHelper");
    const needHelperData = formData["tv-size"]?.needHelper;

    if (needHelperFieldConfig && needHelperData !== undefined && needHelperData !== null) {
      if (shouldRenderField(needHelperFieldConfig.showIf, formData, "tv-size")) {
        const selectedHelperOption = needHelperFieldConfig.options.find(opt => opt.value === needHelperData);
        if (selectedHelperOption) {
          let helperItem = { label: selectedHelperOption.label, cost: (selectedHelperOption.cost || 0), fieldName: "needHelper" };
          currentTotal += helperItem.cost;

          const over81TvGroup = tempStructuredBreakdown.find(group =>
            group.type === "tvSize" && group.label.includes("Over 81")
          );

          if (over81TvGroup) {
            over81TvGroup.items.push(helperItem);
          } else { // If no Over 81" TV, add to existing general group or create one
            let existingGeneralGroup = tempStructuredBreakdown.find(group => group.type === "additional-services");
            if (!existingGeneralGroup) {
              existingGeneralGroup = { type: "additional-services", label: "Add-ons", items: [] }; // Re-add 'Add-ons' if not present
              tempStructuredBreakdown.push(existingGeneralGroup);
            }
            existingGeneralGroup.items.push(helperItem);
          }
        }
      }
    }

    // Process Discount (always applied and has fixed placement)
    const discountGroup = { type: "discount", label: "Discount", items: [] };
    const onlineOrderDiscount = -30; // Static discount for now
    currentTotal += onlineOrderDiscount;
    discountGroup.items.push({ label: "Online Order", cost: onlineOrderDiscount });
    tempStructuredBreakdown.push(discountGroup);


    setTotalPrice(currentTotal);
    setStructuredCostBreakdown(tempStructuredBreakdown);

  }, [formData, scheme, renderedSteps]);

  return { totalPrice, structuredCostBreakdown };
}; 