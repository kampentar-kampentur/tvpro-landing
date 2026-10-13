"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { getUtmParams } from "@/lib/utmTracker";

const CTAContext = createContext(null);

const FB_PHONES = {
    'san-antonio': { phone: '+12109425027', phoneLabel: '(210) 942-5027' },
    'austin': { phone: '+17373833354', phoneLabel: '(737) 383-3354' },
    'fort-lauderdale': { phone: '+17543353386', phoneLabel: '(754) 335-3386' },
    'chicago': { phone: '+18723127556', phoneLabel: '(872) 312-7556' },
    'irvine': { phone: '+19497769926', phoneLabel: '(949) 776-9926' },
};
const FB_DEFAULT_PHONE = { phone: '+12109425027', phoneLabel: '(210) 942-5027' };

const OPENAI_PHONES = {
    'san-antonio': { phone: '+12107968856', phoneLabel: '(210) 796-8856' },
    'dallas': { phone: '+14697166501', phoneLabel: '(469) 716-6501' },
    'fort-lauderdale': { phone: '+17543454333', phoneLabel: '(754) 345-4333' },
    'irvine': { phone: '+19499986321', phoneLabel: '(949) 998-6321' },
    'charlotte': { phone: '+19804558203', phoneLabel: '(980) 455-8203' },
};
const OPENAI_DEFAULT_PHONE = { phone: '+12107968856', phoneLabel: '(210) 796-8856' };

const STATE_TO_FB_METRO = {
    'TX': 'san-antonio',
    'FL': 'fort-lauderdale',
    'IL': 'chicago',
    'CA': 'irvine',
};

const STATE_TO_OPENAI_METRO = {
    'TX': 'san-antonio',
    'FL': 'fort-lauderdale',
    'CA': 'irvine',
    'NC': 'charlotte',
};

const METRO_MAP = {
    // San Antonio, TX & suburbs
    'san-antonio': 'san-antonio',
    'san_antonio': 'san-antonio',
    'sanantonio': 'san-antonio',
    'satx': 'san-antonio',
    'new-braunfels': 'san-antonio',
    'schertz': 'san-antonio',
    'cibolo': 'san-antonio',
    'boerne': 'san-antonio',
    'universal-city': 'san-antonio',
    'converse': 'san-antonio',
    'live-oak': 'san-antonio',
    'selma': 'san-antonio',
    'helotes': 'san-antonio',
    'alamo-heights': 'san-antonio',
    'leon-valley': 'san-antonio',
    'fair-oaks-ranch': 'san-antonio',
    'timberwood-park': 'san-antonio',
    'bulverde': 'san-antonio',
    'canyon-lake': 'san-antonio',

    // Austin, TX & suburbs
    'austin': 'austin',
    'atx': 'austin',
    'round-rock': 'austin',
    'cedar-park': 'austin',
    'georgetown': 'austin',
    'san-marcos': 'austin',
    'pflugerville': 'austin',
    'buda': 'austin',
    'kyle': 'austin',

    // Fort Lauderdale / South Florida & suburbs
    'fort-lauderdale': 'fort-lauderdale',
    'fort_lauderdale': 'fort-lauderdale',
    'fortlauderdale': 'fort-lauderdale',
    'ft-lauderdale': 'fort-lauderdale',
    'ft_lauderdale': 'fort-lauderdale',
    'ftl': 'fort-lauderdale',
    'miami': 'fort-lauderdale',
    'south-florida': 'fort-lauderdale',
    'south_florida': 'fort-lauderdale',
    's-fl': 'fort-lauderdale',
    's_fl': 'fort-lauderdale',
    'sfl': 'fort-lauderdale',
    'boca-raton': 'fort-lauderdale',
    'hollywood': 'fort-lauderdale',
    'pembroke-pines': 'fort-lauderdale',
    'miramar': 'fort-lauderdale',
    'coral-gables': 'fort-lauderdale',
    'aventura': 'fort-lauderdale',
    'kendall': 'fort-lauderdale',
    'homestead': 'fort-lauderdale',
    'hialeah': 'fort-lauderdale',
    'miami-beach': 'fort-lauderdale',
    'doral': 'fort-lauderdale',
    'pompano-beach': 'fort-lauderdale',
    'davie': 'fort-lauderdale',
    'sunrise': 'fort-lauderdale',
    'plantation': 'fort-lauderdale',
    'deerfield-beach': 'fort-lauderdale',
    'boynton-beach': 'fort-lauderdale',
    'delray-beach': 'fort-lauderdale',
    'west-palm-beach': 'fort-lauderdale',

    // Chicago, IL & suburbs
    'chicago': 'chicago',
    'chi': 'chicago',
    'naperville': 'chicago',
    'aurora': 'chicago',
    'joliet': 'chicago',
    'arlington-heights': 'chicago',
    'evanston': 'chicago',
    'schaumburg': 'chicago',
    'oak-brook': 'chicago',
    'orland-park': 'chicago',
    'palatine': 'chicago',
    'elgin': 'chicago',
    'waukegan': 'chicago',
    'cicero': 'chicago',
    'des-plaines': 'chicago',

    // Irvine, CA / Orange County & suburbs
    'irvine': 'irvine',
    'orange-county': 'irvine',
    'oc': 'irvine',
    'newport-beach': 'irvine',
    'costa-mesa': 'irvine',
    'lake-forest': 'irvine',
    'tustin': 'irvine',
    'mission-viejo': 'irvine',
    'laguna-niguel': 'irvine',
    'laguna-hills': 'irvine',
    'aliso-viejo': 'irvine',
    'huntington-beach': 'irvine',
    'santa-ana': 'irvine',
    'orange': 'irvine',
    'anaheim': 'irvine',
    'foothill-ranch': 'irvine',
    'san-clemente': 'irvine',
    'dana-point': 'irvine',
    'fullerton': 'irvine',
    'garden-grove': 'irvine',

    // Dallas, TX & suburbs (ChatGPT)
    'dallas': 'dallas',
    'dfw': 'dallas',
    'plano': 'dallas',
    'frisco': 'dallas',
    'mckinney': 'dallas',
    'arlington': 'dallas',
    'fort-worth': 'dallas',
    'irving': 'dallas',
    'garland': 'dallas',
    'richardson': 'dallas',
    'denton': 'dallas',

    // Charlotte, NC & suburbs (ChatGPT)
    'charlotte': 'charlotte',
    'concord': 'charlotte',
    'gastonia': 'charlotte',
    'rock-hill': 'charlotte',
    'huntersville': 'charlotte',
    'kannapolis': 'charlotte',
    'matthews': 'charlotte',
    'pineville': 'charlotte',
    'mooresville': 'charlotte',
    'waxhaw': 'charlotte',
};

