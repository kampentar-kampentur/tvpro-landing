import { Suspense } from "react";
import { getAllBlogPosts, getAllCities, getStrapiMediaUrl } from "@/lib/strapi";
import { blogPosts as mockPosts } from "@/lib/blog-data";
import BlogClient from "../../../../BlogClient";
import styles from "../../../../blog.module.css";

const POSTS_PER_PAGE = 9;

const slugify = (text) => {
  if (!text) return "";
  return text.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
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
  const defaultCategories = ["News", "Reviews", "Tips & Tricks"];
  const uniqueCategories = [...new Set([
    ...allPosts.map(p => p.category),
    ...defaultCategories
  ].filter(Boolean))];
  
  return uniqueCategories.map(cat => ({
    name: cat,
    slug: slugify(cat)
  }));
}

export async function generateStaticParams() {
  const categories = await getCategories();
  const params = [];

  for (const cat of categories) {
    const strapiPosts = await getAllBlogPosts();
    const allPosts = [...strapiPosts, ...mockPosts];
    const categoryPostsCount = allPosts.filter(post => slugify(post.category || "General") === cat.slug).length;
    const totalPages = Math.ceil(categoryPostsCount / POSTS_PER_PAGE);

    for (let i = 1; i <= totalPages; i++) {
      params.push({
        slug: cat.slug,
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

  const strapiPosts = await getAllBlogPosts();

  let cities = [];
  try {
    cities = await getAllCities();
  } catch (error) {
    console.error("[Blog Category Paginated] Failed to fetch cities:", error);
  }

  const activeCities = cities
    .filter(city => !city.test_version && city.path && !city.metro_city_slug)
    .map(city => ({
      name: city.city_name,
      state: city.state_code,
      path: city.path
    }))
    .slice(0, 8);

  // Normalize only the posts that belong to the active category
  const normalizedStrapiPosts = strapiPosts
    .filter(post => slugify(post.category || "General") === slug)
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

  // Calculate total pages for category (Strapi + mock)
  const allCategoryPosts = [...normalizedStrapiPosts];
  for (const mock of mockPosts) {
    if (slugify(mock.category || "General") === slug) {
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
