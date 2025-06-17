import React from 'react';
import Counter from '@/ui/Counter';
import styles from './CounterField.module.css';

const CounterField = ({ field, value, onChange }) => {
  const currentValue = value !== undefined ? value : field.defaultValue;
  
  return (
    <div className={styles.counterContainer}>
      <Counter
        value={currentValue}
        onChange={onChange}
        min={field.min}
        max={field.max}
      />
    </div>
  );
};

export default CounterField; 