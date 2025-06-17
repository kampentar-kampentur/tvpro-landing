import React from 'react';
import FormOption from '@/ui/Form/components/FormOption';
import formStyles from '../../Form.module.css'

const RadioField = ({ field, value, onChange }) => {
  return (
    <div className={formStyles.optionsGrid}>
      {field.options.map(option => (
        <FormOption
          key={option.value}
          type="radiobutton"
          name={field.name}
          label={option.label}
          subLabel={option.cost ? `$${option.cost}` : undefined}
          checked={value === option.value}
          onChange={() => onChange(option.value)}
        />
      ))}
    </div>
  );
};

export default RadioField; 