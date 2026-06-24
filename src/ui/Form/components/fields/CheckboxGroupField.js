import React from 'react';
import Checkbox from '@/ui/Checkbox';
import styles from './CheckboxGroupField.module.css';
import fieldStyles from './TextField.module.css';

const CheckboxGroupField = ({ label, options, value = [], onChange, error, columns }) => {
  const handleToggle = (optionValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  return (
    <div className={`${styles.container} ${error ? styles.invalid : ''}`}>
      <span className={styles.label}>{label}</span>
      <div className={styles.grid} style={columns ? { gridTemplateColumns: `repeat(${columns}, 1fr)` } : undefined}>
        {options.map((opt) => (
          <div key={opt.value} className={styles.checkboxItem}>
            <Checkbox
              checked={value.includes(opt.value)}
              onChange={() => handleToggle(opt.value)}
              label={opt.label}
            />
          </div>
        ))}
      </div>
      {error && (
        <span className={fieldStyles.errorText} style={{ marginTop: '4px' }}>
          {error}
        </span>
      )}
    </div>
  );
};

export default CheckboxGroupField;