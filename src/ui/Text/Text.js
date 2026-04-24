import React from "react"
import styles from "./Text.module.css"

export default function Text({ text, cityContext }) {
  if (!text) return null;

  // Replace placeholders with city context values
  let processedText = text;
  if (cityContext) {
    if (cityContext.city_name) {
      processedText = processedText.replace(/\{\{city\}\}/g, cityContext.city_name);
    }
    if (cityContext.state_code) {
      processedText = processedText.replace(/\{\{state\}\}/g, cityContext.state_code);
    }
  }

  return processedText.split('\n').map((line, index) => {
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
        {index < processedText.split('\n').length - 1 && <br />}
      </React.Fragment>
    );
  });
}