function normalizeSlug(str) {
    if (!str) return '';
    return decodeURIComponent(str)
        .toLowerCase()
        .trim()
        .replace(/^\/+|\/+$/g, '')
        .replace(/[,\s_]+/g, '-');
}

function findMetroInText(text) {
    if (!text) return null;
    const clean = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    for (const [key, metro] of Object.entries(METRO_MAP)) {
        if (clean.includes(key)) {
            return metro;
        }
    }
    return null;
}

function isFacebookSource({ utmSource, utmMedium, utmCampaign, hasFbclid, referrer }) {
    if (hasFbclid) return true;
    const src = (utmSource || '').toLowerCase().trim();
    if (
        src === 'fb' ||
        src === 'facebook' ||
        src === 'meta' ||
        src === 'instagram' ||
        src === 'ig' ||
        src.startsWith('fb_') ||
        src.startsWith('fb-') ||
        src.startsWith('meta_') ||
        src.startsWith('meta-') ||
        src.startsWith('ig_') ||
        src.startsWith('ig-') ||
        src.includes('facebook') ||
        src.includes('fbads') ||
        src.includes('fb_ads')
    ) {
        return true;
    }
    const med = (utmMedium || '').toLowerCase().trim();
    if (med.includes('facebook') || med.includes('meta') || med.includes('instagram')) return true;
    const cmp = (utmCampaign || '').toLowerCase().trim();
    if (cmp.includes('facebook') || cmp.startsWith('fb_') || cmp.startsWith('fb-') || cmp.includes('_fb_')) return true;
    const ref = (referrer || '').toLowerCase().trim();
    if (ref.includes('facebook.com') || ref.includes('instagram.com') || ref.includes('fb.me') || ref.includes('meta.com')) return true;
    return false;
}

function isOpenAISource({ utmSource, utmMedium, utmCampaign, hasOpenAISource, referrer }) {
    if (hasOpenAISource) return true;
    const src = (utmSource || '').toLowerCase().trim();
    if (src.includes('chatgpt') || src.includes('openai')) return true;
    const med = (utmMedium || '').toLowerCase().trim();
    if (med.includes('chatgpt') || med.includes('openai')) return true;
    const cmp = (utmCampaign || '').toLowerCase().trim();
    if (cmp.includes('chatgpt') || cmp.includes('openai')) return true;
    const ref = (referrer || '').toLowerCase().trim();
    if (ref.includes('chatgpt.com') || ref.includes('openai.com')) return true;
    return false;
}

