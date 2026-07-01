"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const CTAContext = createContext(null);

export function CTAProvider({ children, initialCTA }) {
    const [cta, setCta] = useState(initialCTA || {});

    // Helper to get saved city context from localStorage
    const getSavedContext = () => {
        if (typeof window === "undefined") return {};
        try {
            const saved = localStorage.getItem("user_city_context");
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            return {};
        }
    };

    // Load saved context on mount
    useEffect(() => {
        const saved = getSavedContext();
        if (Object.keys(saved).length > 0) {
            setCta(prev => ({ ...prev, ...saved }));
        }
    }, []);

    // Effect to handle dynamic updates when page transition updates initialCTA
    useEffect(() => {
        if (initialCTA) {
            setCta(prev => {
                const saved = getSavedContext();
                return { ...prev, ...initialCTA, ...saved };
            });
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

export function CityCTASetter({ ctaOverride, citySlug, cityName, stateCode }) {
    const context = useContext(CTAContext);

    // Inject dynamic root link and city name details for the city page
    const overridePayload = {
        ...(ctaOverride || {}),
        homeLink: citySlug ? `/${citySlug}` : undefined,
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

                // Save to localStorage & cookie to persist city context across page changes
                if (typeof window !== "undefined") {
                    localStorage.setItem("user_city_context", ctaOverrideStr);
                    if (parsedOverride.citySlug) {
                        document.cookie = `user_city_slug=${parsedOverride.citySlug}; path=/; max-age=31536000; SameSite=Lax`;
                    }
                }
            } catch (e) {
                console.error("Error parsing ctaOverride string or persisting context", e);
            }
        }
    }, [ctaOverrideStr, context]);

    return null; // This component doesn't render anything visually
}
