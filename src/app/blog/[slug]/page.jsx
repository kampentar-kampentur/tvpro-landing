import { notFound } from "next/navigation";
import { getBlogPost, getAllBlogPosts, getStrapiMediaUrl } from "@/lib/strapi";
import { blogPosts, mockBlogContent } from "@/lib/blog-data";
import PostClient from "./PostClient";

const SITE_URL = "https://tvprousa.com";
const ORG_NAME = "TVPro Handy Services";

// ─── SSG: generate pages at build time ─────────────────────────────────────
export async function generateStaticParams() {
    // Try Strapi first, fall back to local mock slugs
    const strapiPosts = await getAllBlogPosts();
    const strapiSlugs = strapiPosts.map((p) => ({ slug: p.slug }));

    const mockSlugs = blogPosts.map((p) => ({ slug: p.slug }));

    // Merge, deduplicating by slug
    const allSlugs = [...strapiSlugs];
    for (const mock of mockSlugs) {
        if (!allSlugs.find((s) => s.slug === mock.slug)) {
            allSlugs.push(mock);
        }
    }

    return allSlugs;
}

// ─── SEO Metadata ───────────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
    const { slug } = await params;
    const post = await resolvePost(slug);

    if (!post) {
        return { title: "Post Not Found | TVPro Blog" };
    }

    const title = post.seo_title || post.title;
    const description = post.seo_description || post.excerpt;
    const coverUrl = post.cover?.url
        ? getStrapiMediaUrl(post.cover.url)
        : post.image || `${SITE_URL}/og-default.jpg`;

    return {
        title: `${title} | TVPro Blog`,
        description,
        alternates: {
            canonical: `${SITE_URL}/blog/${slug}/`,
        },
        openGraph: {
            title,
            description,
            type: "article",
            url: `${SITE_URL}/blog/${slug}/`,
            images: [{ url: coverUrl, width: 1200, height: 630, alt: title }],
            publishedTime: post.publishedAt || post.date,
            authors: [post.author?.name || ORG_NAME],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [coverUrl],
        },
    };
}

// ─── Helper: resolve post from Strapi or mock ───────────────────────────────
async function resolvePost(slug) {
    // 1. Try Strapi
    const strapiPost = await getBlogPost(slug);
    if (strapiPost) return strapiPost;

    // 2. Fall back to local mock
    const mockPost = blogPosts.find((p) => p.slug === slug);
    if (mockPost) {
        return {
            ...mockPost,
            content: mockBlogContent[slug] || null,
            cover: null, // will use mockPost.image directly
        };
    }

    return null;
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default async function BlogPostPage({ params }) {
    const { slug } = await params;
    const post = await resolvePost(slug);

    if (!post) notFound();

    // Resolve cover image URL
    const coverUrl = post.cover?.url
        ? getStrapiMediaUrl(post.cover.url)
        : post.image || null;

    // Author avatar URL
    const avatarUrl = post.author?.avatar?.url
        ? getStrapiMediaUrl(post.author.avatar.url)
        : post.author?.avatar || null;

    // Build structured data for Google (Article schema)
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.excerpt,
        image: coverUrl ? [coverUrl] : undefined,
        datePublished: post.publishedAt || post.date,
        dateModified: post.updatedAt || post.publishedAt || post.date,
        author: {
            "@type": "Person",
            name: post.author?.name || ORG_NAME,
        },
        publisher: {
            "@type": "Organization",
            name: ORG_NAME,
            logo: {
                "@type": "ImageObject",
                url: `${SITE_URL}/logo.png`,
            },
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${SITE_URL}/blog/${slug}/`,
        },
    };

    // Get related posts (same category, excluding self, max 3)
    const allMock = blogPosts.filter(
        (p) => p.slug !== slug && p.category === post.category
    ).slice(0, 3);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <PostClient
                post={post}
                coverUrl={coverUrl}
                avatarUrl={avatarUrl}
                relatedPosts={allMock}
                slug={slug}
            />
        </>
    );
}
