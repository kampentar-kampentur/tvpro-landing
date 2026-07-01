"use client";

import { useState, useEffect, useRef } from 'react';

export function useInView(options = {}) {
    const [isInView, setIsInView] = useState(false);
    const ref = useRef(null);

    const optionsRef = useRef(options);
    
    useEffect(() => {
        optionsRef.current = options;
    });

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsInView(true);
                // Once it's in view, we can stop observing if we only want it to reveal once
                if (ref.current) observer.unobserve(ref.current);
            }
        }, { threshold: 0.1, ...optionsRef.current });

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return [ref, isInView];
}
