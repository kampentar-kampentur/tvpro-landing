import React from 'react';
import FormOption from '@/ui/Form/components/FormOption';
import formStyles from '../../Form.module.css'

const CheckboxGroupField = ({ field, value = [], onChange }) => {
  const handleOptionChange = (optionValue, checked) => {
    let newSelection;
    if (checked) {
      newSelection = [...value, optionValue];
    } else {
      newSelection = value.filter(item => item !== optionValue);
    }
    onChange(newSelection);
  };
  if (!field.options.length) {
    return
  }

  return (
    <div className={formStyles.optionsGrid}>
      {field.options.map(option => (
        <FormOption
          key={option.value}
          type="checkbox"
          label={option.label}
          subLabel={option.cost ? `$${option.cost}` : undefined}
          checked={value.includes(option.value)}
          onChange={(e) => handleOptionChange(option.value, e.target.checked)}
        />
      ))}
    </div>
  );
};

export default CheckboxGroupField; 