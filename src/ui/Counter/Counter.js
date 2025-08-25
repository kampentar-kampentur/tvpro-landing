import React from 'react';
import styles from './Counter.module.css';
import MinusIcon from '@/assets/icons/MinusCircle.svg';
import PlusIcon from '@/assets/icons/PlusCircle.svg';

const Counter = ({ value, onChange, className }) => {

  const handleIncrement = (e) => {
    e.preventDefault()
    onChange(value + 1);
  };

  const handleDecrement = (e) => {
    e.preventDefault()
    onChange(Math.max(1, value - 1));
  };

  return (
    <div className={`${styles.counter} ${className || ''}`}>
      <button onClick={handleDecrement} className={styles.button} aria-label="Decrement" disabled={value <= 1}>
        <MinusIcon width="24" height="24" />
      </button>
      <span className={styles.value}>{value}</span>
      <button onClick={handleIncrement} className={styles.button} aria-label="Increment">
        <PlusIcon width="24" height="24" />
      </button>
    </div>
  );
};

export default Counter; 