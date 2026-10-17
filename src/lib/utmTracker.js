const STORAGE_KEY = 'utm_params';
const MAX_TOUCHPOINTS = 15;
const MAX_PAGES_VISITED = 30;

/**
 * Known standard ad click and attribution keys
 */
const KNOWN_TRACKING_KEYS = [
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

/**
 * Helper to extract a cookie value by name
 */
function getCookie(name) {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Detect whether URL query contains active advertising, click, or campaign parameters
 */
function hasAdTrackingParams(params) {
    if (!params) return false;
    const checkKeys = [
        'utm_source', 'usm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
        'gclid', 'gbraid', 'wbraid', 'gad_source', 'fbclid', 'msclkid', 'ttclid', 'twclid', 'yclid', 'srsltid',
        'source', 'campaign', 'ad_id', 'adset_id', 'campaign_id'
    ];
    for (const key of checkKeys) {
        const val = params.get(key);
        if (val && val.trim() !== '') return true;
    }
    return false;
}

/**
 * Infer readable channel/source label for a single touchpoint entry
 */
function inferTouchpointSource(capturedParams, externalReferrer) {
    if (capturedParams.utm_source) return capturedParams.utm_source;
    if (capturedParams.fbclid) return 'facebook';
    if (capturedParams.gclid || capturedParams.gbraid || capturedParams.wbraid || capturedParams.gad_source) return 'google';
    if (capturedParams.msclkid) return 'bing';
    if (capturedParams.ttclid) return 'tiktok';
    if (externalReferrer) {
        try {
            return new URL(externalReferrer).hostname.replace(/^www\./, '');
        } catch {
            return externalReferrer;
        }
    }
    return 'direct';
}

/**
 * Compute primary source string (e.g. "facebook", "google", or "facebook → google" for multi-touch)
 */
export function resolveAttributionSource(utm = {}) {
    const touchpoints = Array.isArray(utm.touchpoints) ? utm.touchpoints : [];
    const nonDirectSources = [];

    for (const tp of touchpoints) {
        const src = tp?.source;
        if (src && src !== 'direct') {
            if (nonDirectSources[nonDirectSources.length - 1] !== src) {
                nonDirectSources.push(src);
            }
        }
    }

    if (nonDirectSources.length > 0) {
        return nonDirectSources.join(' → ');
    }

    return (
        utm.utm_source ||
        (utm.fbclid ? 'facebook' : null) ||
        (utm.gclid || utm.gbraid || utm.wbraid ? 'google' : null) ||
        (utm.msclkid ? 'bing' : null) ||
        (utm.ttclid ? 'tiktok' : null) ||
        'direct'
    );
}

/**
 * Parse and capture ALL query parameters from current URL, cookies, referrer,
 * and maintain a chronological history of touchpoints and visited pages in storage.
 */
export function saveUtmParams() {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const capturedFromUrl = {};

    // 1. Capture 100% of all query parameters present in the URL (arbitrary keys & values)
    params.forEach((value, key) => {
        if (value !== null && value !== undefined && value.trim() !== '') {
            capturedFromUrl[key.trim()] = value.trim();
        }
    });

    // 2. Intelligent fallback mapping for non-standard alias parameters used by media buyers
    if (!capturedFromUrl.utm_source) {
        const sourceAlias = capturedFromUrl.source || capturedFromUrl.src || capturedFromUrl.s || capturedFromUrl.oai_source || capturedFromUrl.openAIsource || capturedFromUrl.openaisource || capturedFromUrl.usm_source;
        if (sourceAlias) capturedFromUrl.utm_source = sourceAlias;
    }
    if (!capturedFromUrl.utm_medium) {
        const mediumAlias = capturedFromUrl.medium || capturedFromUrl.med || capturedFromUrl.m || capturedFromUrl.channel;
        if (mediumAlias) capturedFromUrl.utm_medium = mediumAlias;
    }
    if (!capturedFromUrl.utm_campaign) {
        const campaignAlias = capturedFromUrl.campaign || capturedFromUrl.cmp || capturedFromUrl.c || capturedFromUrl.campaign_name || capturedFromUrl.ad_name;
        if (campaignAlias) capturedFromUrl.utm_campaign = campaignAlias;
    }
    if (!capturedFromUrl.utm_content) {
        const contentAlias = capturedFromUrl.content || capturedFromUrl.cnt || capturedFromUrl.creative || capturedFromUrl.ad;
        if (contentAlias) capturedFromUrl.utm_content = contentAlias;
    }
    if (!capturedFromUrl.utm_term) {
        const termAlias = capturedFromUrl.term || capturedFromUrl.keyword || capturedFromUrl.kw || capturedFromUrl.target;
        if (termAlias) capturedFromUrl.utm_term = termAlias;
    }

    // Read existing stored parameters from both localStorage and sessionStorage
    let existing = {};
    let isNewBrowserSession = false;
    try {
        const rawLocal = localStorage.getItem(STORAGE_KEY);
        const rawSession = sessionStorage.getItem(STORAGE_KEY);
        isNewBrowserSession = !rawSession;
        const localParsed = rawLocal ? JSON.parse(rawLocal) : {};
        const sessionParsed = rawSession ? JSON.parse(rawSession) : {};
        existing = {
            ...localParsed,
            ...sessionParsed,
            touchpoints: Array.isArray(localParsed.touchpoints) && localParsed.touchpoints.length >= (Array.isArray(sessionParsed.touchpoints) ? sessionParsed.touchpoints.length : 0)
                ? localParsed.touchpoints
                : (Array.isArray(sessionParsed.touchpoints) ? sessionParsed.touchpoints : []),
            pages_visited: Array.isArray(localParsed.pages_visited) && localParsed.pages_visited.length >= (Array.isArray(sessionParsed.pages_visited) ? sessionParsed.pages_visited.length : 0)
                ? localParsed.pages_visited
                : (Array.isArray(sessionParsed.pages_visited) ? sessionParsed.pages_visited : [])
        };
    } catch {
        existing = {};
    }

    const isFreshAdClick = hasAdTrackingParams(params);
    const hasAnyQueryParams = Object.keys(capturedFromUrl).length > 0;
    const externalReferrer = (document.referrer && !document.referrer.includes(window.location.hostname))
        ? document.referrer
        : null;

    // 3. Construct the merged object: start with existing so no prior parameters are lost
    const merged = { ...existing };

    // Apply newly captured URL parameters (fresh values update current keys, while previous different keys like fbclid/gclid remain)
    for (const [k, v] of Object.entries(capturedFromUrl)) {
        merged[k] = v;
    }

    // 4. Handle first_landing_url, landing_url, landing_path, and referrer
    if (!merged.first_landing_url) {
        merged.first_landing_url = window.location.href;
        merged.first_landing_path = window.location.pathname;
    }

    // CRITICAL: NEVER overwrite landing_url or landing_path during internal site navigation!
    // Only set/update if no landing_url was recorded yet OR a fresh ad click arrived
    if (!merged.landing_url || isFreshAdClick) {
        merged.landing_url = window.location.href;
        merged.landing_path = window.location.pathname;
    }

    // Capture external referrer
    if (externalReferrer) {
        if (!merged.first_referrer) merged.first_referrer = externalReferrer;
        merged.referrer = externalReferrer;
    }

    // 5. Record Touchpoint History (Multi-Touch Attribution)
    const touchpoints = Array.isArray(merged.touchpoints) ? [...merged.touchpoints] : [];
    const lastTouch = touchpoints.length > 0 ? touchpoints[touchpoints.length - 1] : null;

    // Record a new touchpoint when:
    // - No touchpoints exist yet (very first visit)
    // - Current URL has query parameters (ad click / UTM link) and differs from the last recorded touchpoint URL
    // - A new browser session started with an external referrer
    const isDuplicateUrl = lastTouch && lastTouch.url === window.location.href;
    const shouldRecordTouchpoint =
        touchpoints.length === 0 ||
        (hasAnyQueryParams && !isDuplicateUrl) ||
        (isNewBrowserSession && externalReferrer && !isDuplicateUrl);

    if (shouldRecordTouchpoint) {
        touchpoints.push({
            step: touchpoints.length + 1,
            timestamp: new Date().toISOString(),
            source: inferTouchpointSource(capturedFromUrl, externalReferrer),
            url: window.location.href,
            path: window.location.pathname,
            ...(externalReferrer ? { referrer: externalReferrer } : {}),
            params: capturedFromUrl
        });
    }
    merged.touchpoints = touchpoints.slice(-MAX_TOUCHPOINTS);

    // Update summary attribution fields from touchpoints
    if (merged.touchpoints.length > 0) {
        merged.first_source = merged.touchpoints[0].source;
        merged.last_source = merged.touchpoints[merged.touchpoints.length - 1].source;
        merged.conversion_path = merged.touchpoints.map((tp) => tp.source).join(' → ');
    }

    // 6. Record Page Navigation Trail (pages_visited)
    const pagesVisited = Array.isArray(merged.pages_visited) ? [...merged.pages_visited] : [];
    const currentPath = window.location.pathname;
    if (currentPath && pagesVisited[pagesVisited.length - 1] !== currentPath) {
        pagesVisited.push(currentPath);
    }
    merged.pages_visited = pagesVisited.slice(-MAX_PAGES_VISITED);

    // 7. Extract standard ad and analytics cookies
    const gaCookie = getCookie('_ga');
    if (gaCookie) merged._ga = gaCookie;

    const gclAuCookie = getCookie('_gcl_au');
    if (gclAuCookie) merged._gcl_au = gclAuCookie;

    const fbpCookie = getCookie('_fbp');
    if (fbpCookie) merged._fbp = fbpCookie;

    const fbcCookie = getCookie('_fbc');
    if (fbcCookie) merged._fbc = fbcCookie;

    // 8. Write back to BOTH sessionStorage and localStorage
    const serialized = JSON.stringify(merged);
    try {
        sessionStorage.setItem(STORAGE_KEY, serialized);
        localStorage.setItem(STORAGE_KEY, serialized);
    } catch (e) {
        console.warn('[utmTracker] Storage write failed:', e);
    }
}

/**
 * Retrieve all saved UTM, advertising query parameters, and touchpoint history from storage.
 * @returns {Object} All query parameters, touchpoint history, and tracking cookies.
 */
export function getUtmParams() {
    if (typeof window === 'undefined') return {};

    try {
        const rawSession = sessionStorage.getItem(STORAGE_KEY);
        const rawLocal = localStorage.getItem(STORAGE_KEY);
        const sessionParams = rawSession ? JSON.parse(rawSession) : {};
        const localParams = rawLocal ? JSON.parse(rawLocal) : {};
        const merged = { ...localParams, ...sessionParams };

        // Ensure critical tracking keys from either store are never dropped
        for (const key of KNOWN_TRACKING_KEYS) {
            if (!merged[key]) {
                if (localParams[key]) merged[key] = localParams[key];
                else if (sessionParams[key]) merged[key] = sessionParams[key];
            }
        }

        // Preserve full touchpoints and pages_visited arrays from whichever storage has the longer history
        const localTouchpoints = Array.isArray(localParams.touchpoints) ? localParams.touchpoints : [];
        const sessionTouchpoints = Array.isArray(sessionParams.touchpoints) ? sessionParams.touchpoints : [];
        merged.touchpoints = localTouchpoints.length >= sessionTouchpoints.length ? localTouchpoints : sessionTouchpoints;

        const localPages = Array.isArray(localParams.pages_visited) ? localParams.pages_visited : [];
        const sessionPages = Array.isArray(sessionParams.pages_visited) ? sessionParams.pages_visited : [];
        merged.pages_visited = localPages.length >= sessionPages.length ? localPages : sessionPages;

        if (merged.touchpoints.length > 0) {
            merged.first_source = merged.touchpoints[0].source;
            merged.last_source = merged.touchpoints[merged.touchpoints.length - 1].source;
            merged.conversion_path = merged.touchpoints.map((tp) => tp.source).join(' → ');
        }

        if (!merged.first_landing_url) {
            merged.first_landing_url = localParams.first_landing_url || sessionParams.first_landing_url || localParams.landing_url || sessionParams.landing_url || (typeof window !== 'undefined' ? window.location.href : '');
        }
        if (!merged.landing_url) {
            merged.landing_url = localParams.landing_url || sessionParams.landing_url || (typeof window !== 'undefined' ? window.location.href : '');
        }
        if (!merged.landing_path) {
            merged.landing_path = localParams.landing_path || sessionParams.landing_path || (typeof window !== 'undefined' ? window.location.pathname : '');
        }

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
        if (!merged._fbc) {
            const fbcCookie = getCookie('_fbc');
            if (fbcCookie) merged._fbc = fbcCookie;
        }

        return merged;
    } catch {
        return {};
    }
}
