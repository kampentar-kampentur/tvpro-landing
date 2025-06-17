import FormOption from "@/ui/Form/components/FormOption"
import Counter from "@/ui/Counter"
import { useEffect, useMemo, useState } from "react";
import styles from './Form.module.css';
import Button from "@/ui/Button";


export default function Form({scheme, value, onChange, onSubmit, onStepChange}) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0) 
    const [currentSubStepIndex, setCurrentSubStepIndex] = useState(0);

    const currentStepConfig = useMemo(() => 
            scheme && scheme.steps ? scheme.steps[currentStepIndex] : null,
        [currentStepIndex, scheme]
    )

    const renderedSteps = useMemo(() => {
        if (!currentStepConfig) {
            return [];
        }

        if (currentStepConfig.type === "dynamic") {
            const [sourceStepId, sourceFieldName] = currentStepConfig.generateFrom.split('.');
            const sourceData = value[sourceStepId] ? value[sourceStepId][sourceFieldName] : [];

            if (!Array.isArray(sourceData)) {
                return [];
            }

            const itemsToGenerate = sourceData.filter(item => item.count > 0);
            let dynamicStepIndex = 1; 

            return itemsToGenerate.flatMap(item => {
                const subSteps = [];
                for (let i = 0; i < item.count; i++) {
                    const subStepId = `${currentStepConfig.id}-${dynamicStepIndex}`; 
                    let subStepTitle = currentStepConfig.template.title
                        .replace(/#{index}/g, dynamicStepIndex)
                        .replace(/{size}/g, item.label || item.value);

                    subSteps.push({
                        ...currentStepConfig.template,
                        id: subStepId,
                        title: subStepTitle,
                    });
                    dynamicStepIndex++;
                }
                return subSteps;
            });
        } else {
            return [currentStepConfig]; 
        }
    }, [currentStepConfig, value]);

    useEffect(() => {
        if (onStepChange) {
            onStepChange(currentStepIndex, currentSubStepIndex, renderedSteps.length);
        }
    }, [currentStepIndex, currentSubStepIndex, renderedSteps.length, onStepChange]);

    const stepToRender = useMemo(() => {
        if (currentStepConfig && currentStepConfig.type === "dynamic") {
            return renderedSteps[currentSubStepIndex];
        } else {
            return currentStepConfig;
        }
    }, [currentStepConfig, renderedSteps, currentSubStepIndex]);

    const shouldRenderField = (showIfCondition, formData, currentStepId) => {
        if (!showIfCondition) {
            return true; 
        }

        const { field, condition, value: targetValue, values: targetValues } = showIfCondition;
        
        let fieldValue;
        if (field.includes('.')) {
            const [refStepId, refFieldName] = field.split('.');
            fieldValue = formData[refStepId] ? formData[refStepId][refFieldName] : undefined;
        } else {
            fieldValue = formData[currentStepId] ? formData[currentStepId][field] : undefined;
        }

        switch (condition) {
            case "equals":
                return fieldValue === targetValue;
            case "notEquals":
                return fieldValue !== targetValue;
            case "hasAny":
                return Array.isArray(fieldValue) && Array.isArray(targetValues) && 
                       fieldValue.some(item => targetValues.includes(item.value));
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

    const handleFieldChange = (stepId, fieldName, fieldValue) => {
        onChange(prevData => ({
            ...prevData,
            [stepId]: {
                ...(prevData[stepId] || {}),
                [fieldName]: fieldValue
            }
        }));
    };
    
    const handleNextStep = () => {
        if (currentStepConfig.type === "dynamic" && currentSubStepIndex < renderedSteps.length - 1) {
            setCurrentSubStepIndex(prevIndex => prevIndex + 1);
        } else if (currentStepIndex < scheme.steps.length - 1) {
            setCurrentStepIndex(prevStep => prevStep + 1);
            setCurrentSubStepIndex(0);
        }
    };

    const handlePreviousStep = () => {
        if (currentStepConfig.type === "dynamic" && currentSubStepIndex > 0) {
            setCurrentSubStepIndex(prevIndex => prevIndex - 1);
        } else if (currentStepIndex > 0) {
            setCurrentStepIndex(prevStep => prevStep - 1);
            setCurrentSubStepIndex(0);
        }
    };
    
    return (
        <form>
            {stepToRender && (
                <div key={stepToRender.id}>
                    {
                        stepToRender.fields && stepToRender.fields.map(field => {
                            const fieldCurrentValue = value[stepToRender.id] ? value[stepToRender.id][field.name] : undefined;

                            if (!shouldRenderField(field.showIf, value, stepToRender.id)) {
                                return null; 
                            }

                            return (
                                <div key={field.name}>
                                    {field.label && <h3 className={styles.fieldLabel}>{field.label}</h3>}
                                    {field.type === "checkboxWithCounter" && (
                                        <div className={styles.optionsGrid}>
                                            {field.options.map(option => {
                                                const isChecked = Array.isArray(fieldCurrentValue) && fieldCurrentValue.some(item => item.value === option.value);
                                                return (
                                                    <FormOption 
                                                        key={option.value}
                                                        type="checkbox"
                                                        label={option.label}
                                                        subLabel={option.cost ? `$${option.cost}` : undefined}
                                                        enableCounter={true}
                                                        checked={isChecked}
                                                        onChange={() => {
                                                            let newSelection;
                                                            if (isChecked) {
                                                                newSelection = fieldCurrentValue.filter(item => item.value !== option.value);
                                                            } else {
                                                                newSelection = [...(fieldCurrentValue || []), { value: option.value, count: 1 }];
                                                            }
                                                            handleFieldChange(stepToRender.id, field.name, newSelection);
                                                        }}
                                                        onCounterChange={(counterValue) => {
                                                            const updatedSelection = fieldCurrentValue.map(item => 
                                                                item.value === option.value ? { ...item, count: counterValue } : item
                                                            );
                                                            handleFieldChange(stepToRender.id, field.name, updatedSelection);
                                                        }}
                                                    />
                                                );
                                            })}
                                        </div>
                                    )}
                                    {field.type === "radio" && (
                                        <div className={styles.optionsGrid}>
                                            {field.options.map(option => (
                                                <FormOption 
                                                    key={option.value}
                                                    type="radiobutton"
                                                    name={field.name} 
                                                    label={option.label}
                                                    subLabel={option.cost ? `$${option.cost}` : undefined}
                                                    checked={fieldCurrentValue === option.value}
                                                    onChange={() => handleFieldChange(stepToRender.id, field.name, option.value)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                    {field.type === "checkbox" && (
                                        <FormOption 
                                            type="checkbox"
                                            label={field.label}
                                            subLabel={field.cost ? `$${field.cost}` : undefined}
                                            checked={fieldCurrentValue || false}
                                            onChange={(e) => handleFieldChange(stepToRender.id, field.name, e.target.checked)}
                                        />
                                    )}
                                    {field.type === "text" && (
                                        <div>
                                            <label>{field.label}</label>
                                            <input 
                                                type="text" 
                                                value={fieldCurrentValue || ""}
                                                onChange={(e) => handleFieldChange(stepToRender.id, field.name, e.target.value)}
                                            />
                                        </div>
                                    )}
                                    {field.type === "counter" && (
                                        <div>
                                            <label>{field.label}</label>
                                            <Counter
                                                value={fieldCurrentValue !== undefined ? fieldCurrentValue : field.defaultValue}
                                                onChange={(newValue) => handleFieldChange(stepToRender.id, field.name, newValue)}
                                                min={field.min}
                                                max={field.max}
                                            />
                                        </div>
                                    )}
                                    {field.type === "date" && (
                                        <div>
                                            <label>{field.label}</label>
                                            <input 
                                                type="date" 
                                                value={fieldCurrentValue || ""}
                                                onChange={(e) => handleFieldChange(stepToRender.id, field.name, e.target.value)}
                                            />
                                        </div>
                                    )}
                                    {field.type === "checkboxGroup" && (
                                        <div className={styles.optionsGrid}>
                                            {field.options.map(option => (
                                                <FormOption 
                                                    key={option.value}
                                                    type="checkbox"
                                                    label={option.label}
                                                    subLabel={option.cost ? `$${option.cost}` : undefined}
                                                    checked={Array.isArray(fieldCurrentValue) && fieldCurrentValue.includes(option.value)}
                                                    onChange={(e) => {
                                                        let newSelection;
                                                        if (e.target.checked) {
                                                            newSelection = [...(fieldCurrentValue || []), option.value];
                                                        } else {
                                                            newSelection = fieldCurrentValue.filter(item => item !== option.value);
                                                        }
                                                        handleFieldChange(stepToRender.id, field.name, newSelection);
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    }
                </div>
            )}
            <div className={styles.navigationButtons}>
                {(currentStepIndex > 0 || (currentStepConfig.type === "dynamic" && currentSubStepIndex > 0)) && (
                    <Button size="small" variant="secondary" onClick={handlePreviousStep}>Previous Step</Button>
                )}
                {(currentStepIndex < scheme.steps.length - 1 || (currentStepConfig.type === "dynamic" && currentSubStepIndex < renderedSteps.length - 1)) && (
                    <Button size="small" onClick={handleNextStep}>Next Step</Button>
                )}
            </div>
        </form>
    )
}