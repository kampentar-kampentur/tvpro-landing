import React, { useState } from 'react';
import SelectionCard from '@/ui/SelectionCard';
import { shouldRenderField } from '../../utils/formUtils';
import formStyles from '../../Form.module.css'

const RadioField = ({ field, value, onChange, isMobile, formData, stepId, step, isShaking }) => {
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

  const filteredOptions = field.options.filter(option => 
    !option.showIf || (formData && shouldRenderField(option.showIf, formData, stepId || step?.id))
  );

  if (!filteredOptions.length) {
    return null;
  }

  return (
    <div className={formStyles.optionsGrid}>
      {filteredOptions
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
            isShaking={isShaking}
          />
        ))}
    </div>
  );
};

export default RadioField; 