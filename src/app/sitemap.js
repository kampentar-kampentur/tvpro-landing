import { getAllCities, getAllBlogPosts } from '@/lib/strapi';
import { blogPosts } from '@/lib/blog-data';

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

    // 2. Fetch all blog posts from Strapi
    let strapiPosts = [];
    try {
        strapiPosts = await getAllBlogPosts();
    } catch (error) {
        console.error('[Sitemap Error] Failed to fetch blog posts:', error);
    }

    // 3. Map cities to sitemap entries
    const cityEntries = cities
        .filter(city => !city.test_version && city.path && !city.metro_city_slug)
        .map((city) => ({
            url: `${baseUrl}/${city.path}/`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        }));

    // 4. Map blog posts (merging Strapi + fallback mock posts)
    const postSlugs = new Set();
    const blogEntries = [];

    // Add Strapi blog posts
    for (const post of strapiPosts) {
        if (post.slug) {
            postSlugs.add(post.slug);
            blogEntries.push({
                url: `${baseUrl}/blog/${post.slug}/`,
                lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
                changeFrequency: 'weekly',
                priority: 0.7,
            });
        }
    }

    // Add fallback mock posts
    for (const mock of blogPosts) {
        if (!postSlugs.has(mock.slug)) {
            blogEntries.push({
                url: `${baseUrl}/blog/${mock.slug}/`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.7,
            });
        }
    }

    // 5. Static routes
    const staticEntries = [
        {
            url: `${baseUrl}/`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/blog/`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/chicago/`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/our-team/`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
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

    return [...staticEntries, ...cityEntries, ...blogEntries];
}
