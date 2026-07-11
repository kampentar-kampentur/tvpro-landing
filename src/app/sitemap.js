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
    // priority: 0.9 — ниже homepage (1.0), но выше blog (0.8)
    // Suburb-страницы (metro_city_slug) уже отфильтрованы → они noindex и не нужны в sitemap
    const cityEntries = cities
        .filter(city => !city.test_version && city.path && !city.metro_city_slug)
        .map((city) => ({
            url: `${baseUrl}/${city.path}/`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
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
    // Иерархия приоритетов:
    // 1.0 → Homepage (единственная)
    // 0.9 → City pages (основные города, локальный SEO)
    // 0.8 → Blog index, About, Our Team, Contact
    // 0.7 → Blog posts
    // 0.5 → Legal / Cookie policy
    const staticEntries = [
        {
            url: `${baseUrl}/`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/blog/`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        // NOTE: /chicago/ покрывается через cityEntries — не дублируем
        {
            url: `${baseUrl}/our-team/`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/careers/`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/about/`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/contact/`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/cookie-policy/`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/privacy-policy/`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms/`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        }
    ];

    return [...staticEntries, ...cityEntries, ...blogEntries];
}
