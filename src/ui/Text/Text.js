import React from "react";
import styles from "./Text.module.css";

const Text = ({ children, className, variant = "default", as: Tag = "p" }) => {
    const processText = (text) => {
        if (typeof text !== "string") return text;
        const parts = text.split(/(\*\*.*?\*\*|\[.*?\])/g);
        return parts.map((part, i) => {
            if (part.startsWith("**") && part.endsWith("**")) {
                return <strong key={i}>{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith("[") && part.endsWith("]")) {
                return (
                    <span key={i} className={styles.accent}>
                        {part.slice(1, -1)}
                    </span>
                );
            }
            return part;
        });
    };

    return (
        <Tag className={`${styles[variant] || ""} ${className || ""}`}>
            {processText(children)}
        </Tag>
    );
};

export default Text;
