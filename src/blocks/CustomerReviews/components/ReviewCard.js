"use client"
import styles from "./ReviewCard.module.css";
import StarIcon from "@/assets/icons/Star.svg";
import Image from "next/image";

const ReviewCard = ({ rating, reviewText, authorName, reviewDate, avatar, Logo }) => {
  return (
    <div className={styles.reviewCard}>
      <div className={styles.reviewContent}>
        <div className={styles.ratingAndLogo}>
          <div className={styles.stars}>
            {Array.from({ length: 5 }, (_, i) => (
              <StarIcon key={i} width="32" height="32" fill={i < rating ? "#f6b80d" : "#D8D8DD"} />
            ))}
          </div>
          {Logo}
        </div>
        <p className={styles.reviewText}>{reviewText}</p>
      </div>
      <div className={styles.authorInfo}>
        <Image src={avatar} alt={authorName} className={styles.avatar} width={400} height={300} />
        <div className={styles.authorDetails}>
          <h4 className={styles.authorName}>{authorName}</h4>
          <p className={styles.reviewDate}>{reviewDate}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard; 