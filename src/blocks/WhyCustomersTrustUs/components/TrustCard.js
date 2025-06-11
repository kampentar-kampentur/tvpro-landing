import React from "react";
import styles from "./TrustCard.module.css";

const TrustCard = ({ icon, title, description }) => {
  return (
    <div className={styles.trustCard}>
      <div className={styles.iconContainer}>
        {icon}
      </div>
      <div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
};

export default TrustCard; 