const fs = require('fs');
const path = require('path');

// Manually parse .env file if it exists to load NEXT_PUBLIC_SRTAPI_URL
try {
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const parts = line.split('=');
            if (parts[0]) {
                const key = parts[0].trim();
                const value = parts[1] ? parts[1].trim() : '';
                process.env[key] = value;
            }
        });
    }
} catch (e) {
    console.error('Failed to parse .env file:', e);
}

// Use native fetch (Node 18+) instead of node-fetch
async function fetchAllCities() {
    const strapiUrl = process.env.NEXT_PUBLIC_SRTAPI_URL;
    console.log(`Using Strapi URL for variants: ${strapiUrl}`);
    const res = await fetch(`${strapiUrl}/api/cities?pagination[pageSize]=100`);
    const json = await res.json();
    return json.data || [];
}

async function generateVariants() {
    console.log('Fetching cities for variant generation...');
    const cities = await fetchAllCities();

    const middlewareConfig = {
        variants: {},
        geo: {}
    };

    cities.forEach(city => {
        // Handle both flattened and non-flattened structure for safety
        const attrs = city.attributes || city;
        const slug = attrs.path;
        const version = attrs.test_version;
        const cityName = attrs.city_name;

        if (slug) {
            if (!middlewareConfig.variants[slug]) {
                middlewareConfig.variants[slug] = [];
            }
            if (version) {
                middlewareConfig.variants[slug].push(version);
            }

            // Map city_name to slug for Geo-IP matching
            if (cityName && !version) {
                middlewareConfig.geo[cityName.toLowerCase()] = slug;
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
