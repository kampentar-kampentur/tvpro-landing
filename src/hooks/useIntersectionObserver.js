// hooks/useIntersectionObserver.js

import { useEffect, useState } from 'react';

export function useIntersectionObserver(
  elementRef,
  options = {
    threshold: 0.1,
    rootMargin: '0px',
  }
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef?.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      options
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementRef.current, options.threshold, options.rootMargin]);

  return [isIntersecting];
}