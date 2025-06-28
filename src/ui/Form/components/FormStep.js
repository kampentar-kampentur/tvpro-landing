import React from 'react';
import styles from './FormStep.module.css';
import CheckboxWithCounterField from '../components/fields/CheckboxWithCounterField';
import RadioField from '../components/fields/RadioField';
import CheckboxField from '../components/fields/CheckboxField';
import TextField from '../components/fields/TextField';
import CounterField from '../components/fields/CounterField';
import DateField from '../components/fields/DateField';
import CheckboxGroupField from '../components/fields/CheckboxGroupField';
import { shouldRenderField } from '../utils/formUtils';

const FormStep = ({ step, formData, onFieldChange, currentSubStep, totalSubSteps }) => {
  return (
    <div key={step.id} className={styles.formStep}>
      {step.subTitle && <div className={styles.subHeader}><h3>{step.subTitle}</h3> <span className={styles.subSteps}>{currentSubStep + 1}/{totalSubSteps}</span></div>}
      {
        step.fields && step.fields.map(field => {
          const fieldCurrentValue = formData[step.id] ? formData[step.id][field.name] : undefined;

          if (!shouldRenderField(field.showIf, formData, step.id, step.parentContext)) {
            return null; 
          }

          const handleFieldChange = (fieldValue) => {
            onFieldChange(step.id, field.name, fieldValue);
          };

          switch (field.type) {
            case "checkboxWithCounter":
              return (
                <div key={field.name} className={styles.option}>
                  {field.label && <h3 className={styles.fieldLabel}>{field.label}</h3>}
                  <CheckboxWithCounterField 
                    field={field} 
                    value={fieldCurrentValue} 
                    onChange={handleFieldChange} 
                  />
                </div>
              );
            case "radio":
              return (
                <div key={field.name} className={styles.option}>
                  {field.label && <h3 className={styles.fieldLabel}>{field.label}</h3>}
                  <RadioField 
                    field={field} 
                    value={fieldCurrentValue} 
                    onChange={handleFieldChange} 
                  />
                </div>
              );
            case "checkbox":
              return (
                <div key={field.name} className={styles.option}>
                  {field.label && <h3 className={styles.fieldLabel}>{field.label}</h3>}
                  <CheckboxField 
                    field={field} 
                    value={fieldCurrentValue} 
                    onChange={handleFieldChange} 
                  />
                </div>
              );
            case "text":
            case "tel":
            case "number":
              return (
                <div key={field.name} className={`${styles.option} ${styles.textOption}`}>
                  {field.label && <h3 className={styles.fieldLabel}>{field.label}</h3>}
                  <TextField 
                    field={field} 
                    value={fieldCurrentValue} 
                    onChange={handleFieldChange} 
                  />
                </div>
              );
            case "counter":
              return (
                <div key={field.name} className={styles.option}>
                  {field.label && <h3 className={styles.fieldLabel}>{field.label}</h3>}
                  <CounterField 
                    field={field} 
                    value={fieldCurrentValue} 
                    onChange={handleFieldChange} 
                  />
                </div>
              );
            case "date":
              return (
                <div key={field.name} className={styles.option}>
                  {field.label && <h3 className={styles.fieldLabel}>{field.label}</h3>}
                  <DateField 
                    field={field} 
                    value={fieldCurrentValue} 
                    onChange={handleFieldChange} 
                  />
                </div>
              );
            case "checkboxGroup":
              return (
                <div key={field.name} className={styles.option}>
                  {field.label && <h3 className={styles.fieldLabel}>{field.label}</h3>}
                  <CheckboxGroupField 
                    field={field} 
                    value={fieldCurrentValue} 
                    onChange={handleFieldChange} 
                  />
                </div>
              );
            default:
              return null;
          }
        })
      }
    </div>
  );
};

export default FormStep;