export function getCampaignOverride(citySlug) {
    if (typeof window === 'undefined') return null;

    try {
        const params = new URLSearchParams(window.location.search);
        let storedUtm = {};
        try {
            storedUtm = getUtmParams() || {};
        } catch (e) {}

        const utmSource = (
            params.get('utm_source') || 
            params.get('usm_source') || 
            params.get('source') || 
            params.get('src') || 
            storedUtm.utm_source || 
            storedUtm.usm_source || 
            storedUtm.source || 
            ''
        ).toLowerCase();

        const utmMedium = (
            params.get('utm_medium') || 
            params.get('medium') || 
            storedUtm.utm_medium || 
            ''
        ).toLowerCase();

        const utmCampaign = (
            params.get('utm_campaign') || 
            params.get('campaign') || 
            storedUtm.utm_campaign || 
            ''
        ).toLowerCase();

        const hasFbclid = params.has('fbclid') || Boolean(storedUtm.fbclid);
        const hasOpenAISource = params.has('openAIsource') || 
                                params.has('openaisource') || 
                                params.has('oai_source') || 
                                Boolean(storedUtm.openAIsource || storedUtm.openaisource || storedUtm.oai_source);
        const referrer = document.referrer || storedUtm.referrer || '';

        const isFB = isFacebookSource({ utmSource, utmMedium, utmCampaign, hasFbclid, referrer }) || 
                     window.__CAMPAIGN_PHONE__?.source === 'facebook';
        const isOAI = isOpenAISource({ utmSource, utmMedium, utmCampaign, hasOpenAISource, referrer }) || 
                      window.__CAMPAIGN_PHONE__?.source === 'chatgpt';

        if (!isFB && !isOAI) {
            if (window.__CAMPAIGN_PHONE__) return window.__CAMPAIGN_PHONE__;
            if (window.__OPENAI_PHONE__) return window.__OPENAI_PHONE__;
            return null;
        }

        // Resolve city/metro
        const queryCity = params.get('city') || storedUtm.city || '';
        const queryFrom = params.get('from') || storedUtm.from || '';
        const path = window.location.pathname.replace(/^\/|\/$/g, '');
        const geoCity = window.__GEO_CITY__?.city || '';
        const geoState = window.__GEO_CITY__?.state || '';

        let metro = null;

        if (citySlug) {
            metro = METRO_MAP[normalizeSlug(citySlug)] || findMetroInText(citySlug);
        }
        if (!metro && queryCity) {
            metro = METRO_MAP[normalizeSlug(queryCity)] || findMetroInText(queryCity);
        }
        if (!metro && queryFrom) {
            metro = METRO_MAP[normalizeSlug(queryFrom)] || findMetroInText(queryFrom);
        }
        if (!metro && path && path !== 'book-now' && path !== 'index') {
            metro = METRO_MAP[normalizeSlug(path)] || findMetroInText(path);
        }
        if (!metro && utmCampaign) {
            metro = findMetroInText(utmCampaign);
        }
        if (!metro && geoCity) {
            metro = METRO_MAP[normalizeSlug(geoCity)] || findMetroInText(geoCity);
        }
        if (!metro && geoState) {
            const stateUpper = geoState.trim().toUpperCase();
            metro = isFB ? STATE_TO_FB_METRO[stateUpper] : STATE_TO_OPENAI_METRO[stateUpper];
        }

        if (isFB) {
            const phoneData = (metro && FB_PHONES[metro]) ? FB_PHONES[metro] : FB_DEFAULT_PHONE;
            return { ...phoneData, source: 'facebook', metro: metro || 'default-fallback' };
        }

        if (isOAI) {
            const phoneData = (metro && OPENAI_PHONES[metro]) ? OPENAI_PHONES[metro] : OPENAI_DEFAULT_PHONE;
            return { ...phoneData, source: 'chatgpt', metro: metro || 'default-fallback' };
        }
    } catch (e) {
        if (window.__CAMPAIGN_PHONE__) return window.__CAMPAIGN_PHONE__;
        if (window.__OPENAI_PHONE__) return window.__OPENAI_PHONE__;
    }
    return null;
}

export const getOpenAIOverride = getCampaignOverride;

export function CTAProvider({ children, initialCTA }) {
    const [cta, setCta] = useState(() => {
        const override = getCampaignOverride();
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
