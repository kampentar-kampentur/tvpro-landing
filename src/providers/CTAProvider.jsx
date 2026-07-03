"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const CTAContext = createContext(null);

export function CTAProvider({ children, initialCTA }) {
    const [cta, setCta] = useState(initialCTA || {});

    // Effect to handle dynamic updates when page transition updates initialCTA
    useEffect(() => {
        if (initialCTA) {
            setCta(initialCTA);
        }
    }, [initialCTA]);

    // Clean up legacy user_city_slug cookie on mount if it exists
    useEffect(() => {
        if (typeof window !== "undefined") {
            document.cookie = "user_city_slug=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
        }
    }, []);

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

export function CityCTASetter({ ctaOverride, citySlug, cityName, stateCode }) {
    const context = useContext(CTAContext);

    // Inject dynamic city name details for the city page (no homeLink override, logo always goes to /)
    const overridePayload = {
        ...(ctaOverride || {}),
        cityName,
        stateCode,
        citySlug
    };

    // Stringify to prevent endless object reference re-renders
    const ctaOverrideStr = JSON.stringify(overridePayload);

    useEffect(() => {
        if (context && ctaOverrideStr) {
            try {
                const parsedOverride = JSON.parse(ctaOverrideStr);
                context.overrideCTA(parsedOverride);
            } catch (e) {
                console.error("Error parsing ctaOverride string", e);
            }
        }
    }, [ctaOverrideStr, context]);

    return null; // This component doesn't render anything visually
}
