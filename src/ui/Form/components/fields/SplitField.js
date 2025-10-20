import React from 'react';
import TextField from './TextField';
import styles from './SplitField.module.css';

const SplitField = ({ fields, value = {}, onChange, className }) => {
  if (!fields || fields.length !== 2) {
    console.error('SplitField requires exactly 2 fields');
    return null;
  }

  const [firstField, secondField] = fields;

  const handleFieldChange = (fieldName) => (newValue) => {
    onChange({ ...value, [fieldName]: newValue });
  };

  return (
    <div className={`${styles.splitFieldContainer} ${className || ''}`}>
      <TextField
        field={firstField}
        value={value[firstField.name] || ''}
        onChange={handleFieldChange(firstField.name)}
        className={styles.splitFieldItem}
      />
      <TextField
        field={secondField}
        value={value[secondField.name] || ''}
        onChange={handleFieldChange(secondField.name)}
        className={styles.splitFieldItem}
      />
    </div>
  );
};

export default SplitField;