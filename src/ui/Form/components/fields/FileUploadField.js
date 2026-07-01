import React, { useRef, useState } from 'react';
import styles from './FileUploadField.module.css';

const FileUploadField = ({ label, placeholder = 'File upload - optional', value, onChange }) => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState('');

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onChange(file);
    } else {
      setFileName('');
      onChange(null);
    }
  };

  return (
    <div className={styles.container}>
      <span className={styles.label}>{label}</span>
      <div className={styles.uploadArea} onClick={handleClick}>
        <span className={fileName ? styles.fileName : styles.placeholder}>
          {fileName || placeholder}
        </span>
        <input
          type="file"
          ref={fileInputRef}
          className={styles.hiddenInput}
          onChange={handleFileChange}
          accept="image/*,.pdf,.doc,.docx"
        />
      </div>
    </div>
  );
};

export default FileUploadField;
