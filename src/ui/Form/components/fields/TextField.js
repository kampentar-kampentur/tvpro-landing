import React, { useRef, useCallback } from 'react';
import styles from './TextField.module.css';

// Map field names to HTML autocomplete tokens
const AUTOCOMPLETE_MAP = {
  name: 'name',
  phone: 'tel',
  email: 'email',
  address: 'street-address',
  zip: 'postal-code',
  apt: 'address-line2',
};

/**
 * Formats raw digits into US phone format: (XXX) XXX-XXXX
 * Handles optional leading 1 or +1 prefix.
 */
function formatUSPhone(raw) {
  if (!raw) return '';
  let digits = raw.replace(/\D/g, '');
  // Strip leading 1 for display (country code)
  if (digits.length > 10 && digits.startsWith('1')) {
    digits = digits.slice(1);
  }
  if (digits.length === 0) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

/**
 * Given a cursor position in the formatted string, return how many
 * digits are before that position.
 */
function digitIndexAtCursor(formatted, cursorPos) {
  let count = 0;
  for (let i = 0; i < cursorPos && i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) count++;
  }
  return count;
}

/**
 * Given a digit index, find the cursor position in the formatted string
 * that sits right after the Nth digit.
 */
function cursorPosAtDigitIndex(formatted, digitIdx) {
  let count = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) {
      count++;
      if (count === digitIdx) return i + 1;
    }
  }
  return formatted.length;
}

const TextField = ({ field, value = '', onChange, className }) => {
  const isTel = field.type === 'tel';
  const isNumber = field.type === 'number';
  const hasValue = Boolean(value && value.length > 0);
  const autoCompleteValue = field.autoComplete || AUTOCOMPLETE_MAP[field.name] || 'on';
  const fieldId = `field-${field.name}`;
  const inputRef = useRef(null);

  const handlePhoneChange = useCallback((e) => {
    const input = e.target;
    const rawInput = input.value;
    const cursorBefore = input.selectionStart || 0;

    // Extract only digits from the new input
    let digits = rawInput.replace(/\D/g, '');

    // Cap at 11 digits (1 + 10) or 10 digits
    if (digits.length > 11) digits = digits.slice(0, 11);
    if (digits.length > 10 && !digits.startsWith('1')) digits = digits.slice(0, 10);

    // Store raw digits
    onChange(digits);

    // Figure out where the cursor should go in the new formatted string
    const digitsBefore = digitIndexAtCursor(rawInput, cursorBefore);
    const newFormatted = formatUSPhone(digits);
    const newCursor = cursorPosAtDigitIndex(newFormatted, digitsBefore);

    // Defer cursor restoration to after React re-renders
    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.setSelectionRange(newCursor, newCursor);
      }
    });
  }, [onChange]);

  // Display the formatted value
  const displayValue = isTel ? formatUSPhone(value) : value;

  return (
    <div className={(hasValue ? `${styles.textFieldContainer} ${styles.hasValue}` : styles.textFieldContainer) + " " + className}>
      {field.textLabel && hasValue && (
        <label htmlFor={fieldId} className={styles.textLabel}>{field.textLabel}</label>
      )}
      <div className={styles.inputWrapper}>
        {isTel ? (
          <input
            ref={inputRef}
            className={styles.textInput}
            value={displayValue}
            onChange={handlePhoneChange}
            placeholder={field.placeholder}
            type="tel"
            name={field.name}
            id={fieldId}
            autoComplete={autoCompleteValue}
          />
        ) : isNumber ? (
          <input
            type="number"
            className={styles.textInput}
            value={value}
            placeholder={field.placeholder}
            onChange={e => onChange(e.target.value.replace(/[^0-9.]/g, ''))}
            min={field.min}
            max={field.max}
            step={field.step}
            inputMode="numeric"
            pattern="[0-9]*"
            name={field.name}
            id={fieldId}
            autoComplete={autoCompleteValue}
          />
        ) : (
          <input
            type={field.type || 'text'}
            className={styles.textInput}
            value={value}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
            name={field.name}
            id={fieldId}
            autoComplete={autoCompleteValue}
          />
        )}
      </div>
    </div>
  );
};

export default TextField;
