import React from 'react';
import FormOption from '@/ui/Form/components/FormOption';

const CheckboxField = ({ field, value = false, onChange }) => {
  return (
    <FormOption
      type="checkbox"
      label={field.label}
      subLabel={field.cost ? `$${field.cost}` : undefined}
      checked={value}
      onChange={(e) => onChange(e.target.checked)}
    />
  );
};

export default CheckboxField; 