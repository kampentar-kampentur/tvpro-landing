const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const STORAGE_KEY = 'utm_params';

/**
 * Parse UTM parameters from the current URL and save to sessionStorage.
 * Only saves if at least one UTM param is present in the URL.
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

    if (Object.keys(utm).length > 0) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utm));
    }
}

/**
 * Retrieve saved UTM parameters from sessionStorage.
 * @returns {Object} UTM params object, or empty object if none saved.
 */
export function getUtmParams() {
    if (typeof window === 'undefined') return {};

    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}
