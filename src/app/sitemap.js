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
        .filter(city => !city.test_version && city.path && !city.metro_city_slug)
        .map((city) => ({
            url: `${baseUrl}/${city.path}/`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        }));

    // 3. Static routes
    const staticEntries = [
        {
            url: `${baseUrl}/`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/chicago/`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/about/`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact/`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/cookie-policy/`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        }
    ];

    return [...staticEntries, ...cityEntries];
}
