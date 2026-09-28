import React from "react"
import styles from "./Text.module.css"

export default function Text({ text, cityContext }) {
  if (!text) return null;

  // Replace placeholders with city context values or defaults
  let processedText = text;
  const city = cityContext?.city_name || "USA";
  const state = cityContext?.state_code || "";

  if (!state) {
    // Remove trailing comma/space if state is empty, e.g. "in {{city}}, {{state}}" -> "in your city"
    processedText = processedText.replace(/,\s*\{\{state\}\}/g, "");
    processedText = processedText.replace(/\{\{state\}\}/g, "");
  } else {
    processedText = processedText.replace(/\{\{state\}\}/g, state);
  }

  const renderSegmentWithCity = (segment, keyPrefix) => {
    if (!segment.includes("{{city}}")) {
      return segment;
    }
    const subParts = segment.split(/(\{\{city\}\})/g);
    return subParts.map((sub, j) => {
      if (sub === "{{city}}") {
        return (
          <span key={`${keyPrefix}-city-${j}`} data-dynamic-city="" suppressHydrationWarning={true}>
            {city}
          </span>
        );
      }
      return sub;
    });
  };

  return processedText.split('\n').map((line, index) => {
    // Process styling markers:
    // **bold text** -> <strong>
    // [accent text] -> <span class="accent">

    const parts = line.split(/(\*\*.*?\*\*|\[.*?\])/g);
    const processedLine = parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const inner = part.slice(2, -2);
        return <strong key={i}>{renderSegmentWithCity(inner, `b-${i}`)}</strong>;
      }
      if (part.startsWith('[') && part.endsWith(']')) {
        const inner = part.slice(1, -1);
        return <span key={i} className={styles.accent}>{renderSegmentWithCity(inner, `a-${i}`)}</span>;
      }
      return renderSegmentWithCity(part, `t-${i}`);
    });

    return (
      <React.Fragment key={index}>
        {processedLine}
        {index < processedText.split('\n').length - 1 && <br />}
      </React.Fragment>
    );
  });
}