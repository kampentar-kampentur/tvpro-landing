import React, { useState, useEffect, useRef } from 'react';
import fieldStyles from './TextField.module.css';
import styles from './SelectField.module.css';

const SelectField = ({ label, placeholder, value, onChange, options, className, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasValue = Boolean(value);
  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : value;

  const containerClassName = [
    fieldStyles.textFieldContainer,
    hasValue ? fieldStyles.hasValue : '',
    isOpen ? styles.selectFocused : '',
    error ? fieldStyles.invalid : '',
    className || ''
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={containerRef}
      className={containerClassName}
      onClick={() => setIsOpen(!isOpen)}
      style={{ cursor: 'pointer', position: 'relative' }}
    >
      {hasValue && (
        <label className={fieldStyles.textLabel}>{label || placeholder}</label>
      )}
      <div className={fieldStyles.inputWrapper} style={{ pointerEvents: "none" }}>
        <input
          type="text"
          className={fieldStyles.textInput}
          value={hasValue ? displayLabel : ''}
          placeholder={placeholder}
          readOnly
          style={{ width: '100%', cursor: 'pointer' }}
        />
        <svg
          width="16"
          height="16"
          fill="none"
          stroke="#91929c"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          style={{
            transition: 'transform 0.2s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            marginLeft: 'auto',
            flexShrink: 0
          }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </div>

      {isOpen && (
        <div className={styles.dropdownOptions}>
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`${styles.dropdownOption} ${value === opt.value ? styles.dropdownOptionActive : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onChange(opt.value);
                setIsOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
      {error && <span className={fieldStyles.errorText}>{error}</span>}
    </div>
  );
};

export default SelectField;
