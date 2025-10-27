import React, { useState } from 'react';
import SelectionCard from '@/ui/SelectionCard';
import formStyles from '../../Form.module.css'

const RadioField = ({ field, value, onChange, isMobile }) => {
  const [isInfoShow, setIsInfoShow] = useState(null);

  const handleClick = (optionValue) => {
    if (value === optionValue) {
      onChange(null);
    } else {
      onChange(optionValue);
    }
  };

  const handleInfoClick = (optionValue) => {
    setIsInfoShow(isInfoShow === optionValue ? null : optionValue);
  };
  if (!field.options.length) {
    return
  }

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
            price={option.cost !== undefined && option.cost !== null ? (option.costLabel ? option.costLabel : `$${option.cost}`) : null}
            subtitle={option.subtitle}
            description={option.description}
            isInfoShow={isInfoShow === option.value}
            onInfoClick={() => handleInfoClick(option.value)}
          />
        ))}
    </div>
  );
};

export default RadioField; 