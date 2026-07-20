import { Suspense } from "react";
import { getAllBlogPosts, getAllCities, getStrapiMediaUrl } from "@/lib/strapi";
import { blogPosts } from "@/lib/blog-data";
import BlogClient from "../../BlogClient";
import styles from "../../blog.module.css";

const POSTS_PER_PAGE = 9;

export async function generateStaticParams() {
    const strapiPosts = await getAllBlogPosts() || [];
    
    // Merge Strapi and fallback mock posts to get the full count
    const posts = [...strapiPosts];
    for (const mock of (blogPosts || [])) {
        if (!posts.find(p => p.slug === mock.slug)) {
            posts.push(mock);
        }
    }

    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
    
    const params = [];
    for (let i = 1; i <= totalPages; i++) {
        params.push({ num: String(i) });
    }

    if (params.length === 0) {
        console.log("[Build Info] No paginated blog pages. Providing page 1 to prevent build failure.");
        return [{ num: '1' }];
    }

    return params;
}

export async function generateMetadata({ params }) {
    const { num } = await params;
    const title = `TV Mounting & Home Theater Blog - Page ${num} | TVPro`;
    const description = `Read TV mounting tips and guides. Page ${num} of our professional articles archive.`;
    return {
        title,
        description,
        alternates: {
            canonical: `https://tvprousa.com/blog/page/${num}/`,
        },
        openGraph: {
            title,
            description,
            type: "website",
            url: `https://tvprousa.com/blog/page/${num}/`,
            images: [{ url: "https://tvprousa.com/og-image.png", width: 1200, height: 630, alt: "TVPro Blog" }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ["https://tvprousa.com/og-image.png"],
        },
    };
}

export default async function BlogPagePaginated({ params }) {
    const { num } = await params;
    const pageNum = parseInt(num) || 1;
    
    const strapiPosts = await getAllBlogPosts();

    let cities = [];
    try {
        cities = await getAllCities();
    } catch (error) {
        console.error("[Blog Page Paginated] Failed to fetch cities:", error);
    }

    const activeCities = cities
        .filter(city => !city.test_version && city.path && !city.metro_city_slug)
        .map(city => ({
            name: city.city_name,
            state: city.state_code,
            path: city.path
        }))
        .slice(0, 8);

    const normalizedStrapiPosts = strapiPosts.map(post => {
        const formattedDate = post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
            : "";

        return {
            id: post.id || post.slug,
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            category: post.category || "General",
            date: formattedDate || post.date || "",
            readTime: post.readTime ? `${post.readTime} min read` : "5 min read",
            image: post.cover?.url ? getStrapiMediaUrl(post.cover.url) : "/blog-placeholder.jpg",
            coverMedia: post.cover || { url: "/blog-placeholder.jpg" },
            featured: !!post.featured,
            author: {
                name: post.author?.name || "TVPro Specialist",
                role: post.author?.role || "Certified Installer",
                avatar: post.author?.avatar?.url ? getStrapiMediaUrl(post.author.avatar.url) : "/author-placeholder.jpg",
                avatarMedia: post.author?.avatar || { url: "/author-placeholder.jpg" }
            }
        };
    });

    // Calculate total pages based on merged list
    const posts = [...normalizedStrapiPosts];
    for (const mock of blogPosts) {
        if (!posts.find(p => p.slug === mock.slug)) {
            posts.push(mock);
        }
    }

    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

    return (
        <Suspense fallback={<div className={styles.loading}>Loading blog...</div>}>
            <BlogClient 
                initialPosts={normalizedStrapiPosts} 
                cities={activeCities} 
                currentPage={pageNum}
                totalPages={totalPages}
                postsPerPage={POSTS_PER_PAGE}
            />
        </Suspense>
    );
}
