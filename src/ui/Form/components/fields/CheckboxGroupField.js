import React from 'react';
import styles from './CheckboxGroupField.module.css';
import fieldStyles from './TextField.module.css';

const CheckboxGroupField = ({ label, options, value = [], onChange, error, columns, field }) => {
  const finalLabel = label || field?.label;
  const finalOptions = options || field?.options || [];

  const handleToggle = (optionValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  return (
    <div className={`${styles.container} ${error ? styles.invalid : ''}`}>
      {finalLabel && <span className={styles.label}>{finalLabel}</span>}
      <div className={styles.verticalList}>
        {finalOptions.map((opt) => {
          const isSelected = value.includes(opt.value);
          return (
            <div
              key={opt.value}
              className={`${styles.checkboxRow} ${isSelected ? styles.selected : ''}`}
              onClick={() => handleToggle(opt.value)}
            >
              <div className={styles.checkboxIcon} aria-checked={isSelected} />
              <div className={styles.textContainer}>
                <span className={styles.optionLabel}>{opt.label}</span>
                {opt.subtitle && <span className={styles.optionSubtitle}>{opt.subtitle}</span>}
              </div>
              {opt.cost !== undefined && (
                <span className={styles.priceTag}>
                  {opt.costLabel ? opt.costLabel : `+$${opt.cost}`}
                </span>
              )}
            </div>
          );
        })}
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