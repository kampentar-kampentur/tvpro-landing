import { getAllCities } from '@/lib/strapi';

export const dynamic = 'force-static';

export default async function sitemap() {
    const baseUrl = 'https://tvprousa.com';

    // 1. Fetch all cities from Strapi
    let cities = [];
    try {
        cities = await getAllCities();
    } catch (error) {
        console.error('[Sitemap Error] Failed to fetch cities:', error);
    }

    // 2. Map cities to sitemap entries
    const cityEntries = cities
        .filter(city => !city.test_version && city.path)
        .map((city) => ({
            url: `${baseUrl}/${city.path}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        }));

    // 3. Static routes
    const staticEntries = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/privacy-policy`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/sms-consent`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        }
    ];

    return [...staticEntries, ...cityEntries];
}
