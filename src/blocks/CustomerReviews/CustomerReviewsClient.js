"use client";
import { useEffect, useRef, useState } from "react";
import ElfsightWidget from "./components/ElfsightWidget";

export default function CustomerReviewsClient() {
  const ref = useRef(null);
  const [showWidget, setShowWidget] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShowWidget(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ minHeight: 100 }}>
      {showWidget ? <ElfsightWidget /> : null}
    </div>
  );
} 