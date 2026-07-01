"use client";
import { useEffect } from "react";

export default function ElfsightWidget() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (window.Elfsight) {
        try {
          delete window.Elfsight;
        } catch (e) {
          window.Elfsight = undefined;
        }
      }
    };
  }, []);

  return (
    <div className="elfsight-app-0c8768dc-758c-4c7f-a7fe-9fcc2345d890"></div>
  );
} 