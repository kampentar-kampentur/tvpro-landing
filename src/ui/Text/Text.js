import React from "react"
import styles from "./Text.module.css"

export default function Text({ text, cityContext }) {
  if (!text) return null;

  // Replace placeholders with city context values or defaults
  let processedText = text;
  const city = cityContext?.city_name || "your city";
  const state = cityContext?.state_code || "";

  processedText = processedText.replace(/\{\{city\}\}/g, city);

  if (!state) {
    // Remove trailing comma/space if state is empty, e.g. "in {{city}}, {{state}}" -> "in your city"
    processedText = processedText.replace(/,\s*\{\{state\}\}/g, "");
    processedText = processedText.replace(/\{\{state\}\}/g, "");
  } else {
    processedText = processedText.replace(/\{\{state\}\}/g, state);
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