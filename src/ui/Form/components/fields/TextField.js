import React from 'react';
import { IMaskInput } from 'react-imask';
import styles from './TextField.module.css';

const TextField = ({ field, value = '', onChange }) => {
  const isTel = field.type === 'tel';
  const hasValue = Boolean(value && value.length > 0);
  return (
    <div className={hasValue ? `${styles.textFieldContainer} ${styles.hasValue}` : styles.textFieldContainer}>
      {field.textLabel && hasValue && (
        <label className={styles.textLabel}>{field.textLabel}</label>
      )}
      {isTel ? (
        <IMaskInput
          mask="000-000-0000"
          value={value}
          onAccept={(val) => onChange(val)}
          className={styles.textInput}
          placeholder={field.placeholder}
          type="tel"
        />
      ) : (
        <input
          type={field.type || 'text'}
          className={styles.textInput}
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
};

export default TextField; 