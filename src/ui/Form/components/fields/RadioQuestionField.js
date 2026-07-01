import React from 'react';
import Radiobutton from '@/ui/Radiobutton/Radiobutton';
import fieldStyles from './TextField.module.css';

const RadioQuestionField = ({ question, name, value, onChange, options = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }], error }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginBottom: '6px' }}>
      <span style={{ fontSize: '14px', fontWeight: '600', color: '#0e0e13', textAlign: 'left' }}>
        {question}
      </span>
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        {options.map((opt) => (
          <Radiobutton
            key={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            label={opt.label}
            name={name}
            value={opt.value}
          />
        ))}
      </div>
      {error && (
        <span className={fieldStyles.errorText} style={{ marginTop: '2px' }}>
          {error}
        </span>
      )}
    </div>
  );
};

export default RadioQuestionField;
