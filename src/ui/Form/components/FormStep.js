import React, { useState } from 'react';
import styles from './FormStep.module.css';
import RadioField from '../components/fields/RadioField';
import CheckboxField from '../components/fields/CheckboxField';
import TextField from '../components/fields/TextField';
import CounterField from '../components/fields/CounterField';
import DateField from '../components/fields/DateField';
import CheckboxGroupField from '../components/fields/CheckboxGroupField';
import SplitField from '../components/fields/SplitField';
import { shouldRenderField } from '../utils/formUtils';
import ChevronIcon from '@/assets/icons/chevron.svg';
import Button from '@/ui/Button';

const FormStep = ({ step, formData, onFieldChange, currentSubStep, totalSubSteps, isMobile, currentStepIndex, onClose, onBack, onNext, onValidationError }) => {
  const [shakingField, setShakingField] = useState(null);

  if (!step) {
    return <div>hahaha{step}</div>
  }

  const isFieldRequiredAndMissing = (field) => {
    if (!field.isRequired) return false;
    if (!shouldRenderField(field.showIf, formData, step.id, step.parentContext)) return false;
    const val = formData[step.id]?.[field.name];
    return val === undefined || val === null || val === '';
  };

  const isStepValid = step.fields ? !step.fields.some(isFieldRequiredAndMissing) : true;

  const handleNextClick = () => {
    if (!isStepValid) {
      const missingField = step.fields?.find(isFieldRequiredAndMissing);
      if (missingField) {
        onValidationError?.(missingField.name, "required");
        setShakingField(missingField.name);
        setTimeout(() => {
          setShakingField(null);
        }, 600);
      }
    } else {
      onNext();
    }
  };

  return (
    <div key={step.id} className={styles.formStep}>
      {step?.subTitle && <div className={styles.subHeader}><h3>{step?.subTitle}</h3> <span className={styles.subSteps}>{currentSubStep + 1}/{totalSubSteps}</span></div>}

      {
        step.fields && step.fields
          .filter((field) => shouldRenderField(field.showIf, formData, step.id, step.parentContext))
          .map((field, index) => {
            const fieldCurrentValue = formData[step.id] ? formData[step.id][field.name] : undefined;

            const handleFieldChange = (fieldValue) => {
              onFieldChange(step.id, field.name, fieldValue);
            };

            const isShaking = shakingField === field.name;

            switch (field.type) {
              case "checkboxWithCounter":
                return (
                  <div key={field.name} className={styles.option}>
                    <span style={{ display: "flex", marginBottom: "24px" }}>
                      {(currentStepIndex > 0 || currentSubStep > 0) && index === 0 && (
                        <button className={styles.backButton} onClick={onBack}>
                          <ChevronIcon />
                        </button>
                      )}
                      {field.label && <h3 className={`${styles.fieldLabel}`}>{field.label}</h3>}
                    </span>
                    <RadioField
                      field={field}
                      value={fieldCurrentValue}
                      onChange={handleFieldChange}
                      step={step}
                      stepId={step.id}
                      formData={formData}
                      isMobile={isMobile}
                      isShaking={isShaking}
                    />
                    {field.description && <p className={styles.fieldDescription}>{field.description}</p>}
                  </div>
                );
              case "radio":
                return (
                  <div key={field.name} className={styles.option}>
                    <span style={{ display: "flex", marginBottom: "24px" }}>
                      {(currentStepIndex > 0 || currentSubStep > 0) && index === 0 && (
                        <button className={styles.backButton} onClick={onBack}>
                          <ChevronIcon />
                        </button>
                      )}
                      {field.label && <h3 className={`${styles.fieldLabel} ${fieldCurrentValue ? styles.selectedField : ''}`}>{field.label}</h3>}
                    </span>

                    <RadioField
                      field={field}
                      value={fieldCurrentValue}
                      onChange={handleFieldChange}
                      step={step}
                      stepId={step.id}
                      formData={formData}
                      isMobile={isMobile}
                      isShaking={isShaking}
                    />
                    {field.description && <p className={styles.fieldDescription}>{field.description}</p>}
                  </div>
                );
              case "checkbox":
                return (
                  <div key={field.name} className={styles.option}>
                    <span style={{ display: "flex", marginBottom: "24px" }}>
                      {(currentStepIndex > 0 || currentSubStep > 0) && index === 0 && (
                        <button className={styles.backButton} onClick={onBack}>
                          <ChevronIcon />
                        </button>
                      )}
                      {field.label && <h3 className={styles.fieldLabel}>{field.label}</h3>}
                    </span>
                    <CheckboxField
                      field={field}
                      value={fieldCurrentValue}
                      onChange={handleFieldChange}
                    />
                    {field.description && <p className={styles.fieldDescription}>{field.description}</p>}
                  </div>
                );
              case "text":
              case "tel":
              case "number":
                return (
                  <div key={field.name} className={`${styles.option} ${styles.textOption} ${step.id === 'contactInfo' ? styles.contactInfoField : ''}`}>
                    <span style={{ display: "flex" }}>
                      {(currentStepIndex > 0 || currentSubStep > 0) && index === 0 && (
                        <button className={styles.backButton} onClick={onBack}>
                          <ChevronIcon />
                        </button>
                      )}
                      {field.label && <h3 className={styles.fieldLabel}>{field.label}</h3>}
                    </span>
                    <TextField
                      field={field}
                      value={fieldCurrentValue}
                      onChange={handleFieldChange}
                    />
                    {field.description && <p className={styles.fieldDescription}>{field.description}</p>}
                  </div>
                );
              case "counter":
                return (
                  <div key={field.name} className={styles.option}>
                    <span style={{ display: "flex", marginBottom: "24px" }}>
                      {(currentStepIndex > 0 || currentSubStep > 0) && index === 0 && (
                        <button className={styles.backButton} onClick={onBack}>
                          <ChevronIcon />
                        </button>
                      )}
                      {field.label && <h3 className={styles.fieldLabel}>{field.label}</h3>}
                    </span>
                    <CounterField
                      field={field}
                      value={fieldCurrentValue}
                      onChange={handleFieldChange}
                    />
                    {field.description && <p className={styles.fieldDescription}>{field.description}</p>}
                  </div>
                );
              case "date":
                return (
                  <div key={field.name} className={styles.option}>
                    <span style={{ display: "flex", marginBottom: "24px" }}>
                      {(currentStepIndex > 0 || currentSubStep > 0) && index === 0 && (
                        <button className={styles.backButton} onClick={onBack}>
                          <ChevronIcon />
                        </button>
                      )}
                      {field.label && <h3 className={styles.fieldLabel}>{field.label}</h3>}
                    </span>
                    <DateField
                      field={field}
                      value={fieldCurrentValue}
                      onChange={handleFieldChange}
                    />
                    {field.description && <p className={styles.fieldDescription}>{field.description}</p>}
                  </div>
                );
              case "checkboxGroup":
                return (
                  <div key={field.name} className={styles.option}>
                    {index === 0 && (
                      <span style={{ display: "flex", marginBottom: "24px" }}>
                        {(currentStepIndex > 0 || currentSubStep > 0) && (
                          <button className={styles.backButton} onClick={onBack}>
                            <ChevronIcon />
                          </button>
                        )}
                        {field.label && <h3 className={styles.fieldLabel}>{field.label}</h3>}
                      </span>
                    )}
                    <CheckboxGroupField
                      field={field}
                      value={fieldCurrentValue}
                      onChange={handleFieldChange}
                      label={index === 0 ? "" : undefined}
                    />
                    {field.description && <p className={styles.fieldDescription}>{field.description}</p>}
                  </div>
                );
              case "splited":
                return (
                  <div key={field.name} className={`${styles.option} ${styles.splitOption}`}>
                    <span style={{ display: "flex" }}>
                      {(currentStepIndex > 0 || currentSubStep > 0) && index === 0 && (
                        <button className={styles.backButton} onClick={onBack}>
                          <ChevronIcon />
                        </button>
                      )}
                      {field.label && <h3 className={styles.fieldLabel}>{field.label}</h3>}
                    </span>
                    <SplitField
                      fields={field.fields}
                      value={fieldCurrentValue}
                      onChange={handleFieldChange}
                    />
                    {field.description && <p className={styles.fieldDescription}>{field.description}</p>}
                  </div>
                );
              default:
                return null;
            }
          })
      }
      {
        step.fields && step.fields.some(f => f.type === "checkboxGroup") && (
          <div className={styles.navigation}>
            <Button
              variant="primary"
              size="big"
              onClick={handleNextClick}
              className={`${styles.nextBtn} ${!isStepValid ? styles.disabledBtn : ''}`}
            >
              Next
            </Button>
          </div>
        )
      }
    </div>
  );
};

export default FormStep;
