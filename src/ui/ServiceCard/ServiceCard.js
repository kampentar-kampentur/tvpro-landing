'use client';

import styles from "./ServiceCard.module.css";
import SendIcon from "@/assets/icons/send.svg"
import Button from "@/ui/Button"

export default function ServiceCard({ image, title, description }) {
    function onButtonClick() {
        console.log(title);
        
    }
  return (
    <div className={styles.serviceCard}>
        <SendIcon className={styles.sendIcon} width="16" height="16"/>
        <div className={styles.imageContainer}>
            {image}
        </div>
        
        <div className={styles.textWrapper}>
            <h5 className={styles.title}>{title}</h5>
            <span className={styles.description}>{description}</span>
        </div>
        <Button className={styles.hiddenButton} variant="primary" size="small" onClick={onButtonClick}>
            Get The Best Quote
        </Button>
        <button className={styles.invisibleButton} onClick={onButtonClick} />
    </div>
  );
} 