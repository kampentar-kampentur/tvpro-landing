import React from "react";
import styles from "./RunningTextLine.module.css";

export default function RunningTextLine({ textLines, dynamic = false }) {
  const duplicatedTextLines = [];
  for (let copy = 0; copy < 3; copy++) {
    textLines.forEach((line, originalIndex) => {
      duplicatedTextLines.push({
        ...line,
        _id: `${originalIndex}-${copy}`,
      });
    });
  }

  return (
    <div className={styles.marquee}>
      <div className={styles.marqueeContent}>
        {duplicatedTextLines.map((line) => (
          <p key={line._id} className={styles.textLine}>
            <span className={styles.mainText}>{line.main}</span>
            {line.sub && (
              <>
                <span className={styles.separator}> — </span>
                <span className={styles.subText}>{line.sub}</span>
              </>
            )}
          </p>
        ))}
      </div>
    </div>
  );
}