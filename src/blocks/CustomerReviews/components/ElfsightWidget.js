"use client";
import { useEffect } from "react";

export default function ElfsightWidget() {
  useEffect(() => {
    if (!window.Elfsight) {
      const script = document.createElement("script");
      script.src = "https://static.elfsight.com/platform/platform.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="elfsight-app-0c8768dc-758c-4c7f-a7fe-9fcc2345d890" data-elfsight-app-lazy></div>
  );
} 