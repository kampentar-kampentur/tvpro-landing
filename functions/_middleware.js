import config from './middleware-config.json';

const BOT_AGENTS = [
    'googlebot', 'bingbot', 'yandexbot', 'duckduckbot', 'slurp',
    'baiduspider', 'ia_archiver', 'facebot', 'facebookexternalhit',
    'twitterbot', 'rogerbot', 'linkedinbot', 'embedly', 'quora link preview',
    'showyoubot', 'outbrain', 'pinterest/0.', 'developers.google.com/+/web/snippet',
    'slackbot', 'vkshare', 'redditbot', 'applebot', 'whatsapp', 'flipboard', 'tumblr'
];

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
    const hasGeoAssigned = cookieHeader.includes('geo_assigned=true');
    const disableGeo = context.env.DISABLE_GEO_IP === 'true';

    // 3. Determine working path (Actual path or Geo-mapped path)
    let workingPath = (path === 'index' ? '' : path);
    let isGeoRedirect = false;

    if (isRoot && !disableGeo && !hasGeoAssigned) {
        const userCity = context.request.cf?.city?.toLowerCase();
        const matchedSlug = userCity ? config.geo[userCity] : null;

        if (matchedSlug) {
            workingPath = matchedSlug;
            isGeoRedirect = true;
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

    if (version !== 'default' || isGeoRedirect) {
        const fetchUrl = new URL(url);

        if (version !== 'default') {
            // participating in A/B test
            fetchUrl.pathname = `/variants/${workingPath}/${version}`;
        } else {
            // just geo-redirected to city root
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

    // 6. Apply Cookies
    const newRes = new Response(response.body, response);

    if (isGeoRedirect) {
        newRes.headers.append('Set-Cookie', `geo_assigned=true; Path=/; Max-Age=604800`);
    }

    if (variants && variants.length > 0) {
        newRes.headers.append('Set-Cookie', `test_version=${version}; Path=/; Max-Age=2592000; SameSite=Lax`);
    }

    return newRes;
}
