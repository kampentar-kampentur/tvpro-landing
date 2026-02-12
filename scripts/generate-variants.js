const fs = require('fs');
const path = require('path');
// Use native fetch (Node 18+) instead of node-fetch
async function fetchAllCities() {
    const strapiUrl = process.env.NEXT_PUBLIC_SRTAPI_URL || 'http://localhost:1337';
    console.log(`Using Strapi URL: ${strapiUrl}`);
    const res = await fetch(`${strapiUrl}/api/cities?pagination[pageSize]=100`);
    const json = await res.json();
    return json.data;
}

async function generateVariants() {
    console.log('Fetching cities for variant generation...');
    const cities = await fetchAllCities();

    const middlewareConfig = {};

    cities.forEach(city => {
        // Handle both flattened and non-flattened structure for safety
        const attrs = city.attributes || city;
        const slug = attrs.path;
        const version = attrs.test_version;

        if (slug) {
            if (!middlewareConfig[slug]) {
                middlewareConfig[slug] = [];
            }
            if (version) {
                middlewareConfig[slug].push(version);
            }
        }
    });

    // Write middleware-config.json for Cloudflare Functions
    // Move up one level from scripts/ to root/
    const outputPath = path.join(process.cwd(), 'functions', 'middleware-config.json');

    // Ensure functions folder exists
    if (!fs.existsSync(path.dirname(outputPath))) {
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(middlewareConfig, null, 2));
    console.log(`Generated middleware-config.json at ${outputPath}`);
    console.log('Config:', JSON.stringify(middlewareConfig, null, 2));
}

generateVariants();
