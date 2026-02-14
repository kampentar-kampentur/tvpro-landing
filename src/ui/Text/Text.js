import React from "react"
import styles from "./Text.module.css"

export default function Text({ text }) {
  if (!text) return null;

  return text.split('\n').map((line, index) => {
    // Process styling markers:
    // **bold text** -> <strong>
    // [accent text] -> <span class="accent">

    const parts = line.split(/(\*\*.*?\*\*|\[.*?\])/g);
    const processedLine = parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('[') && part.endsWith(']')) {
        return <span key={i} className={styles.accent}>{part.slice(1, -1)}</span>;
      }
      return part;
    });

    return (
      <React.Fragment key={index}>
        {processedLine}
        {index < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    );
  });
}