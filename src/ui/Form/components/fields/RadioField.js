import React from 'react';
import SelectionCard from '@/ui/SelectionCard';
import formStyles from '../../Form.module.css'

const RadioField = ({ field, value, onChange }) => {
  const handleClick = (optionValue) => {
    if (value === optionValue) {
      onChange(null);
    } else {
      onChange(optionValue);
    }
  };

  return (
    <div className={formStyles.optionsGrid}>
      {field.options
        .filter(option => !value || option.value === value)
        .map(option => (
          <SelectionCard
            key={option.value}
            selected={value === option.value}
            onClick={() => handleClick(option.value)}
            label={option.label}
            price={option.cost !== undefined && option.cost !== null ? (option.cost === 0 ? '$0' : `$${option.cost}`) : null}
          />
        ))}
    </div>
  );
};

export default RadioField; 