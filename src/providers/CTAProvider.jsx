"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

const CTAContext = createContext(null);

function getOpenAIOverride(citySlug) {
    if (typeof window === 'undefined') return null;
    if (window.__OPENAI_PHONE__) return window.__OPENAI_PHONE__;
    try {
        const params = new URLSearchParams(window.location.search);
        const utmSource = (params.get('utm_source') || params.get('source') || '').toLowerCase();
        const isChatGPT = utmSource.includes('chatgpt') || 
                          utmSource.includes('openai') || 
                          (params.get('utm_medium') || '').toLowerCase().includes('chatgpt') ||
                          (params.get('utm_campaign') || '').toLowerCase().includes('chatgpt');

        if (isChatGPT) {
            const slug = (citySlug || window.location.pathname.replace(/^\/|\/$/g, '')).toLowerCase();
            const OPENAI_MAP = {
                // San Antonio
                'san-antonio': { phone: '+12107968856', phoneLabel: '(210) 796-8856' },
                'new-braunfels': { phone: '+12107968856', phoneLabel: '(210) 796-8856' },
                'schertz': { phone: '+12107968856', phoneLabel: '(210) 796-8856' },
                'cibolo': { phone: '+12107968856', phoneLabel: '(210) 796-8856' },
                'boerne': { phone: '+12107968856', phoneLabel: '(210) 796-8856' },
                'universal-city': { phone: '+12107968856', phoneLabel: '(210) 796-8856' },
                'converse': { phone: '+12107968856', phoneLabel: '(210) 796-8856' },
                'live-oak': { phone: '+12107968856', phoneLabel: '(210) 796-8856' },
                'selma': { phone: '+12107968856', phoneLabel: '(210) 796-8856' },
                'helotes': { phone: '+12107968856', phoneLabel: '(210) 796-8856' },
                'alamo-heights': { phone: '+12107968856', phoneLabel: '(210) 796-8856' },
                'leon-valley': { phone: '+12107968856', phoneLabel: '(210) 796-8856' },
                'fair-oaks-ranch': { phone: '+12107968856', phoneLabel: '(210) 796-8856' },
                'timberwood-park': { phone: '+12107968856', phoneLabel: '(210) 796-8856' },
                'bulverde': { phone: '+12107968856', phoneLabel: '(210) 796-8856' },
                'canyon-lake': { phone: '+12107968856', phoneLabel: '(210) 796-8856' },

                // Dallas
                'dallas': { phone: '+14697166501', phoneLabel: '(469) 716-6501' },
                'plano': { phone: '+14697166501', phoneLabel: '(469) 716-6501' },
                'frisco': { phone: '+14697166501', phoneLabel: '(469) 716-6501' },
                'mckinney': { phone: '+14697166501', phoneLabel: '(469) 716-6501' },
                'arlington': { phone: '+14697166501', phoneLabel: '(469) 716-6501' },
                'fort-worth': { phone: '+14697166501', phoneLabel: '(469) 716-6501' },
                'irving': { phone: '+14697166501', phoneLabel: '(469) 716-6501' },
                'garland': { phone: '+14697166501', phoneLabel: '(469) 716-6501' },
                'richardson': { phone: '+14697166501', phoneLabel: '(469) 716-6501' },
                'denton': { phone: '+14697166501', phoneLabel: '(469) 716-6501' },

                // Fort Lauderdale
                'fort-lauderdale': { phone: '+17543454333', phoneLabel: '(754) 345-4333' },

                // Irvine
                'irvine': { phone: '+19499986321', phoneLabel: '(949) 998-6321' },
                'newport-beach': { phone: '+19499986321', phoneLabel: '(949) 998-6321' },
                'costa-mesa': { phone: '+19499986321', phoneLabel: '(949) 998-6321' },
                'lake-forest': { phone: '+19499986321', phoneLabel: '(949) 998-6321' },
                'tustin': { phone: '+19499986321', phoneLabel: '(949) 998-6321' },
                'mission-viejo': { phone: '+19499986321', phoneLabel: '(949) 998-6321' },
                'laguna-niguel': { phone: '+19499986321', phoneLabel: '(949) 998-6321' },
                'laguna-hills': { phone: '+19499986321', phoneLabel: '(949) 998-6321' },
                'aliso-viejo': { phone: '+19499986321', phoneLabel: '(949) 998-6321' },
                'huntington-beach': { phone: '+19499986321', phoneLabel: '(949) 998-6321' },
                'santa-ana': { phone: '+19499986321', phoneLabel: '(949) 998-6321' },
                'orange': { phone: '+19499986321', phoneLabel: '(949) 998-6321' },
                'anaheim': { phone: '+19499986321', phoneLabel: '(949) 998-6321' },
                'foothill-ranch': { phone: '+19499986321', phoneLabel: '(949) 998-6321' },
                'san-clemente': { phone: '+19499986321', phoneLabel: '(949) 998-6321' },
                'dana-point': { phone: '+19499986321', phoneLabel: '(949) 998-6321' },

                // Charlotte
                'charlotte': { phone: '+19804558203', phoneLabel: '(980) 455-8203' },
                'concord': { phone: '+19804558203', phoneLabel: '(980) 455-8203' },
                'gastonia': { phone: '+19804558203', phoneLabel: '(980) 455-8203' },
                'rock-hill': { phone: '+19804558203', phoneLabel: '(980) 455-8203' },
                'huntersville': { phone: '+19804558203', phoneLabel: '(980) 455-8203' },
                'kannapolis': { phone: '+19804558203', phoneLabel: '(980) 455-8203' },
                'matthews': { phone: '+19804558203', phoneLabel: '(980) 455-8203' },
                'pineville': { phone: '+19804558203', phoneLabel: '(980) 455-8203' },
                'mooresville': { phone: '+19804558203', phoneLabel: '(980) 455-8203' },
                'waxhaw': { phone: '+19804558203', phoneLabel: '(980) 455-8203' },
            };
            if (OPENAI_MAP[slug]) return OPENAI_MAP[slug];
        }
    } catch (e) {}
    return null;
}

