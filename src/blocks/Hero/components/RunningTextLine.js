import React from "react";
import styles from "./RunningTextLine.module.css";
import textStyles from "@/ui/Text/Text.module.css";

const processText = (text) => {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*|\[.*?\])/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('[') && part.endsWith(']')) {
      return <span key={i} className={textStyles.accent}>{part.slice(1, -1)}</span>;
    }
    return part;
  });
};

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
            <span className={styles.mainText}>{processText(line.main)}</span>
            {line.sub && (
              <>
                <span className={styles.separator}> — </span>
                <span className={styles.subText}>{processText(line.sub)}</span>
              </>
            )}
          </p>
        ))}
      </div>
    </div>
  );
}