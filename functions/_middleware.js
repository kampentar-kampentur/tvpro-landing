import config from './middleware-config.json';

const BOT_AGENTS = [
    'googlebot', 'bingbot', 'yandexbot', 'duckduckbot', 'slurp',
    'baiduspider', 'ia_archiver', 'facebot', 'facebookexternalhit',
    'twitterbot', 'rogerbot', 'linkedinbot', 'embedly', 'quora link preview',
    'showyoubot', 'outbrain', 'pinterest/0.', 'developers.google.com/+/web/snippet',
    'slackbot', 'vkshare', 'redditbot', 'applebot', 'whatsapp', 'flipboard', 'tumblr'
];

/**
 * Dedicated OpenAI / ChatGPT ad campaign phones per city cluster
 */
const OPENAI_CITY_PHONES = {
    // San Antonio, TX: +1 210-796-8856
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

    // Dallas, TX: +1 469-716-6501
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

    // Fort Lauderdale, FL: +1 754-345-4333
    'fort-lauderdale': { phone: '+17543454333', phoneLabel: '(754) 345-4333' },

    // Irvine, CA: +1 949-998-6321
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

    // Charlotte, NC: +1 980-455-8203
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

    if (isRoot) {
        if (!disableGeo) {
            // Fallback to Geo-IP detection
            const userCity = context.request.cf?.city?.toLowerCase();
            const matchedSlug = userCity ? config.geo[userCity] : null;

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

    // 8. OpenAI / ChatGPT Campaign Phone Substitution (Target Cities Only, No Cookies)
    const utmSource = (url.searchParams.get('utm_source') || url.searchParams.get('source') || '').toLowerCase();
    const isChatGPT = utmSource.includes('chatgpt') || 
                      utmSource.includes('openai') || 
                      (url.searchParams.get('utm_medium') || '').toLowerCase().includes('chatgpt') ||
                      (url.searchParams.get('utm_campaign') || '').toLowerCase().includes('chatgpt');

    const openaiPhone = isChatGPT ? OPENAI_CITY_PHONES[workingPath] : null;

    if (targetCity || openaiPhone) {
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

        if (openaiPhone) {
            const phoneDataPayload = {
                phone: openaiPhone.phone,
                phoneLabel: openaiPhone.phoneLabel
            };

            rewriter
                .on('a[href^="tel:"]', {
                    element(el) {
                        el.setAttribute('href', `tel:${openaiPhone.phone}`);
                        const aria = el.getAttribute('aria-label');
                        if (aria && /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(aria)) {
                            el.setAttribute('aria-label', aria.replace(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/, openaiPhone.phoneLabel));
                        }
                        const title = el.getAttribute('title');
                        if (title && /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(title)) {
                            el.setAttribute('title', title.replace(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/, openaiPhone.phoneLabel));
                        }
                    }
                })
                .on('head', {
                    element(el) {
                        el.append(`<script id="openai-phone-override">
window.__OPENAI_PHONE__ = ${JSON.stringify(phoneDataPayload)};
(function() {
    function swap() {
        var label = ${JSON.stringify(openaiPhone.phoneLabel)};
        var href = "tel:" + ${JSON.stringify(openaiPhone.phone)};
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
