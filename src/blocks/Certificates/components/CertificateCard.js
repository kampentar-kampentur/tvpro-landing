"use client"
import { useState } from "react";
import styles from "./CertificateCard.module.css";
import ImageWrapper from "@/ui/ImageWrapper/ImgaeWrapper";
import Modal from "@/ui/Modal/Modal";

const CertificateCard = ({ image, className }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className={`${styles.certificateCard} ${className}`}
        tabIndex={0}
        role="button"
        onClick={() => setOpen(true)}
      >
        {image && <ImageWrapper media={image} className={styles.image} />}
      </div>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <div className={styles.modalMediaContainer}>
          {image && <ImageWrapper media={image} className={styles.modalImage} />}
        </div>
      </Modal>
    </>
  );
};

export default CertificateCard;