import React from 'react';
import { IMaskInput } from 'react-imask';
import styles from './TextField.module.css';

// Map field names to HTML autocomplete tokens
const AUTOCOMPLETE_MAP = {
  name: 'name',
  phone: 'tel',
  email: 'email',
  address: 'street-address',
  zip: 'postal-code',
  apt: 'address-line2',
};

const TextField = ({ field, value = '', onChange, className }) => {
  const isTel = field.type === 'tel';
  const isNumber = field.type === 'number';
  const hasValue = Boolean(value && value.length > 0);
  const autoCompleteValue = field.autoComplete || AUTOCOMPLETE_MAP[field.name] || 'on';
  const fieldId = `field-${field.name}`;

  return (
    <div className={(hasValue ? `${styles.textFieldContainer} ${styles.hasValue}` : styles.textFieldContainer) + " " + className}>
      {field.textLabel && hasValue && (
        <label htmlFor={fieldId} className={styles.textLabel}>{field.textLabel}</label>
      )}
      {isTel ? (
        <IMaskInput
          mask="000-000-0000"
          value={value}
          onAccept={(val) => onChange(val)}
          className={styles.textInput}
          placeholder={field.placeholder}
          type="tel"
          name={field.name}
          id={fieldId}
          autoComplete={autoCompleteValue}
        />
      ) : isNumber ? (
        <input
          type="number"
          className={styles.textInput}
          value={value}
          placeholder={field.placeholder}
          onChange={e => onChange(e.target.value.replace(/[^0-9.]/g, ''))}
          min={field.min}
          max={field.max}
          step={field.step}
          inputMode="numeric"
          pattern="[0-9]*"
          name={field.name}
          id={fieldId}
          autoComplete={autoCompleteValue}
        />
      ) : (
        <input
          type={field.type || 'text'}
          className={styles.textInput}
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          name={field.name}
          id={fieldId}
          autoComplete={autoCompleteValue}
        />
      )}
    </div>
  );
};

export default TextField; 