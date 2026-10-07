import { Suspense } from "react";
import { getAllBlogPosts, getActiveMetroCities, getStrapiMediaUrl } from "@/lib/strapi";
import { blogPosts as mockPosts } from "@/lib/blog-data";
import BlogClient from "../../../../BlogClient";
import styles from "../../../../blog.module.css";

const POSTS_PER_PAGE = 9;

const slugify = (text) => {
  if (!text) return "";
  return text.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
};

const normalizeCategorySlug = (slug) => {
  if (!slug) return "";
  const s = slug.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
  if (s === "tips-and-guides" || s === "tips-guides" || s === "tips-and-tricks" || s === "tips-tricks") {
    return "tips-and-tricks";
  }
  if (s === "reviews" || s === "product-reviews" || s === "mount-reviews") {
    return "reviews";
  }
  if (s === "tv-mounting" || s === "mounting") {
    return "tv-mounting";
  }
  return s;
};

// Retrieve all categories from both Strapi and mock data
async function getCategories() {
  let strapiPosts = [];
  try {
    strapiPosts = await getAllBlogPosts() || [];
  } catch (error) {
    console.error("Failed to fetch posts from Strapi in getCategories:", error);
  }
  const allPosts = [...strapiPosts, ...mockPosts];
  
  // Make sure navbar categories are always included to prevent 404
  const defaultCategories = ["TV Mounting", "Tips & Tricks", "Reviews", "News"];
  const uniqueCategories = [...new Set([
    ...allPosts.map(p => p.category),
    ...defaultCategories
  ].filter(Boolean))];
  
  return uniqueCategories.map(cat => ({
    name: cat === "Tips & Guides" ? "Tips & Tricks" : cat,
    slug: slugify(cat)
  }));
}

export async function generateStaticParams() {
  const categories = await getCategories();
  const staticSlugs = new Set(["tv-mounting", "tips-and-tricks", "tips-and-guides", "reviews", "news"]);
  categories.forEach(c => staticSlugs.add(c.slug));
  const params = [];

  for (const catSlug of staticSlugs) {
    const strapiPosts = await getAllBlogPosts();
    const allPosts = [...strapiPosts, ...mockPosts];
    const categoryPostsCount = allPosts.filter(post => normalizeCategorySlug(slugify(post.category || "General")) === normalizeCategorySlug(catSlug)).length;
    const totalPages = Math.max(1, Math.ceil(categoryPostsCount / POSTS_PER_PAGE));

    for (let i = 1; i <= totalPages; i++) {
      params.push({
        slug: catSlug,
        num: String(i)
      });
    }
  }
  
  return params;
}

export async function generateMetadata({ params }) {
  const { slug, num } = await params;
  const categories = await getCategories();
  const category = categories.find(c => c.slug === slug);
  const categoryName = category ? category.name : "Category";
  const title = `${categoryName} - Page ${num} | TVPro Blog`;
  const description = `Read expert tips and advice for ${categoryName.toLowerCase()}. Page ${num} of category articles.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://tvprousa.com/blog/category/${slug}/page/${num}/`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://tvprousa.com/blog/category/${slug}/page/${num}/`,
      images: [{ url: "https://tvprousa.com/og-image.png", width: 1200, height: 630, alt: `${categoryName} Articles` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://tvprousa.com/og-image.png"],
    },
  };
}

export default async function BlogCategoryPagePaginated({ params }) {
  const { slug, num } = await params;
  const pageNum = parseInt(num) || 1;
  const categories = await getCategories();
  const category = categories.find(c => c.slug === slug);
  const categoryName = category ? category.name : "General";

  const [strapiPosts, activeCities] = await Promise.all([
    getAllBlogPosts(),
    getActiveMetroCities(),
  ]);

  const targetCategorySlug = normalizeCategorySlug(slug);

  // Normalize only the posts that belong to the active category
  let normalizedStrapiPosts = strapiPosts
    .filter(post => normalizeCategorySlug(slugify(post.category || "General")) === targetCategorySlug)
    .map(post => {
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

  // If a category has no specific posts (e.g. news), fallback to latest posts so user never sees a blank page
  if (normalizedStrapiPosts.length === 0 && strapiPosts.length > 0) {
    normalizedStrapiPosts = strapiPosts.slice(0, 9).map(post => {
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
  }

  // Calculate total pages for category (Strapi + mock)
  const allCategoryPosts = [...normalizedStrapiPosts];
  for (const mock of mockPosts) {
    if (normalizeCategorySlug(slugify(mock.category || "General")) === targetCategorySlug) {
      if (!allCategoryPosts.find(p => p.slug === mock.slug)) {
        allCategoryPosts.push(mock);
      }
    }
  }

  const totalPages = Math.max(1, Math.ceil(allCategoryPosts.length / POSTS_PER_PAGE));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${categoryName} - Page ${pageNum} | TVPro Blog`,
    "url": `https://tvprousa.com/blog/category/${slug}/page/${pageNum}/`,
    "description": `Read expert tips, installation guides, and professional advice relating to ${categoryName.toLowerCase()} on the TVPro blog.`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<div className={styles.loading}>Loading category...</div>}>
        <BlogClient 
          initialPosts={normalizedStrapiPosts} 
          category={categoryName} 
          cities={activeCities}
          currentPage={pageNum}
          totalPages={totalPages}
          postsPerPage={POSTS_PER_PAGE}
        />
      </Suspense>
    </>
  );
}
