"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const CTAContext = createContext(null);

export function CTAProvider({ children, initialCTA }) {
    const [cta, setCta] = useState(initialCTA || {});

    const prevInitialCtaRef = React.useRef(initialCTA);

    // Effect to handle dynamic updates when page transition updates initialCTA
    useEffect(() => {
        if (initialCTA && prevInitialCtaRef.current !== initialCTA) {
            setCta(initialCTA);
            prevInitialCtaRef.current = initialCTA;
        }
    }, [initialCTA]);

    // Clean up legacy user_city_slug cookie on mount if it exists
    useEffect(() => {
        if (typeof window !== "undefined") {
            document.cookie = "user_city_slug=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
        }
    }, []);

    // Programmatic Google Ads phone number swapping via window._googWcmGet
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const TRACKING_NUMBERS = [
            '12818684356', // Houston
            '14697514991', // Dallas
            '18723504357', // Chicago
            '17373556973', // Austin
            '17864621468', // Miami
            '18163077393', // Kansas
            '19045695281', // Jacksonville
            '18563535503', // New Jersey
            '15169792880', // New York
            '17042850469', // Charlotte
            '14452344929', // Philadelphia
            '18326647597', // Global Main
            '18774555535'  // Fallback
        ];

        const cleanCurrent = cta.phone ? cta.phone.replace(/[^0-9]/g, '') : '';
        if (!TRACKING_NUMBERS.includes(cleanCurrent)) {
            // Number has already been swapped (or is not a trackable city number)
            return;
        }

        let checkInterval;
        let attempts = 0;

        const trySwap = () => {
            if (window._googWcmGet) {
                clearInterval(checkInterval);
                const cleanPhone = cta.phone ? cta.phone.replace(/[^0-9]/g, '') : '';
                const tenDigits = cleanPhone.length === 11 && cleanPhone.startsWith('1') ? cleanPhone.slice(1) : cleanPhone;
                
                if (tenDigits.length !== 10) return;

                const formats = [
                    `+1 ${tenDigits.slice(0, 3)}-${tenDigits.slice(3, 6)}-${tenDigits.slice(6)}`, // +1 281-868-4356
                    `(${tenDigits.slice(0, 3)}) ${tenDigits.slice(3, 6)}-${tenDigits.slice(6)}`, // (281) 868-4356
                    `${tenDigits.slice(0, 3)}-${tenDigits.slice(3, 6)}-${tenDigits.slice(6)}`,   // 281-868-4356
                    `+1${tenDigits}`,                                                            // +12818684356
                    tenDigits                                                                    // 2818684356
                ];

                console.log("[googWcmGet] Queueing swap calls for formats:", formats);

                formats.forEach(formatStr => {
                    try {
                        window._googWcmGet((formattedNumber, rawNumber) => {
                            console.log("[googWcmGet callback success] Format matched:", formatStr, { formattedNumber, rawNumber });
                            setCta(prev => {
                                const cleanPrev = prev.phone ? prev.phone.replace(/[^0-9]/g, '') : '';
                                console.log("[googWcmGet callback] Prev phone:", prev.phone, "Clean prev:", cleanPrev);
                                if (!TRACKING_NUMBERS.includes(cleanPrev)) {
                                    console.log("[googWcmGet callback] Skip swap - not a tracking number");
                                    return prev;
                                }
                                console.log("[googWcmGet callback] Swap success!");
                                return {
                                    ...prev,
                                    phone: rawNumber,
                                    phoneLabel: formattedNumber
                                };
                            });
                        }, formatStr);
                    } catch (err) {
                        console.error(`Error calling _googWcmGet for ${formatStr}:`, err);
                    }
                });
            } else {
                attempts++;
                if (attempts > 50) { // Stop checking after 10 seconds
                    clearInterval(checkInterval);
                }
            }
        };

        checkInterval = setInterval(trySwap, 200);
        trySwap();

        return () => clearInterval(checkInterval);
    }, [cta.phone, cta.phoneLabel]);

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

    const value = React.useMemo(() => ({ cta, overrideCTA }), [cta, overrideCTA]);

    return (
        <CTAContext.Provider value={value}>
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
    const { overrideCTA } = useContext(CTAContext) || {};

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
        if (overrideCTA && ctaOverrideStr) {
            try {
                const parsedOverride = JSON.parse(ctaOverrideStr);
                overrideCTA(parsedOverride);
            } catch (e) {
                console.error("Error parsing ctaOverride string", e);
            }
        }
    }, [ctaOverrideStr, overrideCTA]);

    return null; // This component doesn't render anything visually
}
