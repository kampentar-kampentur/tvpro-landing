import React from 'react';
import { shouldRenderField } from '../utils/formUtils';
import CheckboxWithCounterField from './fields/CheckboxWithCounterField';
import RadioField from './fields/RadioField';
import CheckboxField from './fields/CheckboxField';
import TextField from './fields/TextField';
import CounterField from './fields/CounterField';
import DateField from './fields/DateField';
import CheckboxGroupField from './fields/CheckboxGroupField';
import styles from './FormField.module.css';

const FormField = ({ field, value, stepId, formData, onChange }) => {
  if (!shouldRenderField(field.showIf, formData, stepId)) {
    return null;
  }

  const handleChange = (fieldValue) => {
    onChange(stepId, field.name, fieldValue);
  };

  const fieldComponents = {
    checkboxWithCounter: CheckboxWithCounterField,
    radio: RadioField,
    checkbox: CheckboxField,
    text: TextField,
    tel: TextField,
    counter: CounterField,
    date: DateField,
    checkboxGroup: CheckboxGroupField
  };

  const FieldComponent = fieldComponents[field.type];

  if (!FieldComponent) {
    console.warn(`Unknown field type: ${field.type}`);
    return null;
  }

  return (
    <div className={styles.fieldContainer}>
      {field.label && field.type !== 'checkbox' && (
        <h3 className={styles.fieldLabel}>{field.label}</h3>
      )}
      <FieldComponent
        field={field}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};

export default FormField;
