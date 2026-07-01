import React from 'react';
import styles from './TextAreaField.module.css';
import fieldStyles from './TextField.module.css';

const TextAreaField = ({ label, placeholder, value, onChange, error }) => {
  return (
    <div className={styles.container}>
      <span className={styles.label}>{label}</span>
      <textarea
        className={`${styles.textarea} ${error ? styles.invalid : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && (
        <span className={fieldStyles.errorText} style={{ marginTop: '4px' }}>
          {error}
        </span>
      )}
    </div>
  );
};

export default TextAreaField;
