import React from "react";
import styles from "./Modal.module.css";
import Button from "@/ui/Button";
import CloseIcon from "@/assets/icons/close.svg"
import { useLockScroll } from "./useLockScroll";
import { useRef } from "react";
import Portal from "@/ui/Portal/Portal";


const Modal = ({ isOpen, onClose, children, className }) => {
  const modalRef = useRef(null);
  useLockScroll(isOpen, modalRef);

  if (!isOpen) return null;

  return (
    <Portal>
      <div className={`${styles.modalOverlay} modalOverlay`} onClick={onClose}>
        <div className={`${styles.modalContent} ${className}`} onClick={(e) => e.stopPropagation()}>
          <Button variant="secondary" size="small" className={styles.closeButton} onClick={onClose}>
            <CloseIcon width="10" height="10" />
          </Button>
          <div className={styles.modalWrapper} ref={modalRef}>
            {children}
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default Modal; 