"use client";

import React, { useEffect, useState } from "react";

export default function FontSwitcher() {
  const [fontMode, setFontMode] = useState("redhat"); // "redhat" | "montserrat"

  useEffect(() => {
    // Check local storage or existing class on body
    const savedFont = localStorage.getItem("font-preference");
    if (savedFont === "montserrat") {
      setFontMode("montserrat");
      document.body.classList.add("font-mode-montserrat");
    } else {
      setFontMode("redhat");
      document.body.classList.remove("font-mode-montserrat");
    }
  }, []);

  const toggleFont = () => {
    if (fontMode === "redhat") {
      setFontMode("montserrat");
      document.body.classList.add("font-mode-montserrat");
      localStorage.setItem("font-preference", "montserrat");
    } else {
      setFontMode("redhat");
      document.body.classList.remove("font-mode-montserrat");
      localStorage.setItem("font-preference", "redhat");
    }
  };

  return (
    <div
      onClick={toggleFont}
      style={{
        position: "fixed",
        bottom: "24px",
        left: "82px", // Shifted by 58px to the right to avoid overlapping other widgets
        zIndex: 999999,
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "5px 10px",
        borderRadius: "30px",
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "1px solid rgba(14, 14, 19, 0.15)",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        userSelect: "none",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
      className="font-switcher-widget"
      title="Toggle Font Family (Red Hat Display / Montserrat)"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.04) translateY(-2px)";
        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
        e.currentTarget.style.boxShadow = "0 12px 30px rgba(0, 0, 0, 0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1) translateY(0)";
        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.85)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.1)";
      }}
    >
      {/* Icon */}
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          backgroundColor: "#0d64a0",
          color: "#ffffff",
          fontSize: "10px",
          fontWeight: "700",
          letterSpacing: "-0.5px",
        }}
      >
        Aa
      </span>

      {/* Label and Info */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0px" }}>
        <span
          style={{
            fontSize: "8px",
            color: "#6B6A73",
            fontWeight: "500",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            lineHeight: "1",
          }}
        >
          Шрифт
        </span>
        <span
          style={{
            fontSize: "12px",
            color: "#0e0e13",
            fontWeight: "700",
            lineHeight: "1.1",
          }}
        >
          {fontMode === "redhat" ? "Red Hat" : "Montserrat"}
        </span>
      </div>

      {/* Small Indicator dot */}
      <span
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: fontMode === "redhat" ? "#91929c" : "#22c55e",
          marginLeft: "4px",
          transition: "background-color 0.3s ease",
        }}
      />
    </div>
  );
}
