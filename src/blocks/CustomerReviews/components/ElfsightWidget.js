"use client";
import Script from "next/script";

export default function ElfsightWidget() {
  return (
    <>
      <Script
        src="https://static.elfsight.com/platform/platform.js"
        data-use-service-core
        strategy="afterInteractive"
      />
      <div className="elfsight-app-0c8768dc-758c-4c7f-a7fe-9fcc2345d890"></div>
    </>
  );
} 