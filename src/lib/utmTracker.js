/**
 * UTM & Click ID Helper for React Forms
 * Reads last-contact tracking parameters and the internal visitorId (tvp_<YYMMDD>_<src>_<rand8>.<ts>)
 * managed by the standalone Vanilla JS tracker in <head> (window.TVPTracker).
 */

const STORAGE_KEY = 'tvp_utm_params';
const VID_KEY = 'tvp_vid';

export const KNOWN_TRACKING_KEYS = [
    'utm_source',
    'usm_source',
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

function getCookie(name) {
    if (typeof document === 'undefined') return null;
    try {
        const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'));
        return match ? decodeURIComponent(match[1]) : null;
    } catch {
        return null;
    }
}

/**
 * Get the current visitor's unique internal ID (`tvp_<YYMMDD>_<src>_<rand8>.<ts>`).
 */
export function getVisitorId() {
    if (typeof window === 'undefined') return null;
    if (window.TVPTracker && typeof window.TVPTracker.getVisitorId === 'function') {
        return window.TVPTracker.getVisitorId();
    }
    try {
        return (
            window.localStorage?.getItem(VID_KEY) ||
            window.sessionStorage?.getItem(VID_KEY) ||
            getCookie(VID_KEY) ||
            null
        );
    } catch {
        return getCookie(VID_KEY) || null;
    }
}

/**
 * Sync any newly arrived URL query parameters into storage (fallback if called from React).
 */
export function saveUtmParams() {
    if (typeof window === 'undefined') return;

    try {
        const searchParams = new URLSearchParams(window.location.search);
        const capturedFromUrl = {};
        for (const [key, value] of searchParams.entries()) {
            if (value !== '') {
                capturedFromUrl[key] = value;
                if (key.toLowerCase() === 'usm_source' && !capturedFromUrl.utm_source) {
                    capturedFromUrl.utm_source = value;
                }
            }
        }

        const rawSession = sessionStorage.getItem(STORAGE_KEY);
        const rawLocal = localStorage.getItem(STORAGE_KEY);
        const localParams = rawLocal ? JSON.parse(rawLocal) : {};
        const sessionParams = rawSession ? JSON.parse(rawSession) : {};
        const existing = {
            ...localParams,
            ...sessionParams
        };

        // Ensure no KNOWN_TRACKING_KEYS are ever lost between localStorage and sessionStorage
        for (const key of KNOWN_TRACKING_KEYS) {
            if (!existing[key]) {
                if (localParams[key]) existing[key] = localParams[key];
                else if (sessionParams[key]) existing[key] = sessionParams[key];
            }
        }

        const visitorId = getVisitorId() || existing.visitorId || null;
        const merged = {
            ...existing,
            ...capturedFromUrl,
            ...(visitorId ? { visitorId } : {})
        };

        if (!merged.landing_url || Object.keys(capturedFromUrl).length > 0) {
            merged.landing_url = window.location.href;
            merged.landing_path = window.location.pathname;
        }

        const serialized = JSON.stringify(merged);
        sessionStorage.setItem(STORAGE_KEY, serialized);
        localStorage.setItem(STORAGE_KEY, serialized);
    } catch (e) {
        console.warn('[utmTracker] Storage sync error:', e);
    }
}

/**
 * Retrieve last-contact UTM/ClickID parameters + internal `visitorId` for form submission.
 */
export function getUtmParams() {
    if (typeof window === 'undefined') return {};

    try {
        const trackerParams =
            window.TVPTracker && typeof window.TVPTracker.getParams === 'function'
                ? window.TVPTracker.getParams()
                : {};

        const rawSession = sessionStorage.getItem(STORAGE_KEY);
        const rawLocal = localStorage.getItem(STORAGE_KEY);
        const sessionParams = rawSession ? JSON.parse(rawSession) : {};
        const localParams = rawLocal ? JSON.parse(rawLocal) : {};
        const merged = { ...localParams, ...sessionParams, ...trackerParams };

        // Explicitly guarantee all KNOWN_TRACKING_KEYS from any store are preserved
        for (const key of KNOWN_TRACKING_KEYS) {
            if (!merged[key]) {
                if (trackerParams[key]) merged[key] = trackerParams[key];
                else if (sessionParams[key]) merged[key] = sessionParams[key];
                else if (localParams[key]) merged[key] = localParams[key];
            }
        }

        const visitorId = getVisitorId();
        if (visitorId) merged.visitorId = visitorId;

        if (!merged._ga) {
            const ga = getCookie('_ga');
            if (ga) merged._ga = ga;
        }
        if (!merged._gcl_au) {
            const gcl = getCookie('_gcl_au');
            if (gcl) merged._gcl_au = gcl;
        }
        if (!merged._fbp) {
            const fbp = getCookie('_fbp');
            if (fbp) merged._fbp = fbp;
        }
        if (!merged._fbc) {
            const fbc = getCookie('_fbc');
            if (fbc) merged._fbc = fbc;
        }

        return merged;
    } catch {
        const vid = getVisitorId();
        return vid ? { visitorId: vid } : {};
    }
}

/**
 * Resolve last-contact source for form submission.
 */
export function resolveAttributionSource(utm = {}, fallbackSource = 'direct') {
    if (!utm || typeof utm !== 'object') return fallbackSource;
    return (
        utm.utm_source ||
        (utm.fbclid ? 'facebook' : null) ||
        (utm.gclid || utm.gbraid || utm.wbraid ? 'google' : null) ||
        (utm.msclkid ? 'bing' : null) ||
        utm.openAIsource ||
        utm.openaisource ||
        utm.openai_source ||
        utm.last_source ||
        fallbackSource
    );
}

/**
 * Track a detailed form interaction event (`modal_open`, `field_interact`, `step_change`, `submit_click`)
 * with the exact form name via the standalone Vanilla JS tracker.
 */
export function trackFormInteract(formName, action, details = {}) {
    if (typeof window === 'undefined') return;
    if (window.TVPTracker && typeof window.TVPTracker.trackFormInteract === 'function') {
        window.TVPTracker.trackFormInteract(formName, action, details);
    }
}
