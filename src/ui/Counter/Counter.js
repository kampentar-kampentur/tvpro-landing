import React from 'react';
import styles from './Counter.module.css';
import MinusIcon from '@/assets/icons/minus.svg';
import PlusIcon from '@/assets/icons/plus.svg';

const Counter = ({ value, onChange, className }) => {

  const handleIncrement = () => {
    onChange(value + 1);
  };

  const handleDecrement = () => {
    onChange(Math.max(0, value - 1));
  };

  return (
    <div className={`${styles.counter} ${className || ''}`}>
      <button onClick={handleDecrement} className={styles.button} aria-label="Decrement">
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