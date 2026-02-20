"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const CTAContext = createContext(null);

export function CTAProvider({ children, initialCTA }) {
    const [cta, setCta] = useState(initialCTA || {});

    // Effect to handle dynamic updates if needed, though primarily controlled by CityCTASetter
    useEffect(() => {
        if (initialCTA) {
            setCta(prev => ({ ...prev, ...initialCTA }));
        }
    }, [initialCTA]);

    const overrideCTA = useCallback((newCTAData) => {
        if (!newCTAData) return;

        setCta((prevCta) => {
            // Only override fields that are actually provided and not empty
            const updatedCta = { ...prevCta };
            let hasChanges = false;

            Object.keys(newCTAData).forEach(key => {
                if (newCTAData[key] !== null && newCTAData[key] !== undefined && newCTAData[key] !== '') {
                    if (updatedCta[key] !== newCTAData[key]) {
                        updatedCta[key] = newCTAData[key];
                        hasChanges = true;
                    }
                }
            });
            // If nothing changed, return exact same reference to prevent re-renders
            return hasChanges ? updatedCta : prevCta;
        });
    }, []);

    return (
        <CTAContext.Provider value={{ cta, overrideCTA }}>
            {children}
        </CTAContext.Provider>
    );
}

export function useCTA() {
    const context = useContext(CTAContext);
    if (!context) {
        throw new Error("useCTA must be used within a CTAProvider");
    }
    return context.cta;
}

export function CityCTASetter({ ctaOverride, citySlug }) {
    const context = useContext(CTAContext);

    // Inject dynamic root link for the city page
    const overridePayload = {
        ...(ctaOverride || {}),
        homeLink: citySlug ? `/${citySlug}` : undefined
    };

    // Stringify to prevent endless object reference re-renders
    const ctaOverrideStr = JSON.stringify(overridePayload);

    useEffect(() => {
        if (context && ctaOverrideStr) {
            try {
                const parsedOverride = JSON.parse(ctaOverrideStr);
                context.overrideCTA(parsedOverride);
            } catch (e) {
                console.error("Error parsing ctaOverride string");
            }
        }
    }, [ctaOverrideStr, context]);

    return null; // This component doesn't render anything visually
}
