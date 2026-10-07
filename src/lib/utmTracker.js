const STORAGE_KEY = 'utm_params';

/**
 * Known standard ad click and attribution keys
 */
const KNOWN_TRACKING_KEYS = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
    'utm_position',
    'utm_matchtype',
    'utm_placement',
    'utm_network',
    'utm_id',
    'utm_creative',
    'gclid',
    'gbraid',
    'wbraid',
    'gad_source',
    'fbclid',
    'msclkid',
    'oppref',
    'ttclid',
    'twclid',
    'yclid',
    'srsltid',
    'ad_id',
    'adset_id',
    'campaign_id',
    'creative_id',
    'placement_id',
    '_ga',
    '_gcl_au',
    '_fbp',
    '_fbc'
];

/**
 * Helper to extract a cookie value by name
 */
function getCookie(name) {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Parse and capture ALL query parameters from current URL, cookies, and referrer,
 * saving them persistently to sessionStorage and localStorage.
 */
export function saveUtmParams() {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const captured = {};

    // 1. Capture 100% of all query parameters present in the URL (arbitrary keys & values)
    params.forEach((value, key) => {
        if (value !== null && value !== undefined && value.trim() !== '') {
            captured[key.trim()] = value.trim();
        }
    });

    // 2. Intelligent fallback mapping for non-standard alias parameters used by media buyers
    if (!captured.utm_source) {
        const sourceAlias = captured.source || captured.src || captured.s || captured.oai_source;
        if (sourceAlias) captured.utm_source = sourceAlias;
    }
    if (!captured.utm_medium) {
        const mediumAlias = captured.medium || captured.med || captured.m || captured.channel;
        if (mediumAlias) captured.utm_medium = mediumAlias;
    }
    if (!captured.utm_campaign) {
        const campaignAlias = captured.campaign || captured.cmp || captured.c || captured.campaign_name || captured.ad_name;
        if (campaignAlias) captured.utm_campaign = campaignAlias;
    }
    if (!captured.utm_content) {
        const contentAlias = captured.content || captured.cnt || captured.creative || captured.ad;
        if (contentAlias) captured.utm_content = contentAlias;
    }
    if (!captured.utm_term) {
        const termAlias = captured.term || captured.keyword || captured.kw || captured.target;
        if (termAlias) captured.utm_term = termAlias;
    }

    // 3. Record landing URL and referrer on first landing
    if (window.location.href) {
        captured.landing_url = window.location.href;
        captured.landing_path = window.location.pathname;
    }
    if (document.referrer && !document.referrer.includes(window.location.hostname)) {
        captured.referrer = document.referrer;
    }

    // 4. Extract standard ad and analytics cookies
    const gaCookie = getCookie('_ga');
    if (gaCookie && !captured._ga) captured._ga = gaCookie;

    const gclAuCookie = getCookie('_gcl_au');
    if (gclAuCookie && !captured._gcl_au) captured._gcl_au = gclAuCookie;

    const fbpCookie = getCookie('_fbp');
    if (fbpCookie && !captured._fbp) captured._fbp = fbpCookie;

    const fbcCookie = getCookie('_fbc');
    if (fbcCookie && !captured._fbc) captured._fbc = fbcCookie;

    // 5. Merge with existing stored parameters and persist
    if (Object.keys(captured).length > 0) {
        let existing = {};
        try {
            const rawSession = sessionStorage.getItem(STORAGE_KEY);
            const rawLocal = localStorage.getItem(STORAGE_KEY);
            existing = {
                ...(rawLocal ? JSON.parse(rawLocal) : {}),
                ...(rawSession ? JSON.parse(rawSession) : {})
            };
        } catch {
            existing = {};
        }

        // Keep initial landing_url / referrer if already recorded
        const merged = {
            ...captured,
            ...existing,
            ...captured // new URL params override existing if fresh click arrived
        };

        const serialized = JSON.stringify(merged);
        try {
            sessionStorage.setItem(STORAGE_KEY, serialized);
            localStorage.setItem(STORAGE_KEY, serialized);
        } catch (e) {
            console.warn('[utmTracker] Storage write failed:', e);
        }
    }
}

/**
 * Retrieve all saved UTM and advertising query parameters from storage.
 * @returns {Object} All query parameters and tracking cookies, or empty object.
 */
export function getUtmParams() {
    if (typeof window === 'undefined') return {};

    try {
        const rawSession = sessionStorage.getItem(STORAGE_KEY);
        const rawLocal = localStorage.getItem(STORAGE_KEY);
        const sessionParams = rawSession ? JSON.parse(rawSession) : {};
        const localParams = rawLocal ? JSON.parse(rawLocal) : {};
        const merged = { ...localParams, ...sessionParams };

        // Dynamically add GA and ad cookies if available
        if (!merged._ga) {
            const gaCookie = getCookie('_ga');
            if (gaCookie) merged._ga = gaCookie;
        }
        if (!merged._gcl_au) {
            const gclAuCookie = getCookie('_gcl_au');
            if (gclAuCookie) merged._gcl_au = gclAuCookie;
        }
        if (!merged._fbp) {
            const fbpCookie = getCookie('_fbp');
            if (fbpCookie) merged._fbp = fbpCookie;
        }

        return merged;
    } catch {
        return {};
    }
}
