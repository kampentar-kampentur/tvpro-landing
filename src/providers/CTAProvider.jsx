"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

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

        const conversionLabel = cta.conversion_label || cta.google_conversion_label || cta.conversionLabel || process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL || "a8L_CP3LxdMcEKqu1fBA";
        const conversionId = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID || "AW-17416148778";
        const configTarget = `${conversionId}/${conversionLabel}`;

        let checkInterval;
        let attempts = 0;

        const trySwap = () => {
            if (window._googWcmGet && typeof window.gtag === 'function') {
                clearInterval(checkInterval);
                const cleanPhone = cta.phone ? cta.phone.replace(/[^0-9]/g, '') : '';
                const tenDigits = cleanPhone.length === 11 && cleanPhone.startsWith('1') ? cleanPhone.slice(1) : cleanPhone;
                
                if (tenDigits.length !== 10) return;

                const primaryFormat = cta.phoneLabel || `(${tenDigits.slice(0, 3)}) ${tenDigits.slice(3, 6)}-${tenDigits.slice(6)}`;
                
                // Register ONLY this active page number with Google Ads ONCE
                window.gtag('config', configTarget, {
                    'phone_conversion_number': primaryFormat
                });

                const formats = [
                    primaryFormat,
                    `+1 ${tenDigits.slice(0, 3)}-${tenDigits.slice(3, 6)}-${tenDigits.slice(6)}`,
                    `${tenDigits.slice(0, 3)}-${tenDigits.slice(3, 6)}-${tenDigits.slice(6)}`,
                    `+1${tenDigits}`,
                    tenDigits
                ];

                console.log("[googWcmGet] Registered active format:", primaryFormat, "Queueing swap calls for:", formats);

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

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

export function CityCTASetter({ ctaOverride, citySlug, cityName, stateCode }) {
    const { overrideCTA } = useContext(CTAContext) || {};

    const overridePayload = useMemo(() => ({
        ...(ctaOverride || {}),
        cityName,
        stateCode,
        citySlug
    }), [ctaOverride, citySlug, cityName, stateCode]);

    const ctaOverrideStr = JSON.stringify(overridePayload);

    useIsomorphicLayoutEffect(() => {
        if (overrideCTA && ctaOverrideStr) {
            try {
                const parsedOverride = JSON.parse(ctaOverrideStr);
                overrideCTA(parsedOverride);
            } catch (e) {
                console.error("Error parsing ctaOverride string", e);
            }
        }
    }, [ctaOverrideStr, overrideCTA]);

    const phoneLabel = ctaOverride?.phoneLabel || ctaOverride?.phone;
    const phoneHref = ctaOverride?.phone ? `tel:${ctaOverride.phone}` : null;

    if (!phoneLabel) return null;

    return (
        <script
            dangerouslySetInnerHTML={{
                __html: `
                    (function() {
                        try {
                            var label = ${JSON.stringify(phoneLabel)};
                            var href = ${JSON.stringify(phoneHref)};
                            if (label) {
                                var btns = document.querySelectorAll('a[href^="tel:"]');
                                btns.forEach(function(b) {
                                    b.textContent = label;
                                    if (href) b.href = href;
                                });
                            }
                        } catch(e) {}
                    })();
                `
            }}
        />
    );
}
