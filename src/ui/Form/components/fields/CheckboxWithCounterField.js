import React from 'react';
import FormOption from '@/ui/Form/components/FormOption';
import formStyles from '../../Form.module.css'

const CheckboxWithCounterField = ({ field, value = [], onChange }) => {
  const handleOptionToggle = (option) => {
    const isChecked = value.some(item => item.value === option.value);
    
    let newSelection;
    if (isChecked) {
      newSelection = value.filter(item => item.value !== option.value);
    } else {
      newSelection = [...value, { value: option.value, count: 1, label: option.label }];
    }
    onChange(newSelection);
  };

  const handleCounterChange = (optionValue, counterValue) => {
    const updatedSelection = value.map(item => 
      item.value === optionValue ? { ...item, count: counterValue } : item
    );
    onChange(updatedSelection);
  };
  if (!field.options.length) {
    return
  }
  return (
    <div className={formStyles.optionsGrid}>
      {field.options.map(option => {
        const isChecked = value.some(item => item.value === option.value);
        const currentItem = value.find(item => item.value === option.value);
        
        return (
          <FormOption
            key={option.value}
            type="checkbox"
            label={option.label}
            subLabel={option.cost ? `$${option.cost}` : undefined}
            enableCounter={true}
            checked={isChecked}
            counterValue={currentItem?.count || 1}
            onChange={() => handleOptionToggle(option)}
            onCounterChange={(counterValue) => handleCounterChange(option.value, counterValue)}
          />
        );
      })}
    </div>
  );
};

export default CheckboxWithCounterField; 