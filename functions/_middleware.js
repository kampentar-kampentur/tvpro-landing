import variantConfig from './middleware-config.json';

export async function onRequest(context) {
    const url = new URL(context.request.url);
    // Clean path: remove leading/trailing slashes
    const path = url.pathname.replace(/^\/|\/$/g, '');

    // 1. Check if active tests exist for this path
    // Note: variantConfig keys should match the cleaned path (e.g. 'chicago')
    const variants = variantConfig[path];

    // If no variants defined for this path, or if it's an API/Asset request, skip
    if (!variants || variants.length === 0 || path.includes('.')) {
        return context.next();
    }

    // 2. Get/Validate Cookie using Regex
    // Cloudflare Workers don't have document.cookie, need manual parsing
    const cookieHeader = context.request.headers.get('Cookie') || '';
    const match = cookieHeader.match(/test_version=([^;]+)/);
    let version = match ? match[1] : null;

    // Validate: If cookie exists but is old/invalid (not in current config), reset it
    if (version && !variants.includes(version) && version !== 'default') {
        version = null;
    }

    // 3. Assign bucket if missing
    if (!version) {
        // Options: 'default' (original page) + all defined variants
        const options = ['default', ...variants];
        // Simple random assignment
        version = options[Math.floor(Math.random() * options.length)];
    }

    // 4. Rewrite & Set Cookie
    let response;
    if (version !== 'default') {
        // Rewrite internal request to variants path: /variants/chicago/v1
        const variantUrl = new URL(url);
        variantUrl.pathname = `/variants/${path}/${version}`;

        // Fetch the variant page
        response = await context.env.ASSETS.fetch(variantUrl);

        // Safety Fallback: If variant build is missing (404), fallback to default
        if (response.status === 404) {
            response = await context.next();
        }
    } else {
        // Default: Process normally (serves /chicago/index.html)
        response = await context.next();
    }

    // 5. Apply Cookie to Response
    const newRes = new Response(response.body, response);
    newRes.headers.append('Set-Cookie', `test_version=${version}; Path=/; Max-Age=2592000; SameSite=Lax`);
    return newRes;
}
