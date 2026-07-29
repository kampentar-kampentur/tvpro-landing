const UTM_KEYS = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
    'utm_position',
    'utm_matchtype',
    'utm_placement',
    'utm_network',
    'gclid',
    'gbraid',
    'wbraid',
    'fbclid',
    'msclkid',
    '_ga',
    '_gcl_au'
];
const STORAGE_KEY = 'utm_params';

/**
 * Helper to extract a cookie value by name
 */
function getCookie(name) {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Parse UTM parameters from the current URL and cookies, saving to sessionStorage and localStorage.
 */
export function saveUtmParams() {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const utm = {};

    UTM_KEYS.forEach((key) => {
        const value = params.get(key);
        if (value) {
            utm[key] = value;
        }
    });

    // Extract GA and Conversion Linker cookies if not present in URL
    if (!utm._ga) {
        const gaCookie = getCookie('_ga');
        if (gaCookie) utm._ga = gaCookie;
    }
    if (!utm._gcl_au) {
        const gclAuCookie = getCookie('_gcl_au');
        if (gclAuCookie) utm._gcl_au = gclAuCookie;
    }

    if (Object.keys(utm).length > 0) {
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

        const merged = { ...existing, ...utm };
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
 * Retrieve saved UTM parameters from storage.
 * @returns {Object} UTM params object, or empty object if none saved.
 */
export function getUtmParams() {
    if (typeof window === 'undefined') return {};

    try {
        const rawSession = sessionStorage.getItem(STORAGE_KEY);
        const rawLocal = localStorage.getItem(STORAGE_KEY);
        const sessionParams = rawSession ? JSON.parse(rawSession) : {};
        const localParams = rawLocal ? JSON.parse(rawLocal) : {};
        const merged = { ...localParams, ...sessionParams };

        // Dynamically add GA cookies if still available
        if (!merged._ga) {
            const gaCookie = getCookie('_ga');
            if (gaCookie) merged._ga = gaCookie;
        }
        if (!merged._gcl_au) {
            const gclAuCookie = getCookie('_gcl_au');
            if (gclAuCookie) merged._gcl_au = gclAuCookie;
        }

        return merged;
    } catch {
        return {};
    }
}

