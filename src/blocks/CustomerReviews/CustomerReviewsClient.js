"use client";
import { useEffect, useRef, useState } from "react";

export default function CustomerReviewsClient() {
  const ref = useRef(null);
  const [showWidget, setShowWidget] = useState(false);
  const [ElfsightWidget, setElfsightWidget] = useState(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Dynamically import ElfsightWidget when it's about to be shown
          import("./components/ElfsightWidget").then((module) => {
            setElfsightWidget(() => module.default);
          });
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
      {showWidget && ElfsightWidget ? <ElfsightWidget /> : null}
    </div>
  );
}