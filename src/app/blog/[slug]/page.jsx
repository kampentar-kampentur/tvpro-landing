import { notFound } from "next/navigation";
import { getBlogPost, getAllBlogPosts, getAllCities, getStrapiMediaUrl } from "@/lib/strapi";
import { blogPosts, mockBlogContent } from "@/lib/blog-data";
import PostClient from "./PostClient";

const SITE_URL = "https://tvprousa.com";
const ORG_NAME = "TVPro Handy Services";

// ─── SSG: generate pages at build time ─────────────────────────────────────
export async function generateStaticParams() {
    // Try Strapi first, fall back to local mock slugs
    const strapiPosts = await getAllBlogPosts();
    const strapiSlugs = (strapiPosts || []).map((p) => ({ slug: p.slug }));

    const mockSlugs = (blogPosts || []).map((p) => ({ slug: p.slug }));

    // Merge, deduplicating by slug
    const allSlugs = [...strapiSlugs];
    for (const mock of mockSlugs) {
        if (!allSlugs.find((s) => s.slug === mock.slug)) {
            allSlugs.push(mock);
        }
    }

    if (allSlugs.length === 0) {
        console.log("[Build Info] No blog posts found in Strapi. Providing placeholder to prevent build failure.");
        return [{ slug: 'build-placeholder' }];
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

    const keywords = post.keywords 
        ? (Array.isArray(post.keywords) ? post.keywords.join(", ") : post.keywords)
        : "";

    return {
        title: `${title} | TVPro Blog`,
        description,
        keywords,
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
            modifiedTime: post.updatedAt || post.publishedAt || post.date,
            section: post.category || "General",
            tags: Array.isArray(post.tags) ? post.tags : (post.keywords ? (Array.isArray(post.keywords) ? post.keywords : [post.keywords]) : []),
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

// Helper: Estimate word count from rich text or string content
function estimateWordCount(content) {
    if (!content) return 0;
    if (typeof content === "string") {
        return content.trim().split(/\s+/).filter(Boolean).length;
    }
    if (Array.isArray(content)) {
        let text = "";
        const extractText = (node) => {
            if (node.text) text += " " + node.text;
            if (node.children) node.children.forEach(extractText);
        };
        content.forEach(extractText);
        return text.trim().split(/\s+/).filter(Boolean).length;
    }
    return 0;
}

// Helper: Extract FAQ Q&A pairs from post content (headings ending in '?')
function extractFAQ(content) {
    if (!Array.isArray(content)) return [];

    const faqs = [];
    for (let i = 0; i < content.length - 1; i++) {
        const node = content[i];
        if (node.type === "heading" && (node.level === 2 || node.level === 3)) {
            const text = node.children?.map(c => c.text).join("") || "";
            if (text.trim().endsWith("?")) {
                let answerText = "";
                for (let j = i + 1; j < content.length; j++) {
                    const nextNode = content[j];
                    if (nextNode.type === "paragraph") {
                        answerText = nextNode.children?.map(c => c.text).join("") || "";
                        break;
                    }
                    if (nextNode.type === "heading") {
                        break;
                    }
                }

                if (text && answerText) {
                    faqs.push({
                        question: text.trim(),
                        answer: answerText.trim()
                    });
                }
            }
        }
    }
    return faqs;
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

    // Estimate word count
    const wordCount = estimateWordCount(post.content);

    // Build structured data for Google (BlogPosting schema)
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        url: `${SITE_URL}/blog/${slug}/`,
        articleSection: post.category || "General",
        wordCount: wordCount || undefined,
        image: coverUrl ? [coverUrl] : undefined,
        datePublished: post.publishedAt || post.date,
        dateModified: post.updatedAt || post.publishedAt || post.date,
        keywords: post.keywords 
            ? (Array.isArray(post.keywords) ? post.keywords.join(", ") : post.keywords)
            : undefined,
        author: {
            "@type": "Person",
            name: post.author?.name || ORG_NAME,
            url: `${SITE_URL}/our-team/`,
        },
        publisher: {
            "@type": "Organization",
            name: ORG_NAME,
            logo: {
                "@type": "ImageObject",
                url: `${SITE_URL}/og-image.png`,
            },
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${SITE_URL}/blog/${slug}/`,
        },
    };

    // Build FAQ Schema if any questions are found
    const faqs = extractFAQ(post.content);
    const faqJsonLd = faqs.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    } : null;

    // Get related posts (same category, excluding self, max 3)
    const allStrapiPosts = await getAllBlogPosts();
    const relatedStrapi = allStrapiPosts
        .filter((p) => p.slug !== slug && p.category === post.category)
        .map((p) => ({
            title: p.title,
            slug: p.slug,
            excerpt: p.excerpt,
            category: p.category,
            readTime: p.readTime ? `${p.readTime} min read` : undefined,
            image: p.cover?.url ? getStrapiMediaUrl(p.cover.url) : null,
            coverMedia: p.cover || null,
        }));

    const relatedMock = blogPosts
        .filter((p) => p.slug !== slug && p.category === post.category)
        .map((p) => ({
            title: p.title,
            slug: p.slug,
            excerpt: p.excerpt,
            category: p.category,
            readTime: p.readTime,
            image: p.image,
            coverMedia: p.image ? { url: p.image } : { url: "/blog-placeholder.jpg" },
        }));

    const mergedRelated = [...relatedStrapi];
    for (const mock of relatedMock) {
        if (mergedRelated.length >= 3) break;
        if (!mergedRelated.find((r) => r.slug === mock.slug)) {
            mergedRelated.push(mock);
        }
    }
    const finalRelated = mergedRelated.slice(0, 3);

    let cities = [];
    try {
        cities = await getAllCities();
    } catch (error) {
        console.error("[Blog Post Page] Failed to fetch cities:", error);
    }

    const activeCities = cities
        .filter(city => !city.test_version && city.path && !city.metro_city_slug)
        .map(city => ({
            name: city.city_name,
            state: city.state_code,
            path: city.path
        }))
        .slice(0, 8);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {faqJsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
                />
            )}
            <PostClient
                post={post}
                coverUrl={coverUrl}
                coverMedia={post.cover || (coverUrl ? { url: coverUrl } : null)}
                avatarUrl={avatarUrl}
                avatarMedia={post.author?.avatar || (avatarUrl ? { url: avatarUrl } : null)}
                relatedPosts={finalRelated}
                slug={slug}
                cities={activeCities}
            />
        </>
    );
}
