import React from "react";
import styles from "./Modal.module.css";
import Button from "@/ui/Button";
import CloseIcon from "@/assets/icons/close.svg"

const Modal = ({ isOpen, onClose, children, className }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={`${styles.modalContent} ${className}`} onClick={(e) => e.stopPropagation()}>
        <Button variant="secondary" size="small" className={styles.closeButton} onClick={onClose}>
          <CloseIcon width="10" heigth="10"/>
        </Button>
        {children}
      </div>
    </div>
  );
};

export default Modal; 