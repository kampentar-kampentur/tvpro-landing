import config from './middleware-config.json';

const BOT_AGENTS = [
    'googlebot', 'bingbot', 'yandexbot', 'duckduckbot', 'slurp',
    'baiduspider', 'ia_archiver', 'facebot', 'facebookexternalhit',
    'twitterbot', 'rogerbot', 'linkedinbot', 'embedly', 'quora link preview',
    'showyoubot', 'outbrain', 'pinterest/0.', 'developers.google.com/+/web/snippet',
    'slackbot', 'vkshare', 'redditbot', 'applebot', 'whatsapp', 'flipboard', 'tumblr'
];

/**
 * Campaign Phone Numbers & Mappings
 * Supported Sources: Facebook (Meta, IG) & ChatGPT (OpenAI)
 */
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

function resolveCampaignPhone(params, context = {}) {
    const utmSource = params.get('utm_source') || params.get('source') || params.get('usm_source') || params.get('src') || '';
    const utmMedium = params.get('utm_medium') || params.get('medium') || '';
    const utmCampaign = params.get('utm_campaign') || params.get('campaign') || '';
    const hasFbclid = params.has('fbclid');
    const hasOpenAISource = params.has('openAIsource') || params.has('openaisource') || params.has('oai_source');
    const referrer = context.referrer || '';

    const isFB = isFacebookSource({ utmSource, utmMedium, utmCampaign, hasFbclid, referrer });
    const isOAI = isOpenAISource({ utmSource, utmMedium, utmCampaign, hasOpenAISource, referrer });

    if (!isFB && !isOAI) return null;

    const queryCity = params.get('city');
    const queryFrom = params.get('from');
    const pathname = context.pathname || '';
    const cfCity = context.cfCity || '';
    const cfRegion = context.cfRegion || '';

    let metro = null;

    if (queryCity) {
        metro = METRO_MAP[normalizeSlug(queryCity)] || findMetroInText(queryCity);
    }
    if (!metro && queryFrom) {
        metro = METRO_MAP[normalizeSlug(queryFrom)] || findMetroInText(queryFrom);
    }
    if (!metro && context.workingPath && context.workingPath !== 'book-now' && context.workingPath !== 'index') {
        metro = METRO_MAP[normalizeSlug(context.workingPath)] || findMetroInText(context.workingPath);
    }
    if (!metro && pathname && pathname !== '/' && pathname !== '/book-now') {
        metro = METRO_MAP[normalizeSlug(pathname)] || findMetroInText(pathname);
    }
    if (!metro && utmCampaign) {
        metro = findMetroInText(utmCampaign);
    }
    if (!metro && cfCity) {
        metro = METRO_MAP[normalizeSlug(cfCity)] || findMetroInText(cfCity);
    }
    if (!metro && cfRegion) {
        const stateUpper = cfRegion.trim().toUpperCase();
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

    return null;
}

export async function onRequest(context) {
    const url = new URL(context.request.url);
    const userAgent = context.request.headers.get('User-Agent')?.toLowerCase() || '';
    const isBot = BOT_AGENTS.some(bot => userAgent.includes(bot)) || context.request.cf?.asOrganization?.toLowerCase().includes('google');

    // Clean path: remove leading/trailing slashes
    const path = url.pathname.replace(/^\/|\/$/g, '') || 'index';
    const isRoot = path === 'index';

    // 1. Skip Assets & APIs
    if (path.includes('.') && !isRoot) {
        return context.next();
    }

    // 2. Bot Protection: Bots always see default content
    if (isBot) {
        return context.next();
    }

    const cookieHeader = context.request.headers.get('Cookie') || '';
    const disableGeo = context.env.DISABLE_GEO_IP === 'true';

    // 3. Determine working path (Actual path or Geo-mapped path)
    let workingPath = (path === 'index' ? '' : path);

    if (isRoot || path === 'book-now') {
        if (!disableGeo) {
            // Check query params first, then fallback to Geo-IP detection
            const queryFrom = url.searchParams.get('from')?.replace(/^\/|\/$/g, '').toLowerCase();
            const queryCity = url.searchParams.get('city')?.toLowerCase();
            const userCity = context.request.cf?.city?.toLowerCase();
            const matchedSlug = queryFrom || (queryCity ? config.geo[queryCity] : null) || (userCity ? config.geo[userCity] : null);

            if (matchedSlug) {
                workingPath = matchedSlug;
            }
        }
    }

    // 4. A/B Testing Logic (Works for both standard and geo-routed paths)
    const variants = config.variants[workingPath];
    let version = 'default';

    if (variants && variants.length > 0) {
        const match = cookieHeader.match(/test_version=([^;]+)/);
        version = match ? match[1] : null;

        if (version && !variants.includes(version) && version !== 'default') {
            version = null;
        }

        if (!version) {
            const options = ['default', ...variants];
            version = options[Math.floor(Math.random() * options.length)];
        }
    }

    // 5. Build Final Response
    let response;
    const isSpecialRoute = version !== 'default' || (isRoot && workingPath !== '');

    if (isSpecialRoute) {
        const fetchUrl = new URL(url);

        if (version !== 'default') {
            // participating in A/B test (either on root or city-assigned root)
            const basePath = workingPath || 'index';
            fetchUrl.pathname = `/variants/${basePath}/${version}`;
        } else {
            // just showing city-specific content on root
            fetchUrl.pathname = `/${workingPath}`;
        }

        response = await context.env.ASSETS.fetch(fetchUrl);

        // Safety Fallback: If variant/city is missing, fallback to actual requested path
        if (response.status === 404) {
            response = await context.next();
        }
    } else {
        response = await context.next();
    }

    // 6. Apply Cookies & Debug Headers
    const newRes = new Response(response.body, response);

    if (variants && variants.length > 0) {
        newRes.headers.append('Set-Cookie', `test_version=${version}; Path=/; Max-Age=2592000; SameSite=Lax`);
    }

    newRes.headers.set('x-debug-cf-city', context.request.cf?.city || 'not-found');
    newRes.headers.set('x-debug-matched-slug', workingPath || 'root');
    newRes.headers.set('x-debug-version', version);

    // 7. Dynamic City Replacement via HTMLRewriter & Geo Injection
    const queryCity = url.searchParams.get('city');
    const isUS = context.request.cf?.country?.toUpperCase() === 'US';
    const cfCity = context.request.cf?.city;
    const cfRegion = context.request.cf?.regionCode || context.request.cf?.region;

    let targetCity = null;
    let targetState = null;

    if (queryCity) {
        // 1. Query parameter takes top priority (e.g. ?city=Houston)
        targetCity = formatCityName(queryCity);
        const parts = targetCity.split(',');
        if (parts.length > 1) {
            targetState = parts[1].trim().toUpperCase();
        }
    } else if (!disableGeo && isUS && cfCity) {
        // 2. Automatic Geo-IP detection ONLY for visitors from USA
        targetCity = formatCityName(cfCity);
        targetState = cfRegion ? cfRegion.toUpperCase() : null;
    }

    // 8. Dynamic Campaign Phone Substitution (Facebook & OpenAI / ChatGPT)
    const campaignPhone = resolveCampaignPhone(url.searchParams, {
        pathname: url.pathname,
        workingPath: workingPath,
        cfCity: context.request.cf?.city,
        cfRegion: context.request.cf?.regionCode || context.request.cf?.region,
        referrer: context.request.headers.get('Referer') || '',
    });

    if (targetCity || campaignPhone) {
        const rewriter = new HTMLRewriter();

        if (targetCity) {
            const geoPayload = {
                city: targetCity.split(',')[0].trim(),
                fullCity: targetCity,
                state: targetState,
                country: isUS ? 'US' : (context.request.cf?.country || null),
            };

            rewriter
                .on('[data-dynamic-city]', {
                    element(el) {
                        el.setInnerContent(targetCity);
                    }
                })
                .on('head', {
                    element(el) {
                        el.append(`<script id="geo-city-data">window.__GEO_CITY__ = ${JSON.stringify(geoPayload)};</script>`, { html: true });
                    }
                });
        }

        if (campaignPhone) {
            const phoneDataPayload = {
                phone: campaignPhone.phone,
                phoneLabel: campaignPhone.phoneLabel,
                source: campaignPhone.source,
                metro: campaignPhone.metro
            };

            rewriter
                .on('a[href^="tel:"]', {
                    element(el) {
                        el.setAttribute('href', `tel:${campaignPhone.phone}`);
                        const aria = el.getAttribute('aria-label');
                        if (aria && /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(aria)) {
                            el.setAttribute('aria-label', aria.replace(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/, campaignPhone.phoneLabel));
                        }
                        const title = el.getAttribute('title');
                        if (title && /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(title)) {
                            el.setAttribute('title', title.replace(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/, campaignPhone.phoneLabel));
                        }
                    }
                })
                .on('head', {
                    element(el) {
                        el.append(`<script id="campaign-phone-override">
window.__CAMPAIGN_PHONE__ = ${JSON.stringify(phoneDataPayload)};
window.__OPENAI_PHONE__ = ${JSON.stringify(phoneDataPayload)};
(function() {
    function swap() {
        var label = ${JSON.stringify(campaignPhone.phoneLabel)};
        var href = "tel:" + ${JSON.stringify(campaignPhone.phone)};
        var btns = document.querySelectorAll('a[href^="tel:"]');
        btns.forEach(function(b) {
            b.href = href;
            var spans = b.querySelectorAll('span:not(.visually-hidden)');
            var updated = false;
            spans.forEach(function(s) {
                if (s.children.length === 0 && /\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}/.test(s.textContent)) {
                    s.textContent = label;
                    updated = true;
                }
            });
            if (!updated && !b.querySelector('svg') && /\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}/.test(b.textContent)) {
                b.textContent = label;
            }
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', swap);
    } else {
        swap();
    }
})();
</script>`, { html: true });
                    }
                });
        }

        return rewriter.transform(newRes);
    }

    return newRes;
}

function formatCityName(raw) {
    if (!raw) return '';
    let str = decodeURIComponent(raw).trim();
    if (str.includes('-') && !str.includes(' ')) {
        str = str.replace(/-/g, ' ');
    }
    str = str.replace(/\b[a-z]/g, (char) => char.toUpperCase());
    str = str.replace(/,\s*([A-Za-z]{2})\b/g, (_, st) => `, ${st.toUpperCase()}`);
    return str.replace(/[<>"']/g, '');
}