export function CTAProvider({ children, initialCTA }) {
    const [cta, setCta] = useState(() => {
        const override = getOpenAIOverride();
        return override ? { ...(initialCTA || {}), ...override } : (initialCTA || {});
    });

    const prevInitialCtaRef = React.useRef(initialCTA);
    // Remembers which tracked phone number was already registered with Google Ads (WCM)
    const registeredPhoneRef = React.useRef(null);
    // Latest label, read inside the tracking effect without making it a dependency
    const phoneLabelRef = React.useRef(cta.phoneLabel);
    phoneLabelRef.current = cta.phoneLabel;

    // Effect to handle dynamic updates when page transition updates initialCTA
    useEffect(() => {
        if (initialCTA && prevInitialCtaRef.current !== initialCTA) {
            const override = getOpenAIOverride();
            setCta(override ? { ...initialCTA, ...override } : initialCTA);
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

        const cleanPhone = cta.phone ? cta.phone.replace(/[^0-9]/g, '') : '';
        const tenDigits = cleanPhone.length === 11 && cleanPhone.startsWith('1') ? cleanPhone.slice(1) : cleanPhone;
        
        if (tenDigits.length !== 10) return;

        // Register each tracked number with Google exactly once. Previously every re-run of
        // this effect (and every 200ms poll tick) called gtag('config', ...) again, and each
        // call makes Google fire another `wcm?cc=..&dn=..` XHR (the 200/302 spam in DevTools).
        if (registeredPhoneRef.current === cleanCurrent) return;
        registeredPhoneRef.current = cleanCurrent;

        const primaryFormat = phoneLabelRef.current || `(${tenDigits.slice(0, 3)}) ${tenDigits.slice(3, 6)}-${tenDigits.slice(6)}`;
        
        // 1. Register ONLY this active page number & label with Google Ads (once)
        if (typeof window.gtag === 'function') {
            window.gtag('config', configTarget, {
                'phone_conversion_number': primaryFormat
            });
        }

        let checkInterval;
        let attempts = 0;

        // The poll only waits for the Google script to expose _googWcmGet.
        const trySwap = () => {
            if (window._googWcmGet) {
                clearInterval(checkInterval);

                const formats = [
                    primaryFormat,
                    `+1 ${tenDigits.slice(0, 3)}-${tenDigits.slice(3, 6)}-${tenDigits.slice(6)}`,
                    `${tenDigits.slice(0, 3)}-${tenDigits.slice(3, 6)}-${tenDigits.slice(6)}`,
                    `+1${tenDigits}`,
                    tenDigits
                ];

                console.log("[googWcmGet] Active label & format registered:", configTarget, primaryFormat);

                formats.forEach(formatStr => {
                    try {
                        window._googWcmGet((formattedNumber, rawNumber) => {
                            setCta(prev => {
                                const cleanPrev = prev.phone ? prev.phone.replace(/[^0-9]/g, '') : '';
                                if (!TRACKING_NUMBERS.includes(cleanPrev)) return prev;
                                // Same values -> same reference, no re-render
                                if (prev.phone === rawNumber && prev.phoneLabel === formattedNumber) return prev;
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
                    // Google script never loaded: allow a later retry for this number
                    registeredPhoneRef.current = null;
                }
            }
        };

        checkInterval = setInterval(trySwap, 200);
        trySwap();

        return () => clearInterval(checkInterval);
    }, [cta.phone]);

    const overrideCTA = useCallback((newCTAData) => {
        if (!newCTAData) return;

        setCta((prevCta) => {
            const openAIOverride = getOpenAIOverride(newCTAData?.citySlug || prevCta?.citySlug);
            const dataToApply = openAIOverride ? { ...newCTAData, ...openAIOverride } : newCTAData;

            // Only override fields that are actually provided and not empty
            const updatedCta = { ...prevCta };
            let hasChanges = false;

            Object.keys(dataToApply).forEach(key => {
                if (dataToApply[key] !== null && dataToApply[key] !== undefined && dataToApply[key] !== '') {
                    if (updatedCta[key] !== dataToApply[key]) {
                        updatedCta[key] = dataToApply[key];
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

    const openAIOverride = getOpenAIOverride(citySlug);
    const effectiveCTAOverride = openAIOverride ? { ...(ctaOverride || {}), ...openAIOverride } : ctaOverride;

    const overridePayload = useMemo(() => ({
        ...(effectiveCTAOverride || {}),
        cityName,
        stateCode,
        citySlug
    }), [effectiveCTAOverride, citySlug, cityName, stateCode]);

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

    const phoneLabel = effectiveCTAOverride?.phoneLabel || effectiveCTAOverride?.phone;
    const phoneHref = effectiveCTAOverride?.phone ? `tel:${effectiveCTAOverride.phone}` : null;

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
